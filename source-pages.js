(function(root){
  "use strict";
  var libraryPromise=null;
  var manifestPromise=null;
  var rendered=new WeakMap();
  var SCRIPT_VERSION="3.11.174";

  function loadManifest(){
    if(!manifestPromise){
      manifestPromise=fetch("./assets/fstu-page-map.json",{cache:"no-cache"}).then(function(response){
        if(!response.ok)throw new Error("The assigned FSTU page map could not be loaded.");
        return response.json();
      });
    }
    return manifestPromise;
  }
  function loadLibrary(){
    if(!root.pdfjsLib) return Promise.reject(new Error("The PDF page renderer did not load. Refresh while online and try again."));
    root.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/"+SCRIPT_VERSION+"/pdf.worker.min.js";
    if(!libraryPromise){
      libraryPromise=Promise.all([
        loadManifest(),
        root.pdfjsLib.getDocument("./assets/fstu-nahw-extracts.pdf").promise,
        root.pdfjsLib.getDocument("./assets/fstu-sarf-extracts.pdf").promise
      ]).then(function(results){
        return {manifest:results[0],nahw:results[1],sarf:results[2]};
      }).catch(function(error){
        libraryPromise=null;
        throw error;
      });
    }
    return libraryPromise;
  }
  function setStatus(canvas,message,isError){
    var status=canvas.parentElement&&canvas.parentElement.querySelector(".fstu-page-status");
    if(status){status.textContent=message;status.classList.toggle("error",!!isError);}
  }
  function renderPage(canvas,library){
    var kind=canvas.getAttribute("data-fstu-source");
    var printedPage=Number(canvas.getAttribute("data-printed-page"));
    var pages=library.manifest.pages[kind];
    if(!Array.isArray(pages))throw new Error("No page mapping exists for "+kind+".");
    var index=pages.indexOf(printedPage);
    if(index<0)throw new Error("Printed page "+printedPage+" is not in the assigned course extracts.");
    var pdf=library[kind];
    if(index>=pdf.numPages)throw new Error("The assigned source page is missing from the excerpt PDF.");
    setStatus(canvas,"Rendering assigned page "+printedPage+"…",false);
    return pdf.getPage(index+1).then(function(page){
      var base=page.getViewport({scale:1});
      var parent=canvas.parentElement;
      var width=Math.max(240,Math.min(1000,(parent&&parent.clientWidth)||700));
      var dpr=Math.max(1,Math.min(2,root.devicePixelRatio||1));
      var scale=(width/base.width)*dpr;
      var viewport=page.getViewport({scale:scale});
      var context=canvas.getContext("2d",{alpha:false});
      canvas.width=Math.ceil(viewport.width);
      canvas.height=Math.ceil(viewport.height);
      canvas.style.width="100%";
      canvas.style.height="auto";
      return page.render({canvasContext:context,viewport:viewport,background:"#ffffff"}).promise.then(function(){
        canvas.classList.add("fstu-page-rendered");
        canvas.setAttribute("aria-label",(kind==="nahw"?"FSTU Naḥw":"FSTU Ṣarf")+" printed page "+printedPage);
        canvas.setAttribute("title",(kind==="nahw"?"FSTU Naḥw":"FSTU Ṣarf")+" · printed page "+printedPage);
        canvas.dataset.rendered="true";
        setStatus(canvas,"Assigned page "+printedPage+" · source page reproduced without annotation.",false);
      });
    });
  }
  function hydrate(rootNode){
    if(!rootNode||!rootNode.querySelectorAll)return;
    var canvases=Array.from(rootNode.querySelectorAll("canvas[data-fstu-source][data-printed-page]")).filter(function(c){
      return c.dataset.rendered!=="true"&&c.dataset.loading!=="true";
    });
    if(!canvases.length)return;
    canvases.forEach(function(canvas){canvas.dataset.loading="true";setStatus(canvas,"Loading the assigned textbook page…",false);});
    loadLibrary().then(function(library){
      return Promise.all(canvases.map(function(canvas){
        return renderPage(canvas,library).catch(function(error){
          setStatus(canvas,"This assigned page could not be displayed. "+error.message+" You can still open the official FSTU resource from the lesson link.",true);
          canvas.dataset.error="true";
        }).finally(function(){canvas.dataset.loading="false";});
      }));
    }).catch(function(error){
      canvases.forEach(function(canvas){
        setStatus(canvas,"Source-page preview unavailable. "+error.message+" Check your connection, then refresh this lesson.",true);
        canvas.dataset.loading="false";
      });
    });
  }
  root.SourcePages={hydrate:hydrate};
})(window);
