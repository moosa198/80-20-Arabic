/* 80/20 Arabic — simplified one-screen student journey.
   The page is deliberately quieter than the full Student Studio: one weekly
   journey, one step at a time, with Hifz as the governing priority.
*/
(function(root){
  "use strict";
  var stateKey="8020-focused-journey-v1";
  var currentWeek=Number(new URLSearchParams(location.search).get("week"))||nextWeek();
  var step=Number(new URLSearchParams(location.search).get("step"))||1;
  var sourceReady=false, vocabReady=false;
  var main=root.document.getElementById("focusMain");

  function esc(v){return String(v==null?"":v).replace(/[&<>\"']/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"})[c];});}
  function week(){return root.WeeklyGuide.get(currentWeek);}
  function tasks(){return (root.WeeklyGuide.recognitionTasks||{})[currentWeek]||{};}
  function read(k){try{return JSON.parse(root.localStorage.getItem(k)||"{}");}catch(e){return {};}}
  function write(k,v){try{root.localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
  function focused(){return read(stateKey)[currentWeek]||{};}
  function saveFocused(patch){var all=read(stateKey),old=all[currentWeek]||{};all[currentWeek]=Object.assign({},old,patch,{updatedAt:new Date().toISOString()});write(stateKey,all);return all[currentWeek];}
  function done(){var a=read("8020-student-v2"),b=read("8020arabic-progress-v1");return !!((a.done||{})[currentWeek]||(b.doneWeeks||{})[currentWeek]);}
  function nextWeek(){for(var i=1;i<=31;i++)if(!doneWeek(i))return i;return 31;}
  function doneWeek(n){var a=read("8020-student-v2"),b=read("8020arabic-progress-v1");return !!((a.done||{})[n]||(b.doneWeeks||{})[n]);}
  function progress(){var n=0;for(var i=1;i<=31;i++)if(doneWeek(i))n++;return Math.round(n/31*100);}
  function termsForTask(){return (tasks().labels||[]).slice(0,4);}
  function persistDone(){
    var a=read("8020-student-v2");a.done=a.done||{};a.done[currentWeek]=true;a.lastCompletedAt=new Date().toISOString();write("8020-student-v2",a);
    var b=read("8020arabic-progress-v1");b.doneWeeks=b.doneWeeks||{};b.doneWeeks[currentWeek]=true;b.lastSession=new Date().toISOString();write("8020arabic-progress-v1",b);
  }
  function stepLabel(n){return ["Amanah + Hifz","FSTU source","7 words","Qur’an application","Self-assess + solution"][n-1]||"Lesson";}
  function nav(){
    var d=week();
    var steps=[1,2,3,4,5].map(function(n){return '<button type="button" class="focus-step '+(n===step?'active ':'')+(n<step?'visited':'')+'" data-step="'+n+'"><span>'+n+'</span><b>'+stepLabel(n)+'</b></button>';}).join("");
    return '<div class="focus-progress" aria-label="Weekly journey"><div class="focus-stepper">'+steps+'</div><div class="focus-progress-meta"><span>Week '+currentWeek+' of 31 · '+esc(d.passage)+'</span><span>'+progress()+'% course complete</span></div></div>';
  }
  function renderAmanah(){
    var s=focused();
    return '<section class="focus-card focus-opening"><div class="eyebrow">START HERE · 30 SECONDS</div><h2>Protect the Amanah of your Qur’an</h2><p class="lead">Your Arabic is here to serve your Hifz and deepen your love of the Qur’an. It is not another subject competing with it.</p><div class="hifz-box"><b>Hifz first</b><p>Complete your teacher-assigned <b>Sabaq</b>, <b>Sabaq Sipara / Sabqi</b> and <b>Dhor / Dawr</b> first. If Hifz needs your attention today, stop here and return to Arabic later.</p></div><div class="amanah-box"><div class="eyebrow">YOUR 3 AMANAHS</div><p class="small">The exact wording from your Amanah framework is intentionally not invented here. Use this space to pause, remember the three commitments your teacher has given you, and assess yourself honestly.</p><div class="amanah-grid"><label><span>Amanah 1</span><select data-amanah="1"><option value="">How am I doing?</option><option '+(s.a1==='yes'?'selected':'')+' value="yes">I kept it</option><option '+(s.a1==='work'?'selected':'')+' value="work">I need to work on it</option></select></label><label><span>Amanah 2</span><select data-amanah="2"><option value="">How am I doing?</option><option '+(s.a2==='yes'?'selected':'')+' value="yes">I kept it</option><option '+(s.a2==='work'?'selected':'')+' value="work">I need to work on it</option></select></label><label><span>Amanah 3</span><select data-amanah="3"><option value="">How am I doing?</option><option '+(s.a3==='yes'?'selected':'')+' value="yes">I kept it</option><option '+(s.a3==='work'?'selected':'')+' value="work">I need to work on it</option></select></label></div></div><div class="focus-actions"><button class="primary" data-next="2">Begin the Arabic lesson</button></div></section>';
  }
  function sourcePages(){var d=week();return '<div class="assigned-pages"><div class="assigned-head"><div><div class="eyebrow">SOURCE BOOK · PRIMARY</div><h3>Only this week’s FSTU pages</h3></div><span>Do the book’s own questions</span></div><div class="source-book"><h4>FSTU Naḥw · نَحْوٌ</h4><p>'+esc(d.nahw)+'</p><div class="source-pages">'+(d.nahwPages||[]).map(function(p){return '<figure><figcaption>Printed p. '+p+'</figcaption><div data-book-page="nahw:'+p+'"></div></figure>';}).join('')+'</div></div><div class="source-book sarf"><h4>FSTU Ṣarf · صَرْفٌ</h4><p>'+esc(d.sarf)+'</p><div class="source-pages">'+(d.sarfPages||[]).map(function(p){return '<figure><figcaption>Printed p. '+p+'</figcaption><div data-book-page="sarf:'+p+'"></div></figure>';}).join('')+'</div></div></div>';}
  function renderSource(){
    var s=focused(),d=week(),pages=(d.nahwPages||[]).concat(d.sarfPages||[]);
    return '<section class="focus-card"><div class="eyebrow">STEP 2 · UNDERSTAND BEFORE YOU APPLY</div><h2>Learn it from FSTU first</h2><p class="lead">The source book teaches the concept. The Qur’an test comes later. Read the assigned pages, complete the questions/exercises on the page, and be able to explain the rule without looking.</p>'+sourcePages()+'<div class="source-check"><h3>FSTU self-check</h3><label class="check"><input type="checkbox" id="fstuRead" '+(s.fstuRead?'checked':'')+'> I read the assigned page(s) and completed the relevant FSTU questions.</label><label class="check"><input type="checkbox" id="fstuExplain" '+(s.fstuExplain?'checked':'')+'> I can explain the concept and the worked example without copying the wording.</label><label class="evidence"><span>Say it in your own words</span><textarea id="fstuTeachback" rows="4" placeholder="What is the rule? What clue should you look for?">'+esc(s.fstuTeachback||'')+'</textarea></label><div class="solution"><b>Need help?</b><p>Return to the exact FSTU page above. Re-read the definition, then the worked example. Cover the explanation and try the question again. Compare your reasoning with the example before moving on.</p><button type="button" class="secondary" id="showSourceHint">Show this week’s focus</button><p class="hidden" id="sourceHint">'+esc(d.nahw)+' '+esc(d.sarf)+'</p></div><div class="focus-actions"><button class="secondary" data-prev="1">Back</button><button class="primary" id="sourceContinue">I understand it → learn the 7 words</button></div></div></section>';
  }
  function renderVocab(){
    var s=focused(),d=week();
    return '<section class="focus-card"><div class="eyebrow">STEP 3 · VOCABULARY</div><h2>Learn these 7 words before testing the Qur’an</h2><p class="lead">These are the week’s new words. Reveal each meaning, say the Arabic aloud, then hide the meaning and check that you still recognise the word.</p><div class="vocab-grid">'+(d.words||[]).slice(0,7).map(function(w,i){var shown=!!(s.vocab||{})[i];return '<article class="vocab-card '+(shown?'shown':'')+'"><span class="vocab-no">'+(i+1)+'</span><b lang="ar" dir="rtl">'+esc(w.ar)+'</b><span class="meaning">'+(shown?esc(w.en):'Meaning hidden')+'</span><button type="button" class="secondary" data-reveal-vocab="'+i+'">'+(shown?'Hide meaning':'Reveal meaning')+'</button></article>';}).join('')+'</div><label class="check vocab-check"><input type="checkbox" id="vocabReady" '+(s.vocabReady?'checked':'')+'> I can recognise all 7 words without needing the English meaning.</label><div class="focus-actions"><button class="secondary" data-prev="2">Back</button><button class="primary" id="vocabContinue">I know the vocab → open the Qur’an test</button></div></section>';
  }
  function renderQuran(){
    var d=week(),t=tasks(),labels=(t.labels||[]).slice(0,3),s=focused();
    var prompts=labels.length?labels.map(function(x,i){var saved=(s.prompts||{})[i]||[];return '<article class="prompt-card"><div class="prompt-no">'+(i+1)+'</div><div><b>Find '+(i===0?'3':'3')+' examples of <span>'+esc(x[0])+'</span> · <span lang="ar" dir="rtl">'+esc(x[1])+'</span></b><p>Use the actual memorised page. Type the Arabic words you selected. Do not translate first — recognise the form/relationship first.</p><div class="evidence-grid">'+[0,1,2].map(function(j){return '<input class="arabic-input" dir="rtl" lang="ar" data-prompt="'+i+'" data-slot="'+j+'" value="'+esc(saved[j]||'')+'" placeholder="Arabic word '+(j+1)+'">';}).join('')+'</div></div></article>';}).join(''):'<p>No task labels are configured for this week.</p>';
    return '<section class="focus-card"><div class="eyebrow">STEP 4 · QUR’AN APPLICATION</div><h2>Now test it on the Qur’an</h2><p class="lead">You have learned the concept and the 7 words. Now return to the memorised page and notice the Arabic. The aim is not to turn Hifz into a grammar exercise; it is to make familiar Qur’anic Arabic more meaningful.</p><div class="quran-target"><b>Target page</b><span>Madani page '+d.page+'</span><strong>'+esc(d.passage)+'</strong><small>Read the whole passage first. Keep your Hifz flow intact.</small></div><div class="quran-page"><div data-book-page="quran:'+Number(d.page)+'"></div><p class="small">If the Qur’an PDF is not yet available on this device, the page viewer will ask for the 15-line Madani PDF. Only the assigned page is displayed.</p></div><div class="prompts">'+prompts+'</div><div class="focus-actions"><button class="secondary" data-prev="3">Back</button><button class="primary" id="quranContinue">I found the evidence → self-assess</button></div></section>';
  }
  function renderAssess(){
    var s=focused(),d=week();
    return '<section class="focus-card"><div class="eyebrow">STEP 5 · SELF-ASSESS + SOLUTION</div><h2>Be honest about what you actually learned</h2><p class="lead">This is not a score. It tells you what to do next. Your teacher can use your evidence; the app does not pretend to replace teacher judgement.</p><div class="assessment-grid"><button class="assess '+(s.self==='secure'?'selected':'')+'" data-self="secure"><b>Secure</b><span>I can explain the FSTU concept and recognise it on my memorised page.</span></button><button class="assess '+(s.self==='developing'?'selected':'')+'" data-self="developing"><b>Developing</b><span>I can see it, but I still need the source/example to help me explain it.</span></button><button class="assess '+(s.self==='revisit'?'selected':'')+'" data-self="revisit"><b>Revisit</b><span>I am not confident yet. I need to go back to FSTU with my teacher.</span></button></div><div class="solution-box"><h3>Solution path</h3><p><b>1.</b> Return to the exact FSTU page assigned this week.</p><p><b>2.</b> Find the definition and one worked example.</p><p><b>3.</b> Explain the rule without looking.</p><p><b>4.</b> Return to page '+d.page+' and re-select the evidence.</p><p><b>5.</b> If the analysis still feels uncertain, record the uncertainty for your teacher. Do not force a grammar label.</p><button type="button" class="secondary" id="showWhy">Show the teacher focus for this week</button><div id="whyBox" class="hidden"><p>'+esc(d.nahw)+'</p><p>'+esc(d.sarf)+'</p></div></div><label class="evidence"><span>One thing I now notice in the Qur’an that I did not notice before</span><textarea id="appreciation" rows="3">'+esc(s.appreciation||'')+'</textarea></label><div class="finish-box"><b>Finish with the Qur’an.</b><p>Read your memorised passage once more for meaning and attachment — not for a grammar mark.</p></div><div class="focus-actions"><button class="secondary" data-prev="4">Back</button><button class="primary" id="finishWeek">Complete Week '+currentWeek+'</button></div></section>';
  }
  function render(){
    var d=week();
    main.innerHTML='<header class="focus-header"><div><div class="eyebrow">80/20 ARABIC · HIFZ-FIRST</div><h1>Week '+currentWeek+'</h1><p>'+esc(d.passage)+' · '+esc(d.objective||'One focused Arabic concept')+'</p></div><a href="./teacher.html" class="teacher-link">Teacher</a></header>'+nav()+'<div class="focus-body">'+(step===1?renderAmanah():step===2?renderSource():step===3?renderVocab():step===4?renderQuran():renderAssess())+'</div>';
    bind();
    if(step===2&&root.BookPages){root.BookPages.hydrate(main);autoFstu();}
    if(step===4&&root.BookPages)root.BookPages.hydrate(main);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function go(n){step=Math.max(1,Math.min(5,Number(n)));history.replaceState(null,'','student.html?week='+currentWeek+'&step='+step);render();}
  function bind(){
    main.querySelectorAll('[data-step]').forEach(function(b){b.addEventListener('click',function(){go(Number(b.dataset.step));});});
    main.querySelectorAll('[data-next]').forEach(function(b){b.addEventListener('click',function(){saveAmanah();go(Number(b.dataset.next));});});
    main.querySelectorAll('[data-prev]').forEach(function(b){b.addEventListener('click',function(){go(Number(b.dataset.prev));});});
    var sc=main.querySelector('#sourceContinue');if(sc)sc.addEventListener('click',function(){var read=main.querySelector('#fstuRead'),ex=main.querySelector('#fstuExplain'),tb=main.querySelector('#fstuTeachback');if(!read.checked||!ex.checked||tb.value.trim().length<15){alert('Complete the two FSTU checks and explain the concept in your own words first.');return;}saveFocused({fstuRead:true,fstuExplain:true,fstuTeachback:tb.value.trim()});go(3);});
    var vc=main.querySelector('#vocabContinue');if(vc)vc.addEventListener('click',function(){if(!main.querySelector('#vocabReady').checked){alert('First check that you can recognise all 7 words without the English meanings.');return;}saveFocused({vocabReady:true});go(4);});
    main.querySelectorAll('[data-reveal-vocab]').forEach(function(b){b.addEventListener('click',function(){var s=focused(),v=Object.assign({},s.vocab||{});v[b.dataset.revealVocab]=!v[b.dataset.revealVocab];saveFocused({vocab:v});render();});});
    main.querySelectorAll('[data-amanah]').forEach(function(x){x.addEventListener('change',function(){var p={};p['a'+x.dataset.amanah]=x.value;saveFocused(p);});});
    main.querySelectorAll('[data-self]').forEach(function(b){b.addEventListener('click',function(){saveFocused({self:b.dataset.self});render();});});
    var qc=main.querySelector('#quranContinue');if(qc)qc.addEventListener('click',function(){var p={};main.querySelectorAll('[data-prompt]').forEach(function(i){var n=Number(i.dataset.prompt),j=Number(i.dataset.slot);p[n]=p[n]||[];p[n][j]=i.value.trim();});saveFocused({prompts:p});go(5);});
    var fw=main.querySelector('#finishWeek');if(fw)fw.addEventListener('click',function(){var s=focused();if(!s.self||!s.appreciation||!s.appreciation.trim()){alert('Choose a self-assessment and write one Qur’an appreciation observation first.');return;}persistDone();alert('Week '+currentWeek+' completed. Keep the Qur’an close, then continue your Hifz.');location.href='student.html?week='+Math.min(31,currentWeek+1)+'&step=1';});
    var app=main.querySelector('#appreciation');if(app)app.addEventListener('input',function(){saveFocused({appreciation:app.value});});
    var why=main.querySelector('#showWhy');if(why)why.addEventListener('click',function(){main.querySelector('#whyBox').classList.toggle('hidden');});
    var hint=main.querySelector('#showSourceHint');if(hint)hint.addEventListener('click',function(){main.querySelector('#sourceHint').classList.toggle('hidden');});
  }
  function saveAmanah(){var p={};main.querySelectorAll('[data-amanah]').forEach(function(x){p['a'+x.dataset.amanah]=x.value;});saveFocused(p);}
  var fstuStarted=false;
  function autoFstu(){if(fstuStarted||!root.FSTUAuto)return;fstuStarted=true;root.FSTUAuto.load().catch(function(e){console.warn('FSTU automatic source loading unavailable:',e);});}
  root.addEventListener('load',function(){render();},{once:true});
  if(document.readyState!=='loading')render();
}(window));
