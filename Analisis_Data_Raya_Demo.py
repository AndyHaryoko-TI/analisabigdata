import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Pengaturan visualisasi seaborn untuk estetika grafik
sns.set_theme(style="whitegrid")

# Menentukan lokasi dataset (asumsi script dijalankan di folder EDA dan dataset di folder parent)
dataset_path = '../Online-Retail.xlsx'
if not os.path.exists(dataset_path):
    dataset_path = 'Online-Retail.xlsx' # Fallback jika berada di folder yang sama

print("="*60)
print("MEMUAT DATASET ONLINE RETAIL")
print("="*60)
print(f"Sedang membaca file: {dataset_path} ... (Mohon tunggu, ini mungkin memakan waktu)")

try:
    df = pd.read_excel(dataset_path)
    print("\n[INFO DATASET AWAL]")
    print(f"Total Baris Data: {df.shape[0]:,} | Total Kolom: {df.shape[1]}")
except Exception as e:
    print(f"Gagal memuat dataset: {e}")
    exit()

print("\n" + "="*60)
print("SESI 1: PRA-PEMROSESAN & PEMBERSIHAN DATA")
print("="*60)

# 1. Menangani Anomali & Logistik Terbalik (Retur)
print("\n[Langkah 1] Memisahkan Transaksi Valid dan Logistik Terbalik (Retur)...")
# Filter transaksi valid (Kuantitas dan Harga positif)
df_valid = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)].copy()
# Filter transaksi retur/batal (Kuantitas negatif)
df_reverse = df[df['Quantity'] < 0].copy()

print(f" -> Total transaksi valid berhasil disaring : {len(df_valid):,} baris")
print(f" -> Total transaksi retur/dibatalkan        : {len(df_reverse):,} baris (Untuk analisis Quality Control)")

# 2. Menangani Nilai Hilang pada Identitas Pelanggan
print("\n[Langkah 2] Menghapus Data Tanpa CustomerID untuk Analisis Perilaku Pelanggan...")
df_clean = df_valid.dropna(subset=['CustomerID']).copy()
print(f" -> Sisa data bersih (siap dianalisis)      : {len(df_clean):,} baris")

# 3. Rekayasa Fitur (Feature Engineering)
print("\n[Langkah 3] Rekayasa Fitur (Menambahkan Total Pendapatan dan Ekstraksi Waktu)...")
# Total Pendapatan = Kuantitas * Harga Satuan
df_clean['TotalSales'] = df_clean['Quantity'] * df_clean['UnitPrice']
# Ekstrak komponen Bulan dari Tanggal Faktur (InvoiceDate)
df_clean['Month'] = df_clean['InvoiceDate'].dt.month
print(" -> Fitur 'TotalSales' dan 'Month' berhasil ditambahkan.")

print("\n" + "="*60)
print("SESI 2: EKSTRAKSI PEMAHAMAN OPERASI BISNIS")
print("="*60)

# 1. Market Basket Analysis (Optimasi Tata Letak Gudang)
print("\n[Analisa 1] Optimasi Tata Letak Gudang (Market Basket Analysis)")
# Mencari nomor invoice yang memuat produk Jumbo Bag Merah
bag_red = set(df_clean[df_clean['Description'].str.contains('JUMBO BAG RED RETROSPOT', na=False)]['InvoiceNo'])
# Mencari nomor invoice yang memuat produk Jumbo Bag Merah Muda
bag_pink = set(df_clean[df_clean['Description'].str.contains('JUMBO BAG PINK POLKADOT', na=False)]['InvoiceNo'])
# Mencari irisan (transaksi yang mengandung kedua tas tersebut sekaligus)
dibeli_bersama = bag_red.intersection(bag_pink)

print(f" -> JUMBO BAG RED RETROSPOT dan PINK POLKADOT dibeli secara bersamaan dalam {len(dibeli_bersama):,} pesanan.")
print(" -> INSIGHT OPERASIONAL: Tempatkan kedua produk ini pada rak (slotting) yang berdekatan di gudang untuk meminimalkan waktu pengambilan (picking time).")

# 2. Segmentasi RFM (Hukum Pareto)
print("\n[Analisa 2] Segmentasi & Distribusi Biaya Akuisisi (Hukum Pareto 80/20)")
# Mengelompokkan total belanja per pelanggan
rfm_monetary = df_clean.groupby('CustomerID')['TotalSales'].sum().reset_index()
rfm_monetary = rfm_monetary.sort_values(by='TotalSales', ascending=False)
total_revenue = rfm_monetary['TotalSales'].sum()

# Mengambil top 17.5% pelanggan (Kategori 'Champions')
top_17_5_percent = int(len(rfm_monetary) * 0.175)
champions = rfm_monetary.head(top_17_5_percent)
champions_revenue = champions['TotalSales'].sum()

print(f" -> Total pelanggan unik tercatat          : {len(rfm_monetary):,} orang")
print(f" -> Pendapatan dari Total Pelanggan        : Rp/£ {total_revenue:,.0f}")
print(f" -> Pendapatan dari 17.5% Top 'Champions'  : Rp/£ {champions_revenue:,.0f}")
print(f" -> Persentase Kontribusi Segmen Champions : {(champions_revenue/total_revenue)*100:.1f}% dari keseluruhan pendapatan.")
print(" -> INSIGHT OPERASIONAL: Jangan tebar promosi secara acak. Fokuskan anggaran kampanye reaktivasi khusus pada mantan pembeli besar yang mulai pasif (Segmen At-Risk).")

# 3. Pola Musiman & Visualisasi (Perencanaan Kapasitas)
print("\n[Analisa 3] Memuat Visualisasi Tren Musiman untuk Perencanaan Kapasitas...")
print(" -> Menyiapkan grafik... (Jendela grafik akan terbuka)")

# Agregasi data kuantitas berdasarkan bulan
monthly_sales = df_clean.groupby('Month')['Quantity'].sum()

# Plotting Grafik Bar
plt.figure(figsize=(12, 6))
bars = monthly_sales.plot(kind='bar', color='steelblue', edgecolor='black', alpha=0.8)
plt.title('Total Kuantitas Pesanan per Bulan (Corak Musiman)', fontsize=15, fontweight='bold', pad=15)
plt.xlabel('Bulan', fontsize=12)
plt.ylabel('Total Volume Pesanan (Unit)', fontsize=12)
plt.xticks(rotation=0)

# Menambahkan angka detail (anotasi) di atas setiap batang grafik
for p in bars.patches:
    bars.annotate(f"{int(p.get_height()):,}", 
                  (p.get_x() + p.get_width() / 2., p.get_height()), 
                  ha='center', va='bottom', fontsize=10, fontweight='bold',
                  xytext=(0, 5), textcoords='offset points')

# Menambahkan garis batas intervensi SDM
# Angka 7.5 berada di antara bulan 8 (Agustus) dan 9 (September) dalam plot array [0,1,2,3...] (yaitu indeks ke-7 dan 8)
plt.axvline(x=7.5, color='red', linestyle='--', linewidth=2, label='Tenggat Rekrutmen SDM Paruh Waktu (Agustus)')

plt.legend()
plt.tight_layout()
plt.show()

print("\n" + "="*60)
print("INSIGHT GRAFIK & PERENCANAAN KAPASITAS:")
print("="*60)
print("1. Terlihat adanya lonjakan pesanan yang masif dan konsisten mulai Bulan ke-9 (September) hingga ke-11 (November).")
print("2. Formula Stok Keselamatan (Safety Stock) harus ditingkatkan secara drastis menyesuaikan periode Kuartal ke-4.")
print("3. Dari aspek Sumber Daya Manusia (SDM), pengambilan pekerja buruh logistik paruh waktu (seasonal workers) harus dilakukan pada pertengahan Bulan Agustus sebelum puncak pesanan melanda untuk mempertahankan batas aman SLA.")
print("="*60)
print("Program selesai dieksekusi.")
