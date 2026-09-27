import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Reveal from './deck/Reveal';
import Split from './components/Split';
import Agenda from './components/Agenda';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';
import Bento from './components/Bento';
import Contrast from './components/Contrast';
import StatGrid from './components/StatGrid';
import Table from './components/Table';
import Section from './components/Section';
import Steps from './components/Steps';

export default function App() {
  return (
    <Deck>
      {/* ======================= COVER & AGENDA ======================= */}
      <Cover
        nav="Sampul"
        kicker="Program Studi Teknik Industri"
        title={<span>Praktikum <span className="accent-text">Analisis Big Data</span></span>}
        subtitle="Dari Eksplorasi Data Mentah Menuju Keputusan Rantai Pasok yang Cerdas"
        foot="Disusun Menggunakan Dataset Online Retail (Kaggle)"
      />

      <Agenda
        nav="Silabus Master"
        kicker="Silabus Utama"
        title="Pilar Analitik Pembelajaran."
        items={[
          { title: "Eksplorasi Data Awal (EDA)", hint: "Pembersihan dataset & filtrasi anomali" },
          { title: "Dead Stock Analysis", hint: "Mendeteksi kapital mati di dalam gudang" },
          { title: "Segmentasi RFM", hint: "Klasifikasi loyalitas konsumen" },
          { title: "Market Basket Analysis", hint: "Aturan Asosiasi untuk optimalisasi rak gudang" }
        ]}
      />

      {/* ======================= MODUL 1: EDA ======================= */}
      <Section
        nav="Modul 1: EDA"
        n={1}
        kicker="Fase Pertama"
        title={<>Eksplorasi Data <span className="accent-text">Awal (EDA)</span></>}
      />

      <Slide nav="EDA: Kualitas Data">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Integritas & Kualitas</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Inspeksi Himpunan <span className="accent-text">Data Mentah</span>
          </h2>
        </Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Isu Nilai Kosong',
              title: 'Missing Values',
              points: [
                'Terdapat 135.080 transaksi tanpa ID Pelanggan.',
                'Penanganan: Listwise Deletion (Dropna).',
                'Tanpa ID valid, mustahil melakukan segmentasi.',
              ],
            }}
            right={{
              label: 'Isu Nilai Ekstrem',
              title: 'Anomali Logistik (Retur)',
              points: [
                'Ditemukan Kuantitas negatif hingga -80.995.',
                'Menandakan adanya pembatalan atau retur.',
                'Penanganan: Filter kuantitas > 0 untuk mencari laba murni.',
              ],
            }}
          />
        </Reveal>
      </Slide>

      <Split
        nav="EDA: Kode Pembersihan"
        flip
        kicker="Skrip Python Dasar"
        title={<>Prapemrosesan <span className="accent-text">Data</span></>}
        body="Menggunakan Pandas untuk membersihkan anomali, menghilangkan retur (logistik terbalik), dan menciptakan fitur baru (Total Sales)."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="1_eda_cleaning.py"
                highlight={[2, 5]}
                code={`# Menyaring barang retur dan menghapus nilai kosong
df_clean = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)].copy()
df_clean = df_clean.dropna(subset=['CustomerID'])

# Menciptakan atribut pendapatan per transaksi
df_clean['TotalSales'] = df_clean['Quantity'] * df_clean['UnitPrice']`}
              />
            </div>
          </>
        }
      />

      {/* ======================= MODUL 2: DEAD STOCK ======================= */}
      <Section
        nav="Modul 2: Dead Stock"
        n={2}
        kicker="Fase Kedua"
        title={<>Analisis <span className="accent-text">Dead Stock</span></>}
      />

      <Slide nav="Dead Stock: Konsep">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Manajemen Inventori</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Ancaman Biaya <span className="accent-text">Penyimpanan</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Dead Stock (Stok Mati)', body: 'Barang tidak laku selama berbulan-bulan. Menyita ruang fisik gudang.', variant: 'accent' },
              { c: 2, r: 1, title: 'Holding Cost', body: 'Beban asuransi, depresiasi, dan modal (cash) yang tidak bisa diputarkan akibat tertahan pada barang.' },
              { c: 2, r: 1, title: 'Solusi SCM', body: 'Lakukan likuidasi (Flash Sale Cuci Gudang) atau integrasikan melalui Bundling Produk.' }
            ]}
          />
        </Reveal>
      </Slide>

      <Split
        nav="Dead Stock: Algoritma"
        kicker="Algoritma Python"
        title={<>Deteksi <span className="accent-text">Otomatis</span></>}
        body="Mengagregasi performa berdasarkan SKU produk, lalu memfilter barang yang sama sekali tidak disentuh konsumen dalam 6 bulan terakhir."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="2_dead_stock.py"
                highlight={[1, 7]}
                code={`# 1. Hitung hari sejak laku terakhir per Produk
snapshot_date = df_clean['InvoiceDate'].max() + pd.Timedelta(days=1)
product_perf = df_clean.groupby('StockCode').agg({
    'Quantity': 'sum',
    'InvoiceDate': lambda x: (snapshot_date - x.max()).days
}).rename(columns={'InvoiceDate': 'Days_Idle'})

# 2. Syarat Dead Stock: Nganggur > 180 hari
dead_stock = product_perf[product_perf['Days_Idle'] > 180]`}
              />
            </div>
          </>
        }
      />

      {/* ======================= MODUL 3: RFM ======================= */}
      <Section
        nav="Modul 3: RFM"
        n={3}
        kicker="Fase Ketiga"
        title={<>Segmentasi <span className="accent-text">RFM</span></>}
      />

      <Split
        nav="RFM: Agregasi"
        flip
        kicker="Skoring Konsumen"
        title={<>Eksekusi Agregasi <span className="accent-text">Serentak</span></>}
        body="RFM (Recency, Frequency, Monetary) merangkum profil loyalitas konsumen. Pandas dapat menghitung ketiga metrik tersebut dalam satu fungsi aggregasi seketika."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="3_rfm_aggregation.py"
                highlight={[2, 3, 4]}
                code={`# Menghitung R, F, M dari 400.000 transaksi
rfm = df_clean.groupby('CustomerID').agg({
    'InvoiceDate': lambda x: (snapshot_date - x.max()).days, # R
    'InvoiceNo': 'nunique',                                  # F
    'TotalSales': 'sum'                                      # M
})`}
              />
            </div>
          </>
        }
      />

      <Split
        nav="RFM: Skoring"
        kicker="Pembobotan Matematika"
        title={<>Kuartil <span className="accent-text">(pd.qcut)</span></>}
        body="Memecah setiap metrik ke dalam persentil yang adil untuk memberikan nilai 1 hingga 4. Perhatian: Recency terkecil (terbaru) mendapatkan nilai terbesar (4)."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="4_rfm_scoring.py"
                highlight={[1, 4]}
                code={`# Recency: Makin kecil angkanya, makin tinggi skornya
rfm['R_Score'] = pd.qcut(rfm['Recency'], 4, labels=[4, 3, 2, 1])

# Frequency & Monetary: Standar (Makin besar, makin tinggi)
rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 4, labels=[1, 2, 3, 4])
rfm['M_Score'] = pd.qcut(rfm['Monetary'], 4, labels=[1, 2, 3, 4])`}
              />
            </div>
          </>
        }
      />

      {/* ======================= MODUL 4: MBA ======================= */}
      <Section
        nav="Modul 4: MBA"
        n={4}
        kicker="Fase Keempat"
        title={<>Market <span className="accent-text">Basket Analysis</span></>}
      />

      <Split
        nav="MBA: Himpunan Irisan"
        flip
        kicker="Aturan Asosiasi Sederhana"
        title={<>Pembuktian <span className="accent-text">Korelasi Produk</span></>}
        body="Tanpa library Machine Learning kompleks, kita bisa membuktikan hukum korelasi belanja melalui operasi Himpunan Matematika (Intersection Set)."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="5_association.py"
                highlight={[2, 3, 6]}
                code={`# Mengisolasi ID transaksi
tas_merah = set(df[df['Desc'] == 'RED BAG']['InvoiceNo'])
tas_pink = set(df[df['Desc'] == 'PINK BAG']['InvoiceNo'])

# Irisan: Dibeli dalam 1 keranjang yang sama
dibeli_bersama = tas_merah.intersection(tas_pink)

# Confidence Probability
confidence = len(dibeli_bersama) / len(tas_merah)`}
              />
            </div>
          </>
        }
      />

      <Slide nav="MBA: Implementasi">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Tindakan Operasional (SCM)</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Strategi <span className="accent-text">Optimalisasi Logistik</span>
          </h2>
        </Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Warehouse Slotting', body: 'Dua barang dengan nilai "Lift" ekstrem WAJIB diletakkan di rak gudang yang bersebelahan untuk meminimalisasi travel-time buruh logistik.' },
              { title: 'Product Bundling', body: 'Menjadikan barang komplementer sebagai satu paket promo E-Commerce demi mengkatrol metrik Average Order Value (AOV).' },
              { title: 'Resolusi Dead Stock', body: 'Market Basket adalah strategi terampuh untuk mencairkan produk mati, dengan mensyaratkan pembeliannya pada produk yang perputarannya sangat cepat (Fast-Moving).' },
            ]}
          />
        </Reveal>
      </Slide>

      {/* ======================= CLOSING ======================= */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Dari 500.000 baris data mentah,<br/>
          menjadi <span className="accent-text">mesin cerdas operasional.</span>
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Modul Praktikum Berakhir. Silakan evaluasi skrip Python di repositori Anda.
        </p>
      </Slide>

    </Deck>
  );
}
