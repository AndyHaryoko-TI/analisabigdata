import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="darkgrid", palette="muted")

def run_eda():
    print("=== 1. Load Data & Overview ===")
    df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')
    print(f"Shape: {df.shape}")
    print("\nInfo:")
    df.info()
    
    print("\nMissing Values:")
    print(df.isnull().sum())
    
    print("\nDuplikat:")
    print(df.duplicated().sum())
    
    print("\n=== 2. Parsing Tanggal ===")
    df['order_date'] = pd.to_datetime(df['order_date'])
    df['registered_date'] = pd.to_datetime(df['registered_date'])
    print("Tipe data order_date:", df['order_date'].dtype)
    
    print("\n=== 3. Validasi Diskon ===")
    # Validasi: before_discount - discount_amount = after_discount
    calc_after = df['before_discount'] - df['discount_amount']
    # Cek yang tidak cocok dengan toleransi 0.01
    mismatch = np.abs(calc_after - df['after_discount']) > 0.01
    print(f"Jumlah baris dengan diskon tidak valid: {mismatch.sum()}")
    
    print("\n=== 4. Univariate Analysis ===")
    # Kategori
    plt.figure(figsize=(10,6))
    sns.countplot(y='category', data=df, order=df['category'].value_counts().index)
    plt.title('Distribusi Kategori Produk')
    plt.tight_layout()
    plt.savefig('category_distribution.png')
    plt.close()
    
    # Histogram Price & Qty
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    sns.histplot(df['price'], bins=50, ax=axes[0], kde=True)
    axes[0].set_title('Distribusi Price')
    sns.histplot(df['qty_ordered'], bins=50, ax=axes[1], kde=True)
    axes[1].set_title('Distribusi Quantity Ordered')
    plt.tight_layout()
    plt.savefig('numeric_distributions.png')
    plt.close()
    
    print("\n=== 5. Deteksi Outlier (IQR) ===")
    cols_to_check = ['price', 'qty_ordered', 'after_discount']
    
    plt.figure(figsize=(12, 6))
    for i, col in enumerate(cols_to_check, 1):
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        outliers = df[(df[col] < lower) | (df[col] > upper)]
        
        print(f"[{col}] Q1: {Q1:.2f}, Q3: {Q3:.2f}, IQR: {IQR:.2f}")
        print(f"Batas: {lower:.2f} s/d {upper:.2f} -> Outliers: {len(outliers)}")
        
        plt.subplot(1, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot {col}')
    plt.tight_layout()
    plt.savefig('boxplots.png')
    plt.close()
    
    print("\n=== 6. Bivariate Analysis (Korelasi) ===")
    num_cols = ['price', 'qty_ordered', 'before_discount', 'discount_amount', 'after_discount', 'cogs']
    corr = df[num_cols].corr()
    
    plt.figure(figsize=(8,6))
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Heatmap Korelasi Numerik')
    plt.tight_layout()
    plt.savefig('correlation_heatmap.png')
    plt.close()
    
    print("\n=== 7. Rata-rata Diskon per Kategori ===")
    discount_cat = df.groupby('category')['discount_amount'].mean().sort_values(ascending=False)
    plt.figure(figsize=(10,6))
    sns.barplot(x=discount_cat.values, y=discount_cat.index, palette="viridis")
    plt.title('Rata-rata Diskon per Kategori')
    plt.xlabel('Discount Amount')
    plt.tight_layout()
    plt.savefig('discount_by_category.png')
    plt.close()
    
    print("\n=== 8. Time Series (Tren Bulanan) ===")
    df['year_month'] = df['order_date'].dt.to_period('M')
    monthly_trend = df.groupby('year_month').size()
    
    plt.figure(figsize=(12,5))
    monthly_trend.plot(kind='line', marker='o')
    plt.title('Jumlah Transaksi per Bulan')
    plt.ylabel('Total Transaksi')
    plt.xlabel('Bulan')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('monthly_trend.png')
    plt.close()
    
    print("\n=== 9. Key Insights ===")
    print(f"1. Kategori Terbanyak: {df['category'].mode()[0]}")
    print(f"2. Rata-rata Harga (Price): {df['price'].mean():.2f}")
    print(f"3. Median Kuantitas (Qty): {df['qty_ordered'].median():.2f}")
    print(f"4. Rata-rata Diskon: {df['discount_amount'].mean():.2f}")
    print(f"5. Total Transaksi: {len(df)}")
    print(f"6. Periode Data: {df['order_date'].min().date()} hingga {df['order_date'].max().date()}")
    print(f"7. Payment Method Terbanyak: {df['payment_method'].mode()[0]}")
    print("\nSemua plot (PNG) berhasil disimpan di direktori aktif.")

if __name__ == '__main__':
    run_eda()
