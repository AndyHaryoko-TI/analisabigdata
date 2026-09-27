# 📊 Modul Perkuliahan: Analisa Big Data
**Program Studi Teknik Industri — Semester 3**

Repositori ini berisi kumpulan materi presentasi interaktif dan *source code* analisis data untuk mata kuliah **Analisa Big Data**. Semua modul disusun berbasis kasus nyata (studi kasus ritel) dengan memadukan Python (Pandas/Scikit-Learn/MLxtend) untuk komputasi analitik dan React (Bolt-Slides) untuk visualisasi presentasi interaktif.

---

## 💾 Dataset Rujukan
Seluruh eksperimen dan analisis dalam modul ini bertumpu pada Dataset Transaksi Ritel (*Retail Transaction Dataset*). Anda dapat menggunakan dataset yang telah kami sediakan langsung di repositori ini:
👉 **[Dataset_Transaction_Retail.csv (Repositori)](https://github.com/AndyHaryoko-TI/analisabigdata/blob/main/Dataset_Transaction_Retail.csv)**

*(Sebagai referensi alternatif, sumber asli mentah dataset ini juga dapat diunduh di tautan Kaggle berikut: [Dataset Kaggle](https://www.kaggle.com/code/ismadiandamara/retail-transaction-analysis?select=Dataset_Transaction_Retail.csv))*

---

## 📋 Lembar Kerja Mahasiswa (LKM)
Untuk keperluan praktikum di laboratorium, asisten atau mahasiswa dapat mengunduh dokumen resmi LKM berformat Microsoft Word (.docx) di sini:
👉 **[Unduh LKM EDA Analisa Big Data](https://github.com/AndyHaryoko-TI/analisabigdata/raw/main/LKM_EDA_Analisa_Big_Data.docx)**

---

## 📚 Daftar Modul & Tautan Presentasi Interaktif
Modul disusun secara berurutan, mulai dari pemahaman awal kualitas data hingga perancangan model strategi rantai pasok (SCM) dan pemasaran (CRM).

### 1. Exploratory Data Analysis (EDA)
Materi fundamental untuk memahami struktur, tipe variabel, distribusi nilai, dan anomali (*outliers*) dari tumpukan data kotor (Raw Data).
- 🐍 **Source Code:** `PPT-EDA/EDA_Retail.py`
- 🌐 **Slide Interaktif:** [Tonton Presentasi EDA](https://AndyHaryoko-TI.github.io/analisabigdata/PPT-EDA/)

### 2. Analisis Inventori Mati (Dead Stock)
Studi kasus *Supply Chain Management* (SCM). Menganalisis perputaran inventori dengan metrik *Recency & Frequency* untuk mendeteksi barang modal yang mengendap lama di gudang agar kerugian (HPP) dapat diselamatkan.
- 🐍 **Source Code:** `PPT-DeadStock/DeadStock_Analysis.py`
- 🌐 **Slide Interaktif:** [Tonton Presentasi Dead Stock](https://AndyHaryoko-TI.github.io/analisabigdata/PPT-DeadStock/)

### 3. RFM Analysis (Segmentasi Konsumen)
Studi kasus *Customer Relationship Management* (CRM). Mengelompokkan jutaan pelanggan menjadi sekumpulan segmen logis (*Champions*, *Loyal*, *At Risk*, dsb) menggunakan pendekatan kuartil atas perilaku Recency, Frequency, dan Monetary (Sumbangsih Pendapatan) mereka.
- 🐍 **Source Code:** `PPT-FM/RFM_Analysis.py`
- 🌐 **Slide Interaktif:** [Tonton Presentasi RFM Analysis](https://AndyHaryoko-TI.github.io/analisabigdata/PPT-FM/)

### 4. Market Basket Analysis (Asosiasi Pembelian)
Penerapan algoritma Machine Learning *Apriori* (*Association Rule Mining*) untuk membaca insting dan pola pembelanjaan bawah sadar konsumen. Modul ini menghasilkan rancangan tata letak (*layout*) gudang/toko dan strategi *Product Bundling* yang presisi.
- 🐍 **Source Code:** `PPT-MBA/MBA_Analysis.py`
- 🌐 **Slide Interaktif:** [Tonton Presentasi Market Basket Analysis](https://AndyHaryoko-TI.github.io/analisabigdata/PPT-MBA/)

---

## 🚀 Panduan Menjalankan Secara Lokal (Local Development)
Apabila Anda ingin mengembangkan atau menjalankan ulang presentasi ini di komputer Anda sendiri:

1. Pastikan **Node.js** dan **NPM** telah ter-install di perangkat Anda.
2. Clone repositori ini atau *download* folder spesifik.
3. Masuk ke direktori web perender presentasi (misal: MBA).
   ```bash
   cd PPT-MBA/bolt-slides
   ```
4. Jalankan perintah instalasi pustaka dan eksekusi server lokal.
   ```bash
   npm install
   npm run dev
   ```
5. Akses `http://localhost:5173/` di browser Anda.

---
*Dipersiapkan dan diotomasikan khusus untuk kebutuhan pengajaran interaktif Teknik Industri.*
