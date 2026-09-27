import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="darkgrid", palette="viridis")

def run_dead_stock_analysis():
    print("=== 1. Load Data & Parsing ===")
    df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')
    df['order_date'] = pd.to_datetime(df['order_date'])
    
    print("=== 2. Data Cleaning ===")
    initial_len = len(df)
    df.drop_duplicates(inplace=True)
    df = df[df['is_valid'] == 1]
    df.dropna(subset=['sku_id'], inplace=True)
    print(f"Data tersisa setelah cleaning: {len(df)} dari {initial_len}")
    
    print("\n=== 3. Agregasi per SKU ===")
    # Snapshot date: 1 hari setelah transaksi terakhir
    snapshot_date = df['order_date'].max() + pd.Timedelta(days=1)
    
    sku_agg = df.groupby(['sku_id', 'sku_name', 'category']).agg(
        total_qty=('qty_ordered', 'sum'),
        total_revenue=('after_discount', 'sum'),
        first_order=('order_date', 'min'),
        last_order=('order_date', 'max'),
        order_count=('id', 'nunique'),
        cogs=('cogs', 'mean') # Mengambil rata-rata HPP
    ).reset_index()
    
    # Menghitung hari sejak transaksi terakhir (Recency)
    sku_agg['days_since_last_sale'] = (snapshot_date - sku_agg['last_order']).dt.days
    
    print("\n=== 4. Definisi Dead Stock ===")
    # Asumsi: Tidak terjual > 90 hari DAN total kuantitas penjualan < Median penjualan global
    median_qty = sku_agg['total_qty'].median()
    threshold_days = 90
    
    def classify_sku(row):
        if row['days_since_last_sale'] > threshold_days and row['total_qty'] < median_qty:
            return 'Dead Stock'
        elif row['days_since_last_sale'] <= 30:
            return 'Fast Moving'
        else:
            return 'Slow Moving'
            
    sku_agg['status'] = sku_agg.apply(classify_sku, axis=1)
    
    # Estimasi nilai inventori (Asumsi sisa stok = median_qty - total_qty, tapi untuk simplifikasi: total_qty historis * cogs sebagai potensi hilang)
    # Pendekatan industri: Nilai mati = harga pokok produksi barang yang tersisa.
    sku_agg['lost_inventory_value'] = sku_agg['cogs'] * (median_qty - sku_agg['total_qty']).clip(lower=1)
    
    dead_stock = sku_agg[sku_agg['status'] == 'Dead Stock']
    print(f"Total SKU Dead Stock: {len(dead_stock)} dari {len(sku_agg)} SKU")
    
    print("\n=== 5. Analisis Karakteristik ===")
    # 5.1 Distribusi Kategori Dead Stock
    plt.figure(figsize=(10,6))
    ds_cat = dead_stock['category'].value_counts()
    sns.barplot(x=ds_cat.values, y=ds_cat.index, palette="mako")
    plt.title('Jumlah SKU Dead Stock per Kategori')
    plt.tight_layout()
    plt.savefig('dead_stock_category.png')
    plt.close()
    
    # 5.2 Histogram Recency
    plt.figure(figsize=(10,5))
    sns.histplot(sku_agg['days_since_last_sale'], bins=50, kde=True, color='purple')
    plt.axvline(threshold_days, color='red', linestyle='--', label='Batas Dead Stock (90 Hari)')
    plt.title('Distribusi Hari Sejak Penjualan Terakhir')
    plt.legend()
    plt.tight_layout()
    plt.savefig('recency_histogram.png')
    plt.close()
    
    # 5.3 Scatter Plot Recency vs Frequency
    plt.figure(figsize=(10,6))
    sns.scatterplot(data=sku_agg, x='order_count', y='days_since_last_sale', hue='status', palette={'Dead Stock':'red', 'Slow Moving':'orange', 'Fast Moving':'green'})
    plt.axhline(threshold_days, color='black', linestyle='--')
    plt.title('Sebaran Recency vs Frequency (Order Count)')
    plt.tight_layout()
    plt.savefig('scatter_recency_freq.png')
    plt.close()
    
    # 5.4 Top 10 Dead Stock by Lost Value
    top_dead = dead_stock.sort_values(by='lost_inventory_value', ascending=False).head(10)
    plt.figure(figsize=(10,6))
    sns.barplot(x='lost_inventory_value', y='sku_name', data=top_dead, palette="rocket")
    plt.title('Top 10 Dead Stock Berdasarkan Nilai Inventori yang Hilang')
    plt.tight_layout()
    plt.savefig('top_dead_stock.png')
    plt.close()
    
    # 5.5 Pie Chart Proporsi Status
    plt.figure(figsize=(8,8))
    status_counts = sku_agg['status'].value_counts()
    plt.pie(status_counts, labels=status_counts.index, autopct='%1.1f%%', colors=['#2ca02c', '#ff7f0e', '#d62728'])
    plt.title('Proporsi SKU Berdasarkan Perputaran')
    plt.savefig('dead_stock_pie.png')
    plt.close()
    
    print("\n=== 6. Ringkasan Eksekutif ===")
    print(f"1. Jumlah SKU Dead Stock: {len(dead_stock)}")
    print(f"2. Persentase Dead Stock: {(len(dead_stock)/len(sku_agg))*100:.2f}%")
    print(f"3. Total Estimasi Nilai Inventori Dead Stock: Rp {dead_stock['lost_inventory_value'].sum():,.2f}")
    print(f"4. Kategori Dead Stock Dominan: {ds_cat.index[0]}")
    print(f"5. Rata-rata hari tidak laku (Dead Stock): {dead_stock['days_since_last_sale'].mean():.1f} hari")
    print("\nVisualisasi PNG berhasil diekspor.")

if __name__ == '__main__':
    run_dead_stock_analysis()
