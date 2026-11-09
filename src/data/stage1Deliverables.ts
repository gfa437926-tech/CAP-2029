export interface DeliverableSection {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  badge: string;
  contentMarkdown: string;
  highlights: { labelAr: string; valueAr: string }[];
}

export const stage1Deliverables: DeliverableSection[] = [
  {
    id: 'srs',
    number: 1,
    titleAr: 'وثيقة المتطلبات النهائية (SRS)',
    titleEn: 'Final Software Requirements Specification',
    summaryAr: 'المواصفات الوظيفية وغير الوظيفية المعتمدة لنظام إدارة التحذيرات الجوية وفصل الطبقات.',
    badge: 'المعايير والمتطلبات',
    highlights: [
      { labelAr: 'الهدف الجوهري', valueAr: 'منصة مستقلة للأرصاد لبث التحذيرات لتطبيق الطقس' },
      { labelAr: 'المعيار المعتمد', valueAr: 'OASIS CAP 1.2 & WMO Warning Guidelines' },
      { labelAr: 'الفصل المعماري', valueAr: '6 طبقات مستقلة بالكامل بدون تبعيات مختلطة' },
      { labelAr: 'الأمان والخصوصية', valueAr: 'منع كشف المسودات وسجلات التدقيق عبر الـ API العامة' }
    ],
    contentMarkdown: `### 1.1 نطاق النظام وهدفه الأساسي
نظام **WAMS (Weather Alerts Management System)** هو منصة ويب متقدمة موجهة لخبراء ومحللي الأرصاد الجوية ومسؤولي التنبؤات والإنذار المبكر. يتيح النظام إنشاء وتدقيق واعتماد ونشر وتحديث وإلغاء وأرشفة التحذيرات الجوية وفق المعايير الدولية (WMO / OASIS CAP v1.2)، مع رسم الحدود الجغرافية للمناطق المتأثرة بدقة مكانية فائقة عبر نظم المعلومات الجغرافية (GIS).

> **ملاحظة محددة ونطاق صارم:**
> هذا النظام **ليس** أداة لإرسال رسائل أو مراسلات حكومية أو عسكرية أو إدارة قوائم مستلمين، بل هو **محرك مركزي لإنتاج التحذيرات الموجهة لمستخدمي تطبيق الطقس** على الخرائط التفاعلية والشاشات الرئيسية وتنبيهات الهواتف الذكية.

---

### 1.2 المتطلبات الوظيفية (Functional Requirements)
1. **دورة حياة التحذير الصارمة:** دعم حالات محددة (Draft -> Pending Review -> Approved -> Scheduled -> Published -> Updated -> Cancelled -> Expired -> Archived).
2. **محرك الخرائط والـ GIS المتقدم:** رسم وتحرير المضلعات (Polygon) والدوائر (Circle) والمناطق الإدارية والتحقق الطوبولوجي من سلامتها وتخزينها في PostGIS.
3. **معالجة واستيراد CAP 1.2:** فحص الـ XML والـ Schema، واستخراج الظواهر والإحداثيات ودرجات الخطورة، وتحويل الرسائل المقبولة إلى مسودات تحتاج تدقيقاً بشرياً.
4. **فصل المهام وصلاحيات RBAC:** منع منشئ التحذير (Alert Creator) من اعتماده أو نشره بنفسه عند تفعيل سياسة الفصل بين المهام (Four-Eyes Principle).
5. **سجل تدقيق غير قابل للتعديل (Append-Only Audit Log):** تدوين كل حركة، مع هوية المستخدم، وعنوان الـ IP، والوقت الدقيق بالـ UTC، والتغييرات بالتفصيل.
6. **واجهة برمجة تطبيقات الطقس (Weather App API):** واجهة RESTful موثقة تدعم الاستعلام المكاني (Spatial Queries) بـ lat/lon، والمناطق الإدارية، وإرجاع GeoJSON نظيف للتحذيرات المنشورة والنشطة فقط.
7. **طابور الإشعارات (Notification Outbox & Queue):** تجهيز حمولات الإشعارات الموجهة جغرافياً لتطبيق الطقس مع منع التكرار وإعادة المحاولة في حال الإخفاق.

---

### 1.3 المتطلبات غير الوظيفية (Non-Functional Requirements)
- **الأداء:** زمن استجابة API تطبيق الطقس أقل من 50ms عبر الـ Spatial Indexing والـ Redis Caching والـ ETags.
- **التوافرية والموثوقية:** 99.95% بدون اعتماد على خدمات خارجية مدفوعة أو إقفال مزود تجاري.
- **الأمان:** حماية كاملة ضد SQL Injection، XSS، CSRF، وتأمين المفاتيح في متغيرات البيئة.
- **التوطين:** دعم كامل للغة العربية (RTL) مع التأسيس للإنجليزية، ودعم الوضع الداكن (Dark Mode) كوضع أساسي.`
  },
  {
    id: 'architecture',
    number: 2,
    titleAr: 'المخطط المعماري للنظام',
    titleEn: 'System Architecture & Decoupled Subsystems',
    summaryAr: 'الهيكل المعماري متعدد الطبقات مفصول المسؤوليات بين الإدارة، والـ GIS، والـ CAP، والـ API، والـ Outbox.',
    badge: 'الهندسة المعمارية',
    highlights: [
      { labelAr: 'محرك الخادم', valueAr: 'Node.js / TypeScript + Express REST Engine' },
      { labelAr: 'المحرك المكاني', valueAr: 'PostgreSQL + PostGIS Extension' },
      { labelAr: 'طابور المهام', valueAr: 'PostgreSQL Transactional Outbox + Worker' },
      { labelAr: 'محرك الخرائط', valueAr: 'Open-Source MapLibre GL / Vector Tiles' }
    ],
    contentMarkdown: `### 2.1 الفصل الكامل بين الطبقات الست (Six Decoupled Subsystems)
لضمان استقرار وموثوقية النظام تحت أعتى الظروف الجوية، تم فصل المكونات بنسبة 100%:

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │             WAMS Web Management Console                │
   │  (React 19 + TypeScript + Tailwind CSS v4 RTL UI)     │
   └───────────────┬───────────────────────┬────────────────┘
                   │                       │
 ┌─────────────────▼─────────┐    ┌────────▼────────────────┐
 │  GIS & Map Editing Engine │    │ Alert Lifecycle Engine  │
 │ (MapLibre / Turf / Spatial│    │ (FSM & Approval Gates & │
 │  Topology & WKT Validator)│    │  Version Audit Trail)   │
 └─────────────────┬─────────┘    └────────┬────────────────┘
                   │                       │
 ┌─────────────────▼───────────────────────▼────────────────┐
 │        Application Core Services & REST API Layer        │
 │     (Auth RBAC, Business Rules, Validation, Drizzle)     │
 └───────┬─────────────────────────┬────────────────┬───────┘
         │                         │                │
┌────────▼──────────────┐ ┌────────▼─────────┐ ┌────▼─────────────────┐
│ CAP 1.2 Engine        │ │ Spatial DB       │ │ Notification Outbox  │
│ - XML Schema Parser   │ │ - PostgreSQL 16  │ │ - Transactional Queue│
│ - Ingestion Pipeline  │ │ - PostGIS 3.4    │ │ - Geo-targeting Push │
│ - Reference Resolver  │ │ - Spatial Indexes│ │ - Retry & Backoff    │
└───────────────────────┘ └──────────────────┘ └────────┬─────────────┘
                                                        │
                                           ┌────────────▼─────────────┐
                                           │ Public Weather App API   │
                                           │ /api/v1/alerts/active    │
                                           │ /api/v1/alerts/nearby    │
                                           └──────────────────────────┘
\`\`\`

---

### 2.2 مبررات القرارات الهندسية
1. **استخدام PostgreSQL مع PostGIS:** المعيار القياسي عالمياً للأرصاد ونظم المعلومات الجغرافية. يوفر دوال مكانية دقيقة مثل \`ST_Intersects\` و \`ST_Contains\` و \`ST_MakeValid\` و \`ST_AsGeoJSON\`.
2. **محرك الخرائط MapLibre GL:** مفتوح المصدر بالكامل، مجاني ولا يتطلب بطاقات مصرفية أو مفاتيح تجارية باهظة من Google Maps، مع إمكانية استخدام شرائح OpenStreetMap المفتوحة أو طبقات الأقمار الصناعية العامة، ودعم الانتقال لأي مزود خرائط مستقبلاً بمرونة كاملة.
3. **نمط Transactional Outbox للإشعارات:** يضمن عدم فقدان أي إشعار حتى عند انقطاع الشبكة، ويحفظ عملية النشر وإدراج مهام الإشعار ضمن Transaction واحدة في قاعدة البيانات.`
  },
  {
    id: 'screens-design',
    number: 3,
    titleAr: 'دليل تصميم صفحات البرنامج الـ 25',
    titleEn: '25 Screens UI/UX Design System',
    summaryAr: 'تصميم بصري متكامل وعالي التباين لجميع شاشات النظام الـ 25 مع رموز الأرصاد وألوان درجات الخطورة.',
    badge: 'تصميم الواجهات',
    highlights: [
      { labelAr: 'عدد الشاشات', valueAr: '25 شاشة حقيقية متخصصة بدون دمج شكلي' },
      { labelAr: 'الوضع اللوني', valueAr: 'Dark Mode أرصادي افتراضي + خيار Light Mode' },
      { labelAr: 'نظام الخطورة', valueAr: 'معتمد دولياً (أزرق - أخضر - أصفر - برتقالي - أحمر)' },
      { labelAr: 'المعاينة الفورية', valueAr: 'محاكاة كاملة لشاشة تطبيق الطقس النهائي' }
    ],
    contentMarkdown: `### 3.1 فهرس الشاشات المصممة
1. **تسجيل الدخول (Login):** مدخل آمن بالبريد وكلمة المرور والمصادقة الثنائية مع كشف حالة الاتصال.
2. **لوحة التحكم الرئيسية (Dashboard):** مؤشرات فورية، توزيع الخطورة، خريطة حية مصغرة، وسرعة استجابة.
3. **خريطة التحذيرات (GIS Interactive Map):** مساحة عمل متكاملة لرسم المضلعات والدوائر وطبقات الطقس.
4. **جميع التحذيرات (All Alerts Registry):** جدول متقدم ذو كثافة عالية، فرز، تصفية، وترقيم صفحات.
5. **إنشاء تحذير (Create Alert Wizard):** معالج خطوة بخطوة يبدأ بالظاهرة ومستوى الخطورة والأوقات.
6. **محرر التحذير (Alert Rich Editor):** محرر نصي ثنائي اللغة (عربي/إنجليزي) مع تعليمات السلامة.
7. **تفاصيل التحذير (Alert Details):** عارض شامل للإحداثيات والإصدارات والمعلومات الفنية.
8. **مراجعة التحذيرات (Alert Review & Approval Gate):** واجهة المدقق والمعتمد مع تدقيق مضلعات GIS.
9. **التحذيرات المجدولة (Scheduled Alerts Queue):** قائمة التنبيهات التي تنتظر تاريخ بدء التأثير.
10. **التحذيرات النشطة (Live Active Alerts):** التحذيرات السارية حالياً والتي تبث لتطبيق الطقس.
11. **التحذيرات المنتهية (Expired Alerts):** التحذيرات التي تجاوزت وقت الانتهاء وأوقفت آلياً.
12. **التحذيرات الملغاة (Cancelled Alerts):** التحذيرات التي أُلغيت رسمياً مع أسباب الإلغاء.
13. **أرشيف التحذيرات (Historical Alert Archive):** أرشيف تاريخي للأرصاد يدعم البحث عبر السنوات.
14. **استيراد CAP (CAP 1.2 Import & Validator):** فاحص XML، معاينة مضلعات قبل التحويل لمسودة.
15. **سجل رسائل CAP (CAP Messages Log):** سجل بجميع رسائل Alert و Update و Cancel المستلمة.
16. **إدارة مصادر البيانات (Data Sources):** إدارة الـ Endpoints والخلاصات مع بيان حالة الاتصال الحقيقية.
17. **إدارة المناطق الجغرافية (Admin Regions):** إدارة الدول والمحافظات والمدن بحدود GeoJSON.
18. **إدارة المستخدمين (User Management):** دليل موظفي الأرصاد، الأقسام، والحالات.
19. **إدارة الأدوار والصلاحيات (RBAC Matrix):** جدول الصلاحيات الـ 14 الموزعة على الأدوار الـ 7.
20. **سجل التدقيق (Append-Only Audit Log):** سجل تتبع أمني يمنع التعديل أو الحذف نهائياً.
21. **إدارة الإشعارات (Weather App Push Outbox):** مراقبة الإشعارات الجغرافية ونسب التسليم.
22. **التقارير والإحصائيات (Meteorological Reports):** توزيع الظواهر، متوسط المدد، وتصدير CSV/PDF.
23. **إعدادات النظام (System Settings):** تخصيص الظواهر الجوية، سياسة الفصل بين المهام، والمواقيت.
24. **إدارة API والتكاملات (API & OpenAPI Console):** توثيق نقاط النهاية ومفاتيح الربط وتوليد الـ SDK.
25. **صفحة حالة النظام (System Health & Diagnostics):** فحص حقيقي للـ DB والـ Redis والـ CAP Feeds.`
  },
  {
    id: 'navigation-flow',
    number: 4,
    titleAr: 'خريطة التنقل ومسارات المستخدم',
    titleEn: 'Information Architecture & User Flows',
    summaryAr: 'الهيكل الهرمي للشاشات، مسار إنشاء ونشر التحذير، ومسار استيراد ومعالجة رسائل CAP.',
    badge: 'هندسة المعلومات',
    highlights: [
      { labelAr: 'المسار الحرج 1', valueAr: 'المسودة -> التدقيق -> الاعتماد -> النشر' },
      { labelAr: 'المسار الحرج 2', valueAr: 'استيراد CAP -> فحص الـ Schema -> تحويل لمسودة' },
      { labelAr: 'المسار الحرج 3', valueAr: 'النشر الفوري -> طابور Outbox -> بث تطبيق الطقس' },
      { labelAr: 'أدوات التنقل', valueAr: 'شريط جانبي أرصادي، شريط علوي، وبحث سريع' }
    ],
    contentMarkdown: `### 4.1 شجرة التنقل الرئيسية (Main Site Map)
- **العمليات والإنذار المباشر (Operations)**
  - لوحة التحكم الرئيسية \`/dashboard\`
  - خريطة التحذيرات الجغرافية \`/gis-map\`
  - التحذيرات النشطة \`/alerts/active\`
  - التحذيرات المجدولة \`/alerts/scheduled\`
  - مراجعة التحذيرات واعتمادها \`/alerts/review\`
  - إنشاء تحذير جديد \`/alerts/create\`
- **سجلات التحذيرات (Alert Records)**
  - جميع التحذيرات \`/alerts\`
  - التحذيرات المنتهية \`/alerts/expired\`
  - التحذيرات الملغاة \`/alerts/cancelled\`
  - الأرشيف التاريخي \`/alerts/archive\`
- **نظام CAP ومصادر البيانات (CAP & Ingestion)**
  - استيراد CAP 1.2 والتحقق \`/cap/import\`
  - سجل رسائل CAP \`/cap/logs\`
  - إدارة مصادر البيانات وخلاصات الطقس \`/sources\`
- **الجغرافيا والنشر الخارجي (GIS & Distribution)**
  - إدارة المناطق الإدارية \`/regions\`
  - طابور إشعارات تطبيق الطقس \`/notifications\`
  - إدارة الـ API والتكاملات \`/api-management\`
- **الأمان والتقارير والنظام (Security & System)**
  - سجل التدقيق الأمني \`/audit-logs\`
  - التقارير والإحصائيات \`/reports\`
  - المستخدمون والصلاحيات \`/users\` & \`/rbac\`
  - إعدادات النظام \`/settings\`
  - حالة الخدمات والخوادم \`/health\``
  },
  {
    id: 'db-schema',
    number: 5,
    titleAr: 'مخطط قاعدة البيانات الأولي (ERD & SQL)',
    titleEn: 'Database Architecture & PostGIS Schema',
    summaryAr: 'تصميم قاعدة بيانات علائقية كاملة ومطبعة تستخدم PostgreSQL و PostGIS مع قيود السلامة وفهارس الأداء.',
    badge: 'قواعد البيانات',
    highlights: [
      { labelAr: 'محرك التخزين', valueAr: 'PostgreSQL 16 + PostGIS 3.4' },
      { labelAr: 'نوع المعرفات', valueAr: 'UUID v4 لجميع السجلات الحساسة' },
      { labelAr: 'الفهارس المكانية', valueAr: 'GIST Spatial Indexes على أعمدة geom' },
      { labelAr: 'سلامة السجل', valueAr: 'Append-Only Audit Log محمي بالـ Constraints' }
    ],
    contentMarkdown: `### 5.1 الجداول الأساسية (Core Tables Schema)
تم تصميم الجداول مع الالتزام التام بالمعايير الجغرافية وقيود النزاهة المرجعية:

\`\`\`sql
-- 1. تفعيل امتدادات PostGIS و UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. جدول المستخدمين
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول التحذيرات الجوية الرئيسي
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. WAMS-SA-2026-0881
    headline_ar TEXT NOT NULL,
    headline_en TEXT,
    short_headline_ar VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    safety_instructions_ar TEXT NOT NULL,
    phenomenon VARCHAR(50) NOT NULL, -- heavy_rain, dust_storm, etc.
    severity VARCHAR(20) NOT NULL,   -- informational, minor, moderate, severe, extreme
    urgency VARCHAR(20) NOT NULL,    -- immediate, expected, future, past, unknown
    certainty VARCHAR(20) NOT NULL,  -- observed, likely, possible, unlikely, unknown
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    issuer_org VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    published_by UUID REFERENCES users(id),
    issued_at TIMESTAMPTZ NOT NULL,
    effective_at TIMESTAMPTZ NOT NULL,
    onset_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    current_version INT DEFAULT 1,
    cap_identifier VARCHAR(255),
    source_type VARCHAR(50) DEFAULT 'manual',
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (expires_at > effective_at)
);

-- 4. جدول المناطق الجغرافية للتحذير (PostGIS Spatial Table)
CREATE TABLE alert_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    area_desc_ar VARCHAR(255) NOT NULL,
    area_desc_en VARCHAR(255),
    area_type VARCHAR(20) NOT NULL, -- polygon, circle, admin_region
    geom GEOMETRY(Geometry, 4326) NOT NULL, -- WGS84 Spatial Data
    center_geom GEOMETRY(Point, 4326),
    radius_km NUMERIC(8,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهرس مكاني فائق السرعة
CREATE INDEX idx_alert_areas_geom ON alert_areas USING GIST (geom);

-- 5. جدول إصدارات التحذير (Version History)
CREATE TABLE alert_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    headline_ar TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    change_summary TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (alert_id, version_number)
);

-- 6. جدول طابور الإشعارات (Transactional Outbox)
CREATE TABLE notification_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'queued',
    recipients_count INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    retry_count INT DEFAULT 0,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. سجل التدقيق الأمني غير القابل للتعديل (Append-Only Audit Log)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(20) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\``
  },
  {
    id: 'rbac-matrix',
    number: 6,
    titleAr: 'مصفوفة الأدوار والصلاحيات (RBAC)',
    titleEn: 'Role-Based Access Control & Separation of Duties',
    summaryAr: 'هيكلة الأدوار السبعة والصلاحيات الـ 14 مع تفعيل مبدأ العينين الأربع (Four-Eyes Principle).',
    badge: 'الأمان والامتثال',
    highlights: [
      { labelAr: 'عدد الأدوار', valueAr: '7 أدوار وظيفية محددة بدقة' },
      { labelAr: 'عدد الصلاحيات', valueAr: '14 صلاحية دقيقة ومستقلة على الخادم' },
      { labelAr: 'مبدأ الفصل', valueAr: 'منع منشئ التحذير من اعتماده أو نشره' },
      { labelAr: 'سجل العمليات', valueAr: 'توثيق كل حركة بالهوية ورقم الإصدار والوقت' }
    ],
    contentMarkdown: `### 6.1 مصفوفة الصلاحيات حسب الأدوار
| الصلاحية / الدور | Super Admin | Admin | Creator | Reviewer | Approver | Publisher | Viewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **إنشاء التحذيرات الجوية** | نعم | نعم | نعم | لا | لا | لا | لا |
| **تعديل المسودات** | نعم | نعم | نعم | لا | لا | لا | لا |
| **إرسال للمراجعة** | نعم | نعم | نعم | لا | لا | لا | لا |
| **مراجعة وتدقيق التحذيرات** | نعم | نعم | لا | نعم | نعم | لا | لا |
| **اعتماد التحذير (Approve)** | نعم | لا | لا | لا | نعم | لا | لا |
| **نشر التحذير فوراً** | نعم | لا | لا | لا | لا | نعم | لا |
| **تحديث تحذير منشور** | نعم | لا | نعم* | لا | نعم | نعم | لا |
| **إلغاء تحذير منشور** | نعم | لا | لا | لا | نعم | نعم | لا |
| **إدارة مصادر CAP** | نعم | نعم | لا | لا | لا | لا | لا |
| **إدارة المناطق الإدارية** | نعم | نعم | لا | لا | لا | لا | لا |
| **إدارة المستخدمين** | نعم | نعم | لا | لا | لا | لا | لا |
| **الاطلاع على سجل التدقيق**| نعم | نعم | لا | لا | لا | لا | لا |
| **إدارة إعدادات النظام** | نعم | لا | لا | لا | لا | لا | لا |
| **عرض التحذيرات فقط** | نعم | نعم | نعم | نعم | نعم | نعم | نعم |

---

### 6.2 سياسة الفصل بين المهام (Separation of Duties Policy)
- عند تفعيل السياسة في الإعدادات:
  - **قيد رقم 1:** إذا كان \`alert.created_by == current_user.id\`، يُمنع المستخدم برمجياً على الـ Backend من استدعاء \`POST /api/alerts/:id/approve\` أو \`POST /api/alerts/:id/publish\`.
  - **قيد رقم 2:** المعتمد (Approver) لا يملك صلاحية النشر المباشر؛ النشر من اختصاص الناشر (Publisher) لضمان التحقق من جاهزية شبكة البث.`
  },
  {
    id: 'lifecycle',
    number: 7,
    titleAr: 'محرك دورة حياة التحذيرات (State Machine)',
    titleEn: 'Alert Finite State Machine & Version Control',
    summaryAr: 'آلة الحالات المحدودة وقواعد الانتقال الموثقة مع دعم الانتهاء الآلي والإصدارات التاريخية.',
    badge: 'دورة الحياة',
    highlights: [
      { labelAr: 'الحالات المعتمدة', valueAr: '9 حالات صارمة محكومة بالـ Backend' },
      { labelAr: 'منع النشر غير المعتمد', valueAr: 'حظر نشر أي مسودة أو تحذير قيد المراجعة' },
      { labelAr: 'الانتهاء الآلي', valueAr: 'عامل خلفي (Cron) يحول المنتهي لـ Expired' },
      { labelAr: 'إدارة الإصدارات', valueAr: 'الاحتفاظ بالإصدار السابق ونصه ومضلعاته بالكامل' }
    ],
    contentMarkdown: `### 7.1 مخطط الحالات والانتقالات (State Transitions)
\`\`\`
  [ Draft ] (إنشاء مسودة وتعديلها)
      │
      ▼ (submit_for_review)
  [ Pending Review ] (قيد المراجعة والتدقيق)
      │
      ▼ (approve)
  [ Approved ] (معتمد وجاهز)
      │
      ├───────────────────────┐
      ▼ (publish_now)         ▼ (schedule_publish)
  [ Published ]           [ Scheduled ]
      │                       │
      │ (effective_at reached)▼
      │ ◄─────────────────────┘
      │
      ├───────────────────────┬───────────────────────┐
      ▼ (update / escalate)   ▼ (cancel)              ▼ (expires_at passed)
  [ Updated ] (v2, v3...)  [ Cancelled ]           [ Expired ]
      │                       │                       │
      └───────────────────────┴───────────────────────┘
                              │
                              ▼ (archive_job)
                         [ Archived ]
\`\`\`

---

### 7.2 قيود التحقق البرمجية على الخادم (Backend Invariant Rules)
1. **Rule 1 (منع نشر المسودات):** التحويل إلى \`published\` لا يُقبل إلا إذا كانت الحالة السابقة \`approved\` أو \`scheduled\`.
2. **Rule 2 (منع النشر بعد انتهاء الصلاحية):** إذا كان \`NOW() > expires_at\`، يُرفض النشر برمز خطأ \`400 Bad Request - ALERT_EXPIRED\`.
3. **Rule 3 (حفظ الإصدارات):** عند تعديل أي تحذير بحالة \`published\`، يتم نسخ السجل الحالي بالكامل في جدول \`alert_versions\` مع زيادة \`version_number\` وتوثيق سبب التعديل.`
  },
  {
    id: 'api-specs',
    number: 8,
    titleAr: 'مواصفات واجهات البرمجة (API Design)',
    titleEn: 'Weather App Integration & Internal REST Endpoints',
    summaryAr: 'تصميم RESTful API نظيف وموثق تحت بادئة /api/v1 مع دعم الاستعلام المكاني GeoJSON والتخزين المؤقت.',
    badge: 'الربط والتكامل',
    highlights: [
      { labelAr: 'المسار العام', valueAr: '/api/v1/alerts (قراءة فقط للمنشورة والنشطة)' },
      { labelAr: 'الاستعلام المكاني', valueAr: 'GET /api/v1/alerts/nearby?lat=...&lon=...' },
      { labelAr: 'حماية البيانات', valueAr: 'حجب المسودات وسجلات التدقيق عن الـ API العامة' },
      { labelAr: 'التخزين المؤقت', valueAr: 'دعم رؤوس ETags و Cache-Control' }
    ],
    contentMarkdown: `### 8.1 نقاط النهاية لتطبيق الطقس (Public Weather App Endpoints)
جميع نقاط النهاية العامة تسترجع **التحذيرات المنشورة والنشطة فقط**:

- \`GET /api/v1/alerts/active\`
  - استرجاع جميع التحذيرات السارية حالياً بصيغة JSON مع ملخصات المناطق المتأثرة.
- \`GET /api/v1/alerts/nearby?lat=21.48&lon=39.19\`
  - استعلام مكاني (Spatial Query) بالـ PostGIS لإرجاع أي تحذير يتقاطع مضلعه الجغرافي مع إحداثيات المستخدم.
- \`GET /api/v1/alerts/region/{regionId}\`
  - استرجاع التحذيرات الخاصة بمحافظة أو مدينة محددة.
- \`GET /api/v1/alerts/{id}/geometry\`
  - استرجاع مضلعات GeoJSON الدقيقة لرسمها على خرائط تطبيق الطقس.
- \`GET /api/v1/health\`
  - فحص جاهزية الخادم وحالة الاتصال بقاعدة البيانات.

---

### 8.2 نقاط النهاية الإدارية لنظام WAMS (Protected Admin API)
تتطلب Bearer Token وصلاحيات RBAC محددة:
- \`POST /api/v1/admin/alerts\` (إنشاء مسودة)
- \`PUT /api/v1/admin/alerts/{id}\` (تحديث المسودة)
- \`POST /api/v1/admin/alerts/{id}/review\` (إرسال للمراجعة)
- \`POST /api/v1/admin/alerts/{id}/approve\` (اعتماد التحذير)
- \`POST /api/v1/admin/alerts/{id}/publish\` (نشر التحذير)
- \`POST /api/v1/admin/alerts/{id}/cancel\` (إلغاء التحذير)
- \`POST /api/v1/admin/cap/validate\` (فحص رسالة CAP 1.2 XML)
- \`POST /api/v1/admin/cap/import\` (استيراد وتحويل لمسودة)`
  },
  {
    id: 'test-plan',
    number: 9,
    titleAr: 'خطة الاختبارات وضمان الجودة (QA Plan)',
    titleEn: 'Comprehensive Verification & Test Suites',
    summaryAr: 'خطة اختبارات تفصيلية تشمل 22 سيناريو فعلياً من إنشاء التحذير وحتى فحص الـ CAP والاستعلام المكاني.',
    badge: 'الاختبارات والجودة',
    highlights: [
      { labelAr: 'عدد حزم الاختبار', valueAr: '22 حزمة اختبار فعلية ومقاسة' },
      { labelAr: 'مستويات الفحص', valueAr: 'Unit + Integration + Spatial GIS + Security' },
      { labelAr: 'اختبارات الـ CAP', valueAr: 'فحص مضلعات غير مغلقة وتواريخ سابقة ومعرفات خاطئة' },
      { labelAr: 'اختبار التزامن', valueAr: 'منع النشر المزدوج المتزامن (Race Conditions)' }
    ],
    contentMarkdown: `### 9.1 مصفوفة حزم الاختبار الـ 22 الإلزامية
1. **إنشاء التحذير:** التحقق من الحقول الإلزامية ودرجة الخطورة.
2. **تعديل التحذير:** التأكد من إمكانية تعديل المسودات وحظر تعديل المنشور بدون إصدار جديد.
3. **مراجعة التحذير:** التحقق من إجازة المسودة وتوثيق هوية المدقق.
4. **اعتماد التحذير:** تطبيق صلاحية الاعتماد وتوثيق وقت الاعتماد.
5. **النشر الفوري:** توليد سجل Outbox وتحديث الحالة إلى Published.
6. **الجدولة الزمنية:** التحقق من بقاء التحذير بحالة Scheduled حتى حلول وقت Onset.
7. **إلغاء التحذير:** تسجيل سبب الإلغاء وتوليد حدث Cancel لتطبيق الطقس.
8. **انتهاء الصلاحية الآلي:** اختبار عمل وظيفة Cron عند تجاوز expires_at.
9. **حفظ الإصدارات:** مقارنة snapshot الإصدار الأول بالإصدار الثاني بدقة 100%.
10. **استيراد CAP صحيح:** فحص وتحليل ملف XML متوافق مع CAP 1.2 بنجاح.
11. **رفض CAP غير صحيح:** التحقق من رفض XML ناقص أو غير مغلق مع كشف الأخطاء.
12. **معالجة Update و Cancel في CAP:** التحقق من ربط References بالمعرف الأصلي.
13. **صحة GeoJSON:** التحقق من صيغة المضلعات وإحداثيات WGS84.
14. **سلامة المضلعات Polygon Validity:** فحص عدم تقاطع المضلع مع نفسه عبر ST_IsValid.
15. **استعلام التحذيرات حسب الموقع:** اختبار دالة ST_Intersects مع إحداثيات داخل المضلع وخارجه.
16. **تداخل المناطق الجغرافية:** فحص التحذيرات المتزامنة لنفس المنطقة ودمج طبقات الخطورة.
17. **صلاحيات المستخدمين RBAC:** اختبار منع منشئ التحذير من اعتماده أو نشره.
18. **أمان الـ API العامة:** التأكد المطلق من عدم ظهور المسودات أو الملاحظات الداخلية لمستخدم تطبيق الطقس.
19. **منع تكرار الإشعارات:** اختبار طابور Outbox بضمان التسليم مرة واحدة فقط (Idempotency).
20. **معالجة فشل الإشعارات:** التحقق من استراتيجية إعادة المحاولة (Exponential Backoff).
21. **اختبار التزامن (Concurrency):** منع حدوث Race Conditions عند اعتماد نفس التحذير في نفس اللحظة.
22. **النسخ الاحتياطي والاستعادة:** التحقق من سلامة تصدير واسترجاع قاعدة بيانات PostgreSQL/PostGIS.`
  },
  {
    id: 'cost-estimate',
    number: 10,
    titleAr: 'تقدير التكاليف ومتطلبات التشغيل',
    titleEn: 'Cost Estimation & Local Zero-Cost Deployment',
    summaryAr: 'بيئة محلية مجانية 100% باستخدام Docker Compose مع خيارات الاستضافة السحابية الاقتصادية بدون قيود.',
    badge: 'التكلفة والتشغيل',
    highlights: [
      { labelAr: 'تكلفة التطوير المحلي', valueAr: '$0.00 (مجاني بالكامل عبر مفتوح المصدر)' },
      { labelAr: 'محرك الخرائط', valueAr: 'MapLibre GL + OpenStreetMap (بدون Google Maps)' },
      { labelAr: 'قاعدة البيانات', valueAr: 'PostgreSQL + PostGIS مفتوحة المصدر محلياً' },
      { labelAr: 'البطاقة المصرفية', valueAr: 'غير مطلوبة إطلاقاً لتشغيل النظام' }
    ],
    contentMarkdown: `### 10.1 التكلفة الصفرية أثناء التطوير (Zero-Cost Local Stack)
تم تصميم النظام ليعمل بالكامل على جهاز المطور أو خادم الأرصاد المحلي دون أي اشتراك مدفوع أو بطاقة مصرفية:

| المكون | التقنية المختارة | التكلفة | الملاحظات |
| :--- | :--- | :---: | :--- |
| **واجهة المستخدم** | React + Vite + Tailwind v4 | **$0** | مفتوح المصدر |
| **محرك الخادم** | Node.js + Express + TypeScript | **$0** | مفتوح المصدر |
| **قاعدة البيانات المكانية**| PostgreSQL 16 + PostGIS 3.4 | **$0** | تشغيل محلي عبر Docker |
| **محرك الخرائط والشرائح** | MapLibre GL + OSM Vector Tiles | **$0** | بديل مجاني واحترافي لـ Google Maps |
| **طابور المهام** | Transactional Outbox (Postgres) | **$0** | مدمج دون الحاجة لخدمات وسيطة مدفوعة |
| **إجمالي تكلفة التطوير** | **مفتوح المصدر بالكامل** | **$0.00** | **تشغيل محلي مجاني تماماً** |

---

### 10.2 ملف Docker Compose المقترح للتشغيل الفوري
\`\`\`yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:16-3.4-alpine
    container_name: wams-postgis
    environment:
      POSTGRES_DB: wams_db
      POSTGRES_USER: wams_user
      POSTGRES_PASSWORD: wams_local_dev_password
    ports:
      - "5432:5432"
    volumes:
      - wams_pgdata:/var/lib/postgresql/data

  backend:
    build: .
    container_name: wams-server
    environment:
      DATABASE_URL: postgres://wams_user:wams_local_dev_password@db:5432/wams_db
      PORT: 3000
      JWT_SECRET: wams_secure_dev_jwt_key_2026
    ports:
      - "3000:3000"
    depends_on:
      - db

volumes:
  wams_pgdata:
\`\`\``
  }
];
