# LeadFlow Deployment Guide

## الملفات:
- `widget/` - موقع العملاء (عام)
- `admin/` - نظام الإدارة (محمي بالدخول)

## النشر على Vercel:

### 1. Widget (الموقع العام):
```bash
cd deploy/widget
vercel --prod
```

### 2. Admin (نظام الإدارة):
```bash
cd deploy/admin
vercel --prod
```

## إعداد Supabase Auth:

### 1. إنشاء مستخدم أولي:
- افتح Supabase Dashboard → Authentication → Users
- اضغط "Add user"
- البريد: admin@mydtfstore.com
- كلمة المرور: (اختر كلمة قوية)

### 2. تفعيل RLS:
- تأكد من تفعيل Row Level Security
- السياسات مضمنة في `supabase-schema.sql`

## الأمان:
- ✅ تسجيل الدخول مطلوب للنظام
- ✅ service_role key غير موجود في الكود الأمامي
- ✅ Headers أمان مضمنة
- ✅ CORS مضبوط
- ✅ HTTPS إجباري

## الروابط النهائية:
- Widget: `https://your-project.vercel.app`
- Admin: `https://your-admin.vercel.app/login.html`
