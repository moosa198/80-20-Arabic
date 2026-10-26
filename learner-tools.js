(function(root){
  "use strict";
  var PROFILE_KEY="8020-learner-profile-v1";
  var PACKAGE_FORMAT="80-20-arabic-class-record";
  function escapeHtml(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});
  }
  function getProfile(){
    try{
      var p=JSON.parse(root.localStorage.getItem(PROFILE_KEY)||"{}");
      return {studentId:String(p.studentId||""),displayName:String(p.displayName||""),className:String(p.className||""),teacherName:String(p.teacherName||"")};
    }catch(e){return {studentId:"",displayName:"",className:"",teacherName:""};}
  }
  function saveProfile(p){
    var clean={studentId:String(p.studentId||"").trim(),displayName:String(p.displayName||"").trim(),className:String(p.className||"").trim(),teacherName:String(p.teacherName||"").trim()};
    root.localStorage.setItem(PROFILE_KEY,JSON.stringify(clean));
    return clean;
  }
  function readJson(key){
    try{return JSON.parse(root.localStorage.getItem(key)||"{}");}catch(e){return {};}
  }
  function makeRecord(progress,source){
    return {
      format:PACKAGE_FORMAT,
      schemaVersion:1,
      exportedAt:new Date().toISOString(),
      learner:getProfile(),
      source:String(source||"80-20-arabic"),
      progress:progress||{},
      recognition:readJson("8020-word-recognition-v1"),
      weeklyRecall:readJson("8020-weekly-recall-v2")
    };
  }
  function safeFilename(s){
    return String(s||"progress").normalize("NFKD").replace(/[^A-Za-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"progress";
  }
  function download(progress,source){
    var record=makeRecord(progress,source);
    var label=record.learner.studentId||"unlabelled";
    var group=record.learner.className||"class";
    var blob=new Blob([JSON.stringify(record,null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob);
    var link=root.document.createElement("a");
    link.href=url;
    link.download="80-20-arabic-"+safeFilename(group)+"-"+safeFilename(label)+".json";
    root.document.body.appendChild(link);link.click();link.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1500);
    return record;
  }
  function mountProfilePanel(container,source,getProgress){
    if(!container)return;
    var p=getProfile();
    var holder=root.document.createElement("section");
    holder.className="panel learner-profile-panel";
    holder.innerHTML='<div class="panelHead"><h2>Class record details</h2><span class="eyebrow">FOR TEACHER MONITORING</span></div>'+
      '<p class="explain">Use a short student ID or agreed initials, not sensitive personal details. These fields label an exported progress file; they do not create an account or send data anywhere.</p>'+
      '<form data-learner-profile-form><div class="learner-profile-grid">'+
      '<label>Student ID <span class="required-mark">required</span><input name="studentId" autocomplete="off" maxlength="40" value="'+escapeHtml(p.studentId)+'" placeholder="e.g. MDS-014" required></label>'+
      '<label>Class / group <span class="required-mark">required</span><input name="className" autocomplete="organization" maxlength="80" value="'+escapeHtml(p.className)+'" placeholder="e.g. Saturday Hifz Group A" required></label>'+
      '<label>Display name or initials <span class="optional-mark">optional</span><input name="displayName" autocomplete="off" maxlength="60" value="'+escapeHtml(p.displayName)+'" placeholder="e.g. M. or student initials"></label>'+
      '<label>Teacher <span class="optional-mark">optional</span><input name="teacherName" autocomplete="off" maxlength="80" value="'+escapeHtml(p.teacherName)+'" placeholder="e.g. Teacher initials"></label>'+
      '</div><div class="actions profile-actions"><button class="btn light" type="submit">Save class details on this device</button><button class="btn" type="button" data-export-class-record>Export progress for teacher</button><button class="btn light" type="button" data-clear-learner-profile>Clear class details</button></div><p class="learner-profile-status" data-profile-status role="status" aria-live="polite">Progress is still stored locally in this browser.</p></form>'+
      '<p class="guide-small">To share progress, save these details, export the JSON record, and give the file to your teacher. The teacher imports files into the separate dashboard. This site does not sync student data live between devices. On a shared tablet, export first, then use the course reset control before another learner begins; a label alone does not isolate each learner’s local progress.</p>';
    container.appendChild(holder);
    var form=holder.querySelector("[data-learner-profile-form]");
    var status=holder.querySelector("[data-profile-status]");
    form.addEventListener("submit",function(event){
      event.preventDefault();
      var data=new FormData(form);
      var saved=saveProfile({studentId:data.get("studentId"),displayName:data.get("displayName"),className:data.get("className"),teacherName:data.get("teacherName")});
      status.textContent="Saved for this browser: "+saved.studentId+" · "+saved.className+".";
      status.classList.remove("profile-warning");
      status.classList.add("profile-saved");
    });
    holder.querySelector("[data-clear-learner-profile]").addEventListener("click",function(){
      if(typeof root.confirm==="function"&&!root.confirm("Clear the student ID and class details stored in this browser? Course progress will remain until you reset it separately."))return;
      root.localStorage.removeItem(PROFILE_KEY);
      form.querySelectorAll("input").forEach(function(input){input.value="";});
      status.textContent="Class details cleared. The course progress on this browser has not been reset.";
      status.classList.remove("profile-saved","profile-warning");
    });
    holder.querySelector("[data-export-class-record]").addEventListener("click",function(){
      var data=new FormData(form);
      var saved=saveProfile({studentId:data.get("studentId"),displayName:data.get("displayName"),className:data.get("className"),teacherName:data.get("teacherName")});
      if(!saved.studentId||!saved.className){
        status.textContent="Enter a student ID and class/group first, then export for your teacher.";
        status.classList.add("profile-warning");
        form.querySelector('[name="studentId"]').focus();
        return;
      }
      download(typeof getProgress==="function"?getProgress():getProgress,source);
      status.textContent="Progress record exported for "+saved.studentId+" · "+saved.className+". Send this JSON file to your teacher.";
      status.classList.remove("profile-warning");
      status.classList.add("profile-saved");
    });
  }
  function restorePackage(record,progressKey){
    var data=record&&record.progress?record.progress:record;
    if(!data||typeof data!=="object")throw new Error("Invalid progress file.");
    if(record&&record.learner)saveProfile(record.learner);
    if(record&&record.recognition)root.localStorage.setItem("8020-word-recognition-v1",JSON.stringify(record.recognition));
    if(record&&record.weeklyRecall)root.localStorage.setItem("8020-weekly-recall-v2",JSON.stringify(record.weeklyRecall));
    if(progressKey)root.localStorage.setItem(progressKey,JSON.stringify(data));
    return data;
  }
  root.LearnerTools={getProfile:getProfile,saveProfile:saveProfile,makeRecord:makeRecord,download:download,mountProfilePanel:mountProfilePanel,restorePackage:restorePackage,profileKey:PROFILE_KEY,packageFormat:PACKAGE_FORMAT};
})(window);
