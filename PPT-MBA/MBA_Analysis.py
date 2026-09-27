import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

sns.set_theme(style="darkgrid", palette="YlOrRd")

def run_mba_analysis():
    print("=== 1. Load Data & Parsing ===")
    df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')
    df['order_date'] = pd.to_datetime(df['order_date'])
    
    print("=== 2. Data Cleaning ===")
    # Hapus duplikat dan transaksi tidak valid
    initial_len = len(df)
    df.drop_duplicates(inplace=True)
    df = df[df['is_valid'] == 1]
    
    # Menghapus baris yang tidak memiliki SKU / Nama Produk
    df.dropna(subset=['sku_name', 'id'], inplace=True)
    print(f"Data valid bersisa: {len(df)} dari {initial_len} baris.")
    
    print("\n=== 3. Persiapan Data Basket (Keranjang) ===")
    # Group by id (transaksi) dan bentuk list produk
    basket_df = df.groupby('id')['category'].unique().reset_index()
    # Untuk komputasi yang lebih ringan dalam simulasi ini, kita gunakan 'category'. 
    # (Bisa diganti 'sku_name' jika RAM memadai).
    transactions = basket_df['category'].tolist()
    print(f"Total Keranjang (Transactions): {len(transactions)}")
    
    print("\n=== 4. One-Hot Encoding ===")
    te = TransactionEncoder()
    te_ary = te.fit(transactions).transform(transactions)
    df_encoded = pd.DataFrame(te_ary, columns=te.columns_)
    
    print("\n=== 5. Frequent Itemsets (Apriori) ===")
    # min_support 0.01 artinya item/pasangan harus muncul minimal di 1% dari total transaksi
    frequent_itemsets = apriori(df_encoded, min_support=0.01, use_colnames=True)
    frequent_itemsets['length'] = frequent_itemsets['itemsets'].apply(lambda x: len(x))
    print(f"Ditemukan {len(frequent_itemsets)} frequent itemsets.")
    
    print("\n=== 6. Association Rules ===")
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)
    
    # Filter rules dengan Lift > 1
    rules = rules[rules['lift'] > 1.0].sort_values(by='lift', ascending=False)
    
    print(f"Ditemukan {len(rules)} Association Rules dengan Lift > 1.")
    print(f"Rata-rata Lift: {rules['lift'].mean():.2f}")
    print(f"Rata-rata Confidence: {rules['confidence'].mean():.2f}")
    print(f"Rata-rata Support: {rules['support'].mean():.4f}")
    
    # Memilih top 10 rules untuk divisualisasikan
    top_10_rules = rules.head(10)
    
    print("\n=== 7. Visualisasi & Plot ===")
    
    # 7.1 Scatter Plot Support vs Confidence (Color by Lift)
    plt.figure(figsize=(10,6))
    sc = plt.scatter(rules['support'], rules['confidence'], c=rules['lift'], cmap='YlOrRd', s=100*rules['lift'])
    plt.colorbar(sc, label='Lift')
    plt.title('Sebaran Support vs Confidence')
    plt.xlabel('Support')
    plt.ylabel('Confidence')
    plt.tight_layout()
    plt.savefig('support_confidence_scatter.png')
    plt.close()
    
    # 7.2 Bar chart Top 10 Rules by Lift
    # Mengubah format (A -> B) untuk label
    rule_labels = top_10_rules.apply(lambda r: f"{list(r['antecedents'])[0]} -> {list(r['consequents'])[0]}", axis=1)
    
    plt.figure(figsize=(10,6))
    sns.barplot(x=top_10_rules['lift'].values, y=rule_labels, palette="Oranges_r")
    plt.title('Top 10 Association Rules Berdasarkan Nilai Lift')
    plt.xlabel('Lift Score')
    plt.tight_layout()
    plt.savefig('top_rules_lift.png')
    plt.close()
    
    # 7.3 Co-occurrence Heatmap (Sederhana dari korelasi biner 10 Kategori teratas)
    top_categories = df['category'].value_counts().head(10).index
    df_top = df_encoded[top_categories]
    co_matrix = df_top.corr()
    
    plt.figure(figsize=(10,8))
    sns.heatmap(co_matrix, annot=True, cmap='YlOrBr', fmt=".2f")
    plt.title('Co-occurrence Correlation (Heatmap Kategori Teratas)')
    plt.tight_layout()
    plt.savefig('cooccurrence_heatmap.png')
    plt.close()
    
    # Network Graph menggunakan NetworkX (Basic)
    try:
        import networkx as nx
        plt.figure(figsize=(10,8))
        G = nx.DiGraph()
        for idx, row in top_10_rules.iterrows():
            ant = list(row['antecedents'])[0]
            con = list(row['consequents'])[0]
            G.add_edge(ant, con, weight=row['lift'])
            
        pos = nx.spring_layout(G, k=0.5)
        nx.draw(G, pos, with_labels=True, node_color='orange', node_size=2000, font_size=10, font_weight='bold', edge_color='gray', arrows=True)
        plt.title('Network Graph Top 10 Association Rules')
        plt.tight_layout()
        plt.savefig('network_graph.png')
        plt.close()
    except ImportError:
        print("NetworkX tidak terinstall, melewati pembuatan Network Graph.")

    print("\nAnalisis Market Basket Selesai dan Plot Berhasil Diekspor.")

if __name__ == '__main__':
    run_mba_analysis()
