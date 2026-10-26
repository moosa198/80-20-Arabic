/* 80/20 Arabic — temporary pronunciation support for first encounters.
   Arabic stays primary. Transliteration is deliberately shown only in the first
   teaching encounter for a term, and only while viewing that lesson before it is
   marked complete. This is instructional scaffolding, not a replacement for Arabic.
*/
(function(root){
  "use strict";
  var TERMS={
    noun:{ar:"اِسْمٌ",latin:"ismun",week:1},
    verb:{ar:"فِعْلٌ",latin:"fiʿlun",week:1},
    particle:{ar:"حَرْفٌ",latin:"ḥarfun",week:1},
    past:{ar:"فِعْلٌ مَاضٍ",latin:"fiʿlun māḍin",week:1},
    imperfect:{ar:"فِعْلٌ مُضَارِعٌ",latin:"fiʿlun muḍāriʿun",week:1},
    nominal:{ar:"جُمْلَةٌ اِسْمِيَّةٌ",latin:"jumlatun ismiyyatun",week:2},
    mubtada:{ar:"الْمُبْتَدَأُ",latin:"al-mubtadaʾu",week:2},
    khabar:{ar:"الْخَبَرُ",latin:"al-khabaru",week:2},
    verbal:{ar:"جُمْلَةٌ فِعْلِيَّةٌ",latin:"jumlatun fiʿliyyatun",week:3},
    faail:{ar:"فَاعِلٌ",latin:"fāʿilun",week:3},
    mafool:{ar:"مَفْعُولٌ بِهِ",latin:"mafʿūlun bihi",week:3},
    preposition:{ar:"حَرْفُ جَرٍّ",latin:"ḥarfu jarrin",week:4},
    genitive:{ar:"مَجْرُورٌ",latin:"majrūrun",week:4},
    jarMajrur:{ar:"جَارٌّ وَمَجْرُورٌ",latin:"jārrun wa-majrūrun",week:4},
    conjunction:{ar:"عَطْفٌ",latin:"ʿaṭfun",week:5},
    conjunctionParticle:{ar:"حَرْفُ عَطْفٍ",latin:"ḥarfu ʿaṭfin",week:5},
    idafah:{ar:"إِضَافَةٌ",latin:"iḍāfatun",week:6},
    mudaf:{ar:"مُضَافٌ",latin:"muḍāfun",week:6},
    mudafIlayh:{ar:"مُضَافٌ إِلَيْهِ",latin:"muḍāfun ilayhi",week:6},
    pronoun:{ar:"ضَمِيرٌ",latin:"ḍamīrun",week:7},
    attachedPronoun:{ar:"ضَمِيرٌ مُتَّصِلٌ",latin:"ḍamīrun muttaṣilun",week:3},
    adjective:{ar:"نَعْتٌ",latin:"naʿtun",week:9},
    described:{ar:"مَنْعُوتٌ",latin:"manʿūtun",week:9},
    relativePronoun:{ar:"اِسْمٌ مَوْصُولٌ",latin:"ismun mawṣūlun",week:10},
    relativeClause:{ar:"صِلَةُ الْمَوْصُولِ",latin:"ṣilatu al-mawṣūli",week:10},
    oath:{ar:"قَسَمٌ",latin:"qasamun",week:11},
    negation:{ar:"نَفْيٌ",latin:"nafyun",week:13},
    jussive:{ar:"مَجْزُومٌ",latin:"majzūmun",week:13},
    passive:{ar:"مَبْنِيٌّ لِلْمَجْهُولِ",latin:"mabniyyun lil-majhūli",week:14},
    naib:{ar:"نَائِبُ الْفَاعِلِ",latin:"nāʾibu al-fāʿili",week:14},
    activeParticiple:{ar:"اِسْمُ الْفَاعِلِ",latin:"ismu al-fāʿili",week:15},
    passiveParticiple:{ar:"اِسْمُ الْمَفْعُولِ",latin:"ismu al-mafʿūli",week:15},
    exception:{ar:"اِسْتِثْنَاءٌ",latin:"istithnāʾun",week:17},
    question:{ar:"اِسْتِفْهَامٌ",latin:"istifhāmun",week:18},
    vocative:{ar:"نِدَاءٌ",latin:"nidāʾun",week:18},
    condition:{ar:"شَرْطٌ",latin:"sharṭun",week:19},
    zarf:{ar:"ظَرْفٌ",latin:"ẓarfun",week:19},
    purposeLam:{ar:"لَامُ التَّعْلِيلِ",latin:"lāmu al-taʿlīli",week:21},
    mafoolAjlihi:{ar:"مَفْعُولٌ لِأَجْلِهِ",latin:"mafʿūlun li-ajlihi",week:21},
    haal:{ar:"حَالٌ",latin:"ḥālun",week:22},
    dual:{ar:"مُثَنَّى",latin:"muthannā",week:23},
    relative:{ar:"اِسْمٌ مَوْصُولٌ",latin:"ismun mawṣūlun",week:10},
    absolute:{ar:"مَفْعُولٌ مُطْلَقٌ",latin:"mafʿūlun muṭlaqun",week:27},
    verbalNoun:{ar:"مَصْدَرٌ",latin:"maṣdarun",week:27},
    tarkib:{ar:"تَرْكِيبٌ",latin:"tarkībun",week:28},
    sentenceClause:{ar:"جُمْلَةٌ",latin:"jumlatun",week:28},
    relativeClause:{ar:"صِلَةُ الْمَوْصُولِ",latin:"ṣilatu al-mawṣūli",week:10},
    root:{ar:"جَذْرٌ",latin:"jadhrun",week:15},
    pattern:{ar:"وَزْنٌ",latin:"waznun",week:15},
    activeParticiple:{ar:"اِسْمُ الْفَاعِلِ",latin:"ismu al-fāʿili",week:15},
    passiveParticiple:{ar:"اِسْمُ الْمَفْعُولِ",latin:"ismu al-mafʿūli",week:15},
    derived:{ar:"صِيَغٌ مَزِيدَةٌ",latin:"ṣiyaghun mazīdatun",week:15},
    inna:{ar:"إِنَّ وَأَخَوَاتُهَا",latin:"inna wa-akhawātuhā",week:16},
    emphasis:{ar:"تَوْكِيدٌ",latin:"tawkīdun",week:16},
    kana:{ar:"كَانَ وَأَخَوَاتُهَا",latin:"kāna wa-akhawātuhā",week:16},
    laysa:{ar:"لَيْسَ",latin:"laysa",week:16},
    subjunctive:{ar:"مَنْصُوبٌ",latin:"manṣūbun",week:13},
    genitive:{ar:"مَجْرُورٌ",latin:"majrūrun",week:4},
    agreement:{ar:"مُطَابَقَةٌ",latin:"muṭābaqatun",week:9},
    definiteness:{ar:"تَعْرِيفٌ",latin:"taʿrīfun",week:9},
    gender:{ar:"جِنْسٌ نَحْوِيٌّ",latin:"jinsun naḥwiyyun",week:9},
    number:{ar:"عَدَدٌ",latin:"ʿadadun",week:23},
    restriction:{ar:"قَصْرٌ",latin:"qaṣrun",week:17},
    purpose:{ar:"تَعْبِيرٌ عَنِ الْغَرَضِ",latin:"taʿbīrun ʿani al-gharaḍi",week:21},
    result:{ar:"جَوَابُ الشَّرْطِ",latin:"jawābu al-sharṭi",week:19},
    subordinate:{ar:"جُمْلَةٌ تَابِعَةٌ",latin:"jumlatun tābiʿatun",week:20},
    particleChoice:{ar:"وَظِيفَةُ الْحَرْفِ",latin:"waẓīfatu al-ḥarfi",week:25},
    clause:{ar:"جُمْلَةٌ",latin:"jumlatun",week:28},
    weak:{ar:"فِعْلٌ مُعْتَلٌّ",latin:"fiʿlun muʿtallun",week:15},
    manMa:{ar:"مِنْ / مَا بِحَسَبِ السِّيَاقِ",latin:"min / mā bi-ḥasabi al-siyāqi",week:25},
    expression:{ar:"تَرْكِيبٌ",latin:"tarkībun",week:28},
    case:{ar:"عَلَامَةُ الْإِعْرَابِ",latin:"ʿalāmatu al-iʿrābi",week:1},
    conjugation:{ar:"تَصْرِيفٌ",latin:"taṣrīfun",week:1}
  };
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function render(key, originalArabic, week, completed, activeLesson, escapeFn, className){
    var e=escapeFn||esc, meta=TERMS[key], useIntro=!!(meta&&activeLesson&&!completed&&Number(week)===meta.week);
    var arabic=useIntro?meta.ar:(originalArabic||(meta&&meta.ar)||"");
    var cls="tar"+(className?" "+className:"");
    return '<span class="term '+(className==="small"?"small":"")+'"><span class="ten">'+e((root.TERMS&&root.TERMS[key]&&root.TERMS[key][0])||key)+'</span>'+
      '<span class="term-ar-stack"><span class="'+cls+'" lang="ar" dir="rtl">'+e(arabic)+'</span>'+
      (useIntro?'<small class="term-pronunciation" lang="en" dir="ltr">'+e(meta.latin)+'</small>':"")+'</span></span>';
  }
  root.TermSupport={render:render,terms:TERMS};
}(window));
