/* Renders exact pages from student-supplied PDFs inside this browser.
   The original PDFs are never uploaded to a server or stored: only the assigned
   page images are saved in IndexedDB on this device. */
(function (root) {
  "use strict";
  var DB_NAME="8020-source-pages-v1", DB_VERSION=1, DB=null, DB_PROMISE=null;
  var PDFJS_WORKER="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  var urls={}, jobs={}, zoomBound=false;
  var LABELS={quran:"15-line Madani Mushaf",sarf:"FSTU Ṣarf",nahw:"FSTU Naḥw"};
  var SOURCES={
    sarf:"https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources",
    nahw:"https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources"
  };
  var ACCEPTS={quran:"application/pdf",sarf:"application/pdf",nahw:"application/pdf"};
  var WIDTHS={quran:1000,sarf:1000,nahw:1000};

  function openDb() {
    if(DB)return Promise.resolve(DB);
    if(DB_PROMISE)return DB_PROMISE;
    DB_PROMISE=new Promise(function(resolve,reject){
      if(!root.indexedDB){reject(new Error("This browser does not provide local page storage."));return;}
      var req;
      try{req=root.indexedDB.open(DB_NAME,DB_VERSION);}catch(e){reject(e);return;}
      req.onupgradeneeded=function(){
        var db=req.result;
        if(!db.objectStoreNames.contains("pages"))db.createObjectStore("pages",{keyPath:"key"});
        if(!db.objectStoreNames.contains("meta"))db.createObjectStore("meta",{keyPath:"id"});
      };
      req.onsuccess=function(){DB=req.result;DB.onversionchange=function(){DB.close();DB=null;DB_PROMISE=null;};resolve(DB);};
      req.onerror=function(){reject(req.error||new Error("Could not open local page storage."));};
      req.onblocked=function(){reject(new Error("Local page storage is blocked by another open tab. Close the other 80/20 Arabic tab and retry."));};
    }).catch(function(e){DB_PROMISE=null;throw e;});
    return DB_PROMISE;
  }
  function storeGet(storeName,key) {
    return openDb().then(function(db){return new Promise(function(resolve,reject){
      var tx=db.transaction(storeName,"readonly"),req=tx.objectStore(storeName).get(key);
      req.onsuccess=function(){resolve(req.result||null);};req.onerror=function(){reject(req.error);};
    });});
  }
  function storePut(storeName,value) {
    return openDb().then(function(db){return new Promise(function(resolve,reject){
      var tx=db.transaction(storeName,"readwrite");
      tx.objectStore(storeName).put(value);
      tx.oncomplete=function(){resolve(true);};tx.onerror=function(){reject(tx.error||new Error("Could not save a rendered page on this device."));};
      tx.onabort=function(){reject(tx.error||new Error("Saving the page was aborted. Check the available storage on this device."));};
    });});
  }
  function sourceKey(kind,page){return kind+":"+Number(page);}
  function setStatus(kind,message,isBusy) {
    if(!root.document)return;
    root.document.querySelectorAll('[data-book-status="'+kind+'"]').forEach(function(el){el.textContent=message;});
    root.document.querySelectorAll('[data-book-upload="'+kind+'"]').forEach(function(el){el.disabled=!!isBusy;});
    root.document.querySelectorAll('[data-book-upload-label="'+kind+'"]').forEach(function(el){el.classList.toggle("is-busy",!!isBusy);});
  }
  function sourcePages(kind) {
    if(!root.WeeklyGuide||!root.WeeklyGuide.getPageSourceMap)return [];
    var m=root.WeeklyGuide.getPageSourceMap();
    return (m[kind]||[]).map(Number).sort(function(a,b){return a-b;});
  }
  function maxPdfPage(kind,pages) {
    if(!pages.length)return 0;
    return Math.max.apply(null,pages)+(kind==="quran"?1:0);
  }
  function pageUrl(item) {
    if(urls[item.key])return urls[item.key];
    urls[item.key]=URL.createObjectURL(item.blob);
    return urls[item.key];
  }
  function makeMissing(kind,page,message) {
    var label=LABELS[kind]||"source book";
    var msg=message||("Load the relevant "+label+" PDF to display only the assigned printed pages.");
    var official=SOURCES[kind]||"";
    var officialLink=official?'<p><a class="source-download-link" href="'+official+'" target="_blank" rel="noreferrer">Get the official '+escapeHtml(label)+' resource ↗</a></p>':"";
    return '<div class="book-page-missing"><div class="book-missing-mark" aria-hidden="true">↥</div><b>Assigned page '+Number(page)+' · not loaded yet</b><p>'+escapeHtml(msg)+'</p>'+officialLink+'<label class="book-upload-button" data-book-upload-label="'+kind+'">Choose '+escapeHtml(label)+' PDF<input type="file" accept="'+(ACCEPTS[kind]||"application/pdf")+'" data-book-upload="'+kind+'"></label><p class="guide-small">The browser extracts only the course-assigned pages and stores those page images on this device. The source PDF is never uploaded.</p></div>';
  }
  function escapeHtml(s) {
    return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);});
  }
  async function hydrate(container,kinds) {
    container=container||root.document;
    if(!container||!container.querySelectorAll)return;
    var allowed=kinds&&kinds.length?new Set(kinds):null;
    var nodes=Array.prototype.slice.call(container.querySelectorAll("[data-book-page]"));
    await Promise.all(nodes.map(async function(el){
      var parts=String(el.getAttribute("data-book-page")||"").split(":");
      var kind=parts[0],page=Number(parts[1]);
      if(allowed&&!allowed.has(kind))return;
      if(el.dataset.hydrating==="true")return;
      el.dataset.hydrating="true";
      if(!LABELS[kind]||!page){el.innerHTML='<div class="book-page-placeholder">Unknown source-page reference.</div>';return;}
      try{
        var item=await storeGet("pages",sourceKey(kind,page));
        if(item&&item.blob){
          var title=(LABELS[kind]||kind)+" · printed page "+page;
          el.innerHTML='<figure class="book-page-figure"><img class="source-page-image" src="'+pageUrl(item)+'" alt="'+escapeHtml(title)+'" loading="lazy" tabindex="0" role="button" aria-label="Open larger view of '+escapeHtml(title)+'"><figcaption>'+escapeHtml(title)+' · <button type="button" class="page-zoom-text">Zoom page</button></figcaption></figure>';
        }else{
          var setupMessage;
          try { await openDb(); setupMessage=null; } catch(e) { setupMessage="Open the hosted website (not a local file) so this browser can save the page image. "+e.message; }
          el.innerHTML=makeMissing(kind,page,setupMessage);
        }
      }catch(e){
        el.innerHTML=makeMissing(kind,page,"Local page storage is unavailable. "+(e&&e.message?e.message:"Open the hosted website and retry."));
      }finally{delete el.dataset.hydrating;}
    }));
    bindPageZoom(container);
  }
  function renderPage(pdf,pageNumber,kind,printedPage) {
    return pdf.getPage(pdfPageNumber(kind,printedPage)).then(async function(page){
      var original=page.getViewport({scale:1});
      var scale=WIDTHS[kind]/original.width;
      var viewport=page.getViewport({scale:scale});
      var canvas=root.document.createElement("canvas");
      canvas.width=Math.round(viewport.width);canvas.height=Math.round(viewport.height);
      var ctx=canvas.getContext("2d",{alpha:false});
      if(!ctx)throw new Error("This browser cannot create a page image.");
      ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
      var task=page.render({canvasContext:ctx,viewport:viewport,background:"#ffffff"});
      await task.promise;
      var blob=await new Promise(function(resolve,reject){
        canvas.toBlob(function(b){if(b)resolve(b);else reject(new Error("The browser could not export page "+printedPage+"."));},"image/jpeg",0.92);
      });
      await storePut("pages",{key:sourceKey(kind,printedPage),kind:kind,printedPage:Number(printedPage),pdfPage:pdfPageNumber(kind,printedPage),blob:blob,renderedAt:new Date().toISOString()});
      page.cleanup();
      canvas.width=0;canvas.height=0;
      return blob.size;
    });
  }
  function pdfPageNumber(kind,printedPage) {
    return Number(printedPage)+(kind==="quran"?1:0);
  }
  async function processUpload(kind,file) {
    if(jobs[kind])return;
    if(!file){return;}
    if(file.type&&file.type!=="application/pdf"&&!/\.pdf$/i.test(file.name)){
      setStatus(kind,"Please choose a PDF file.",false);return;
    }
    if(!root.pdfjsLib||!root.pdfjsLib.getDocument){
      setStatus(kind,"The PDF page viewer has not loaded. Check the connection and reload the website.",false);return;
    }
    var pages=sourcePages(kind);
    if(!pages.length){setStatus(kind,"No weekly page assignments are configured for this source.",false);return;}
    jobs[kind]=true;
    setStatus(kind,"Reading "+file.name+"…",true);
    try{
      root.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
      var buffer=await file.arrayBuffer();
      var loadTask=root.pdfjsLib.getDocument({data:new Uint8Array(buffer),useSystemFonts:true,isEvalSupported:false});
      var pdf=await loadTask.promise;
      var maxPage=maxPdfPage(kind,pages);
      if(pdf.numPages<maxPage){
        throw new Error("This PDF has "+pdf.numPages+" pages, but the weekly mapping needs PDF page "+maxPage+". Choose the correct edition.");
      }
      var total=pages.length,bytes=0,sourcePageCount=pdf.numPages;
      for(var i=0;i<total;i++){
        var printedPage=pages[i];
        setStatus(kind,"Rendering "+LABELS[kind]+" pages "+(i+1)+" of "+total+"…",true);
        bytes+=await renderPage(pdf,printedPage,kind,printedPage);
        if((i+1)%4===0)await new Promise(function(resolve){root.setTimeout(resolve,0);});
      }
      try{await pdf.destroy();}catch(e){}
      buffer=null;
      await storePut("meta",{id:kind,fileName:file.name,pdfPageCount:sourcePageCount,pagesSaved:total,renderedBytes:bytes,importedAt:new Date().toISOString()});
      setStatus(kind,"Ready: "+file.name+" · "+total+" assigned pages saved on this device.",false);
      await refreshLibraryStatus();
      await hydrate(root.document,[kind]);
    }catch(error){
      setStatus(kind,"Could not prepare this source: "+(error&&error.message?error.message:"unknown error"),false);
      try{if(root.console)root.console.error("80/20 Arabic page import failed ("+kind+")",error);}catch(e){}
    }finally{
      jobs[kind]=false;
      root.document.querySelectorAll('[data-book-upload="'+kind+'"]').forEach(function(el){el.disabled=false;el.value="";});
    }
  }
  async function refreshLibraryStatus() {
    if(!root.document)return;
    for(var kind of ["quran","sarf","nahw"]){
      try{
        var meta=await storeGet("meta",kind);
        if(meta){
          setStatus(kind,"Ready: "+meta.fileName+" · "+meta.pagesSaved+" assigned pages saved on this device.",false);
        }else if(!jobs[kind]){
          setStatus(kind,"Not loaded on this device yet.",false);
        }
      }catch(e){
        setStatus(kind,"Open the hosted website to enable local page storage.",false);
      }
    }
  }
  async function pageCount(kind) {
    var pages=sourcePages(kind),loaded=0;
    for(var p of pages){if(await storeGet("pages",sourceKey(kind,p)))loaded++;}
    return {loaded:loaded,total:pages.length};
  }
  async function clear(kind) {
    var pages=sourcePages(kind);
    var db=await openDb();
    await new Promise(function(resolve,reject){
      var tx=db.transaction(["pages","meta"],"readwrite"),store=tx.objectStore("pages");
      pages.forEach(function(p){store.delete(sourceKey(kind,p));});
      tx.objectStore("meta").delete(kind);
      tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error);};
    });
    Object.keys(urls).forEach(function(key){if(key.indexOf(kind+":")===0){URL.revokeObjectURL(urls[key]);delete urls[key];}});
    await refreshLibraryStatus();await hydrate(root.document,[kind]);
  }
  function bindPageZoom(container) {
    container=container||root.document;
    if(!root.document||zoomBound)return;
    zoomBound=true;
    container.addEventListener("click",function(event){
      var img=event.target.closest(".source-page-image"),button=event.target.closest(".page-zoom-text");
      if(button){img=button.closest(".book-page-figure")&&button.closest(".book-page-figure").querySelector(".source-page-image");}
      if(img)showZoom(img.src,img.alt);
    });
    container.addEventListener("keydown",function(event){
      if((event.key==="Enter"||event.key===" ")&&event.target.matches(".source-page-image")){event.preventDefault();showZoom(event.target.src,event.target.alt);}
    });
  }
  function showZoom(src,alt) {
    var modal=root.document.getElementById("bookPageZoom");
    if(!modal){
      modal=root.document.createElement("div");modal.id="bookPageZoom";modal.className="book-page-zoom";modal.hidden=true;
      modal.innerHTML='<div class="book-page-zoom-toolbar"><span id="bookPageZoomTitle"></span><button type="button" id="bookPageZoomClose" aria-label="Close enlarged page">Close ✕</button></div><div class="book-page-zoom-stage"><img id="bookPageZoomImage" alt=""></div>';
      root.document.body.appendChild(modal);
      modal.addEventListener("click",function(e){if(e.target===modal||e.target.id==="bookPageZoomClose")modal.hidden=true;});
      root.document.addEventListener("keydown",function(e){if(e.key==="Escape"&&modal)modal.hidden=true;});
    }
    root.document.getElementById("bookPageZoomTitle").textContent=alt||"Source page";
    root.document.getElementById("bookPageZoomImage").src=src;
    root.document.getElementById("bookPageZoomImage").alt=alt||"Source page";
    modal.hidden=false;
  }
  if(root.document){
    root.document.addEventListener("change",function(e){
      var input=e.target.closest&&e.target.closest("[data-book-upload]");
      if(input&&input.files&&input.files[0])processUpload(input.dataset.bookUpload,input.files[0]);
    });
    root.document.addEventListener("click",function(e){
      var btn=e.target.closest&&e.target.closest("[data-clear-book]");
      if(btn){var kind=btn.getAttribute("data-clear-book");clear(kind).catch(function(err){setStatus(kind,"Could not clear the local page library: "+err.message,false);});}
    });
    root.addEventListener("load",function(){refreshLibraryStatus();},{once:true});
  }
  root.BookPages={
    hydrate:hydrate,refreshLibraryStatus:refreshLibraryStatus,processUpload:processUpload,
    getPageCount:pageCount,clear:clear,getPageSourceMap:sourcePages,
    pdfPageNumber:pdfPageNumber
  };
}(window));
