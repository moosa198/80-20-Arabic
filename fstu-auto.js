/* Automatic FSTU source loading.
   The PDF is fetched through the same-origin Cloudflare Pages Function and
   processed locally by the existing BookPages renderer. The original PDF is
   not uploaded to Supabase; only assigned page images are kept in IndexedDB.
*/
(function(root){
  "use strict";
  var started=false;
  function ensureCloudProgressHost(){
    if(root.document.querySelector(".topBtns,.topright"))return;
    var host=root.document.createElement("div");
    host.className="topBtns";
    host.style.display="none";
    root.document.body.appendChild(host);
  }
  ensureCloudProgressHost();
  async function load(){
    if(started||!root.BookPages||!root.WeeklyGuide||!root.pdfjsLib)return;
    started=true;
    root.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    for(const kind of ["nahw","sarf"]){
      var original=root.WeeklyGuide.getPageSourceMap;
      try{
        var pages=(original.call(root.WeeklyGuide)[kind]||[]).map(Number).sort(function(a,b){return a-b;});
        root.WeeklyGuide.getPageSourceMap=function(){var m=original.call(root.WeeklyGuide);m[kind]=pages;return m;};
        var response=await fetch("/api/fstu/"+kind,{credentials:"same-origin",cache:"no-cache"});
        if(!response.ok)throw new Error("FSTU "+kind+" source request returned "+response.status);
        var blob=await response.blob();
        var file=new File([blob],"official-fstu-"+kind+".pdf",{type:"application/pdf"});
        await root.BookPages.processUpload(kind,file);
      }finally{
        root.WeeklyGuide.getPageSourceMap=original;
      }
    }
    await root.BookPages.hydrate(root.document);
  }
  root.FSTUAuto={load:load};
}(window));
