/* Optional, secure class sync for 80/20 Arabic.
   Uses the current classes/class_memberships schema. Data stays local unless a
   student signs in, chooses a class and explicitly syncs; subsequent changes
   are then autosaved to that class. Never put a service_role key in the browser.
*/
(function(root){
  "use strict";
  var CONFIG=root.SUPABASE_CONFIG||{};
  var KEYS=["8020arabic-progress-v1","8020-word-recognition-v1","8020-weekly-recall-v2","8020-student-v2"];
  var client=null,session=null,memberships=[],activeClassId="",activeRole="",ready=false,busy=false;
  var lastStatus="Progress stays on this device until you sign in and sync with a class.";
  var suppressed=false,writeTimer=null,initialized=false,dialog=null,statusNode=null,button=null;

  function configured(){return !!(CONFIG.url&&CONFIG.publishableKey&&root.supabase&&root.supabase.createClient);}
  function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function parse(value){try{return JSON.parse(value||"{}")||{};}catch(e){return {};}}
  function localState(key){try{return parse(root.localStorage.getItem(key));}catch(e){return {};}}
  function dateValue(value){var n=Date.parse(value||"");return Number.isFinite(n)?n:0;}
  function newer(a,b,key){return dateValue(a&&a[key])>=dateValue(b&&b[key])?a:b;}
  function mergeCards(local,remote){
    var out=Object.assign({},remote||{});
    Object.keys(local||{}).forEach(function(key){
      var l=local[key],r=out[key];
      if(!r){out[key]=l;return;}
      var lr=Number(l&&l.reps||0),rr=Number(r&&r.reps||0);
      if(lr>rr){out[key]=l;return;}
      if(lr===rr&&dateValue(l&&l.last)>dateValue(r&&r.last)){out[key]=l;return;}
      if(lr===rr&&Number(l&&l.interval||0)>Number(r&&r.interval||0)){out[key]=l;}
    });
    return out;
  }
  function mergeSnapshots(key,local,remote){
    local=local||{};remote=remote||{};
    if(key==="8020-word-recognition-v1"){
      var out={},weeks=new Set(Object.keys(local).concat(Object.keys(remote)));
      weeks.forEach(function(week){
        var a=local[week]||{},b=remote[week]||{};
        var aa=Array.isArray(a.attempts)?a.attempts:(a.words?[a]:[]);
        var bb=Array.isArray(b.attempts)?b.attempts:(b.words?[b]:[]);
        var unique={},attempts=[];
        bb.concat(aa).forEach(function(x){
          if(!x)return;
          var signature=String(x.savedAt||"")+"|"+String(x.labelAr||"")+"|"+(x.words||[]).map(function(w){return w.text||"";}).join("|");
          if(!unique[signature]){unique[signature]=true;attempts.push(x);}
        });
        attempts.sort(function(x,y){return dateValue(x.savedAt)-dateValue(y.savedAt);});
        out[week]=Object.assign({},b,a,{week:Number(week),attempts:attempts.slice(-60)});
        var latest=attempts[attempts.length-1];
        if(latest)out[week].updatedAt=latest.savedAt;
      });
      return out;
    }
    if(key==="8020-weekly-recall-v2"){
      var records={};
      new Set(Object.keys(remote).concat(Object.keys(local))).forEach(function(k){
        records[k]=newer(local[k],remote[k],"answeredAt")||local[k]||remote[k];
      });
      return records;
    }
    if(key==="8020arabic-progress-v1"||key==="8020-student-v2"){
      var combined=Object.assign({},remote,local);
      combined.cards=mergeCards(local.cards,remote.cards);
      var doneName=key==="8020arabic-progress-v1"?"doneWeeks":"done";
      combined[doneName]=Object.assign({},remote[doneName]||{},local[doneName]||{});
      Object.keys(remote[doneName]||{}).forEach(function(k){
        combined[doneName][k]=!!(remote[doneName][k]||((local[doneName]||{})[k]));
      });
      if(key==="8020arabic-progress-v1"){
        combined.streak=Math.max(Number(local.streak||0),Number(remote.streak||0));
        combined.seconds=Math.max(Number(local.seconds||0),Number(remote.seconds||0));
        combined.lastSession=newer(local,remote,"lastSession").lastSession||null;
      }
      return combined;
    }
    return Object.assign({},remote,local);
  }
  function setStatus(message){
    lastStatus=String(message||"");
    if(statusNode)statusNode.textContent=lastStatus;
    if(button){button.setAttribute("aria-label",lastStatus);button.title=lastStatus;}
  }
  function privacyLabel(){
    var label=root.document&&root.document.querySelector(".privacy");
    if(label)label.textContent=ready?"Class cloud sync active":"Progress stays on this device";
  }
  function show(){if(dialog){dialog.hidden=false;var close=dialog.querySelector(".cp-close");if(close)close.focus();render();}}
  function hide(){if(dialog)dialog.hidden=true;if(button)button.focus();}
  function styleAndMount(){
    var host=root.document.querySelector(".topright,.topBtns");
    if(!host||dialog)return;
    var style=root.document.createElement("style");
    style.textContent=".cp-launch{white-space:nowrap}.cp-overlay{position:fixed;inset:0;z-index:1000;background:#132b2780;display:grid;place-items:center;padding:14px}.cp-overlay[hidden]{display:none!important}.cp-panel{width:min(670px,100%);max-height:min(88vh,850px);overflow:auto;background:#fffdf8;color:#172b29;border:1px solid #dce3de;border-radius:18px;box-shadow:0 20px 70px #0003;padding:clamp(16px,3vw,25px);font:13px/1.55 system-ui,sans-serif}.cp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;border-bottom:1px solid #dce3de;padding-bottom:13px;margin-bottom:15px}.cp-head h2{margin:2px 0 4px;font-size:22px;letter-spacing:-.5px}.cp-muted{color:#687772}.cp-close{border:1px solid #dce3de;background:#fff;border-radius:9px;padding:6px 10px;color:#163c36}.cp-form{display:grid;gap:10px}.cp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cp-field{display:grid;gap:4px}.cp-field label{font-weight:700;font-size:11px}.cp-field input,.cp-field select{min-width:0;width:100%;border:1px solid #cfd9d2;border-radius:9px;background:white;color:#172b29;padding:10px;font:inherit}.cp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}.cp-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid #163c36;background:#163c36;color:#fff;text-decoration:none;border-radius:9px;padding:9px 12px;font-size:11px;font-weight:700;cursor:pointer}.cp-btn.secondary{background:#fff;color:#163c36;border-color:#dce3de}.cp-note{padding:11px;border:1px solid #dce3de;border-radius:10px;background:#f5f7f2;margin:10px 0;color:#53665c;font-size:12px}.cp-note.cp-error{background:#fff0eb;border-color:#e3bfb5;color:#7a352a}.cp-note.cp-success{background:#edf5ed;border-color:#c6dcc8;color:#274d37}.cp-status{font-size:11px;color:#596a62;overflow-wrap:anywhere}.cp-rule{border:0;border-top:1px solid #dce3de;margin:17px 0}@media(max-width:480px){.cp-grid{grid-template-columns:1fr}.cp-launch{font-size:10px;padding:7px 8px}}";
    root.document.head.appendChild(style);
    button=root.document.createElement("button");
    button.id="cloudProgressLaunch";button.type="button";
    button.className=host.classList.contains("topBtns")?"topBtn cp-launch":"btn btntop cp-launch";
    button.textContent="Class sync";button.addEventListener("click",show);host.appendChild(button);
    dialog=root.document.createElement("div");dialog.className="cp-overlay";dialog.hidden=true;
    dialog.innerHTML='<section class="cp-panel" role="dialog" aria-modal="true" aria-labelledby="cpTitle"><div class="cp-head"><div><div class="cp-muted" style="font-size:10px;letter-spacing:.12em;font-weight:800;text-transform:uppercase">80/20 Arabic · Madrassa</div><h2 id="cpTitle">Progress and class access</h2><div class="cp-muted">Local-first learning, with optional secure class synchronisation.</div></div><button type="button" class="cp-close">Close ✕</button></div><div id="cpBody"></div><p id="cpStatus" class="cp-status" role="status" aria-live="polite"></p></section>';
    root.document.body.appendChild(dialog);statusNode=dialog.querySelector("#cpStatus");
    dialog.querySelector(".cp-close").addEventListener("click",hide);
    dialog.addEventListener("click",function(e){if(e.target===dialog)hide();});
    dialog.addEventListener("keydown",function(e){if(e.key==="Escape")hide();});
  }
  function bind(id,fn){
    var el=root.document.getElementById(id);
    if(el)el.addEventListener("click",function(e){
      e.preventDefault();Promise.resolve(fn(e)).catch(function(err){setStatus(err.message||String(err));render();});
    });
  }
  function messageBox(text,kind){return '<div class="cp-note '+(kind==="error"?"cp-error":kind==="success"?"cp-success":"")+'">'+esc(text)+'</div>';}
  function render(){
    if(!dialog)return;
    var body=dialog.querySelector("#cpBody");
    if(!configured()){
      body.innerHTML=messageBox("Cloud sync is not configured. The app continues to work locally. A project URL and public publishable key are required; never use a service_role key in browser code.");
      setStatus(lastStatus);return;
    }
    if(!session){
      body.innerHTML='<form id="cpAuth" class="cp-form"><div class="cp-grid"><div class="cp-field"><label for="cpName">Name (new account)</label><input id="cpName" autocomplete="name" maxlength="100" placeholder="Your name"></div><div class="cp-field"><label for="cpEmail">Email address</label><input id="cpEmail" type="email" autocomplete="email" required></div></div><div class="cp-field"><label for="cpPassword">Password</label><input id="cpPassword" type="password" autocomplete="current-password" minlength="8" required></div><p class="cp-muted">Use the student account your teacher has added to a class. If creating an account here, confirm your email first if prompted, then ask your teacher for a class invitation code.</p><div class="cp-actions"><button id="cpSignIn" class="cp-btn" type="button">Sign in</button><button id="cpSignUp" class="cp-btn secondary" type="button">Create account</button></div></form>';
      bind("cpSignIn",signIn);bind("cpSignUp",signUp);setStatus(lastStatus);return;
    }
    var classOptions=memberships.map(function(m){return '<option value="'+esc(m.id)+'" '+(activeClassId===m.id?"selected":"")+'>'+esc(m.name)+' · '+esc(m.role)+'</option>';}).join("");
    var active=memberships.find(function(m){return m.id===activeClassId;});
    var html='<div class="cp-note cp-success">Signed in as <b>'+esc(session.user.email||"account")+'</b>. Cloud data is scoped to your class membership.</div>';
    if(!memberships.length){html+=messageBox("No class is linked to this account yet. Ask your teacher for a one-use class invitation code.");}
    else{
      html+='<form id="cpSelectClass" class="cp-form"><div class="cp-field"><label for="cpClass">Your class</label><select id="cpClass" required><option value="">Choose a class…</option>'+classOptions+'</select></div><div class="cp-actions"><button class="cp-btn" type="submit">Select class / sync progress</button><a class="cp-btn secondary" href="./teacher.html" target="_blank" rel="noreferrer">Teacher dashboard</a></div></form>';
    }
    html+='<hr class="cp-rule"><form id="cpJoin" class="cp-form"><div class="cp-field"><label for="cpInvite">Join a class · one-use invitation code</label><input id="cpInvite" autocomplete="off" spellcheck="false" placeholder="Paste invitation code" required></div><div class="cp-actions"><button class="cp-btn secondary" type="submit">Join class</button></div></form><hr class="cp-rule"><div class="cp-actions"><button id="cpSignOut" class="cp-btn secondary" type="button">Sign out</button></div>';
    if(active){
      html+='<hr class="cp-rule"><div class="cp-note"><b>Selected class:</b> '+esc(active.name)+'<br><span class="cp-muted">Role: '+esc(active.role)+'</span><div class="cp-actions"><button id="cpSyncNow" class="cp-btn" type="button">'+(active.role==="student"?"Merge and sync my progress":"Open teacher dashboard")+'</button></div></div>';
    }
    body.innerHTML=html;
    var join=root.document.getElementById("cpJoin");
    if(join)join.addEventListener("submit",function(e){e.preventDefault();joinClass().catch(function(err){setStatus(err.message||String(err));render();});});
    var select=root.document.getElementById("cpSelectClass");
    if(select)select.addEventListener("submit",function(e){
      e.preventDefault();
      (async function(){
        activeClassId=root.document.getElementById("cpClass").value;
        var chosen=memberships.find(function(m){return m.id===activeClassId;});
        activeRole=chosen&&chosen.role||"";ready=false;saveActiveChoice();
        if(activeRole==="student"){await syncSelectedClass();}
        else if(activeRole){setStatus("Staff account selected. Use the teacher dashboard for class administration and reviews.");root.open("./teacher.html","_blank","noopener");render();}
      })().catch(function(err){setStatus(err.message||String(err));render();});
    });
    bind("cpSyncNow",async function(){
      if(activeRole==="student"){await syncSelectedClass();}
      else if(activeRole){root.open("./teacher.html","_blank","noopener");}
    });
    bind("cpSignOut",signOut);
    setStatus(lastStatus);
  }
  async function signIn(){
    var email=(root.document.getElementById("cpEmail")||{}).value||"";
    var password=(root.document.getElementById("cpPassword")||{}).value||"";
    setStatus("Signing in…");
    var r=await client.auth.signInWithPassword({email:email.trim(),password:password});
    if(r.error)throw r.error;session=r.data.session;await loadMemberships();
    setStatus("Signed in. Choose your class before syncing.");render();
  }
  async function signUp(){
    var email=(root.document.getElementById("cpEmail")||{}).value||"";
    var password=(root.document.getElementById("cpPassword")||{}).value||"";
    var name=(root.document.getElementById("cpName")||{}).value||"";
    if(!name.trim())throw new Error("Enter your name for the new account.");
    setStatus("Creating your account…");
    var r=await client.auth.signUp({email:email.trim(),password:password,options:{data:{display_name:name.trim()}}});
    if(r.error)throw r.error;session=r.data.session;
    if(!session){setStatus("Account created. Check your email to confirm the account, then return here to sign in.");render();return;}
    await loadMemberships();setStatus("Account created. Join a class using your teacher's one-use code.");render();
  }
  async function signOut(){
    ready=false;activeClassId="";activeRole="";session=null;memberships=[];
    try{root.sessionStorage.removeItem("8020-active-class");}catch(e){}
    var r=await client.auth.signOut();if(r.error)throw r.error;
    setStatus("Signed out. Learning progress remains saved on this device.");render();privacyLabel();
  }
  async function loadMemberships(){
    memberships=[];if(!session)return;
    var m=await client.from("class_memberships").select("class_id,role").eq("user_id",session.user.id);
    if(m.error)throw m.error;
    var rows=m.data||[],ids=rows.map(function(x){return x.class_id;});
    if(!ids.length){activeClassId="";activeRole="";return;}
    var c=await client.from("classes").select("id,name,year_group").in("id",ids);
    if(c.error)throw c.error;
    memberships=(c.data||[]).map(function(x){
      var mr=rows.find(function(y){return y.class_id===x.id;})||{};
      return {id:x.id,name:x.name,year_group:x.year_group||"",role:mr.role||"student"};
    });
    var saved="";try{saved=root.sessionStorage.getItem("8020-active-class")||"";}catch(e){}
    if(activeClassId&&memberships.some(function(m){return m.id===activeClassId;}))saved=activeClassId;
    if(saved&&memberships.some(function(m){return m.id===saved;})){
      activeClassId=saved;activeRole=(memberships.find(function(m){return m.id===saved;})||{}).role||"";
    }else{activeClassId="";activeRole="";}
  }
  function saveActiveChoice(){try{root.sessionStorage.setItem("8020-active-class",activeClassId);}catch(e){}}
  async function joinClass(){
    if(!session)throw new Error("Sign in first.");
    var input=root.document.getElementById("cpInvite"),code=(input&&input.value||"").trim();
    if(!code)throw new Error("Paste the one-use class invitation code from your teacher.");
    setStatus("Joining class…");
    var result=await client.rpc("accept_class_invite",{p_code:code});
    if(result.error)throw result.error;
    await loadMemberships();activeClassId=result.data;
    var joined=memberships.find(function(m){return m.id===activeClassId;});
    activeRole=joined&&joined.role||"";saveActiveChoice();
    setStatus("Class joined. You can now sync your progress.");render();
  }
  async function syncSelectedClass(){
    if(!session)throw new Error("Sign in first.");
    var selected=memberships.find(function(m){return m.id===activeClassId;});
    if(!selected)throw new Error("Choose a class before syncing.");
    if(selected.role!=="student")throw new Error("Staff progress must be reviewed through the teacher dashboard, not synced as student data.");
    if(busy)return;
    busy=true;ready=false;privacyLabel();
    try{
      setStatus("Merging local progress with your class…");
      var remote=await client.from("student_learning_state").select("store_key,state").eq("class_id",activeClassId).eq("student_user_id",session.user.id);
      if(remote.error)throw remote.error;
      var remoteByKey={};(remote.data||[]).forEach(function(r){remoteByKey[r.store_key]=r.state||{};});
      var merged={};suppressed=true;
      KEYS.forEach(function(key){
        merged[key]=mergeSnapshots(key,localState(key),remoteByKey[key]||{});
        try{root.localStorage.setItem(key,JSON.stringify(merged[key]));}catch(e){}
      });
      suppressed=false;await pushData(merged);ready=true;saveActiveChoice();privacyLabel();
      setStatus("Synced securely with "+selected.name+". Saved progress is now available to authorised class staff.");
    }catch(e){suppressed=false;ready=false;privacyLabel();throw e;}
    finally{busy=false;render();}
  }
  async function pushData(states){
    if(!session||!activeClassId||activeRole!=="student")return;
    var now=new Date().toISOString();
    var rows=KEYS.map(function(key){return {class_id:activeClassId,student_user_id:session.user.id,store_key:key,state:states[key]||{},updated_at:now};});
    var result=await client.from("student_learning_state").upsert(rows,{onConflict:"class_id,student_user_id,store_key"});
    if(result.error)throw result.error;
  }
  function queuePush(key){
    if(!KEYS.includes(String(key))||suppressed||!ready||!session||activeRole!=="student"||!activeClassId)return;
    if(writeTimer)root.clearTimeout(writeTimer);
    writeTimer=root.setTimeout(async function(){
      if(busy)return;busy=true;
      try{await pushData(Object.fromEntries(KEYS.map(function(k){return [k,localState(k)];})));setStatus("Class progress saved.");}
      catch(e){ready=false;privacyLabel();setStatus("Local progress is safe, but cloud sync failed: "+(e.message||String(e)));}
      finally{busy=false;}
    },900);
  }
  function patchLocalStorage(){
    if(!root.Storage||root.Storage.prototype.__8020CloudPatched)return;
    var nativeSetItem=root.Storage.prototype.setItem;
    root.Storage.prototype.setItem=function(key,value){
      var result=nativeSetItem.apply(this,arguments);
      if(this===root.localStorage)queuePush(key);
      return result;
    };
    root.Storage.prototype.__8020CloudPatched=true;
  }
  async function init(){
    if(initialized)return;initialized=true;styleAndMount();patchLocalStorage();
    if(!configured()){setStatus("Cloud sync is not configured. Use the app locally until it is configured.");privacyLabel();return;}
    client=root.supabase.createClient(CONFIG.url,CONFIG.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    client.auth.onAuthStateChange(function(_event,newSession){
      session=newSession;
      if(!session){ready=false;activeRole="";activeClassId="";memberships=[];privacyLabel();}
      if(statusNode&&dialog&&!dialog.hidden)render();
    });
    var response=await client.auth.getSession();
    if(response.error){setStatus(response.error.message);return;}
    session=response.data.session;
    if(session){try{await loadMemberships();}catch(e){setStatus("Could not load classes: "+e.message);}}
    privacyLabel();render();
  }
  if(root.document){
    if(root.document.readyState==="complete")init().catch(function(e){setStatus(e.message||String(e));});
    else root.addEventListener("load",function(){init().catch(function(e){setStatus(e.message||String(e));});},{once:true});
  }
  root.CloudProgress={init:init,getStatus:function(){return lastStatus;},isConfigured:configured,sync:function(){return syncSelectedClass();},getActiveClass:function(){return {id:activeClassId,role:activeRole,ready:ready};}};
}(window));
