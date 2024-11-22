# YT Analyzer
Demo: https://ytanalyzer.vercel.app/

![image](https://github.com/user-attachments/assets/0ace9bef-09cf-41e0-9a45-a7a52a7bf32e)


YT Analyzer adalah aplikasi web yang memungkinkan pengguna untuk menganalisis video YouTube menggunakan AI. Aplikasi ini mengekstrak informasi penting dan menghasilkan ringkasan dari video YouTube secara otomatis.

## Fitur Utama

- 🚀 **Analisis Cepat**: Dapatkan ringkasan video dalam hitungan detik
- 🎯 **Poin Penting**: Ekstrak poin-poin kunci secara otomatis
- 📊 **Riwayat Analisis**: Simpan dan akses kembali hasil analisis
- 🔒 **Aman**: Integrasi dengan Google Authentication

![image](https://github.com/user-attachments/assets/6364956e-79df-4d9d-93d8-a02eb5ace4d9)

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI**: Mistral AI
- **API**: YouTube Data API v3

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda memiliki:

- Node.js (v18 atau lebih baru)
- NPM atau Yarn
- Firebase Project
- YouTube Data API Key
- Mistral AI API Key

## Instalasi

1. Clone repository
```bash
git clone https://github.com/username/yt-analyzer.git
cd yt-analyzer
```

2. Install dependencies
```bash
npm install
```
atau
```bash
yarn install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Isi environment variables berikut:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key
YOUTUBE_API_KEY=your_youtube_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

4. Jalankan development server
```bash
npm run dev
```
atau
```bash
yarn dev
```


## Penggunaan

1. Buka aplikasi di browser (default: http://localhost:3000)
2. Login menggunakan akun Google
3. Paste URL video YouTube yang ingin dianalisis
4. Tunggu beberapa saat untuk mendapatkan hasil analisis
5. Lihat riwayat analisis di sidebar

## API Endpoints

### POST /api/analyze
Menganalisis video YouTube berdasarkan URL

Request:
```json
{
  "videoId": "your_youtube_video_id"
}
```


Response:
```json
{
  "summary": "ringkasan video",
  "videoDetails": { "title": "judul video", "viewCount": 1000000, "channelTitle": "nama channel" }
}
```


### GET /api/history
Mengambil riwayat analisis pengguna

Response:
```json
[
{
"id": "string",
"title": "string",
"timestamp": "string",
"videoId": "string",
"channelTitle": "string",
"viewCount": "string"
}
]
```

## Struktur Project

yt-analyzer/
├── app/
│ ├── api/
│ │ ├── analyze/
│ │ └── history/
│ ├── components/
│ ├── context/
│ ├── lib/
│ ├── about/
│ ├── analyze/
│ └── page.tsx
├── public/
└── package.json


## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b improve-feature`)
3. Commit perubahan (`git commit -m 'Improve feature'`)
4. Push ke branch (`git push origin improve-feature`)
5. Buat Pull Request

## Lisensi

No License

## Kontak

akmal - [@akmlfy_](https://instagram.com/akmlfy_)

Project Link: [https://github.com/akmalfirliyanto/yt-analyzer](https://github.com/akmalfirliyanto/yt-analyzer)
