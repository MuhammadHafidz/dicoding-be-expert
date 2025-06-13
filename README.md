# dicoding-be-expert

[![CI](https://github.com/MuhammadHafidz/dicoding-be-expert/actions/workflows/ci.yml/badge.svg)](https://github.com/MuhammadHafidz/dicoding-be-expert/actions/workflows/ci.yml) [![CI](https://github.com/MuhammadHafidz/dicoding-be-expert/actions/workflows/cd.yml/badge.svg)](https://github.com/MuhammadHafidz/dicoding-be-expert/actions/workflows/cd.yml)

📦 Submission proyek untuk kelas **Menjadi Back-End Developer Expert dengan JavaScript** dari [Dicoding](https://www.dicoding.com/).

---

## ✨ Fitur

- 🔐 Autentikasi pengguna dengan JWT
- 🧵 Kelola thread dan komentar
- 💬 Balasan komentar (reply)
- ❤️ Toggle like/unlike komentar
- 🚦 Rate limit 90 request/menit untuk `/threads` via NGINX
- 🧪 Unit & integration test dengan Jest + Hapi
- ✅ CI/CD dengan GitHub Actions

---

## 🚀 Cara Menjalankan Proyek

### 1. Clone repository

```bash
git clone https://github.com/MuhammadHafidz/dicoding-be-expert.git
cd dicoding-be-expert
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables (opsional)
```ini
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGUSER=user
PGHOST=localhost
PGPASSWORD=supersecret
PGDATABASE=db_name
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=user
PGDATABASE_TEST=db_name_test
PGPASSWORD_TEST=supersecret
PGPORT_TEST=5432


# TOKENIZE
ACCESS_TOKEN_KEY=anystring
REFRESH_TOKEN_KEY=anystring
ACCCESS_TOKEN_AGE=3000
```
dan di `config/database/test.json`

```json
{
  "user": "user",
  "password": "supersecret",
  "host": "localhost",
  "port": 5432,
  "database": "db_name_test"
}
```

### 4. Jalankan Migrasi DB

```bash
npm run migrate up 
npm run migrate:test up
```

### 5. Jalankan Pengujian

```bash
npm run test
## Selebihnya cek di package.json
```

### 6. Jalankan Aplikas

```bash
## Development dengan Nodemon
npm run start:dev

## Production
npm run start
```
## ⚙️ CI/CD - GitHub Actions

CI otomatis dijalankan setiap ada `pull request` ke branch `main`:

- Menggunakan PostgreSQL service dan Node.js matrix (`20.x`, `22.x`)
- Langkah:

  - `npm install`
  - `npm run migrate up`
  - `npm test`

**File konfigurasi CI:** `.github/workflows/ci.yml`

## 🧱 Struktur Proyek

```bash
├── src/                        # source code utama
│   ├── Applications
│   ├── Commons
│   ├── Infrastructures
│   └── Interfaces
├── tests/                      # file pengujian
├── migrations/                 # file SQL migrasi DB
├── .github/workflows/          # CI/CD GitHub Actions
├── nginx.conf                  # Konfigurasi limit access NGINX
├── README.md
└── package.json
```

## 🌐 Rate Limiting dengan NGINX
Permintaan ke `/threads` dibatasi maksimal **90 request per menit** per IP. Konfigurasi disimpan dalam `nginx.conf` seperti:

```nginx
limit_req_zone $binary_remote_addr zone=threads_limit:10m rate=90r/m;

location ~ ^/threads {
  limit_req zone=threads_limit burst=10 nodelay;
  proxy_pass http://localhost:5000;
}
```

>**NOTE**: Bijaklah dalam menggunakan Repository ini


