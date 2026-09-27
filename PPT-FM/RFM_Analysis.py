import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="darkgrid", palette="magma")

def run_rfm_analysis():
    print("=== 1. Load Data & Parsing ===")
    df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')
    df['order_date'] = pd.to_datetime(df['order_date'])
    
    print("=== 2. Data Cleaning ===")
    # Hapus duplikat dan transaksi tidak valid
    df.drop_duplicates(inplace=True)
    df = df[df['is_valid'] == 1]
    
    # Menghapus baris yang tidak memiliki customer_id
    initial_len = len(df)
    df.dropna(subset=['customer_id'], inplace=True)
    print(f"Data valid bersisa: {len(df)} dari {initial_len} baris.")
    
    print("\n=== 3. Agregasi RFM (Recency, Frequency, Monetary) ===")
    snapshot_date = df['order_date'].max() + pd.Timedelta(days=1)
    
    # Hitung nilai dasar R, F, M
    rfm = df.groupby('customer_id').agg(
        Recency=('order_date', lambda x: (snapshot_date - x.max()).days),
        Frequency=('id', 'nunique'),
        Monetary=('after_discount', 'sum')
    ).reset_index()
    
    # Filter pelanggan dengan nilai uang = 0 atau kurang (refund)
    rfm = rfm[rfm['Monetary'] > 0]
    
    print("\n=== 4. Scoring (Kuartil) ===")
    # Recency: Semakin kecil (baru) semakin bagus, maka label dibalik
    rfm['R_Score'] = pd.qcut(rfm['Recency'], 4, labels=[4, 3, 2, 1])
    # Frequency: Sering ada duplikasi di qcut jika frekuensi sangat menumpuk di 1.
    # Maka gunakan rank method
    rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 4, labels=[1, 2, 3, 4])
    # Monetary: Semakin besar semakin bagus
    rfm['M_Score'] = pd.qcut(rfm['Monetary'], 4, labels=[1, 2, 3, 4])
    
    # RFM Segment 
    rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)
    
    print("\n=== 5. Segmentasi Pelanggan ===")
    def segment_customer(row):
        r, f, m = int(row['R_Score']), int(row['F_Score']), int(row['M_Score'])
        # Logika Sederhana Kuartil
        if r >= 4 and f >= 4 and m >= 4:
            return 'Champions'
        elif r >= 3 and (f >= 3 or m >= 3):
            return 'Loyal Customers'
        elif r >= 3 and f <= 2:
            return 'New Customers'
        elif r == 2 and f >= 2:
            return 'Need Attention'
        elif r <= 2 and f <= 2:
            return 'About to Sleep'
        elif r == 1 and f >= 3:
            return 'At Risk'
        elif r == 1 and f < 3:
            return 'Lost'
        else:
            return 'Potential Loyalist'
            
    rfm['Segment'] = rfm.apply(segment_customer, axis=1)
    
    print("\n=== 6. Visualisasi & Plot ===")
    
    # 6.1 Distribusi RFM
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    sns.histplot(rfm['Recency'], bins=30, ax=axes[0], color='indigo')
    axes[0].set_title('Distribusi Recency')
    # Filter cap untuk visualisasi Frequency (karena bisa long tail)
    sns.histplot(rfm[rfm['Frequency'] < 20]['Frequency'], bins=20, ax=axes[1], color='violet')
    axes[1].set_title('Distribusi Frequency (<20)')
    sns.histplot(rfm[rfm['Monetary'] < 5000000]['Monetary'], bins=30, ax=axes[2], color='fuchsia')
    axes[2].set_title('Distribusi Monetary (<5M)')
    plt.tight_layout()
    plt.savefig('rfm_distributions.png')
    plt.close()
    
    # 6.2 Proporsi Segmen
    plt.figure(figsize=(10,6))
    seg_counts = rfm['Segment'].value_counts()
    sns.barplot(x=seg_counts.values, y=seg_counts.index, palette="cool")
    plt.title('Jumlah Pelanggan per Segmen')
    plt.tight_layout()
    plt.savefig('segment_distribution.png')
    plt.close()
    
    # 6.3 Heatmap Median Recency vs Median Frequency per Segmen
    # Di Pandas kita agregasi
    seg_stats = rfm.groupby('Segment').agg(
        Mean_R=('Recency', 'mean'),
        Mean_F=('Frequency', 'mean'),
        Total_M=('Monetary', 'sum')
    ).round(2)
    
    plt.figure(figsize=(8,6))
    sns.heatmap(seg_stats[['Mean_R', 'Mean_F']], annot=True, cmap='Purples', fmt=".1f")
    plt.title('Heatmap Karakteristik Segmen')
    plt.tight_layout()
    plt.savefig('rfm_heatmap.png')
    plt.close()
    
    # 6.4 Scatter Plot R vs F 
    plt.figure(figsize=(10,6))
    sns.scatterplot(data=rfm[rfm['Frequency'] < 50], x='Recency', y='Frequency', hue='Segment', palette='tab10', alpha=0.7)
    plt.title('Sebaran Pelanggan (Recency vs Frequency)')
    plt.tight_layout()
    plt.savefig('rfm_scatter.png')
    plt.close()
    
    # 6.5 Top 10 Customers by Monetary
    top_cust = rfm.sort_values(by='Monetary', ascending=False).head(10)
    plt.figure(figsize=(10,5))
    sns.barplot(x='Monetary', y=top_cust['customer_id'].astype(str), palette="rocket")
    plt.title('Top 10 Pelanggan Berdasarkan Monetary')
    plt.tight_layout()
    plt.savefig('top_customers.png')
    plt.close()
    
    # 6.6 Revenue by Segment
    plt.figure(figsize=(10,6))
    sns.barplot(x=seg_stats['Total_M'].values, y=seg_stats.index, palette="mako")
    plt.title('Total Pendapatan (Revenue) per Segmen')
    plt.tight_layout()
    plt.savefig('revenue_by_segment.png')
    plt.close()
    
    print("\n=== 7. Ringkasan Insight ===")
    print(seg_stats)
    
    print("\nAnalisis RFM Selesai dan Plot Berhasil Diekspor.")

if __name__ == '__main__':
    run_rfm_analysis()
