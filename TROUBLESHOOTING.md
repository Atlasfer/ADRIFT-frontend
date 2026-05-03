# Troubleshooting Guide - ADRIFT Frontend

## ❌ Problem: Dashboard tidak bisa dibuka (`/dashboard`)

### Solusi 1: Restart Development Server

```bash
# Stop server (Ctrl+C di terminal)
# Kemudian start ulang:
npm run dev
```

### Solusi 2: Clear Cache & Restart

```bash
# Stop server
# Hapus folder .next
rm -rf .next

# Atau di Windows PowerShell:
Remove-Item -Recurse -Force .next

# Start ulang
npm run dev
```

### Solusi 3: Clear Browser Cache & LocalStorage

1. Buka DevTools (F12)
2. Application tab → Storage → Clear site data
3. Atau manual:
   - Local Storage → Hapus `adrift-auth`
   - Session Storage → Clear all
   - Cookies → Clear all
4. Refresh browser (Ctrl+Shift+R)

### Solusi 4: Cek Login Status

Dashboard hanya bisa diakses jika:
- ✅ User sudah login
- ✅ User role = "STUDENT"

**Cara cek:**
1. Buka DevTools (F12)
2. Console tab
3. Ketik: `localStorage.getItem('adrift-auth')`
4. Lihat apakah ada token dan user data

**Jika tidak ada atau expired:**
```
1. Logout (jika ada button)
2. Clear localStorage
3. Login ulang di /auth/login
```

### Solusi 5: Cek Console Error

1. Buka DevTools (F12)
2. Console tab
3. Lihat apakah ada error merah
4. Screenshot dan share error jika ada

### Solusi 6: Reinstall Dependencies

```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Atau di Windows PowerShell:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Install ulang
npm install

# Start server
npm run dev
```

---

## ❌ Problem: Infinite Loading di Dashboard

### Penyebab:
- API `/api/auth/me` tidak response
- Token expired
- Backend tidak running

### Solusi:

**1. Cek Backend Running**
```bash
# Pastikan backend berjalan di port yang benar
# Cek di .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**2. Test API Manual**
```bash
# Buka terminal baru
# Test API dengan curl:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/auth/me
```

**3. Cek Network Tab**
1. Buka DevTools (F12)
2. Network tab
3. Refresh halaman
4. Lihat request ke `/api/auth/me`
5. Cek status code:
   - 200 = OK
   - 401 = Token expired (login ulang)
   - 500 = Backend error
   - Failed = Backend tidak running

---

## ❌ Problem: Redirect Loop (Login → Dashboard → Login)

### Penyebab:
- Token tidak tersimpan di localStorage
- Layout protection redirect terus menerus

### Solusi:

**1. Cek Token Tersimpan**
```javascript
// Di Console DevTools:
localStorage.getItem('adrift-auth')
```

**2. Cek Zustand Store**
```javascript
// Di Console DevTools:
// Lihat apakah user dan token ada
```

**3. Disable Layout Protection Sementara**
Edit `src/app/(student)/layout.tsx`:
```typescript
// Comment out redirect sementara untuk debug:
// useEffect(() => {
//   if (!isAuthenticated) {
//     router.push("/auth/login");
//   }
// }, [isAuthenticated, router]);
```

---

## ❌ Problem: 404 Not Found di `/dashboard`

### Penyebab:
- File `src/app/(student)/dashboard/page.tsx` tidak ada
- Folder structure salah
- Next.js cache issue

### Solusi:

**1. Cek File Ada**
```bash
# Cek apakah file ada:
ls src/app/\(student\)/dashboard/page.tsx

# Atau di Windows:
dir src\app\(student)\dashboard\page.tsx
```

**2. Cek Folder Structure**
```
src/app/
├── (student)/          ← Harus ada kurung!
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
```

**3. Rebuild**
```bash
# Stop server
# Hapus .next
rm -rf .next

# Start ulang
npm run dev
```

---

## ❌ Problem: Blank Page / White Screen

### Solusi:

**1. Cek Console Error**
- Buka DevTools (F12)
- Lihat Console tab
- Screenshot error jika ada

**2. Cek React Error Overlay**
- Next.js biasanya menampilkan error overlay merah
- Baca error message
- Fix sesuai error

**3. Cek Component Render**
```typescript
// Tambahkan console.log di dashboard:
export default function DashboardPage() {
  console.log('Dashboard rendering...');
  const { user } = useAuthStore();
  console.log('User:', user);
  // ...
}
```

---

## ✅ Checklist Debugging

Sebelum report issue, pastikan sudah coba:

- [ ] Restart development server
- [ ] Clear .next folder
- [ ] Clear browser cache & localStorage
- [ ] Login ulang
- [ ] Cek console error
- [ ] Cek network tab
- [ ] Cek backend running
- [ ] Cek file structure
- [ ] Reinstall dependencies

---

## 🆘 Masih Bermasalah?

Jika sudah coba semua solusi di atas tapi masih error:

1. **Screenshot:**
   - Console error (F12 → Console)
   - Network tab (F12 → Network)
   - Error overlay (jika ada)

2. **Info Environment:**
   - Node version: `node -v`
   - NPM version: `npm -v`
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/Safari

3. **Share:**
   - Error message lengkap
   - Steps to reproduce
   - Expected vs Actual behavior

---

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Clear cache
rm -rf .next

# Reinstall
rm -rf node_modules package-lock.json && npm install

# Check port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux
```

---

## 🎯 Expected Behavior

**Setelah login sebagai STUDENT:**
1. Redirect ke `/dashboard`
2. Lihat sidebar kiri dengan logo ADRIFT
3. Lihat konten dashboard:
   - Welcome message
   - Quick stats
   - Quick access cards
4. Bisa klik menu navigasi
5. Bisa logout

**URL yang benar:**
- ✅ `http://localhost:3000/dashboard`
- ❌ `http://localhost:3000/student`
- ❌ `http://localhost:3000/student/dashboard`
