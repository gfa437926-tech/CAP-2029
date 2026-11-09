# مخطط قاعدة البيانات المكانية والتسلسل الهيكلي لمنظومة WAMS الوطنية
## WAMS National – Spatial PostGIS Database Schema & Data Dictionary (ERD-2029)

---

## 1. التقديم والمبادئ الأساسية
تصف هذه الوثيقة المخطط الهيكلي لقاعدة البيانات المكانيّة **PostgreSQL / PostGIS** المعتمَدة لمنظومة WAMS الوطنية.

### قواعد الحوكمة والأمان الصارمة:
1. **لا يجوز تنفيذ أية عملية Migration أو DROP أو TRUNCATE تلقائياً على جداول الإنتاج**.
2. **البيانات التشغيلية هي المصدر الوحيد للحقائق (Database-First)**.
3. **التكامل مع الأنظمة الأخرى يتم عبر APIs موثقة مع الحفاظ على استقلالية WAMS التامة**.

---

## 2. الامتدادات المكانية القياسية (PostGIS Extensions)
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

---

## 3. توصيف الجداول المكانية الرئيسية (Data Dictionary)

### 3.1 جدول التحذيرات المكانية الوطنية (`wams_alerts_geo`)
| اسم الحقل | النوع | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` | المعرف الفريد للتنبيه |
| `alert_code` | `VARCHAR(64)` | `UNIQUE, NOT NULL` | رمز التحذير الوطني القياسي |
| `cap_identifier` | `VARCHAR(128)` | `UNIQUE, NOT NULL` | المعرف الدولي المعتمد لـ CAP 1.2 |
| `phenomenon` | `VARCHAR(32)` | `NOT NULL` | نوع الظاهرة أو الخطر الطبيعي/التقني |
| `severity` | `VARCHAR(16)` | `NOT NULL` | درجة الخطورة (extreme, severe, moderate, minor, info) |
| `urgency` | `VARCHAR(16)` | `NOT NULL` | العجلة والمدى الزمني |
| `certainty` | `VARCHAR(16)` | `NOT NULL` | مستوى التأكد العلمي |
| `status` | `VARCHAR(16)` | `NOT NULL` | حالة التحذير (published, updated, cancelled, draft) |
| `issuer_org` | `VARCHAR(128)` | `NOT NULL` | الجهة الحكومية المصدِرة |
| `clearance_level` | `VARCHAR(16)` | `NOT NULL, DEFAULT 'restricted'` | مستوى التصريح الأمني (public, restricted, sensitive, top_secret) |
| `affected_polygon` | `GEOMETRY(Polygon, 4326)` | `GIST INDEX` | المضلع المكاني للرقعة المتأثرة بالتحذير |
| `headline_ar` | `TEXT` | `NOT NULL` | عنوان التحذير باللغة العربية |
| `description_ar` | `TEXT` | `NOT NULL` | الشرح التفصيلي للتحذير |
| `instructions_ar` | `TEXT` | `NOT NULL` | تعليمات وإرشادات السلامة العامة |
| `issued_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | تاريخ وساعة الإصدار |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | تاريخ وساعة انتهاء الصلاحية |

### 3.2 جدول محطات الرصد والقياس المكانية (`wams_stations_geo`)
| اسم الحقل | النوع | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `station_id` | `VARCHAR(32)` | `PRIMARY KEY` | معرف المحطة الأوتوماتيكية |
| `name_ar` | `VARCHAR(128)` | `NOT NULL` | اسم المحطة باللغة العربية |
| `governorate` | `VARCHAR(32)` | `NOT NULL` | المحافظة التابعة لها المحطة |
| `location` | `GEOMETRY(Point, 4326)` | `GIST INDEX` | الموقع الجغرافي بالـ Lat/Lng |
| `elevation_m` | `NUMERIC(6,2)` | `NOT NULL` | الارتفاع عن سطح البحر بالأمتار |
| `sensor_health` | `VARCHAR(16)` | `NOT NULL, DEFAULT 'optimal'` | حالة سلامة المعايرة والحساسات |

### 3.3 جدول سجل التدقيق المحصن تشفيرياً (`wams_audit_ledger`)
| اسم الحقل | النوع | القيود | الوصف |
| :--- | :--- | :--- | :--- |
| `entry_id` | `UUID` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` | معرف كتلة التدقيق |
| `timestamp` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | التاريخ والوقت بدقة الميكروثانية |
| `actor_id` | `VARCHAR(64)` | `NOT NULL` | هوية المستخدم أو المشغل |
| `action_type` | `VARCHAR(64)` | `NOT NULL` | نوع العملية (CREATE_ALERT, UPDATE_STATUS, ACCESS_AI) |
| `previous_hash` | `VARCHAR(64)` | `NOT NULL` | هاش SHA-256 للكتلة السابقة |
| `entry_hash` | `VARCHAR(64)` | `NOT NULL` | هاش SHA-256 للكتلة الحالية |

---

## 4. مصفوفة الصلاحيات والأدوار الـ 23 الوطنية (RBAC Authorization Matrix)
تضمن المنظومة التحكم الصارم في الوصول عبر 23 دوراً مؤسسياً:

1. `NationalAdministrator` (صلاحيات شاملة)
2. `NationalOperationsManager` (قيادة العمليات الوطنية)
3. `MeteorologicalSpecialist` (الأرصاد الجوية)
4. `ClimateResearcher` (الأبحاث المناخية)
5. `SeismicSpecialist` (الرصد الجيولوجي والإنذار الزلزالي)
6. `WildfireOperationsOfficer` (إدارة حرائق الغابات)
7. `EmergencyResponseManager` (إدارة الاستجابة للطوارئ)
8. `CivilDefenseOfficer` (الدفاع المدني والإنقاذ)
9. `HealthSectorOfficer` (القطاع الصحي والطبي)
10. `AgriculturalSectorOfficer` (القطاع الزراعي والأمن الغذائي)
11. `AviationOfficer` (أرصاد وسلطات الطيران المدني)
12. `PortOperationsOfficer` (الموانئ والسلامة البحرية)
13. `TransportationOfficer` (المرور والطرق السريعة)
14. `InfrastructureOperator` (البنية التحتية)
15. `RegionalOperationsManager` (إدارة العمليات الإقليمية)
16. `GovernorateOfficer` (مسؤول المحافظة)
17. `StationManager` (مدير شبكة المحطات)
18. `StationObserver` (راصد محطة)
19. `FieldTeamMember` (عضو الفريق الميداني)
20. `DataAnalyst` (محلل بيانات)
21. `Researcher` (باحث علمي)
22. `Auditor` (مدقق أمني)
23. `PublicUser` (عرض البيانات العامة فقط)

---

## 5. الاعتماد والحفظ
يتم حفظ هذا المخطط كمرجع هندسي للتطوير المستقبلي دون تطبيق أي تعديل قسري على قواعد البيانات القائمة.
