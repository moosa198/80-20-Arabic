(function(root){
  "use strict";
  var CONFIG_KEY="8020-classroom-config-v1";
  var ENROLMENT_KEY="8020-classroom-enrolment-v1";
  var COURSE_KEY="8020arabic-progress-v1";
  var STUDIO_KEY="8020-student-v2";
  var QUIZ_KEY="8020-weekly-recall-v2";
  var RECOGNITION_KEY="8020-word-recognition-v1";
  var SOURCE_KEY="8020-source-first-v1";
  var client=null,clientConfig=null,syncTimer=null,modal=null;

  function readJson(key,fallback){
    try{var value=root.localStorage.getItem(key);return value?JSON.parse(value):fallback;}
    catch(e){return fallback;}
  }
  function config(){return readJson(CONFIG_KEY,{});}
  function enrolment(){return readJson(ENROLMENT_KEY,null);}
  function saveConfig(value){
    var nextUrl=String(value.url||"").trim().replace(/\/$/,"");
    var prior=config(),active=enrolment();
    if(active&&prior.url&&nextUrl!==prior.url)throw new Error("Disconnect this learner from the current class before changing the classroom project.");
    root.localStorage.setItem(CONFIG_KEY,JSON.stringify({url:nextUrl,anonKey:String(value.anonKey||"").trim()}));
    client=null;clientConfig=null;
  }
  function getClient(){
    var cfg=config();
    if(!cfg.url||!cfg.anonKey)return null;
    if(!root.supabase||typeof root.supabase.createClient!=="function")throw new Error("The classroom connection library did not load. Check the internet connection and reload.");
    if(client&&clientConfig&&clientConfig.url===cfg.url&&clientConfig.anonKey===cfg.anonKey)return client;
    client=root.supabase.createClient(cfg.url,cfg.anonKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:"8020-student-auth-"+cfg.url.replace("https://","").replace("http://","").replace(/[^a-zA-Z0-9]/g,"-").slice(0,55)}
    });
    clientConfig={url:cfg.url,anonKey:cfg.anonKey};
    return client;
  }
  function snapshot(){
    return {
      version:1,
      exportedAt:new Date().toISOString(),
      course:readJson(COURSE_KEY,null),
      studio:readJson(STUDIO_KEY,null),
      quizzes:readJson(QUIZ_KEY,{}),
      recognition:readJson(RECOGNITION_KEY,{}),
      sourceFirst:readJson(SOURCE_KEY,{})
    };
  }
  function mergeFlags(remote,local){
    var out=Object.assign({},remote||{});
    Object.keys(local||{}).forEach(function(key){out[key]=!!(out[key]||local[key]);});
    return out;
  }
  function mergeCards(remote,local){
    var out=Object.assign({},remote||{});
    Object.keys(local||{}).forEach(function(key){
      var a=out[key],b=local[key];
      if(!a){out[key]=b;return;}
      if(!b)return;
      var ra=Number(a.reps||0),rb=Number(b.reps||0);
      if(rb>ra||(rb===ra&&Number(b.interval||0)>Number(a.interval||0)))out[key]=b;
    });
    return out;
  }
  function mergeTimestampedMap(remote,local,timeKey){
    var out=Object.assign({},remote||{});
    Object.keys(local||{}).forEach(function(key){
      var a=out[key],b=local[key];
      if(!a){out[key]=b;return;}
      if(!b)return;
      var ta=Date.parse(a[timeKey]||"")||0,tb=Date.parse(b[timeKey]||"")||0;
      if(tb>ta)out[key]=b;
    });
    return out;
  }
  function attemptsFor(item){
    if(item&&Array.isArray(item.attempts))return item.attempts;
    return item&&Array.isArray(item.words)?[item]:[];
  }
  function mergeRecognition(remote,local){
    var out=Object.assign({},remote||{});
    Object.keys(local||{}).forEach(function(week){
      var a=out[week]||{week:Number(week),attempts:[]},b=local[week]||{};
      var attempts=attemptsFor(a).concat(attemptsFor(b)),seen=Object.create(null),dedup=[];
      attempts.forEach(function(attempt){
        var signature=attempt.savedAt||JSON.stringify([attempt.words,attempt.labelAr,attempt.explanation]);
        if(seen[signature])return;
        seen[signature]=true;dedup.push(attempt);
      });
      dedup.sort(function(x,y){return (Date.parse(x.savedAt||"")||0)-(Date.parse(y.savedAt||"")||0);});
      out[week]={week:Number(week),attempts:dedup,updatedAt:(dedup[dedup.length-1]||{}).savedAt||a.updatedAt||b.updatedAt||""};
    });
    return out;
  }
  function mergeSnapshots(remote,local){
    remote=remote||{};local=local||{};
    var out={version:1,exportedAt:new Date().toISOString()};
    if(remote.course||local.course){
      out.course=Object.assign({},remote.course||{},local.course||{});
      out.course.doneWeeks=mergeFlags(remote.course&&remote.course.doneWeeks,local.course&&local.course.doneWeeks);
      out.course.cards=mergeCards(remote.course&&remote.course.cards,local.course&&local.course.cards);
      out.course.seconds=Math.max(Number(remote.course&&remote.course.seconds||0),Number(local.course&&local.course.seconds||0));
      out.course.streak=Math.max(Number(remote.course&&remote.course.streak||0),Number(local.course&&local.course.streak||0));
    }
    if(remote.studio||local.studio){
      out.studio=Object.assign({},remote.studio||{},local.studio||{});
      out.studio.done=mergeFlags(remote.studio&&remote.studio.done,local.studio&&local.studio.done);
      out.studio.cards=mergeCards(remote.studio&&remote.studio.cards,local.studio&&local.studio.cards);
    }
    out.quizzes=mergeTimestampedMap(remote.quizzes,local.quizzes,"answeredAt");
    out.recognition=mergeRecognition(remote.recognition,local.recognition);
    out.sourceFirst=mergeTimestampedMap(remote.sourceFirst,local.sourceFirst,"completedAt");
    return out;
  }
  function saveSnapshotLocally(data){
    if(data.course)root.localStorage.setItem(COURSE_KEY,JSON.stringify(data.course));
    if(data.studio)root.localStorage.setItem(STUDIO_KEY,JSON.stringify(data.studio));
    root.localStorage.setItem(QUIZ_KEY,JSON.stringify(data.quizzes||{}));
    root.localStorage.setItem(RECOGNITION_KEY,JSON.stringify(data.recognition||{}));
    root.localStorage.setItem(SOURCE_KEY,JSON.stringify(data.sourceFirst||{}));
  }
  function clearLearningStores(){
    [COURSE_KEY,STUDIO_KEY,QUIZ_KEY,RECOGNITION_KEY,SOURCE_KEY].forEach(function(key){root.localStorage.removeItem(key);});
  }
  function hasSubstantiveLocalProgress(){
    var data=snapshot(),course=data.course||{},studio=data.studio||{};
    return Object.keys(course.doneWeeks||{}).some(function(k){return course.doneWeeks[k];})||
      Object.keys(studio.done||{}).some(function(k){return studio.done[k];})||
      Object.keys(course.cards||{}).length>0||Object.keys(studio.cards||{}).length>0||
      Object.keys(data.quizzes||{}).length>0||Object.keys(data.recognition||{}).length>0||
      Object.keys(data.sourceFirst||{}).length>0;
  }
  async function syncNow(reason){
    var enrolled=enrolment();
    if(!enrolled||!enrolled.studentId)return {ok:false,skipped:true,reason:"This browser is not linked to a class learner."};
    var sb=getClient();
    if(!sb)return {ok:false,skipped:true,reason:"Classroom settings are not configured."};
    var auth=await sb.auth.getSession();
    var user=auth.data&&auth.data.session&&auth.data.session.user;
    if(!user)return {ok:false,skipped:true,reason:"Student session has expired. Reconnect using your class and learner codes."};
    var now=new Date().toISOString();
    var result=await sb.from("student_progress").upsert({
      student_id:enrolled.studentId,
      snapshot:snapshot(),
      updated_at:now,
      last_seen:now
    },{onConflict:"student_id"});
    if(result.error)throw result.error;
    return {ok:true,reason:reason||"update",syncedAt:now};
  }
  function queueSync(reason){
    if(syncTimer)root.clearTimeout(syncTimer);
    syncTimer=root.setTimeout(function(){
      syncNow(reason||"progress-update").then(function(result){
        if(result.ok&&modal&&modal.querySelector("[data-classroom-status]")){
          modal.querySelector("[data-classroom-status]").textContent="Class progress synced just now.";
        }
      }).catch(function(error){
        if(modal&&modal.querySelector("[data-classroom-status]")){
          modal.querySelector("[data-classroom-status]").textContent="Progress is saved on this device, but cloud sync failed: "+(error.message||"connection error")+".";
        }
      });
    },800);
  }
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);});}
  function status(message,kind){
    if(!modal)return;
    var target=modal.querySelector("[data-classroom-status]");
    if(target){target.textContent=message;target.className="classroom-status "+(kind||"");}
  }
  function currentInputs(){
    return {
      url:modal.querySelector('[name="classroom-url"]').value.trim(),
      anonKey:modal.querySelector('[name="classroom-anon-key"]').value.trim(),
      classCode:modal.querySelector('[name="classroom-class-code"]').value.trim(),
      accessCode:modal.querySelector('[name="classroom-access-code"]').value.trim()
    };
  }
  function closeModal(){if(modal)modal.hidden=true;}
  function buildModal(){
    if(modal)return modal;
    var div=root.document.createElement("div");
    div.id="classroomModal";
    div.className="classroom-modal";
    div.hidden=true;
    div.innerHTML='<div class="classroom-backdrop" data-classroom-close></div><section class="classroom-dialog" role="dialog" aria-modal="true" aria-labelledby="classroom-title"><div class="classroom-dialog-head"><div><p class="classroom-kicker">MADRASAH CLASS TRACKING</p><h2 id="classroom-title">Connect your learning to your class</h2></div><button type="button" class="classroom-close" data-classroom-close aria-label="Close">×</button></div><p class="classroom-intro">Your teacher gives you a classroom setup file (or the project details), a class code and your own learner access code. Your written work and progress sync to your teacher’s class only after you connect.</p><form data-classroom-form><label>Classroom setup file <input type="file" data-classroom-config-file accept="application/json,.json"></label><p class="classroom-help">A teacher can provide a small JSON file containing the public project URL and public anon key. It never contains a privileged database key.</p><div class="classroom-fields"><label>Project URL<input name="classroom-url" type="url" placeholder="https://your-project.supabase.co" autocomplete="url" required></label><label>Public anon / publishable key<input name="classroom-anon-key" type="password" autocomplete="off" placeholder="Paste the public project key" required></label><label>Class code<input name="classroom-class-code" type="text" autocomplete="off" maxlength="32" placeholder="From your teacher" required></label><label>Your personal learner code<input name="classroom-access-code" type="text" autocomplete="off" maxlength="32" placeholder="Keep this private" required></label></div><div class="classroom-dialog-actions"><button class="classroom-primary" type="submit">Connect to my class</button><button class="classroom-secondary" data-classroom-save-settings type="button">Save setup only</button><button class="classroom-secondary" data-classroom-disconnect type="button">Disconnect this device</button></div></form><p class="classroom-status" data-classroom-status role="status" aria-live="polite">Progress remains on this device until the class connection is set up.</p><p class="classroom-privacy-note">Privacy: do not enter your date of birth, home address or other unnecessary personal details. Your teacher can see your saved class progress and recognition explanations. Ask your teacher or parent/guardian if you are unsure.</p></section>';
    root.document.body.appendChild(div);
    modal=div;
    var cfg=config();
    var url=div.querySelector('[name="classroom-url"]'),key=div.querySelector('[name="classroom-anon-key"]');
    url.value=cfg.url||"";key.value=cfg.anonKey||"";
    var en=enrolment();
    if(en&&en.className)status("Connected to "+en.className+". Progress syncs after each saved activity.","success");
    div.querySelectorAll("[data-classroom-close]").forEach(function(el){el.addEventListener("click",closeModal);});
    div.querySelector('[data-classroom-config-file]').addEventListener("change",function(event){
      var file=event.target.files&&event.target.files[0];if(!file)return;
      file.text().then(function(text){
        var data=JSON.parse(text);
        var cfg=data.classroom||data;
        if(!cfg.url||!cfg.anonKey)throw new Error("This file does not contain a valid classroom URL and public anon key.");
        url.value=cfg.url;key.value=cfg.anonKey;
        var classInput=div.querySelector('[name="classroom-class-code"]');
        if(cfg.classCode&&classInput)classInput.value=cfg.classCode;
        saveConfig(cfg);status("Setup file loaded. Confirm the class code, add your personal learner code, then connect.","success");
      }).catch(function(e){status(e.message||"Could not read setup file.","error");});
    });
    div.querySelector("[data-classroom-save-settings]").addEventListener("click",function(){
      var values=currentInputs();
      if(!/^https:\/\//i.test(values.url)||!values.anonKey){status("Enter a valid HTTPS project URL and public anon key first.","error");return;}
      try{saveConfig(values);status("Classroom setup saved in this browser. Add your class and personal learner codes to connect.","success");}
      catch(e){status(e.message||"Could not change classroom project.","error");}
    });
    div.querySelector("[data-classroom-disconnect]").addEventListener("click",async function(){
      try{
        var sb=getClient(),en=enrolment();
        if(en&&en.studentId){
          status("Saving this learner’s progress before disconnecting…");
          var synced=await syncNow("before-disconnect");
          if(!synced.ok)throw new Error(synced.reason||"The latest progress could not be saved. Keep this learner connected until sync succeeds.");
          var left=await sb.rpc("leave_class_student");
          if(left.error)throw left.error;
        }
        if(sb)await sb.auth.signOut();
        root.localStorage.removeItem(ENROLMENT_KEY);
        clearLearningStores();
        status("Disconnected safely. The class record remains saved online; this device’s learner data has been cleared for the next student.","success");
      }catch(e){status("Could not safely disconnect: "+(e.message||"unknown error")+". No local learner data was cleared.","error");}
    });
    div.querySelector("[data-classroom-form]").addEventListener("submit",async function(event){
      event.preventDefault();
      var values=currentInputs();
      if(!/^https:\/\//i.test(values.url)||!values.anonKey||!values.classCode||!values.accessCode){status("Complete all fields before connecting.","error");return;}
      try{
        saveConfig(values);
        var sb=getClient(),previous=enrolment();
        if(previous&&previous.studentId){
          status("Saving the previous learner’s progress before switching accounts…");
          var syncedBefore=await syncNow("before-learner-switch");
          if(!syncedBefore.ok)throw new Error(syncedBefore.reason||"Could not save the previous learner’s progress. Please retry before switching.");
          var left=await sb.rpc("leave_class_student");
          if(left.error)throw left.error;
          await sb.auth.signOut();
          root.localStorage.removeItem(ENROLMENT_KEY);
          clearLearningStores();
        }else if(hasSubstantiveLocalProgress()){
          var keep=root.confirm("This browser already contains learning progress. It will be merged into the learner record you are about to connect. Continue only if that progress belongs to you. If this device was used by another learner, cancel and clear/export that local data first.");
          if(!keep)return;
        }
        status("Connecting securely…");
        var auth=await sb.auth.getSession();
        var user=auth.data&&auth.data.session&&auth.data.session.user;
        if(user&&user.email){await sb.auth.signOut();user=null;}
        if(!user){
          var anonymous=await sb.auth.signInAnonymously();
          if(anonymous.error)throw anonymous.error;
        }
        var joined=await sb.rpc("join_class_student",{p_class_code:values.classCode,p_access_code:values.accessCode});
        if(joined.error)throw joined.error;
        var row=Array.isArray(joined.data)?joined.data[0]:joined.data;
        if(!row||!row.student_id)throw new Error("The class service returned no learner record.");
        root.localStorage.setItem(ENROLMENT_KEY,JSON.stringify({
          studentId:row.student_id,displayName:row.display_name,className:row.class_name,schoolName:row.school_name,classCode:values.classCode.toUpperCase(),joinedAt:new Date().toISOString()
        }));
        status("Loading your saved class progress…","success");
        var remote=await sb.from("student_progress").select("snapshot").eq("student_id",row.student_id).maybeSingle();
        if(remote.error)throw remote.error;
        var combined=mergeSnapshots(remote.data&&remote.data.snapshot||{},snapshot());
        saveSnapshotLocally(combined);
        status("Connected as "+row.display_name+" · "+row.class_name+". Syncing your learning record…","success");
        var result=await syncNow("connect-and-merge");
        if(!result.ok)throw new Error(result.reason||"Unable to sync progress.");
        status("Connected as "+row.display_name+" · "+row.class_name+". Your progress has synced.","success");
      }catch(e){status("Connection failed: "+(e.message||"check the class codes and setup").replace(/<[^>]*>/g,""),"error");}
    });
    return div;
  }
  function attachStudentUI(){
    if(!root.document)return;
    var opener=root.document.getElementById("classroomOpen");
    if(!opener){
      opener=root.document.createElement("button");
      opener.type="button";opener.id="classroomOpen";opener.className="txtbtn";opener.textContent="Class tracking";
      var footer=root.document.querySelector(".footer")||root.document.querySelector(".topBtns");
      if(footer)footer.appendChild(opener);else root.document.body.appendChild(opener);
    }
    opener.addEventListener("click",function(){var dialog=buildModal();dialog.hidden=false;dialog.querySelector("button[data-classroom-close]").focus();});
    buildModal();
    var en=enrolment();
    if(en)queueSync("page-open");
    root.addEventListener("visibilitychange",function(){if(root.document.visibilityState==="hidden")syncNow("page-hide").catch(function(){});});
    root.addEventListener("beforeunload",function(){syncNow("page-close").catch(function(){});});
  }
  root.ClassroomSync={
    attachStudentUI:attachStudentUI,
    queueSync:queueSync,
    syncNow:syncNow,
    getEnrolment:enrolment,
    saveConfig:saveConfig,
    config:config
  };
  if(root.document){
    if(root.document.readyState==="loading")root.document.addEventListener("DOMContentLoaded",attachStudentUI,{once:true});
    else attachStudentUI();
  }
})(window);
