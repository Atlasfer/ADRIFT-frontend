# Git Commit Guide - Student Portal Feature

## ✅ FILES YANG SUDAH DIBUAT

Semua file sudah tersimpan di folder `src/app/(student)/`:

```
src/app/(student)/
├── layout.tsx                          ✅ BARU
├── dashboard/
│   └── page.tsx                        ✅ BARU
├── frs-simulator/
│   └── page.tsx                        ✅ BARU
├── skill-tree/
│   ├── page.tsx                        ✅ BARU
│   └── progress/
│       └── page.tsx                    ✅ BARU
└── profile/
    └── page.tsx                        ✅ SUDAH ADA
```

## 🚀 CARA COMMIT & PUSH KE GITHUB

### Step 1: Cek Status
```bash
git status
```

**Harusnya muncul:**
```
new file:   src/app/(student)/layout.tsx
new file:   src/app/(student)/dashboard/page.tsx
new file:   src/app/(student)/frs-simulator/page.tsx
new file:   src/app/(student)/skill-tree/page.tsx
new file:   src/app/(student)/skill-tree/progress/page.tsx
modified:   src/app/auth/login/page.tsx
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Commit
```bash
git commit -m "feat: add student portal with sidebar navigation

- Add student layout with sidebar (same design as admin)
- Add dashboard page with welcome and quick access
- Add FRS simulator page
- Add skill tree pages (view and progress)
- Add profile page (view and update)
- Fix login redirect to /dashboard
- Add logout functionality
- Add navigation menu (Dashboard, FRS, Skill Tree, Profile)
"
```

### Step 4: Push
```bash
git push origin feature-file-admin
```

## ✅ FITUR YANG SUDAH LENGKAP

### 1. **Login & Redirect** ✅
- Login sebagai STUDENT → redirect ke `/dashboard`
- Login sebagai ADMIN → redirect ke `/admin`

### 2. **Sidebar Navigation** ✅
- Logo ADRIFT dengan badge "Student"
- Menu: Dashboard, FRS Simulator, Skill Tree, Profile
- User info dengan NRP
- Tombol Logout

### 3. **Dashboard** ✅
- Welcome message
- Quick stats (Tahun Angkatan, Status, Role)
- Quick access cards
- Info ADRIFT

### 4. **FRS Simulator** ✅
- Filter jadwal
- List jadwal
- Selected panel
- Save plans
- Alternative plans

### 5. **Skill Tree** ✅
- View curriculum graph
- Progress tracking
- Claim/unclaim courses

### 6. **Profile** ✅
- View profile info
- Edit: nama, NRP, tahun angkatan
- Email read-only
- Form validation
- Success/error notifications

### 7. **Logout** ✅
- Button di sidebar
- Clear token
- Redirect ke login

## 📋 CHECKLIST SEBELUM PUSH

- [x] Semua file sudah dibuat
- [x] Login redirect ke `/dashboard`
- [x] Sidebar dengan navigasi lengkap
- [x] Logout button berfungsi
- [x] Profile page bisa edit
- [x] FRS Simulator berfungsi
- [x] Skill Tree berfungsi

## 🎯 TESTING SETELAH PUSH

### 1. Pull di Device Lain
```bash
git pull origin feature-file-admin
```

### 2. Install Dependencies (jika perlu)
```bash
npm install
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Test Login
```
http://localhost:3000/auth/login
```

### 5. Test Features
- ✅ Login → Redirect ke `/dashboard`
- ✅ Sidebar muncul dengan menu lengkap
- ✅ Klik Dashboard → Lihat beranda
- ✅ Klik FRS Simulator → Simulasi FRS
- ✅ Klik Skill Tree → Visualisasi kurikulum
- ✅ Klik Profile → Edit profile
- ✅ Klik Logout → Redirect ke login

## 🐛 TROUBLESHOOTING

### Problem: Git tidak detect perubahan
**Solusi:**
```bash
# Cek apakah file benar-benar ada
ls src/app/(student)

# Jika ada, force add
git add -f src/app/(student)/*

# Commit
git commit -m "add student portal"

# Push
git push origin feature-file-admin
```

### Problem: Folder (student) tidak muncul di GitHub
**Penyebab:** Folder dengan kurung `()` kadang bermasalah di Windows

**Solusi:**
```bash
# Escape kurung dengan backslash
git add "src/app/(student)/*"

# Atau gunakan quotes
git add 'src/app/(student)/*'
```

### Problem: File sudah di-commit tapi tidak muncul di GitHub
**Solusi:**
```bash
# Cek remote
git remote -v

# Pastikan push ke branch yang benar
git push origin feature-file-admin

# Jika masih gagal, force push
git push -f origin feature-file-admin
```

## 📞 QUICK COMMANDS

```bash
# Cek status
git status

# Add all
git add .

# Commit
git commit -m "add student portal"

# Push
git push origin feature-file-admin

# Pull (di device lain)
git pull origin feature-file-admin

# Cek branch
git branch

# Switch branch
git checkout feature-file-admin
```

## ✅ EXPECTED RESULT

Setelah push berhasil, teman Anda harus bisa:

1. **Pull branch:**
   ```bash
   git pull origin feature-file-admin
   ```

2. **Lihat file baru:**
   ```
   src/app/(student)/
   ├── layout.tsx
   ├── dashboard/page.tsx
   ├── frs-simulator/page.tsx
   ├── skill-tree/page.tsx
   ├── skill-tree/progress/page.tsx
   └── profile/page.tsx
   ```

3. **Run aplikasi:**
   ```bash
   npm run dev
   ```

4. **Test semua fitur:**
   - Login → Dashboard
   - Navigasi sidebar
   - FRS Simulator
   - Skill Tree
   - Profile
   - Logout

## 🎉 SELESAI!

Semua file sudah dibuat dan siap di-push ke GitHub!

**Ketik command ini sekarang:**
```bash
git status
git add .
git commit -m "feat: add complete student portal with sidebar navigation"
git push origin feature-file-admin
```

Good luck! 🚀
