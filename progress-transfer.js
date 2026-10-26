/* Shared, versioned progress backup format for the two student entry points. */
(function(root){
  "use strict";
  var FORMAT="80-20-arabic-progress", VERSION=2;
  function canonicalKey(key){
    var m=String(key).match(/^w(\d+)[:-](\d+)$/);
    if(m)return "w"+m[1]+":"+m[2];
    if(key.indexOf("hf:")===0)return key;
    if(key.indexOf("h-")===0)return "hf:"+key.slice(2);
    if(key.indexOf("term:")===0)return key;
    if(key.indexOf("t-")===0)return "term:"+key.slice(2);
    return key;
  }
  function studentKey(key){
    var m=String(key).match(/^w(\d+):(\d+)$/);
    if(m)return "w"+m[1]+"-"+m[2];
    if(key.indexOf("hf:")===0)return "h-"+key.slice(3);
    if(key.indexOf("term:")===0)return "t-"+key.slice(5);
    return key;
  }
  function toCanonical(value){
    if(!value||!value.cards||typeof value.cards!=="object"||Array.isArray(value.cards))throw new Error("This file does not contain a recognised 80/20 Arabic progress record.");
    var done=value.doneWeeks||value.done;
    if(!done||typeof done!=="object"||Array.isArray(done))throw new Error("This backup is missing its weekly completion record.");
    var cards={};
    Object.keys(value.cards).forEach(function(key){cards[canonicalKey(key)]=value.cards[key];});
    var out={format:FORMAT,formatVersion:VERSION,cards:cards,doneWeeks:done};
    ["lastSession","streak","seconds"].forEach(function(key){if(value[key]!==undefined)out[key]=value[key];});
    return out;
  }
  function toStudent(value){
    var canonical=toCanonical(value),cards={};
    Object.keys(canonical.cards).forEach(function(key){cards[studentKey(key)]=canonical.cards[key];});
    return {cards:cards,done:canonical.doneWeeks};
  }
  function download(value,filename){
    var record=toCanonical(value),anchor=root.document.createElement("a");
    var blob=new Blob([JSON.stringify(record,null,2)],{type:"application/json"});
    anchor.href=URL.createObjectURL(blob);anchor.download=filename||"80-20-arabic-progress.json";anchor.click();URL.revokeObjectURL(anchor.href);
  }
  root.ProgressTransfer={format:FORMAT,version:VERSION,toCanonical:toCanonical,toStudent:toStudent,download:download};
}(window));