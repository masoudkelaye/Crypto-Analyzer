# 🚀 راهنمای آپلود روی GitHub

## مرحله ۱: ساخت اکانت و Repository

1. برو به [github.com](https://github.com) و اکانت بساز (اگر نداری)
2. روی دکمه **New** (یا +) کلیک کن
3. اسم Repository رو بذار: `crypto-analyzer` (یا هرچی دوست داری)
4. توضیح بنویس: `Crypto Trading Analysis PWA`
5. تیک **Public** رو بزن
6. **نزن** "Add a README" (چون ما داریم)
7. کلیک کن **Create repository**

---

## مرحله ۲: آپلود با ترمینال

بعد از ساخت Repository، این دستورات رو بزن:

```bash
# برو داخل پوشه پروژه
cd crypto-analyzer

# Git رو شروع کن
git init

# همه فایل‌ها رو اضافه کن
git add .

# اولین commit
git commit -m "🚀 Initial commit: Crypto Analyzer Pro PWA"

# Branch اصلی رو name بده
git branch -M main

# Repository خودت رو لینک کن (USERNAME رو عوض کن)
git remote add origin https://github.com/USERNAME/crypto-analyzer.git

# آپلود کن!
git push -u origin main
```

> ⚠️ به جای `USERNAME` نام کاربری GitHub خودت رو بنویس

---

## مرحله ۳: فعال‌سازی GitHub Pages (برای آنلاین بودن سایت)

1. برو تو صفحه Repository تو GitHub
2. برو به **Settings** → **Pages**
3. از بخش **Source** انتخاب کن: **Deploy from a branch**
4. Branch: `main` و پوشه: `/ (root)` → **Save**
5. چند دقیقه صبر کن
6. سایتت آنلاین میشه: `https://USERNAME.github.io/crypto-analyzer/`

> 🔔 **نکته مهم**: برای کار کردن نوتیفیکیشن‌ها و PWA حتماً باید سایت HTTPS باشه که GitHub Pages خودش HTTPS داره ✅

---

## روش جایگزین: آپلود دستی (بدون ترمینال)

1. برو تو صفحه Repository تو GitHub
2. کلیک کن **uploading an existing file**
3. تمام فایل‌های داخل پوشه `crypto-analyzer` رو drag & drop کن
4. پیام commit بنویس: `Initial commit`
5. کلیک کن **Commit changes**

---

## 🌐 Deploy حرفه‌ای‌تر (اختیاری)

### Vercel (پیشنهادی - سریع‌ترین)
```bash
npm i -g vercel
cd crypto-analyzer
vercel
```
یا از سایت [vercel.com](https://vercel.com) ریپازیتوری GitHub رو import کن.

### Netlify
1. برو به [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. **Add new site** → **Import an existing project**
4. Repository رو انتخاب کن
5. تمام! خودکار deploy میشه

### Cloudflare Pages
1. برو به [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect to GitHub
3. Repository رو انتخاب کن
4. Build settings خالی بذار (static site هست)
5. Deploy

---

## 🔄 بروزرسانی پروژه

بعد از تغییرات، فقط این ۳ دستور رو بزن:

```bash
git add .
git commit -m "توضیح تغییرات"
git push
```

---

## 📝 دستورات مفید Git

| دستور | توضیح |
|-------|--------|
| `git status` | وضعیت فایل‌ها |
| `git log --oneline` | تاریخچه commit ها |
| `git pull` | دریافت آخرین تغییرات |
| `git branch` | لیست branch ها |
| `git diff` | تفاوت تغییرات |

---

## ✅ چک‌لیست نهایی

- [ ] اکانت GitHub ساختی
- [ ] Repository ساختی
- [ ] فایل‌ها push شدن
- [ ] GitHub Pages / Vercel / Netlify فعال شد
- [ ] سایت روی HTTPS باز میشه
- [ ] نوتیفیکیشن‌ها کار می‌کنن
- [ ] PWA قابل نصبه

موفق باشی! 🎉
