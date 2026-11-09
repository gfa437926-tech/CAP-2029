import { AlertItem, CAPMessageRecord, DataSourceItem, AuditLogItem, NotificationJob, User } from '../types/wams';

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    name: 'د. طارق الحارثي',
    email: 'tariq.alharthi@met.gov.sa',
    role: 'super_admin',
    department: 'الإدارة العامة للأرصاد والإنذار المبكر',
    status: 'active',
    lastLogin: '2026-11-08 16:15 UTC'
  },
  {
    id: 'usr-002',
    name: 'م. سارة القحطاني',
    email: 'sarah.q@met.gov.sa',
    role: 'alert_creator',
    department: 'قسم التنبؤات والتحاليل السينوبتيكية',
    status: 'active',
    lastLogin: '2026-11-08 15:40 UTC'
  },
  {
    id: 'usr-003',
    name: 'د. فيصل الشمري',
    email: 'faysal.sh@met.gov.sa',
    role: 'reviewer',
    department: 'شعبة تدقيق التحذيرات الجوية',
    status: 'active',
    lastLogin: '2026-11-08 14:20 UTC'
  },
  {
    id: 'usr-004',
    name: 'م. عبد الرحمن البلوشي',
    email: 'a.balushi@met.gov.sa',
    role: 'approver',
    department: 'مركز إدارة الأزمات والتحذير الجوي',
    status: 'active',
    lastLogin: '2026-11-08 15:55 UTC'
  },
  {
    id: 'usr-005',
    name: 'أمل العتيبي',
    email: 'amal.otaibi@met.gov.sa',
    role: 'publisher',
    department: 'بوابة النشر الرقمي وواجهات الطقس',
    status: 'active',
    lastLogin: '2026-11-08 16:02 UTC'
  }
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alt-2026-881',
    code: 'WAMS-SA-2026-0881',
    headlineAr: 'أمطار رعدية شديدة الغزارة مع خطر تشكل السيول المفاجئة وتساقط البرد',
    headlineEn: 'Violent Torrential Rain with Severe Flash Flood Risk and Large Hail',
    shortHeadlineAr: 'أمطار شديدة وسيول جارفة',
    descriptionAr: 'تتأثر المناطق الجبلية والساحلية بحالة من عدم الاستقرار الجوي العنيف مصحوبة بركاميات رعدية نشطة تؤدي لهطول أمطار غزيرة جداً تتراوح كمياتها بين 50 - 90 ملم خلال 6 ساعات، مع رياح هابطة تتجاوز 75 كم/س.',
    descriptionEn: 'Atmospheric instability causing severe convective storm cells with rain accumulations exceeding 75mm and wind gusts up to 75km/h.',
    safetyInstructionsAr: 'الابتعاد التام عن بطون الأودية ومجاري السيول وتجمعات المياه. عدم المجازفة بعبور المسالك المغمورة وتوخي أقصى درجات الحيطة والحذر.',
    phenomenon: 'flash_flood',
    severity: 'extreme',
    urgency: 'immediate',
    certainty: 'observed',
    status: 'published',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    reviewedBy: 'د. فيصل الشمري',
    approvedBy: 'م. عبد الرحمن البلوشي',
    publishedBy: 'أمل العتيبي',
    issuedAt: '2026-11-08T12:00:00Z',
    effectiveAt: '2026-11-08T13:00:00Z',
    onsetAt: '2026-11-08T13:30:00Z',
    expiresAt: '2026-11-09T04:00:00Z',
    areas: [
      {
        id: 'area-jeddah-makkah',
        nameAr: 'محافظة جدة ومكة المكرمة والشعيبة',
        nameEn: 'Jeddah, Makkah, and Shoaiba Corridor',
        type: 'polygon',
        coordinates: [
          { lat: 21.90, lng: 39.05 },
          { lat: 21.80, lng: 39.40 },
          { lat: 21.30, lng: 39.95 },
          { lat: 20.80, lng: 39.60 },
          { lat: 21.15, lng: 38.95 }
        ]
      }
    ],
    currentVersion: 2,
    versionHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-11-08T12:00:00Z',
        updatedBy: 'م. سارة القحطاني',
        changeSummary: 'الإصدار الأولي بمستوى خطورة برتقالي (شديد)',
        status: 'published',
        headlineAr: 'أمطار رعدية غزيرة ورياح هابطة نشطة',
        severity: 'severe'
      },
      {
        versionNumber: 2,
        updatedAt: '2026-11-08T14:15:00Z',
        updatedBy: 'م. عبد الرحمن البلوشي',
        changeSummary: 'رفع مستوى الخطورة إلى أحمر (استثنائي/أقصى) بعد رصد رادار السحب العملاقة',
        status: 'published',
        headlineAr: 'أمطار رعدية شديدة الغزارة مع خطر تشكل السيول المفاجئة',
        severity: 'extreme'
      }
    ],
    capIdentifier: 'urn:oid:2.49.0.0.682.0.2026.881',
    sourceType: 'manual',
    internalNotes: 'تم التنسيق المسبق وتأكيد قراءات الرادار عبر محطة الأرصاد الساحلية رقم 40400.',
    tags: ['سيول', 'أمطار رعدية', 'أحمر', 'القطاع الغربي']
  },
  {
    id: 'alt-2026-882',
    code: 'WAMS-SA-2026-0882',
    headlineAr: 'عاصفة غبارية جدارية تؤدي لانعدام الرؤية الأفقية لأقل من 200 متر',
    headlineEn: 'Severe Wall Dust Storm with Visibility Dropping Below 200m',
    shortHeadlineAr: 'عاصفة رملية وتدني الرؤية',
    descriptionAr: 'نشاط متوقع في الرياح السطحية الشمالية الشرقية النشطة والمثيرة للأتربة والغبار تتجاوز سرعتها 60 كم/س متسببة في تدنٍ حاد وشبه انعدام في مدى الرؤية الأفقية على الطرق السريعة.',
    descriptionEn: 'Strong surface winds generating blowing sand and wall dust storm reducing horizontal visibility sharply.',
    safetyInstructionsAr: 'ينصح مرضى الجهاز التنفسي والربو بملازمة المنازل وإحكام إغلاق النوافذ، وتجنب السفر والتنقل السريع على الطرق المفتوحة.',
    phenomenon: 'dust_storm',
    severity: 'severe',
    urgency: 'expected',
    certainty: 'likely',
    status: 'published',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    reviewedBy: 'د. فيصل الشمري',
    approvedBy: 'م. عبد الرحمن البلوشي',
    publishedBy: 'أمل العتيبي',
    issuedAt: '2026-11-08T10:30:00Z',
    effectiveAt: '2026-11-08T11:00:00Z',
    onsetAt: '2026-11-08T12:00:00Z',
    expiresAt: '2026-11-08T22:00:00Z',
    areas: [
      {
        id: 'area-riyadh-qassim',
        nameAr: 'منطقة الرياض والقصيم وحفر الباطن',
        nameEn: 'Riyadh, Qassim and Hafar Al-Batin Region',
        type: 'polygon',
        coordinates: [
          { lat: 26.50, lng: 43.50 },
          { lat: 27.90, lng: 45.80 },
          { lat: 25.50, lng: 47.90 },
          { lat: 23.80, lng: 46.20 },
          { lat: 24.80, lng: 43.20 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-11-08T10:30:00Z',
        updatedBy: 'م. سارة القحطاني',
        changeSummary: 'الإصدار المعتمد الأول',
        status: 'published',
        headlineAr: 'عاصفة غبارية جدارية تؤدي لانعدام الرؤية الأفقية',
        severity: 'severe'
      }
    ],
    capIdentifier: 'urn:oid:2.49.0.0.682.0.2026.882',
    sourceType: 'manual',
    internalNotes: 'جبهة غبارية قادمة من الشمال الشرقي مدعومة برياح نشطة.',
    tags: ['غبار', 'رؤية متدنية', 'الوسطى']
  },
  {
    id: 'alt-2026-883',
    code: 'WAMS-SA-2026-0883',
    headlineAr: 'موجة ضباب كثيف تعيق حركة الملاحة على السواحل والمرتفعات الجنوبية',
    headlineEn: 'Dense Fog Layer Severely Affecting Navigation over Southern Highlands',
    shortHeadlineAr: 'ضباب كثيف',
    descriptionAr: 'تشكل سحب منخفضة وملامسة لسطح الأرض تؤدي لتشكل ضباب كثيف يحد من الرؤية الأفقية إلى أقل من 500 متر خلال ساعات الصباح الباكر.',
    descriptionEn: 'Dense radiation fog expected in valleys and highland passes.',
    safetyInstructionsAr: 'استخدام أنوار الضباب والقيادة بسرعة منخفضة وترك مسافة أمان كافية بين المركبات.',
    phenomenon: 'dense_fog',
    severity: 'moderate',
    urgency: 'future',
    certainty: 'possible',
    status: 'scheduled',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    reviewedBy: 'د. فيصل الشمري',
    approvedBy: 'م. عبد الرحمن البلوشي',
    issuedAt: '2026-11-08T14:00:00Z',
    effectiveAt: '2026-11-09T01:00:00Z',
    onsetAt: '2026-11-09T02:00:00Z',
    expiresAt: '2026-11-09T08:00:00Z',
    areas: [
      {
        id: 'area-asir-baha',
        nameAr: 'مرتفعات عسير والباحة والطائف',
        nameEn: 'Asir and Baha Highlands',
        type: 'polygon',
        coordinates: [
          { lat: 18.10, lng: 42.40 },
          { lat: 19.30, lng: 41.80 },
          { lat: 21.20, lng: 40.40 },
          { lat: 21.35, lng: 40.70 },
          { lat: 18.25, lng: 42.80 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-11-08T14:00:00Z',
        updatedBy: 'م. سارة القحطاني',
        changeSummary: 'جدولة الإنذار ليبدأ فجر الغد تلقائياً',
        status: 'scheduled',
        headlineAr: 'موجة ضباب كثيف تعيق حركة الملاحة',
        severity: 'moderate'
      }
    ],
    sourceType: 'manual',
    internalNotes: 'مجداول للنشر فجر 9 نوفمبر عند الساعة 01:00 UTC.',
    tags: ['ضباب', 'مرتفعات', 'مجدول']
  },
  {
    id: 'alt-2026-884',
    code: 'WAMS-SA-2026-0884',
    headlineAr: 'رياح بحرية نشطة وارتفاع الأمواج لأكثر من 3.5 أمتار في الخليج العربي',
    headlineEn: 'Strong Marine Winds with Wave Heights Exceeding 3.5m in Arabian Gulf',
    shortHeadlineAr: 'اضطراب بحري وأمواج عاتية',
    descriptionAr: 'اضطرابات جوية بحرية تؤدي لارتفاع الموج إلى ما بين 2.5 إلى 3.5 متر، مما يشكل خطورة على القوارب الصغيرة ومراكب الصيد.',
    descriptionEn: 'Rough sea conditions with northwesterly winds and high swell.',
    safetyInstructionsAr: 'تعليق كافة الأنشطة البحرية والإبحار والصيد لجميع القوارب الصغيرة والتزام إرشادات خفر السواحل.',
    phenomenon: 'marine_surge',
    severity: 'minor',
    urgency: 'expected',
    certainty: 'likely',
    status: 'pending_review',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    issuedAt: '2026-11-08T15:20:00Z',
    effectiveAt: '2026-11-08T18:00:00Z',
    onsetAt: '2026-11-08T19:00:00Z',
    expiresAt: '2026-11-09T18:00:00Z',
    areas: [
      {
        id: 'area-eastern-gulf',
        nameAr: 'المياه الإقليمية - الخليج العربي (الدمام والجبيل والخفجي)',
        nameEn: 'Arabian Gulf Territorial Waters',
        type: 'polygon',
        coordinates: [
          { lat: 28.50, lng: 48.70 },
          { lat: 27.20, lng: 50.10 },
          { lat: 25.80, lng: 50.40 },
          { lat: 26.20, lng: 49.80 },
          { lat: 28.10, lng: 48.40 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-11-08T15:20:00Z',
        updatedBy: 'م. سارة القحطاني',
        changeSummary: 'تم إرسال المسودة للمراجعة والتدقيق',
        status: 'pending_review',
        headlineAr: 'رياح بحرية نشطة وارتفاع الأمواج',
        severity: 'minor'
      }
    ],
    sourceType: 'manual',
    internalNotes: 'بانتظار تدقيق مسؤول الأرصاد البحرية قبل الاعتماد.',
    tags: ['بحر', 'أمواج', 'الشرقية']
  },
  {
    id: 'alt-2026-885',
    code: 'WAMS-SA-2026-0885',
    headlineAr: 'مسودة تنبيه: انخفاض حاد في درجات الحرارة وصقيع فجر الغد',
    headlineEn: 'Draft Alert: Sharp Temperature Drop and Night Frost',
    shortHeadlineAr: 'صقيع وموجة باردة',
    descriptionAr: 'كتلة هوائية قطبية المنشأ تتدنى معها درجات الحرارة السطحية لما دون الصفر المئوي في المناطق الشمالية.',
    descriptionEn: 'Polar air mass drop with sub-zero ground frost expected in northern sectors.',
    safetyInstructionsAr: 'حماية المزروعات والبيوت المحمية واتخاذ تدابير التدفئة الآمنة وتجنب تشغيل الفحم بالأماكن المغلقة.',
    phenomenon: 'frost_ice',
    severity: 'informational',
    urgency: 'future',
    certainty: 'possible',
    status: 'draft',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    issuedAt: '2026-11-08T16:00:00Z',
    effectiveAt: '2026-11-09T00:00:00Z',
    onsetAt: '2026-11-09T01:00:00Z',
    expiresAt: '2026-11-09T07:00:00Z',
    areas: [
      {
        id: 'area-tabuk-jouf',
        nameAr: 'منطقة تبوك والجوف والحدود الشمالية',
        nameEn: 'Tabuk, Jawf and Northern Borders',
        type: 'polygon',
        coordinates: [
          { lat: 28.30, lng: 36.50 },
          { lat: 31.20, lng: 38.20 },
          { lat: 31.80, lng: 41.50 },
          { lat: 29.50, lng: 41.00 },
          { lat: 27.80, lng: 37.20 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [],
    sourceType: 'manual',
    internalNotes: 'مسودة قيد الصياغة الأولية، لم ترسل للمراجعة بعد.',
    tags: ['صقيع', 'الشمالية', 'مسودة']
  },
  {
    id: 'alt-2026-879',
    code: 'WAMS-SA-2026-0879',
    headlineAr: 'إلغاء تنبيه: زوال فرصة الرياح الهابطة عن القطاع الأوسط',
    headlineEn: 'Cancellation Alert: Dissipation of Downburst Wind Threat',
    shortHeadlineAr: 'إلغاء تنبيه الرياح',
    descriptionAr: 'استقرار الأجواء وتلاشي الخلايا الركامية السابقة وعودة سرعة الرياح للمعدلات الطبيعية.',
    descriptionEn: 'Conditions normalized and convective cells dissipated.',
    safetyInstructionsAr: 'انتهاء مفعول التحذير السابق واستئناف النشاطات الاعتيادية بأمان.',
    phenomenon: 'gale_winds',
    severity: 'minor',
    urgency: 'past',
    certainty: 'observed',
    status: 'cancelled',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    reviewedBy: 'د. فيصل الشمري',
    approvedBy: 'م. عبد الرحمن البلوشي',
    publishedBy: 'أمل العتيبي',
    issuedAt: '2026-11-08T07:00:00Z',
    effectiveAt: '2026-11-08T07:00:00Z',
    onsetAt: '2026-11-08T07:00:00Z',
    expiresAt: '2026-11-08T11:00:00Z',
    areas: [
      {
        id: 'area-dawadmi',
        nameAr: 'محافظة الدوادمي وعفيف',
        nameEn: 'Dawadmi and Afif',
        type: 'polygon',
        coordinates: [
          { lat: 24.50, lng: 44.10 },
          { lat: 24.80, lng: 44.60 },
          { lat: 24.10, lng: 44.80 },
          { lat: 23.90, lng: 44.20 }
        ]
      }
    ],
    currentVersion: 2,
    versionHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-11-08T07:00:00Z',
        updatedBy: 'م. سارة القحطاني',
        changeSummary: 'نشر أولي',
        status: 'published',
        headlineAr: 'رياح نشطة وأتربة مثارة',
        severity: 'minor'
      },
      {
        versionNumber: 2,
        updatedAt: '2026-11-08T11:00:00Z',
        updatedBy: 'أمل العتيبي',
        changeSummary: 'إلغاء رسمي للتحذير لزوال الحالة',
        status: 'cancelled',
        headlineAr: 'إلغاء تنبيه الرياح',
        severity: 'minor'
      }
    ],
    sourceType: 'manual',
    internalNotes: 'تم الإلغاء بموجب تقرير دورية الرادار 11:00 UTC.',
    tags: ['ملغي', 'رياح', 'الدوادمي']
  },
  {
    id: 'alt-2026-870',
    code: 'WAMS-SA-2026-0870',
    headlineAr: 'منتهي: موجة أمطار غزيرة سابقة على المرتفعات الجنوبية الغربية',
    headlineEn: 'Expired: Heavy Rain and Flash Floods over Southwestern Escarpment',
    shortHeadlineAr: 'أمطار غزيرة منتهية',
    descriptionAr: 'انتهت فترة تأثير المنخفض الجوي وتوقف هطول الأمطار الغزيرة مع استقرار مؤشرات الرادار.',
    descriptionEn: 'The previous convective weather alert has concluded at the scheduled expiration time.',
    safetyInstructionsAr: 'انتهاء فترة التحذير مع ضرورة توخي الحذر من الرطوبة وبقايا المياه الراكدة.',
    phenomenon: 'heavy_rain',
    severity: 'moderate',
    urgency: 'past',
    certainty: 'observed',
    status: 'expired',
    issuerOrg: 'المركز الوطني للأرصاد',
    createdBy: 'م. سارة القحطاني',
    reviewedBy: 'د. فيصل الشمري',
    approvedBy: 'م. عبد الرحمن البلوشي',
    publishedBy: 'أمل العتيبي',
    issuedAt: '2026-11-07T08:00:00Z',
    effectiveAt: '2026-11-07T09:00:00Z',
    onsetAt: '2026-11-07T10:00:00Z',
    expiresAt: '2026-11-08T08:00:00Z',
    areas: [
      {
        id: 'area-jizan',
        nameAr: 'منطقة جازان وفيفاء والداير',
        nameEn: 'Jazan, Fayfa and Dayer',
        type: 'polygon',
        coordinates: [
          { lat: 16.80, lng: 42.50 },
          { lat: 17.50, lng: 43.10 },
          { lat: 17.10, lng: 43.30 },
          { lat: 16.70, lng: 42.90 }
        ]
      }
    ],
    currentVersion: 1,
    versionHistory: [],
    sourceType: 'manual',
    internalNotes: 'انتهت الصلاحية تلقائياً عبر مجدول المهام عند 2026-11-08T08:00:00Z.',
    tags: ['منتهي', 'أمطار', 'جازان']
  }
];

export const sampleCapXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>urn:oid:2.49.0.0.682.0.2026.881</identifier>
  <sender>alerts@ncm.gov.sa</sender>
  <sent>2026-11-08T14:15:00+00:00</sent>
  <status>Actual</status>
  <msgType>Update</msgType>
  <scope>Public</scope>
  <references>alerts@ncm.gov.sa,urn:oid:2.49.0.0.682.0.2026.881_v1,2026-11-08T12:00:00+00:00</references>
  <info>
    <language>ar-SA</language>
    <category>Met</category>
    <event>أمطار رعدية وسيول جارفة</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>WMO-WAMS</valueName>
      <value>FLASH_FLOOD_01</value>
    </eventCode>
    <effective>2026-11-08T13:00:00+00:00</effective>
    <onset>2026-11-08T13:30:00+00:00</onset>
    <expires>2026-11-09T04:00:00+00:00</expires>
    <senderName>المركز الوطني للأرصاد - إدارة الإنذار المبكر</senderName>
    <headline>أمطار رعدية شديدة الغزارة مع خطر تشكل السيول المفاجئة وتساقط البرد</headline>
    <description>تتأثر المناطق الساحلية والجبلية بركاميات رعدية عنيفة تؤدي لهطول أمطار غزيرة جداً تتراوح بين 50 - 90 ملم.</description>
    <instruction>الابتعاد عن مجاري الأودية والسيول وتجنب القيادة في الطرق المنخفضة المغمورة بالماء.</instruction>
    <area>
      <areaDesc>محافظة جدة ومكة المكرمة والشعيبة</areaDesc>
      <polygon>21.90,39.05 21.80,39.40 21.30,39.95 20.80,39.60 21.15,38.95 21.90,39.05</polygon>
      <geocode>
        <valueName>ISO3166-2</valueName>
        <value>SA-02</value>
      </geocode>
    </area>
  </info>
</alert>`;

export const mockCapMessages: CAPMessageRecord[] = [
  {
    id: 'cap-rec-091',
    identifier: 'urn:oid:2.49.0.0.682.0.2026.881',
    sender: 'alerts@ncm.gov.sa',
    sent: '2026-11-08T14:15:00Z',
    status: 'Actual',
    msgType: 'Update',
    scope: 'Public',
    category: 'Met',
    eventAr: 'أمطار رعدية وسيول جارفة',
    urgency: 'Immediate',
    severity: 'Extreme',
    certainty: 'Observed',
    areaDesc: 'محافظة جدة ومكة المكرمة والشعيبة',
    validationStatus: 'valid',
    rawXml: sampleCapXml,
    convertedAlertId: 'alt-2026-881',
    receivedAt: '2026-11-08T14:15:22Z'
  },
  {
    id: 'cap-rec-090',
    identifier: 'urn:oid:2.49.0.0.682.0.2026.882',
    sender: 'radar-feed@met.gov.sa',
    sent: '2026-11-08T10:30:00Z',
    status: 'Actual',
    msgType: 'Alert',
    scope: 'Public',
    category: 'Met',
    eventAr: 'عاصفة غبارية جدارية',
    urgency: 'Expected',
    severity: 'Severe',
    certainty: 'Likely',
    areaDesc: 'منطقة الرياض والقصيم وحفر الباطن',
    validationStatus: 'valid',
    rawXml: sampleCapXml,
    convertedAlertId: 'alt-2026-882',
    receivedAt: '2026-11-08T10:30:15Z'
  },
  {
    id: 'cap-rec-089',
    identifier: 'urn:oid:test-corrupt-msg-992',
    sender: 'external-test@partner.org',
    sent: '2026-11-08T09:12:00Z',
    status: 'Test',
    msgType: 'Alert',
    scope: 'Private',
    category: 'Other',
    eventAr: 'رسالة اختبارية ذات هندسة غير مغلقة',
    urgency: 'Unknown',
    severity: 'Unknown',
    certainty: 'Unknown',
    areaDesc: 'منطقة غير محددة بدقة',
    validationStatus: 'invalid',
    validationErrors: [
      'خطأ في مضلع الإحداثيات: Polygon غير مغلق (النقطة الأخيرة لا تطابق النقطة الأولى)',
      'حقل identifier غير مطابق لمعيار OID المعتمد',
      'عنصر <expires> أقدم من عنصر <sent>'
    ],
    rawXml: '<alert><identifier>corrupt</identifier></alert>',
    receivedAt: '2026-11-08T09:12:04Z'
  }
];

export const mockDataSources: DataSourceItem[] = [
  {
    id: 'ds-01',
    nameAr: 'خلاصة CAP الوطنية الرسمية (NCM Feed)',
    type: 'cap_feed',
    endpoint: 'https://alerts.ncm.gov.sa/feeds/v1/cap.atom',
    status: 'connected',
    lastSync: 'منذ دقيقتين (16:30 UTC)',
    importedCount: 1420,
    rejectedCount: 4,
    autoDraft: true,
    notes: 'تغذية آلية تنشئ مسودات في WAMS للمراجعة البشرية دون نشر تلقائي.'
  },
  {
    id: 'ds-02',
    nameAr: 'شبكة استشعار الرادار ونظام الإنذار المبكر',
    type: 'rest_api',
    endpoint: 'https://internal-radar.met.gov.sa/api/v2/alerts',
    status: 'connected',
    lastSync: 'منذ 5 دقائق (16:27 UTC)',
    importedCount: 843,
    rejectedCount: 1,
    autoDraft: true,
    notes: 'الاستيراد الفوري لمؤشرات شدة خلايا الرادار الدوبلري.'
  },
  {
    id: 'ds-03',
    nameAr: 'شبكة الأرصاد العالمية WMO GTS Alert Hub',
    type: 'wmo_gts',
    endpoint: 'https://alerthub.wmo.int/api/v1/feed',
    status: 'disconnected',
    lastSync: 'غير متصل (بانتظار اعتماد بيانات الاعتماد وموافقة المسؤول)',
    importedCount: 0,
    rejectedCount: 0,
    autoDraft: false,
    notes: 'مطابق للسياسة: لا يتم تفعيل أي اتصال خارجي دون موافقة المسؤول وإعداد الرموز السرية.'
  },
  {
    id: 'ds-04',
    nameAr: 'بوابة الرفع اليدوي لملفات CAP XML',
    type: 'manual',
    endpoint: '/api/v1/cap/upload',
    status: 'connected',
    lastSync: 'منذ 45 دقيقة',
    importedCount: 189,
    rejectedCount: 6,
    autoDraft: true,
    notes: 'واجهة التدقيق والتحقق المحلي لمحللي الأرصاد.'
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'aud-9912',
    timestamp: '2026-11-08 14:15:10 UTC',
    actor: 'م. عبد الرحمن البلوشي',
    role: 'Approver (معتمد التحذيرات)',
    action: 'ALERT_ESCALATION_APPROVE',
    targetEntity: 'AlertItem',
    targetId: 'alt-2026-881 (v2)',
    ipAddress: '10.20.14.88',
    status: 'success',
    details: 'اعتماد رفع مستوى الخطورة إلى Extreme وتوليد إشعار فوري لتطبيق الطقس'
  },
  {
    id: 'aud-9911',
    timestamp: '2026-11-08 14:12:05 UTC',
    actor: 'د. فيصل الشمري',
    role: 'Reviewer (مدقق التحذيرات)',
    action: 'ALERT_REVIEW_PASS',
    targetEntity: 'AlertItem',
    targetId: 'alt-2026-881 (v2)',
    ipAddress: '10.20.14.52',
    status: 'success',
    details: 'إجازة المسودة وتمريرها للاعتماد بعد مراجعة تقاطع مضلع جدة ومكة المكرمة'
  },
  {
    id: 'aud-9910',
    timestamp: '2026-11-08 14:02:18 UTC',
    actor: 'م. سارة القحطاني',
    role: 'Alert Creator (منشئ التحذير)',
    action: 'ALERT_VERSION_DRAFT',
    targetEntity: 'AlertItem',
    targetId: 'alt-2026-881 (v2)',
    ipAddress: '10.20.12.19',
    status: 'success',
    details: 'إنشاء الإصدار الثاني بناءً على تحديث رادار دوبلر الساحلي'
  },
  {
    id: 'aud-9909',
    timestamp: '2026-11-08 11:00:22 UTC',
    actor: 'أمل العتيبي',
    role: 'Publisher (ناشر التحذير)',
    action: 'ALERT_CANCEL_PUBLISH',
    targetEntity: 'AlertItem',
    targetId: 'alt-2026-879',
    ipAddress: '10.20.15.11',
    status: 'success',
    details: 'نشر قرار إلغاء التنبيه الجوي وإخطار تطبيق الطقس بحذف المنطقة المظللة'
  },
  {
    id: 'aud-9908',
    timestamp: '2026-11-08 09:12:05 UTC',
    actor: 'CAP Ingestion Engine',
    role: 'System Service',
    action: 'CAP_VALIDATION_REJECT',
    targetEntity: 'CAPMessage',
    targetId: 'urn:oid:test-corrupt-msg-992',
    ipAddress: '127.0.0.1 (Local Queue)',
    status: 'failure',
    details: 'رفض رسالة CAP لاحتوائها على مضلع غير مغلق واختلاف في صيغة المعرف'
  }
];

export const mockNotificationJobs: NotificationJob[] = [
  {
    id: 'job-7701',
    alertId: 'alt-2026-881',
    event: 'escalation',
    targetGeoAreas: ['محافظة جدة ومكة المكرمة والشعيبة'],
    severity: 'extreme',
    status: 'delivered',
    recipientsCount: 284000,
    deliveredCount: 282410,
    createdAt: '2026-11-08 14:15:15 UTC',
    scheduledFor: '2026-11-08 14:15:15 UTC',
    retryCount: 0
  },
  {
    id: 'job-7702',
    alertId: 'alt-2026-882',
    event: 'new_alert',
    targetGeoAreas: ['منطقة الرياض والقصيم وحفر الباطن'],
    severity: 'severe',
    status: 'delivered',
    recipientsCount: 412000,
    deliveredCount: 409850,
    createdAt: '2026-11-08 10:30:20 UTC',
    scheduledFor: '2026-11-08 10:30:20 UTC',
    retryCount: 0
  },
  {
    id: 'job-7703',
    alertId: 'alt-2026-883',
    event: 'new_alert',
    targetGeoAreas: ['مرتفعات عسير والباحة والطائف'],
    severity: 'moderate',
    status: 'queued',
    recipientsCount: 95000,
    deliveredCount: 0,
    createdAt: '2026-11-08 14:00:00 UTC',
    scheduledFor: '2026-11-09 01:00:00 UTC (مجدول مع بداية التأثير)',
    retryCount: 0
  }
];
