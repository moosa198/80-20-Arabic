(function(root){
  "use strict";
  /* Readings are deliberately small and secondary: Arabic remains primary.
     The vocalised form supports decoding; the romanisation is a gentle cue,
     not a substitute for learning to read Arabic script. */
  var TERMS={
    noun:{ar:"اِسْمٌ",latin:"ism"},
    verb:{ar:"فِعْلٌ",latin:"fiʿl"},
    particle:{ar:"حَرْفٌ",latin:"ḥarf"},
    past:{ar:"فِعْلٌ مَاضٍ",latin:"fiʿl māḍin"},
    imperfect:{ar:"فِعْلٌ مُضَارِعٌ",latin:"fiʿl muḍāriʿ"},
    imperative:{ar:"فِعْلُ أَمْرٍ",latin:"fiʿl amr"},
    nominal:{ar:"جُمْلَةٌ اِسْمِيَّةٌ",latin:"jumlah ismiyyah"},
    verbal:{ar:"جُمْلَةٌ فِعْلِيَّةٌ",latin:"jumlah fiʿliyyah"},
    mubtada:{ar:"مُبْتَدَأٌ",latin:"mubtadaʾ"},
    khabar:{ar:"خَبَرٌ",latin:"khabar"},
    faail:{ar:"فَاعِلٌ",latin:"fāʿil"},
    mafool:{ar:"مَفْعُولٌ بِهِ",latin:"mafʿūl bihi"},
    preposition:{ar:"حَرْفُ جَرٍّ",latin:"ḥarf jarr"},
    genitive:{ar:"مَجْرُورٌ",latin:"majrūr"},
    jarMajrur:{ar:"جَارٌّ وَمَجْرُورٌ",latin:"jārr wa-majrūr"},
    conjunction:{ar:"عَطْفٌ",latin:"ʿaṭf"},
    conjunctionParticle:{ar:"حَرْفُ عَطْفٍ",latin:"ḥarf ʿaṭf"},
    idafah:{ar:"إِضَافَةٌ",latin:"iḍāfah"},
    mudaf:{ar:"مُضَافٌ",latin:"muḍāf"},
    mudafIlayh:{ar:"مُضَافٌ إِلَيْهِ",latin:"muḍāfun ilayhi"},
    pronoun:{ar:"ضَمِيرٌ",latin:"ḍamīr"},
    attachedPronoun:{ar:"ضَمِيرٌ مُتَّصِلٌ",latin:"ḍamīrun muttaṣil"},
    adjective:{ar:"نَعْتٌ",latin:"naʿt"},
    described:{ar:"مَنْعُوتٌ",latin:"manʿūt"},
    relativePronoun:{ar:"اِسْمٌ مَوْصُولٌ",latin:"ism mawṣūl"},
    relativeClause:{ar:"صِلَةُ الْمَوْصُولِ",latin:"ṣilatu l-mawṣūl"},
    inna:{ar:"إِنَّ وَأَخَوَاتُهَا",latin:"inna wa-akhawātuhā"},
    emphasis:{ar:"تَوْكِيدٌ",latin:"tawkīd"},
    kana:{ar:"كَانَ وَأَخَوَاتُهَا",latin:"kāna wa-akhawātuhā"},
    laysa:{ar:"لَيْسَ",latin:"laysa"},
    negation:{ar:"نَفْيٌ",latin:"nafy"},
    jussive:{ar:"مَجْزُومٌ",latin:"majzūm"},
    subjunctive:{ar:"مَنْصُوبٌ",latin:"manṣūb"},
    passive:{ar:"مَبْنِيٌّ لِلْمَجْهُولِ",latin:"mabniyy lil-majhūl"},
    naib:{ar:"نَائِبُ الْفَاعِلِ",latin:"nāʾibu l-fāʿil"},
    derived:{ar:"أَوْزَانٌ مَزِيدَةٌ",latin:"awzān mazīdah"},
    activeParticiple:{ar:"اِسْمُ الْفَاعِلِ",latin:"ism al-fāʿil"},
    passiveParticiple:{ar:"اِسْمُ الْمَفْعُولِ",latin:"ism al-mafʿūl"},
    conjugation:{ar:"تَصْرِيفٌ",latin:"taṣrīf"},
    condition:{ar:"شَرْطٌ",latin:"sharṭ"},
    result:{ar:"جَوَابُ الشَّرْطِ",latin:"jawāb al-sharṭ"},
    exception:{ar:"اِسْتِثْنَاءٌ",latin:"istithnāʾ"},
    question:{ar:"اِسْتِفْهَامٌ",latin:"istifhām"},
    vocative:{ar:"نِدَاءٌ",latin:"nidāʾ"},
    oath:{ar:"قَسَمٌ",latin:"qasam"},
    zarf:{ar:"ظَرْفٌ",latin:"ẓarf"},
    subordinate:{ar:"جُمْلَةٌ تَابِعَةٌ",latin:"jumlah tābiʿah"},
    purpose:{ar:"تَعْبِيرٌ عَنِ الْغَرَضِ",latin:"taʿbīr ʿan al-gharaḍ"},
    purposeLam:{ar:"لَامُ التَّعْلِيلِ",latin:"lām at-taʿlīl"},
    mafoolAjlihi:{ar:"مَفْعُولٌ لِأَجْلِهِ",latin:"mafʿūl li-ajlihi"},
    haal:{ar:"حَالٌ",latin:"ḥāl"},
    dual:{ar:"مُثَنَّى",latin:"muthannā"},
    number:{ar:"عَدَدٌ",latin:"ʿadad"},
    restriction:{ar:"قَصْرٌ",latin:"qaṣr"},
    absolute:{ar:"مَفْعُولٌ مُطْلَقٌ",latin:"mafʿūlun muṭlaq"},
    particleChoice:{ar:"وَظِيفَةُ الْحَرْفِ",latin:"waẓīfatu l-ḥarf"},
    tarkib:{ar:"تَرْكِيبٌ",latin:"tarkīb"},
    agreement:{ar:"مُطَابَقَةٌ",latin:"muṭābaqah"},
    definiteness:{ar:"تَعْرِيفٌ",latin:"taʿrīf"},
    gender:{ar:"جِنْسٌ نَحْوِيٌّ",latin:"jins naḥwiyy"},
    case:{ar:"عَلَامَةُ الْإِعْرَابِ",latin:"ʿalāmatu l-iʿrāb"},
    weak:{ar:"فِعْلٌ مُعْتَلٌّ",latin:"fiʿlun muʿtall"},
    manMa:{ar:"مَنْ / مَا بِحَسَبِ السِّيَاقِ",latin:"man / mā ḥasaba s-siyāq"},
    lamu:{ar:"لَامُ التَّوْكِيدِ",latin:"lām at-tawkīd"},
    expression:{ar:"تَرْكِيبٌ",latin:"tarkīb"},
    sentenceClause:{ar:"جُمْلَةٌ",latin:"jumlah"},
    clause:{ar:"جُمْلَةٌ",latin:"jumlah"},
    root:{ar:"جَذْرٌ",latin:"jذر / jذر (root)"},
    pattern:{ar:"وَزْنٌ",latin:"wazn"},
    verbalNoun:{ar:"مَصْدَرٌ",latin:"maṣdar"}
  };
  var EXTRA=[
    ["اِسْمٌ مَوْصُولٌ","ism mawṣūl","اسم موصول"],
    ["صِلَةُ الْمَوْصُولِ","ṣilatu l-mawṣūl","صلة الموصول"],
    ["حَرْفُ نَفْيٍ","ḥarf nafy","حرف نفي"],
    ["فِعْلٌ مُضَارِعٌ","fiʿl muḍāriʿ","فعل مضارع"],
    ["فِعْلٌ مُضَارِعٌ مَجْزُومٌ","fiʿl muḍāriʿ majzūm","فعل مضارع مجزوم"],
    ["فِعْلٌ مَبْنِيٌّ لِلْمَجْهُولِ","fiʿl mabniyy lil-majhūl","فعل مبني للمجهول"],
    ["نَائِبُ الْفَاعِلِ","nāʾibu l-fāʿil","نائب الفاعل"],
    ["وَاوُ الْقَسَمِ","wāw al-qasam","واو القسم"],
    ["مُسْتَثْنًى","mustathnā","مستثنى"],
    ["أَدَاةُ اسْتِفْهَامٍ","adātu istifhām","أداة استفهام"],
    ["أَدَاةُ نِدَاءٍ","adātu nidāʾ","أداة نداء"],
    ["مَنْصُوبٌ","manṣūb","منصوب"],
    ["مَجْزُومٌ","majzūm","مجزوم"],
    ["مِنْ / مَا بِحَسَبِ السِّيَاقِ","min / mā ḥasaba s-siyāq","من / ما بحسب السياق"],
    ["حَرْفُ تَعْلِيلٍ","ḥarf taʿlīl","لام التعليل"],
    ["مُبْتَدَأٌ","mubtadaʾ","مبتدأ"],
    ["خَبَرٌ","khabar","خبر"],
    ["فَاعِلٌ","fāʿil","فاعل"],
    ["مَفْعُولٌ بِهِ","mafʿūl bihi","مفعول به"],
    ["مَفْعُولٌ مُطْلَقٌ","mafʿūlun muṭlaq","مفعول مطلق"],
    ["مَفْعُولٌ لِأَجْلِهِ","mafʿūl li-ajlihi","مفعول لأجله"],
    ["حَالٌ","ḥāl","حال"],
    ["ظَرْفُ زَمَانٍ","ẓarf zamān","ظرف زمان"],
    ["ظَرْفُ مَكَانٍ","ẓarf makān","ظرف مكان"],
    ["إِضَافَةٌ","iḍāfah","إضافة"],
    ["مُضَافٌ","muḍāf","مضاف"],
    ["مُضَافٌ إِلَيْهِ","muḍāfun ilayhi","مضاف إليه"],
    ["جَارٌّ وَمَجْرُورٌ","jārr wa-majrūr","جار ومجرور"],
    ["نَعْتٌ","naʿt","نعت"],
    ["مَنْعُوتٌ","manʿūt","منعوت"],
    ["ضَمِيرٌ","ḍamīr","ضمير"],
    ["ضَمِيرٌ مُتَّصِلٌ","ḍamīrun muttaṣil","ضمير متصل"],
    ["اِسْمُ الْفَاعِلِ","ism al-fāʿil","اسم الفاعل"],
    ["اِسْمُ الْمَفْعُولِ","ism al-mafʿūl","اسم المفعول"],
    ["لَامُ التَّعْلِيلِ","lām at-taʿlīl","لام التعليل"],
    ["مُثَنَّى","muthannā","مثنّى"],
    ["عَطْفٌ","ʿaṭf","عطف"],
    ["حَرْفُ عَطْفٍ","ḥarf ʿaṭf","حرف عطف"]
  ];
  function normalise(value){
    return String(value||"").normalize("NFD").replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g,"").replace(/[ًٌٍَُِّْٰ]/g,"").replace(/\s+/g," ").trim();
  }
  var byArabic=Object.create(null);
  Object.keys(TERMS).forEach(function(key){byArabic[normalise(TERMS[key].ar)]=TERMS[key];});
  EXTRA.forEach(function(item){byArabic[normalise(item[2])]={ar:item[0],latin:item[1]};});
  function get(key,fallback){
    var item=TERMS[key];
    if(item)return item;
    var found=byArabic[normalise(fallback)];
    return found||{ar:fallback||"",latin:""};
  }
  function renderTerm(key,english,fallback){
    var item=get(key,fallback);
    return '<span class="term '+(english==="small"?"small":"")+'"><span class="ten">'+escapeHtml(english||"")+'</span><span class="term-ar-wrap"><span class="tar" lang="ar" dir="rtl">'+escapeHtml(item.ar||fallback||"")+'</span>'+(item.latin?'<small class="term-translit" lang="en" dir="ltr">'+escapeHtml(item.latin)+'</small>':"")+'</span></span>';
  }
  function renderLabel(arabicText,english){
    var item=get("",arabicText);
    var html='<span class="recognition-label-words"><span>'+escapeHtml(english||"")+'</span><b lang="ar" dir="rtl">'+escapeHtml(item.ar||arabicText||"")+'</b>'+(item.latin?'<small class="term-translit" lang="en" dir="ltr">'+escapeHtml(item.latin)+'</small>':"")+'</span>';
    return html;
  }
  function escapeHtml(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});
  }
  root.GrammarTerms={get:get,renderTerm:renderTerm,renderLabel:renderLabel,byArabic:byArabic,normalise:normalise};
})(window);
