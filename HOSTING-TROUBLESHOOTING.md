# دليل حل مشاكل الاستضافة

## المتغيرات البيئية المطلوبة للاستضافة

يجب إضافة هذه المتغيرات في لوحة تحكم الاستضافة (Vercel/Railway/Netlify):

```env
# MongoDB Atlas Connection (مهم جداً!)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/modelsite?retryWrites=true&w=majority

# NextAuth - رابط الموقع الفعلي (بدون / في النهاية)
NEXTAUTH_URL=https://your-actual-domain.com

# NextAuth Secret - يجب أن يكون نفس المستخدم محلياً
NEXTAUTH_SECRET=xMjvrzbJYTfvwU6maa1TpD+wOZ6nQ9A+RJZXTdy+0Ac=

# تفعيل Trust Host للاستضافة
AUTH_TRUST_HOST=true

# البيئة
NODE_ENV=production
```

## خطوات التشخيص

### 1. التحقق من MongoDB Atlas

1. افتح [MongoDB Atlas](https://cloud.mongodb.com)
2. اذهب إلى **Network Access**
3. تأكد من إضافة `0.0.0.0/0` في IP Whitelist (للسماح بكل الاتصالات)
4. اذهب إلى **Database Access** وتأكد من وجود مستخدم بصلاحيات قراءة/كتابة

### 2. التحقق من Admin موجود في قاعدة البيانات

استخدم MongoDB Compass أو واجهة Atlas للتحقق من:

- هل يوجد مستخدم admin في collection `admins`؟
- هل البريد الإلكتروني صحيح؟
- هل كلمة المرور مشفرة بـ bcrypt؟

### 3. فحص Logs على الاستضافة

#### على Vercel:

1. اذهب إلى Dashboard > Project > Deployments
2. اختر آخر deployment
3. اضغط على "Runtime Logs"
4. ابحث عن الأخطاء عند محاولة تسجيل الدخول

#### على Railway:

1. اذهب إلى Project > Logs
2. راقب الـ logs أثناء محاولة تسجيل الدخول

### 4. اختبار API مباشرة

جرب استدعاء API التسجيل مباشرة:

```bash
curl -X POST https://your-domain.com/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

## الأخطاء الشائعة وحلولها

### خطأ: "No response" أو لا يحدث شيء

**السبب:** عادة مشكلة في:

1. MONGODB_URI غير صحيح
2. IP غير مسموح في MongoDB Atlas
3. NEXTAUTH_URL غير صحيح
4. NEXTAUTH_SECRET غير موجود

**الحل:**

- تحقق من جميع المتغيرات البيئية
- تأكد من `NEXTAUTH_URL` يطابق رابط موقعك بالضبط
- افتح Developer Tools > Console وشاهد الأخطاء

### خطأ: "Invalid email or password" (حتى مع بيانات صحيحة)

**السبب:** Admin غير موجود في قاعدة البيانات

**الحل:**

1. سجّل admin جديد عبر `/api/admin/register`
2. أو استورد بيانات من قاعدة البيانات المحلية

### خطأ: "Authentication failed"

**السبب:** مشكلة في الاتصال بقاعدة البيانات

**الحل:**

1. تحقق من صحة `MONGODB_URI`
2. تأكد من Network Access في MongoDB Atlas
3. شاهد الـ logs للحصول على تفاصيل أكثر

### Cookies لا تُحفظ

**السبب:** إعدادات الـ cookies خاطئة

**الحل:**

- تأكد من `useSecureCookies: true` في production
- تأكد من `NEXTAUTH_URL` يبدأ بـ `https://`
- بعض المتصفحات تحظر Third-party cookies

## اختبار محلي قبل الرفع

```bash
# 1. بناء المشروع
npm run build

# 2. تشغيل production محلياً
npm start

# 3. جرب تسجيل الدخول على localhost:3000
```

## إنشاء Admin جديد على الاستضافة

إذا لم يكن لديك admin:

```bash
# استخدم أداة مثل Postman أو curl
curl -X POST https://your-domain.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'
```

## Debug Mode

قمنا بتفعيل `debug: true` في NextAuth. شاهد logs الاستضافة لرؤية معلومات تفصيلية عن عملية المصادقة.

## الدعم

إذا استمرت المشكلة:

1. افتح Developer Console في المتصفح
2. راقب Network tab أثناء تسجيل الدخول
3. تحقق من Response من `/api/auth/callback/credentials`
4. شارك الأخطاء للحصول على مساعدة محددة
