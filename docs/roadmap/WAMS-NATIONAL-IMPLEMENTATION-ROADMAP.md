# خارطة التنفيذ الشاملة لمنظومة WAMS الوطنية
## WAMS National – 24-Phase Master Architecture & Implementation Roadmap

---

## 1. الهيكل العام لمراحل التنفيذ (Phases Overview)

تتكون خارطة التنفيذ من **24 مرحلة رئيسية** مقسمة على مسارات التحول الوطني:

```
+-----------------------------------------------------------------------------------+
|               WAMS NATIONAL ARCHITECTURE & ROADMAP LAYERS                         |
+-----------------------------------------------------------------------------------+
| Phase 0: Baseline Hardening, Security Sanitization & CI Verification              |
| Phase 1: National Multi-Hazard & CAP v1.2 Protocol Core Structure                |
| Phase 2: Microservices Backend & ASP.NET Core Foundation (Domain-Driven Design)   |
| Phase 3: Spatial Database Architecture (PostGIS Engine & Schema Governance)       |
| Phase 4: Zero-Trust Security, Identity & Role-Based Access Control (RBAC)         |
| Phase 5: Database-First Gemini AI Guardrails & Analytics Gateway                  |
| Phase 6: Immutable Hash-Chained Audit Logging & Compliance Ledger                 |
| Phase 7: National Meteorological & Climate Intelligence Core (Meteorology)        |
| Phase 8: Seismic & Tectonic Hazard Early Warning System                           |
| Phase 9: Wildfire Risk Assessment & Thermal Hotspot Monitoring (FWI)              |
| Phase 10: Hydrological Flash Flood & Landslide Warning System                     |
| Phase 11: Emergency Health Operations & Medical Evacuation Gateway                |
| Phase 12: Agricultural Resilience, Frost & Drought Management                     |
| Phase 13: Aviation Meteorology & Aerodrome Alerting (METAR/TAF/SIGMET)            |
| Phase 14: Maritime Safety, Coastal Surge & Port Operations                        |
| Phase 15: Road Safety, Highway Weather & Transport Operations                     |
| Phase 16: Industrial Hazards, CBRN & Chemical Contamination Tracking              |
| Phase 17: Critical Infrastructure Protection & Energy Grid Resilience             |
| Phase 18: Telecommunications Emergency Mesh & Mesh-Relay Nodes                   |
| Phase 19: Water Resources & Strategic Dam Cascade Safety                          |
| Phase 20: Civil Defense Operations, Mass Evacuation & Rescue Coordination         |
| Phase 21: Social Support, Shelter Allocation & Vulnerable Groups Operations       |
| Phase 22: Cascade Multi-Hazard Simulation & National Drill Engine                 |
| Phase 23: National Production Readiness, Accreditation & Sovereign Deployment    |
+-----------------------------------------------------------------------------------+
```

---

## 2. التفاصيل الفنية والتنفيذية لكل مرحلة

### المرحلة 0: التحصين الأساسي والتنظيف الأمني وتكامل CI
- **الهدف**: معالجة الثغرات الأمنية الحرجة في الكود الحالي، تنظيف مدخلات XSS، إزالة المفاتيح والرموز الاستاتيكية، وضمان عمل اختبارات CI ونموذج البناء الخالي من الأخطاء.
- **مخرجات المرحلة**:
  - تطهير الواجهات واستخدام `DOMPurify` لضمان الحماية من XSS.
  - إزالة أي مسارات اختبار غير محمية.
  - تشغيل واستقرار جناح الاختبارات Vitest.

### المرحلة 1: بنية تحذيرات CAP v1.2 وإدارة المخاطر المتعددة
- **الهدف**: تثبيت معيار ITU-T X.1303 / CAP 1.2 كمعيار وطني موحد لإنشاء ونشر التحذيرات.
- **مخرجات المرحلة**:
  - نموذج بيانات CAP v1.2 (Identifier, Sender, Status, MsgType, Scope, Info Blocks).
  - دعم وسوم التوزيع الجغرافي الخرائطي (Polygons, Circles, Geocodes).

### المرحلة 2: الخدمات المصغرة ونواة ASP.NET Core (.NET 9)
- **الهدف**: إعداد تصميم النظام الخلفي الموزع القابل للتوسع باستقلالية تامة.
- **مخرجات المرحلة**:
  - تصميم الطبقات (API Gateway, Core Domain Services, Data Persistence).
  - عقود OpenAPI / Swagger لكل خدمة.

### المرحلة 3: قواعد البيانات الجغرافية PostGIS وSchema Governance
- **الهدف**: تصميم مخطط البيانات المكاني وتوسعات PostGIS لتغطية كافة الخرائط والمخاطر الوطنية.
- **مخرجات المرحلة**:
  - جداول `wams_alerts_geo`, `wams_stations`, `wams_hazards`, `wams_audit_logs`.
  - الفهارس المكانية `GIST` للقياسات والاستعلامات فائقة السرعة.

### المرحلة 4: الهوية المؤسسية والتحكم بالوصول المبني على الأدوار (Zero-Trust RBAC)
- **الهدف**: بناء نظام أمان شامل ذو اعتمادية عالية وصلاحيات موحدة عبر الوزارات والقطاعات.
- **مخرجات المرحلة**:
  - الأدوار: `NationalAdmin`, `MetOfficer`, `CivilDefenseCmd`, `HealthOp`, `SeismicAnalyst`, `PublicViewer`.
  - سياسات الوصول المشفر بالرموز والتفويض النقطي (Attribute-Based Access Control).

### المرحلة 5: محرك الذكاء الاصطناعي Gemini المستند إلى قواعد البيانات (Database-First AI)
- **الهدف**: ربط بوابة الذكاء الاصطناعي Gemini بقواعد البيانات المعتمدة مع تطبيق قيود عدم الهلوسة.
- **مخرجات المرحلة**:
  - محرك التحقق من الحقائق (Grounding Validator Engine).
  - فصل البيانات الحقيقية عن البيانات المحاكاة بصرياً وفي قواعد البيانات.

### المرحلة 6: سجل التدقيق المحصن بسلسلة الهاش (Hash-Chained Audit Ledger)
- **الهدف**: توثيق جميع التغييرات وإصدارات التحذيرات بسلسلة هاش مشفرة لمنع التلاعب.
- **مخرجات المرحلة**:
  - جدولة `AuditLogEntry` مع وسم SHA-256 للكتلة السابقة والكتلة الحالية.

### المراحل 7 إلى 21: الأنظمة القطاعية التخصصية (Sector-Specific Systems)
تغطي جميع القطاعات الـ 16 المحددة في وثيقة المتطلبات، حيث تحصل كل جهة حكومية على لوحة قيادة متخصصة، أدوات استعلام جغرافية، ونظام تنبيه مبكر فوري مرتبط بنواة CAP v1.2 الوطنية.

### المرحلة 22: محرك المحاكاة الوطنية للمخاطر المتسلسلة (Cascade Multi-Hazard Drill Engine)
- **الهدف**: إمكانية تنشيط سيناريوهات كوارث مركبة (مثل: زلزال متبوع بانهيار سد وحريق صناعي) لاختبار جاهزية الوزارات.

### المرحلة 23: الجاهزية الوطنية للاعتتماد والتشغيل السيادي (Sovereign Production Readiness)
- **الهدف**: إجراء الفحوصات النهائية للأمان، والاعتماد الفني، وتأكيد التوافق التام مع كافة المعايير الوطنية.

---

## 3. منهجية الضبط والتنفيذ (Execution Protocol)
- تنفذ المهام خطوة بخطوة وفق مبدأ **"طلب واحد في كل مرة"**.
- يتم تقديم تقرير فني وافٍ مع طلب الموافقة قبل الانتقال إلى أي خطوة برمجية جديدة.
