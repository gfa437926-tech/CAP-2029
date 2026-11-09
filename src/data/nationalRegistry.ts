/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HazardDefinition, NationalDataSource, SectorOperationalRole } from '../types/national';

export const nationalSectors: SectorOperationalRole[] = [
  {
    sector: 'emergency_mgmt',
    nameAr: 'وزارة الطوارئ وإدارة الكوارث والدفاع المدني',
    mandateAr: 'القيادة والسيطرة العامة، التنسيق الوطني بين الوزارات، إدارة مراكز العمليات والإنقاذ، وإصدار أوامر الإخلاء.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['استنفار فرق الإنقاذ والدفاع المدني', 'تجهيز مراكز الإيواء المؤقتة', 'إطلاق صفارات الإنذار وإشعارات الإخلاء']
  },
  {
    sector: 'meteorology',
    nameAr: 'المركز الوطني للأرصاد الجوية والمناخ',
    mandateAr: 'رصد الغلاف الجوي، التنبؤات العددية والسينوبتيكية، إدارة رادارات الطقس، وإصدار التحذيرات الجوية الرسمية.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['نشر نشرات التحذير الجوي المبكر', 'تحديث مؤشرات شدة العواصف كل 15 دقيقة', 'إمداد الطيران والموانئ بنشرات METAR/TAF']
  },
  {
    sector: 'geological',
    nameAr: 'المركز الوطني للزلازل والجيولوجيا',
    mandateAr: 'رصد النشاط التكتوني والزلزالي عبر شبكة المحطات الرقمية، تقدير الشدة اللحظية، وتوليد خرائط الاهتزاز (ShakeMaps).',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['بث إشعار رصد هزة أرضية فوري للعمليات', 'نشر تقرير الشدة الزلزالية وعمق البؤرة', 'تقييم احتمالية الهزات الارتدادية والتصدعات']
  },
  {
    sector: 'water_resources',
    nameAr: 'وزارة الموارد المائية والسدود',
    mandateAr: 'مراقبة أحواض الأنهار، مناسيب وتصريف السدود، نمذجة الفيضانات المفاجئة وسلامة المنشآت المائية.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: false,
    primaryResponseActions: ['مراقبة سلامة السدود وتصريف المفيض', 'إنذار القرى الواقعة في مجاري الوديان', 'تنسيق خطط تصريف المياه الفائضة']
  },
  {
    sector: 'agriculture',
    nameAr: 'وزارة الزراعة والغابات والأمن الغذائي',
    mandateAr: 'رصد حرائق الغابات عبر الأقمار الصناعية، مؤشرات الجفاف، الصقيع على المحاصيل، وتوجيه الإرشاد الزراعي.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['توجيه فرق إطفاء الغابات للتدخل السريع', 'إطلاق تحذيرات الصقيع للمزارعين والبيوت المحمية', 'رصد انتشار الآفات الزراعية والجراد']
  },
  {
    sector: 'health_services',
    nameAr: 'وزارة الصحة ومنظومة الإسعاف السريع',
    mandateAr: 'رفع الجاهزية القصوى للمشافي، توجيه أساطيل الإسعاف، معالجة تداعيات موجات الحر، وإدارة بنوك الدم.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: false,
    publicBroadcastingPermitted: false,
    primaryResponseActions: ['استنفار أقسام الطوارئ والعناية المركزة', 'نشر فرق الفرز الطبي الميداني في مناطق الكارثة', 'توفير مخزون أمصال ومضادات التسمم']
  },
  {
    sector: 'aviation',
    nameAr: 'هيئة الطيران المدني والمطارات',
    mandateAr: 'سلامة الملاحة الجوية، إدارة مدرجات المطارات، استقبال تحذيرات الرياح العاتية والضباب والقص الهوائي.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: false,
    primaryResponseActions: ['تعليق أو تحويل مسارات الطائرات في المطارات المتأثرة', 'تفعيل خطط طوارئ المدرجات عند تراكم الثلوج والضباب']
  },
  {
    sector: 'maritime_ports',
    nameAr: 'المديرية العامة للموانئ والنقل البحري',
    mandateAr: 'سلامة المياه الإقليمية والمرافئ، متابعة ارتفاع الأمواج، وإدارة حركة سفن الشحن وقوارب الصيد.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: true,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['إغلاق الموانئ بوجه الملاحة عند ارتفاع الموج لأكثر من 3.5م', 'منع إبحار زوارق الصيد والرياضات البحرية']
  },
  {
    sector: 'traffic_transit',
    nameAr: 'إدارة المرور وهندسة الطرق والجسور',
    mandateAr: 'مراقبة شبكة الطرق السريعة والمعابر الجبلية، إغلاق الطرق المغمورة، وتحديد المسارات البديلة.',
    alertAuthoringPermitted: true,
    alertApprovalRequired: false,
    publicBroadcastingPermitted: true,
    primaryResponseActions: ['إغلاق الطرق المهددة بالسيول أو الانهيارات الصخرية', 'تسيير دوريات التحويل المروري على المسارات الآمنة']
  }
];

export const nationalHazardsRegistry: HazardDefinition[] = [
  // 1. الأخطار الجوية
  {
    id: 'haz-met-01',
    code: 'HAZ-MET-STORMS',
    nameAr: 'عواصف مطرية وسيول جارفة',
    nameEn: 'Torrential Rain & Flash Floods',
    category: 'meteorological',
    primarySector: 'meteorology',
    participatingSectors: ['emergency_mgmt', 'water_resources', 'traffic_transit'],
    dataSources: ['رادارات دوبلر الساحلية', 'محطات الأرصاد الآلية', 'أقمار ميتيوسات الأوروبية'],
    monitoringUnit: 'ملم / ساعة ومؤشر الانعكاسية الرادارية dBZ',
    confidenceThreshold: 'دقة نمذجة WRF-3km تتجاوز 85%',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'أمطار 20 - 40 ملم خلال 6 ساعات', actionRequired: 'تنبيه وحدات البلديات لتطهير مجاري التصريف' },
      { level: 'severe', triggerCondition: 'أمطار 40 - 70 ملم مع سيول في الأودية', actionRequired: 'استنفار الدفاع المدني وإغلاق المسالك المنخفضة' },
      { level: 'extreme', triggerCondition: 'أمطار تفوق 70 ملم مع تدفق جارف وانهيارات', actionRequired: 'إعلان طوارئ قطاعية وإخلاء المناطق المحاذية للأودية' }
    ],
    impactedVulnerabilities: ['تجمعات سكنية في الوديان', 'الجسور القديمة', 'شبكات الصرف الصحي']
  },
  {
    id: 'haz-met-02',
    code: 'HAZ-MET-GALE',
    nameAr: 'رياح عاتية وهبات هابطة شديدة',
    nameEn: 'Severe Gale Winds & Microbursts',
    category: 'meteorological',
    primarySector: 'meteorology',
    participatingSectors: ['aviation', 'maritime_ports', 'emergency_mgmt'],
    dataSources: ['حساسات سرعة الرياح فوق الصدمية', 'رادارات الطقس', 'محطات الرصد الجوي'],
    monitoringUnit: 'كم / ساعة وعقدة بحرية',
    confidenceThreshold: 'رصد تدرج ضغطي سينوبتيكي > 4 هكتوباسكال/100كم',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'سرعة رياح 60 - 75 كم/س', actionRequired: 'تثبيت اللوحات الإعلانية وأسقف المستودعات' },
      { level: 'severe', triggerCondition: 'سرعة رياح 75 - 95 كم/س', actionRequired: 'منع شاحنات النقل العالية على الجسور المرتفعة' },
      { level: 'extreme', triggerCondition: 'هبات تفوق 95 كم/س مصحوبة بعواصف رعدية', actionRequired: 'تعليق حركة الطيران الخفيف والرافعات الإنشائية' }
    ],
    impactedVulnerabilities: ['أبراج نقل الطاقة الكهربائية', 'الرافعات الإنشائية', 'المراكب البحرية']
  },
  {
    id: 'haz-met-03',
    code: 'HAZ-MET-FROST',
    nameAr: 'صقيع إشعاعي وانخفاض حاد في درجات الحرارة',
    nameEn: 'Severe Radiation Frost & Freeze',
    category: 'meteorological',
    primarySector: 'meteorology',
    participatingSectors: ['agriculture', 'health_services', 'traffic_transit'],
    dataSources: ['شبكة مجسات حرارة سطح التربة', 'نماذج التنبؤ العددي ECMWF/WRF'],
    monitoringUnit: 'درجة مئوية (°C) عند ارتفاع 5 سم و 2 متر',
    confidenceThreshold: 'رصد سماء صافية مع رياح هادئة ورطوبة منخفضة',
    alertLevels: [
      { level: 'minor', triggerCondition: 'حرارة التربة 0 إلى -2 مئوية', actionRequired: 'تنبيه مزارعي الأشجار المثمرة والخضار' },
      { level: 'severe', triggerCondition: 'حرارة سطحية دون -4 مئوية لأكثر من 5 ساعات', actionRequired: 'تشغيل مداخن التدفئة والري الرذاذي للمحاصيل' }
    ],
    impactedVulnerabilities: ['البيوت البلاستيكية', 'محاصيل القمح والخضار', 'شبكات مياه الشرب الخارجية']
  },

  // 2. الأخطار الجيولوجية والزلزالية
  {
    id: 'haz-geo-01',
    code: 'HAZ-GEO-QUAKE',
    nameAr: 'الزلازل والارتدادات التكتونية الصدعية',
    nameEn: 'Earthquakes & Active Fault Rupture',
    category: 'geological',
    primarySector: 'geological',
    participatingSectors: ['emergency_mgmt', 'health_services', 'traffic_transit', 'water_resources'],
    dataSources: ['الشبكة الوطنية لمحطات الزلازل واسعة النطاق', 'حساسات التسارع القوي (Strong Motion)'],
    monitoringUnit: 'مقياس ريختر للعزم (Mw) وتسارع الجاذبية (%g)',
    confidenceThreshold: 'تحديد بؤري متقاطع من 4 محطات رقمية على الأقل خلال < 20 ثانية',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'قوة زلزالية 4.5 إلى 5.4 ريختر بمناطق مأهولة', actionRequired: 'فحص فوري للجسور والسدود والمنشآت الحيوية' },
      { level: 'severe', triggerCondition: 'قوة زلزالية 5.5 إلى 6.4 ريختر', actionRequired: 'إعلان حالة الطوارئ العامة وتوجيه فرق الإنقاذ' },
      { level: 'extreme', triggerCondition: 'قوة زلزالية تفوق 6.5 ريختر وتدمير بنيوي محتمل', actionRequired: 'تفعيل القيادة الوطنية الموحدة واستدعاء الإسناد الشامل' }
    ],
    impactedVulnerabilities: ['المباني غير المقاومة للزلازل', 'السدود الرئيسية', 'المشافي وشبكات المياه والغاز']
  },
  {
    id: 'haz-geo-02',
    code: 'HAZ-GEO-LANDSLIDE',
    nameAr: 'الانزلاقات الأرضية وانهيارات المنحدرات الصخرية',
    nameEn: 'Slope Landslides & Rockfalls',
    category: 'geological',
    primarySector: 'geological',
    participatingSectors: ['traffic_transit', 'emergency_mgmt'],
    dataSources: ['رادارات التداخل الفضائي InSAR', 'حساسات الإزاحة السلكية بالمقالع'],
    monitoringUnit: 'ملم إزاحة ومعدل تشبع التربة بالمياه',
    confidenceThreshold: 'تجاوز مؤشر التشبع الهيدرولوجي 90% على منحدر > 35 درجة',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'إزاحة سطحية مرصودة 5 - 15 ملم', actionRequired: 'تسيير دوريات مراقبة المنحدرات الجبلية' },
      { level: 'extreme', triggerCondition: 'انهيار صخري فعال يقطع الشرايين الطرقية', actionRequired: 'إغلاق الطريق فوراً وإرسال آليات إزالة الأنقاض' }
    ],
    impactedVulnerabilities: ['الطرق الجبلية الدولية', 'المنازل الواقعة عند أقدام الجروف الصخرية']
  },

  // 3. أخطار الحرائق
  {
    id: 'haz-fire-01',
    code: 'HAZ-FIRE-FOREST',
    nameAr: 'حرائق الغابات والأراضي الحراجية والزراعية',
    nameEn: 'Wildfires & Agricultural Forest Fires',
    category: 'wildfire',
    primarySector: 'agriculture',
    participatingSectors: ['emergency_mgmt', 'health_services', 'traffic_transit'],
    dataSources: ['مستشعرات الأقمار الصناعية VIIRS و MODIS', 'أبراج المراقبة البصرية الحراجية', 'محطات الرصد المناخي'],
    monitoringUnit: 'مؤشر خطر الحريق الكندي (FWI) وقدرة البؤرة الإشعاعية MW',
    confidenceThreshold: 'رصد بؤرة حرارية فضائية مدعومة بمؤشر جفاف نباتي عالي',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'مؤشر خطر حريق FWI > 25 مع حرارة مرتفعة', actionRequired: 'تسيير طائرات استطلاع مسيرة ومنع إشعال النيران' },
      { level: 'severe', triggerCondition: 'اندلاع حريق غابات نشط مع سرعة رياح > 40 كم/س', actionRequired: 'تدخل طيران الإطفاء وتطويق القرى المحاذية' },
      { level: 'extreme', triggerCondition: 'حريق تاجي ضخم وخروج النيران عن السيطرة', actionRequired: 'إخلاء القرى والمزارع وتأمين خطوط النار العازلة' }
    ],
    impactedVulnerabilities: ['المحميات الطبيعية والغابات الصنوبرية', 'القرى السكنية المتاخمة للغابات', 'خطوط نقل الكهرباء']
  },

  // 4. الأخطار المائية والهيدرولوجية
  {
    id: 'haz-hydro-01',
    code: 'HAZ-HYDRO-DAM',
    nameAr: 'فيضان الأنهار وارتفاع مناسيب بحيرات السدود',
    nameEn: 'Riverine Flooding & Dam Surcharge Risk',
    category: 'hydrological',
    primarySector: 'water_resources',
    participatingSectors: ['emergency_mgmt', 'agriculture', 'traffic_transit'],
    dataSources: ['شبكة محطات قياس مناسيب السدود الرقمية', 'مجسات الجريان النهرية بالموجات الصوتية'],
    monitoringUnit: 'متر مكعب/ثانية ومتر فوق سطح البحر (MASL)',
    confidenceThreshold: 'رصد تجاوز عتبة التخزين الأعظمي بنسبة > 95%',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'منسوب المياه يصل 90% من السعة التصميمية', actionRequired: 'فتح قنوات التصريف الجزئي ومراقبة القاع' },
      { level: 'extreme', triggerCondition: 'تدفق فيضاني يتجاوز سعة المفيض مع خطر الغمر', actionRequired: 'إطلاق صفارات الإنذار للسكان في حوض النهر الأدنى' }
    ],
    impactedVulnerabilities: ['الأراضي الزراعية في حوض النهر', 'محطات ضخ مياه الشرب', 'المجمعات السكنية النهرية']
  },

  // 5. الأخطار الصحية
  {
    id: 'haz-health-01',
    code: 'HAZ-HLTH-HEAT',
    nameAr: 'موجات الحر القاتلة والإجهاد الحراري الشديد',
    nameEn: 'Lethal Heatwaves & Severe Heat Stress',
    category: 'health',
    primarySector: 'health_services',
    participatingSectors: ['emergency_mgmt', 'meteorology'],
    dataSources: ['محطات الأرصاد', 'سجلات غرف طوارئ المشافي', 'مؤشر الحرارة الرطبة WBGT'],
    monitoringUnit: 'درجة حرارة البصيلة الرطبة ومؤشر الإجهاد الحراري WBGT',
    confidenceThreshold: 'استمرار حرارة > 42°C لأكثر من 3 أيام متتالية مع رطوبة عالية',
    alertLevels: [
      { level: 'severe', triggerCondition: 'مؤشر الحرارة > 45°C في المدن المكتظة', actionRequired: 'تجهيز مراكز التبريد السريع والإسعاف وتوزيع المياه' },
      { level: 'extreme', triggerCondition: 'تجاوز مؤشر WBGT عتبة 32°C الخطرة فسيولوجياً', actionRequired: 'تعليق الأعمال الميدانية وحظر التعرض لأشعة الشمس' }
    ],
    impactedVulnerabilities: ['كبار السن والأطفال ومرضى القلب', 'عمال البناء والزراعة في الميدان']
  },

  // 6. الأخطار البحرية والساحلية
  {
    id: 'haz-mar-01',
    code: 'HAZ-MAR-SURGE',
    nameAr: 'اضطرابات بحرية وأمواج عاتية وتيارات ساحبة',
    nameEn: 'Severe Marine Swell & Coastal Storm Surge',
    category: 'maritime',
    primarySector: 'maritime_ports',
    participatingSectors: ['emergency_mgmt', 'meteorology'],
    dataSources: ['عوامات رصد الأمواج الساحلية (Wave Buoys)', 'محطات رصد المد والجزر (Tide Gauges)'],
    monitoringUnit: 'ارتفاع الموج الدال (Hs) بالأمتار وفترة الموج بالثواني',
    confidenceThreshold: 'رصد تراكب أمواج الرياح مع أمواج السويل العميقة',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'ارتفاع الموج بين 2.5 - 3.5 متر', actionRequired: 'منع قوارب الصيد الصغيرة وتأمين المرافئ' },
      { level: 'extreme', triggerCondition: 'ارتفاع الموج يفوق 4.5 أمتار مع مد عاصفي', actionRequired: 'إغلاق الموانئ بالكامل وتفريغ الكورنيش والمنشآت الشاطئية' }
    ],
    impactedVulnerabilities: ['أرصفة الموانئ وحاويات الشحن', 'زوارق وقوارب الصيد', 'المطاعم والمنشآت الشاطئية']
  },

  // 7. الأخطار البيئية والغبارية
  {
    id: 'haz-env-01',
    code: 'HAZ-ENV-DUST',
    nameAr: 'العواصف الرملية والجدارية وتدني جودة الهواء',
    nameEn: 'Severe Wall Dust Storms & Atmospheric Pollution',
    category: 'environmental',
    primarySector: 'meteorology',
    participatingSectors: ['health_services', 'traffic_transit', 'aviation'],
    dataSources: ['أجهزة قياس عمق الغبار البصري (AOD)', 'محطات مراقبة الجسيمات الدقيقة PM2.5 و PM10'],
    monitoringUnit: 'ميكروغرام/م³ ومدى الرؤية الأفقية بالأمتار',
    confidenceThreshold: 'جبهة غبارية كثيفة مرصودة عبر الأقمار الصناعية تتحرك بسرعة > 50 كم/س',
    alertLevels: [
      { level: 'moderate', triggerCondition: 'الرؤية 500 - 1000 متر مع PM10 > 300', actionRequired: 'تحذير مرضى الربو والجهاز التنفسي بملازمة المنازل' },
      { level: 'extreme', triggerCondition: 'انعدام الرؤية لأقل من 200 متر وعاصفة جدارية', actionRequired: 'إيقاف حركة السير على الطرق المفتوحة والمطارات' }
    ],
    impactedVulnerabilities: ['مرضى الربو والأمراض الصدرية', 'حركة السير على الأوتوسترادات الدولية']
  },

  // 8. الأخطار التقنية والصناعية
  {
    id: 'haz-tech-01',
    code: 'HAZ-TECH-HAZMAT',
    nameAr: 'حوادث التسرب الكيميائي والغازات السامة والحرائق الصناعية',
    nameEn: 'Industrial Hazmat Leaks & Toxic Plumes',
    category: 'technological',
    primarySector: 'emergency_mgmt',
    participatingSectors: ['health_services', 'meteorology', 'traffic_transit'],
    dataSources: ['محطات استشعار الغازات السامة الثابتة بالمجمعات الصناعية', 'بلاغات غرف عمليات الدفاع المدني'],
    monitoringUnit: 'جزء في المليون (PPM) ومؤشر انتشار الدخان السينوبتيكي',
    confidenceThreshold: 'تأكيد حساسات المواد الخطرة أو رصد تسرب مؤكد ميدانياً',
    alertLevels: [
      { level: 'severe', triggerCondition: 'تسرب غاز سام محصور داخل منشأة صناعية', actionRequired: 'عزل المنشأة وتفعيل وحدات مكافحة المواد الخطرة CBRN' },
      { level: 'extreme', triggerCondition: 'سحابة سامة تنتقل باتجاه مناطق مأهولة مع اتجاه الريح', actionRequired: 'إغلاق النوافذ أو إخلاء الأحياء السكنية باتجاه عكس الرياح' }
    ],
    impactedVulnerabilities: ['المجمعات السكنية المحيطة بالمدن الصناعية', 'شبكات المياه السطحية']
  }
];

export const nationalDataCatalogue: NationalDataSource[] = [
  {
    id: 'src-met-01',
    code: 'MET-AWS-NET',
    nameAr: 'شبكة محطات الأرصاد الجوية السطحية المؤتمتة (AWS)',
    nameEn: 'Automated Weather Stations Network',
    ownerMinistry: 'المركز الوطني للأرصاد الجوية والمناخ',
    category: 'meteorological',
    collectionMethod: 'telemetry',
    updateFrequency: 'كل 10 دقائق',
    accuracy: '±0.1°C للحرارة، ±2% للرطوبة، ±0.2 م/ث للرياح',
    dataClassification: 'public',
    fallbackStrategy: 'اتصال خلوي 4G مدعوم بنقل عبر الأقمار الصناعية Iridium',
    activeStatus: 'active'
  },
  {
    id: 'src-met-02',
    code: 'MET-RADAR-DOP',
    nameAr: 'شبكة رادارات الطقس الدوبلرية الساحلية والداخلية',
    nameEn: 'Doppler Weather Radar Network',
    ownerMinistry: 'المركز الوطني للأرصاد الجوية والمناخ',
    category: 'meteorological',
    collectionMethod: 'radar',
    updateFrequency: 'كل 6 دقائق (Volume Scan)',
    accuracy: 'دقة مكانية 250 متر لشدة الهطول والرياح الدوامية',
    dataClassification: 'restricted',
    fallbackStrategy: 'مسار ألياف ضوئية مباشر + خط راديوي بديل',
    activeStatus: 'active'
  },
  {
    id: 'src-geo-01',
    code: 'GEO-SEIS-NET',
    nameAr: 'الشبكة الوطنية للرصد الزلزالي الرقمي والتسارع الأرضي',
    nameEn: 'National Digital Seismological Network',
    ownerMinistry: 'المركز الوطني للزلازل',
    category: 'geological',
    collectionMethod: 'iot_sensor',
    updateFrequency: 'بث فوري مستمر (Real-time Stream 100 Hz)',
    accuracy: 'دقة زمنية بنظام GPS بنبضة الميكروثانية وتحديد مكاني ±1 كم',
    dataClassification: 'restricted',
    fallbackStrategy: 'اتصال فضائي VSAT لكل محطة زلزالية مع بطاريات شمسية',
    activeStatus: 'active'
  },
  {
    id: 'src-sat-01',
    code: 'SAT-FIRE-VIIRS',
    nameAr: 'منظومة الرصد الفضائي للبؤر الحرارية وحرائق الغابات (VIIRS/MODIS)',
    nameEn: 'Satellite Thermal Anomaly & Active Fire Ingestion',
    ownerMinistry: 'وزارة الزراعة والغابات / المركز الوطني للأرصاد',
    category: 'wildfire',
    collectionMethod: 'satellite',
    updateFrequency: 'كل 4 ساعات (أقمار مدارية متزامنة وقطبية)',
    accuracy: 'دقة رصد بؤر بمساحة 375 متر مربع',
    dataClassification: 'public',
    fallbackStrategy: 'تعدد مصادر الأقمار (NASA FIRMS + EUMETSAT)',
    activeStatus: 'active'
  },
  {
    id: 'src-wat-01',
    code: 'WAT-DAM-SCADA',
    nameAr: 'منظومة مجسات السدود ومناسيب الأنهار (SCADA Water Telemetry)',
    nameEn: 'Dam Hydrological Telemetry & River Gauge Network',
    ownerMinistry: 'وزارة الموارد المائية',
    category: 'hydrological',
    collectionMethod: 'telemetry',
    updateFrequency: 'كل 15 دقيقة',
    accuracy: 'دقة منسوب ±1 ملم مع قراءات تدفق مفيض مؤتمتة',
    dataClassification: 'sensitive',
    fallbackStrategy: 'شبكة لاسلكية مشفرة ونظام رصد يدوي احتياطي',
    activeStatus: 'active'
  },
  {
    id: 'src-hlth-01',
    code: 'HLTH-HOSP-READY',
    nameAr: 'منظومة جاهزية المشافي وبنوك الدم والإسعاف المركزي',
    nameEn: 'National Hospital Emergency Bed Capacity & EMS Hub',
    ownerMinistry: 'وزارة الصحة',
    category: 'health',
    collectionMethod: 'api',
    updateFrequency: 'كل 30 دقيقة',
    accuracy: 'تحديث فوري لأسرة العناية الفائقة وغرف العمليات وسيارات الإسعاف',
    dataClassification: 'sensitive',
    fallbackStrategy: 'شبكة لاسلكية تترا (TETRA) مغلقة بين المستشفيات المركزية',
    activeStatus: 'active'
  },
  {
    id: 'src-traf-01',
    code: 'TRAF-ROAD-CLOSURE',
    nameAr: 'سجل إغلاقات الطرق والجسور والمعابر الحدودية',
    nameEn: 'Road Network Closure & Bridge Structural Status',
    ownerMinistry: 'وزارة النقل / إدارة المرور',
    category: 'technological',
    collectionMethod: 'field_report',
    updateFrequency: 'فوري عند حدوث قطع مروري',
    accuracy: 'تحديد دقيق لمعرف وصلة الطريق على خرائط GIS',
    dataClassification: 'public',
    fallbackStrategy: 'غرفة اتصالات مركزية عبر أجهزة الإرسال VHF',
    activeStatus: 'active'
  }
];
