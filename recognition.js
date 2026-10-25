(function(root){
  "use strict";
  var STORAGE_KEY="8020-word-recognition-v1";
  var activeWeek=null;
  var selections=Object.create(null);
  var observer=null;

  function loadAll(){
    try{return JSON.parse(root.localStorage.getItem(STORAGE_KEY)||"{}");}
    catch(e){return {};}
  }
  function saveAll(data){
    try{root.localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true;}
    catch(e){return false;}
  }
  function currentSelection(n){
    if(!selections[n])selections[n]={words:[],labelEn:"",labelAr:""};
    return selections[n];
  }
  function selectedText(s){
    return s.words.map(function(w){return w.text;}).filter(Boolean).join(" · ");
  }
  function latestAttempt(n){
    var item=loadAll()[n];
    if(!item)return null;
    if(Array.isArray(item.attempts))return item.attempts[item.attempts.length-1]||null;
    return item.words?item:null;
  }
  function decorateWords(){
    root.document.querySelectorAll('quran-madina-html[data-recognition-page] .quran-madina-html-word[data-qmh-w]').forEach(function(el){
      el.setAttribute("role","button");
      el.setAttribute("tabindex","0");
      el.setAttribute("aria-label","Select Arabic word "+el.textContent.trim());
      el.classList.add("recognition-word");
    });
  }
  function paint(n){
    if(!root.document)return;
    var host=root.document.querySelector('[data-recognition-task="'+n+'"]');
    if(!host)return;
    var s=currentSelection(n);
    var selected=host.querySelector("[data-recognition-selected]");
    if(selected){
      selected.textContent=selectedText(s)||"No words selected yet";
      selected.setAttribute("lang","ar");
      selected.setAttribute("dir","rtl");
    }
    var location=host.querySelector("[data-recognition-location]");
    if(location){
      location.textContent=s.words.length?s.words.map(function(w){return "page "+w.page+", word "+w.index;}).join(" · "):"Choose a word from the digital Qur’an page above.";
    }
    host.querySelectorAll("[data-recognition-label]").forEach(function(button){
      var active=button.getAttribute("data-recognition-label")===s.labelAr;
      button.classList.toggle("selected",active);
      button.setAttribute("aria-pressed",String(active));
    });
    root.document.querySelectorAll('quran-madina-html[data-recognition-page] .quran-madina-html-word[data-qmh-w]').forEach(function(el){
      var reader=el.closest("quran-madina-html");
      if(!reader)return;
      var page=Number(reader.getAttribute("page"));
      var index=Number(el.getAttribute("data-qmh-w"));
      var active=s.words.some(function(word){return word.page===page&&word.index===index;});
      el.classList.toggle("student-picked-word",active);
      el.setAttribute("aria-pressed",String(active));
    });
    updateHistory(n);
  }
  function showFeedback(n,message,success){
    var host=root.document.querySelector('[data-recognition-task="'+n+'"]');
    var feedback=host&&host.querySelector("[data-recognition-feedback]");
    if(!feedback)return;
    feedback.hidden=false;
    feedback.className="recognition-feedback "+(success?"saved":"needs-work");
    feedback.textContent=message;
  }
  function updateHistory(n){
    var host=root.document.querySelector('[data-recognition-task="'+n+'"]');
    if(!host)return;
    var target=host.querySelector("[data-recognition-history]");
    if(!target)return;
    var all=loadAll(),item=all[n],attempts=item&&Array.isArray(item.attempts)?item.attempts:(item&&item.words?[item]:[]);
    target.textContent="";
    if(!attempts.length){target.textContent="No attempts saved on this device yet.";return;}
    attempts.slice(-5).forEach(function(attempt,index){
      var row=root.document.createElement("div");
      row.className="recognition-history-row";
      var number=root.document.createElement("b");
      number.textContent="Attempt "+(Math.max(1,attempts.length-4)+index);
      var detail=root.document.createElement("span");
      var words=(attempt.words||[]).map(function(w){return w.text;}).join(" · ")||"No word saved";
      detail.textContent=words+" — "+(attempt.labelEn||"Role not recorded")+" ("+(attempt.labelAr||"—")+")";
      var explanation=root.document.createElement("p");
      explanation.textContent=attempt.explanation||"No explanation recorded.";
      row.appendChild(number);row.appendChild(detail);row.appendChild(explanation);target.appendChild(row);
    });
  }
  function bind(n){
    activeWeek=Number(n);
    var host=root.document.querySelector('[data-recognition-task="'+n+'"]');
    if(!host)return;
    var s=currentSelection(n);
    var previous=latestAttempt(n);
    if(previous){
      if(!s.words.length&&Array.isArray(previous.words))s.words=previous.words.slice();
      if(!s.labelAr){s.labelAr=previous.labelAr||"";s.labelEn=previous.labelEn||"";}
      var savedExplanation=host.querySelector('[data-recognition-explanation="'+n+'"]');
      if(savedExplanation&&!savedExplanation.value)savedExplanation.value=previous.explanation||"";
    }
    host.querySelectorAll("[data-recognition-label]").forEach(function(button){
      button.setAttribute("aria-pressed",String(button.getAttribute("data-recognition-label")===s.labelAr));
      button.addEventListener("click",function(){
        s.labelAr=button.getAttribute("data-recognition-label")||"";
        s.labelEn=button.getAttribute("data-recognition-en")||"";
        paint(n);
      });
    });
    var clear=host.querySelector('[data-clear-recognition="'+n+'"]');
    if(clear)clear.addEventListener("click",function(){
      s.words=[];
      paint(n);
    });
    var save=host.querySelector('[data-save-recognition="'+n+'"]');
    if(save)save.addEventListener("click",function(){
      var explanation=(host.querySelector('[data-recognition-explanation="'+n+'"]')||{}).value||"";
      if(!s.words.length){showFeedback(n,"Tap at least one word on the digital Qur’an page before saving.",false);return;}
      if(!s.labelAr){showFeedback(n,"Choose the role label in English and Arabic before saving.",false);return;}
      if(!explanation.trim()){showFeedback(n,"Write one sentence explaining the Arabic clue before saving.",false);return;}
      var all=loadAll(),item=all[n]||{week:Number(n),attempts:[]};
      if(!Array.isArray(item.attempts))item.attempts=item.words?[item]:[];
      var attempt={
        words:s.words.map(function(w){return {page:w.page,index:w.index,text:w.text};}),
        page:s.words[0].page,labelEn:s.labelEn,labelAr:s.labelAr,
        explanation:explanation.trim(),savedAt:new Date().toISOString()
      };
      item.week=Number(n);item.attempts.push(attempt);item.updatedAt=attempt.savedAt;all[n]=item;
      if(saveAll(all)){
        showFeedback(n,"Attempt "+item.attempts.length+" saved on this device. Compare your reasoning with the source and ask your teacher to confirm the grammatical role.",true);
        updateHistory(n);
      }else{
        showFeedback(n,"The browser could not store this attempt. Check the local storage settings and try again.",false);
      }
    });
    var sequence=host.closest(".weekly-sequence");
    var loadButton=sequence&&sequence.querySelector('[data-load-transfer-page="'+n+'"]');
    if(loadButton)loadButton.addEventListener("click",function(){
      var input=sequence.querySelector('[data-transfer-page="'+n+'"]');
      var page=Number(input&&input.value);
      if(!Number.isInteger(page)||page<1||page>604){if(input)input.focus();return;}
      var reader=sequence.querySelector('quran-madina-html[data-recognition-page]');
      if(reader){reader.setAttribute("page",String(page));reader.setAttribute("aria-label","Qur’an page "+page);}
      var pill=sequence.querySelector(".page-pill");
      if(pill)pill.textContent="Madina page "+page;
      var heading=sequence.querySelector(".mushaf-reference h3");
      if(heading){
        var defaultPage=Number(WeeklyGuide.get(n).page||604);
        heading.textContent=(Number(n)===31||page!==defaultPage)
          ?"Selected practice page "+page+" · verify the passage in your Mushaf"
          :WeeklyGuide.get(n).passage;
      }
      s.words=[];
      paint(n);
    });
    decorateWords();
    paint(n);
    if(!observer&&root.MutationObserver&&root.document.documentElement){
      observer=new root.MutationObserver(function(records){
        if(!records.some(function(record){return record.addedNodes&&record.addedNodes.length;}))return;
        decorateWords();
        if(activeWeek!==null)paint(activeWeek);
      });
      observer.observe(root.document.documentElement,{childList:true,subtree:true});
    }
    if(!root.__8020RecognitionClickBound){
      root.__8020RecognitionClickBound=true;
      root.document.addEventListener("click",function(event){
        var word=event.target.closest&&event.target.closest('quran-madina-html[data-recognition-page] .quran-madina-html-word[data-qmh-w]');
        if(!word)return;
        var reader=word.closest("quran-madina-html"),task=root.document.querySelector("[data-recognition-task]");
        if(!reader||!task)return;
        var week=Number(task.getAttribute("data-recognition-task"));
        if(week!==activeWeek)return;
        event.preventDefault();event.stopPropagation();
        var index=Number(word.getAttribute("data-qmh-w")),page=Number(reader.getAttribute("page"));
        if(!Number.isInteger(index)||!Number.isInteger(page))return;
        var selection=currentSelection(week),text=word.textContent.trim();
        var found=selection.words.findIndex(function(selected){return selected.page===page&&selected.index===index;});
        if(found>=0)selection.words.splice(found,1);
        else selection.words.push({page:page,index:index,text:text});
        paint(week);
      },true);
      root.document.addEventListener("keydown",function(event){
        if(event.key!=="Enter"&&event.key!==" ")return;
        var word=event.target.closest&&event.target.closest('quran-madina-html[data-recognition-page] .quran-madina-html-word[data-qmh-w]');
        if(!word)return;
        event.preventDefault();
        word.dispatchEvent(new root.MouseEvent("click",{bubbles:true,cancelable:true}));
      },true);
    }
  }
  root.Recognition={bind:bind};
})(window);
