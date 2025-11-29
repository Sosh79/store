# دليل النشر (Deployment Guide)

تم تحديث المشروع ليكون متوافقاً مع أي دومين. لم يعد يعتمد على `localhost:3000` ويمكن نشره على أي استضافة.

## التغييرات المطبقة

1. **إزالة الاعتماد على localhost**: تم تحديث `app/about/page.tsx` لاستخدام قاعدة البيانات مباشرة بدلاً من fetch إلى localhost
2. **استخدام المسارات النسبية**: جميع الصفحات الأخرى تستخدم مسارات نسبية (`/api/...`) التي تعمل تلقائياً مع أي دومين
3. **Server Components**: الصفحات تستخدم Server Components للوصول المباشر لقاعدة البيانات

## متطلبات النشر

### 1. متغيرات البيئة (Environment Variables)

عند نشر المشروع على أي استضافة، تأكد من إضافة المتغيرات التالية:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.com

# Optional: Node Environment
NODE_ENV=production
```

#### ملاحظات مهمة:

- `MONGODB_URI`: رابط الاتصال بقاعدة بيانات MongoDB (يفضل استخدام MongoDB Atlas)
- `NEXTAUTH_SECRET`: مفتاح سري لـ NextAuth (يمكن توليده بالأمر `openssl rand -base64 32`)
- `NEXTAUTH_URL`: رابط موقعك الفعلي (مثل: https://yourdomain.com)

### 2. منصات الاستضافة المدعومة

#### أ) Vercel (موصى به لـ Next.js)

1. قم بإنشاء حساب على [Vercel](https://vercel.com)
2. ربط المستودع من GitHub
3. إضافة متغيرات البيئة في لوحة التحكم
4. النشر سيتم تلقائياً

```bash
# أو استخدم CLI
npm i -g vercel
vercel login
vercel --prod
```

#### ب) Netlify

1. قم بإنشاء حساب على [Netlify](https://netlify.com)
2. ربط المستودع من GitHub
3. تعيين Build Command: `npm run build`
4. تعيين Publish directory: `.next`
5. إضافة متغيرات البيئة

#### ج) Railway

1. قم بإنشاء حساب على [Railway](https://railway.app)
2. إنشاء مشروع جديد من GitHub
3. إضافة متغيرات البيئة
4. Railway سيكتشف Next.js تلقائياً

#### د) DigitalOcean App Platform

1. قم بإنشاء حساب على [DigitalOcean](https://www.digitalocean.com)
2. إنشاء App جديد من GitHub
3. إضافة متغيرات البيئة
4. تحديد نوع التطبيق: Web Service

#### هـ) استضافة مخصصة (VPS)

إذا كنت تستخدم VPS خاص:

```bash
# 1. رفع الملفات إلى السيرفر
git clone your-repo-url
cd modelSite

# 2. تثبيت التبعيات
npm install

# 3. بناء المشروع
npm run build

# 4. تشغيل المشروع
npm start
```

يمكن استخدام PM2 لإدارة التطبيق:

```bash
npm install -g pm2
pm2 start npm --name "modelsite" -- start
pm2 save
pm2 startup
```

### 3. إعداد قاعدة البيانات

#### MongoDB Atlas (موصى به)

1. قم بإنشاء حساب على [MongoDB Atlas](https://www.mongodb.com/atlas)
2. إنشاء Cluster جديد
3. إنشاء Database User
4. إضافة IP Address إلى Whitelist (استخدم `0.0.0.0/0` للسماح لجميع IPs)
5. نسخ Connection String
6. استبدل `<username>` و `<password>` في Connection String

### 4. النطاق المخصص (Custom Domain)

بعد النشر:

1. احصل على عنوان IP أو CNAME من منصة الاستضافة
2. في إعدادات النطاق، أضف DNS records:
   - Type: A Record
   - Name: @ (للدومين الرئيسي) أو www
   - Value: IP Address الخاص بك
3. انتظر حتى ينتشر DNS (قد يستغرق حتى 48 ساعة)

### 5. اختبار النشر

بعد النشر، تأكد من:

- ✅ الصفحة الرئيسية تعمل
- ✅ صفحة About تعمل
- ✅ صفحة Services تعرض الخدمات
- ✅ صفحة Contact تعمل
- ✅ لوحة الإدارة تعمل ويمكن تسجيل الدخول
- ✅ الصور تُحمّل بشكل صحيح
- ✅ قاعدة البيانات متصلة

### 6. الأمان

تأكد من:

- ✅ لا تشارك `NEXTAUTH_SECRET` مع أي شخص
- ✅ استخدم كلمات مرور قوية لقاعدة البيانات
- ✅ قم بتفعيل HTTPS (SSL/TLS)
- ✅ حدث التبعيات بشكل دوري
- ✅ لا تنشر ملف `.env` على GitHub

## استكشاف الأخطاء

### مشكلة: لا يمكن الاتصال بقاعدة البيانات

- تحقق من صحة `MONGODB_URI`
- تأكد من إضافة IP Address إلى MongoDB Atlas Whitelist
- تحقق من اسم المستخدم وكلمة المرور

### مشكلة: خطأ في تسجيل الدخول (NextAuth)

- تحقق من `NEXTAUTH_SECRET`
- تأكد من تعيين `NEXTAUTH_URL` إلى الرابط الصحيح
- تحقق من اتصال قاعدة البيانات

### مشكلة: الصور لا تظهر

- تحقق من `next.config.ts` يسمح بروابط الصور
- تأكد من صحة روابط الصور

## الدعم

إذا واجهت أي مشاكل، راجع:

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## ملاحظات إضافية

- المشروع الآن جاهز للنشر ولا يحتوي على أي إشارات لـ localhost
- جميع API endpoints تستخدم مسارات نسبية
- Server Components تتصل مباشرة بقاعدة البيانات
- التطبيق متوافق مع جميع منصات استضافة Next.js
