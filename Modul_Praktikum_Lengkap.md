# Modul Praktikum Analisis Big Data
**Program Studi Teknik Industri**

## Deskripsi Mata Kuliah
Modul ini dirancang untuk memberikan pemahaman praktis kepada mahasiswa Teknik Industri mengenai pemanfaatan algoritma data mining dan statistika deskriptif guna mengekstrak insight operasional dan strategi bisnis (Manajemen Rantai Pasok/SCM) dari dataset transaksi ritel.

**Dataset Utama:** [Dataset Transaction Retail (Kaggle)](https://www.kaggle.com/code/ismadiandamara/retail-transaction-analysis?select=Dataset_Transaction_Retail.csv)

---

## Modul 1: Eksplorasi Data Awal (EDA)
**Tujuan Pembelajaran:** Mahasiswa mampu mengidentifikasi karakteristik dataset, mendeteksi nilai kosong, serta menangani anomali matematis (seperti pengembalian barang).

### 1.1 Persiapan dan Pemuatan Data
Langkah pertama dalam analisis adalah memuat pustaka (library) dan membaca himpunan data.
```python
import pandas as pd
import matplotlib.pyplot as plt

# Memuat Dataset
df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')
print(f"Dimensi Data: {df.shape}")
```

### 1.2 Identifikasi Anomali dan Nilai Kosong
```python
# Cek nilai kosong
print(df.isnull().sum())

# Cek anomali (Kuantitas negatif)
ringkasan = df.describe()
print(ringkasan)

# Menghapus Missing Values dan Retur (Quantity < 0)
df_clean = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)].dropna(subset=['CustomerID'])
print(f"Data valid (bersih): {len(df_clean)}")
```

---

## Modul 2: Analisis Stok Mati (Dead Stock) & Slow-Moving Inventory
**Tujuan Pembelajaran:** Mahasiswa mampu menganalisis perputaran persediaan barang untuk meminimalkan *Holding Cost* dan memaksimalkan likuiditas ruang pergudangan (Warehouse Slotting).

### 2.1 Agregasi Performa Level SKU (Stock Keeping Unit)
```python
# Tentukan tanggal referensi (1 hari setelah rekam data terakhir)
df_clean['InvoiceDate'] = pd.to_datetime(df_clean['InvoiceDate'])
snapshot_date = df_clean['InvoiceDate'].max() + pd.Timedelta(days=1)

# Agregasi performa per SKU
product_perf = df_clean.groupby(['StockCode', 'Description']).agg({
    'Quantity': 'sum',
    'InvoiceDate': lambda x: (snapshot_date - x.max()).days # Menghitung hari sejak terakhir laku
}).reset_index()

product_perf.rename(columns={'InvoiceDate': 'Days_Since_Last_Sold'}, inplace=True)
```

### 2.2 Filter Deteksi Dead Stock
```python
# Ambang Batas: Tidak laku > 180 Hari ATAU Total Laku < 10 Unit
dead_stock = product_perf[(product_perf['Days_Since_Last_Sold'] > 180) | (product_perf['Quantity'] < 10)]
dead_stock = dead_stock.sort_values(by=['Days_Since_Last_Sold'], ascending=False)
display(dead_stock.head())
```
*Tindakan Manajerial:* Barang yang masuk klasifikasi ini harus segera dilikuidasi dengan cuci gudang (*clearance*) atau digabung (*bundling*) dengan produk terlaris.

---

## Modul 3: Segmentasi RFM (Recency, Frequency, Monetary)
**Tujuan Pembelajaran:** Mahasiswa dapat mengklasifikasikan loyalitas dan profitabilitas setiap entitas konsumen untuk optimalisasi biaya akuisisi pelanggan (Customer Acquisition Cost).

### 3.1 Kalkulasi RFM Serentak
```python
df_clean['TotalSales'] = df_clean['Quantity'] * df_clean['UnitPrice']

rfm = df_clean.groupby('CustomerID').agg({
    'InvoiceDate': lambda x: (snapshot_date - x.max()).days, # Recency
    'InvoiceNo': 'nunique',                                  # Frequency
    'TotalSales': 'sum'                                      # Monetary
})
rfm.rename(columns={'InvoiceDate': 'Recency', 'InvoiceNo': 'Frequency', 'TotalSales': 'Monetary'}, inplace=True)
```

### 3.2 Sistem Skoring dan Segmentasi Aksi
```python
# Pembagian 4 Kuartil menggunakan qcut
rfm['R_Score'] = pd.qcut(rfm['Recency'], 4, labels=[4, 3, 2, 1]) # Skor 4 untuk hari terpendek
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 4, labels=[1, 2, 3, 4])
rfm['M_Score'] = pd.qcut(rfm['Monetary'], 4, labels=[1, 2, 3, 4])

rfm['RFM_Segment'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)

def label_segmen(row):
    if row['RFM_Segment'] == '444':
        return 'Champions'
    elif row['R_Score'] <= 2 and row['M_Score'] >= 3:
        return 'At Risk'
    return 'Lainnya'

rfm['Status'] = rfm.apply(label_segmen, axis=1)
```

---

## Modul 4: Market Basket Analysis (Asosiasi Keranjang Belanja)
**Tujuan Pembelajaran:** Mahasiswa mampu menemukan pola keterikatan pembelian antar produk yang mendasari strategi *Cross-Selling* virtual dan *Warehouse Slotting* fisik.

### 4.1 Transformasi Data dan Agregasi Keranjang
```python
# Mengumpulkan semua nama produk (Description) yang berada dalam 1 Nomor Tagihan
keranjang = df_clean.groupby('InvoiceNo')['Description'].apply(set).reset_index()
```

### 4.2 Kalkulasi Asosiasi dengan Himpunan (Intersection)
```python
# Membuktikan relasi antara 2 produk secara manual
tas_merah = set(df_clean[df_clean['Description'] == 'JUMBO BAG RED RETROSPOT']['InvoiceNo'])
tas_pink = set(df_clean[df_clean['Description'] == 'JUMBO BAG PINK POLKADOT']['InvoiceNo'])

# Menghitung irisan tagihan (Dibeli bersamaan)
dibeli_bersama = tas_merah.intersection(tas_pink)

# Menghitung probabilitas bersyarat (Confidence)
confidence = len(dibeli_bersama) / len(tas_merah)
print(f"Confidence (Merah -> Pink): {confidence * 100:.1f}%")
```
*Tindakan Manajerial:* Produk dengan tingkat probabilitas (*Confidence* dan *Lift*) yang ekstrim wajib diletakkan pada rak penyimpanan yang berdekatan di gudang logistik untuk memangkas *Picking Time* (Travel Distance) para buruh logistik.
