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
import Steps from './components/Steps';
import Table from './components/Table';
import Build from './deck/Build';
import CountUp from './components/CountUp';

// Mock charts for Bolt Slides
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import DonutChart from './components/DonutChart';

export default function App() {
  return (
    <Deck>
      {/* 1. Cover */}
      <Cover
        nav="Sampul"
        kicker="Teknik Industri · Semester 3"
        title={<span>Exploratory Data Analysis: <span className="accent-text">Transaksi Retail</span></span>}
        subtitle="Analisa Big Data — Dataset Dataset_Transaction_Retail.csv"
        foot="Disusun secara Otomatis"
      />

      {/* 2. Agenda */}
      <Agenda
        nav="Agenda"
        kicker="Silabus EDA"
        title="Pokok Pembahasan."
        items={[
          { title: "Latar Belakang", hint: "Tujuan EDA" },
          { title: "Data Overview", hint: "Struktur Dataset" },
          { title: "Data Cleaning", hint: "Anomali & Null" },
          { title: "Univariate Analysis", hint: "Kategorikal & Numerik" },
          { title: "Bivariate Analysis", hint: "Korelasi & Pola" },
          { title: "Time Series", hint: "Tren Transaksi" },
          { title: "Key Insights", hint: "Ringkasan Eksekutif" },
          { title: "Rekomendasi", hint: "Langkah Lanjutan" }
        ]}
      />

      {/* 3. Latar Belakang & Tujuan */}
      <Slide nav="Latar Belakang">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Pengantar</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Mengapa <span className="accent-text">EDA Penting?</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Menemukan Pola Tersembunyi', body: 'EDA membantu kita membedah distribusi dan tendensi sentral sebelum modeling.' },
              { c: 2, r: 1, title: 'Validasi Integritas Data', body: 'Memastikan tidak ada outlier atau data logistik yang merusak arus kas nyata.', variant: 'accent' }
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 24, fontWeight: 'bold' }}>
            <span className="accent-text">Tujuan Utama:</span> Membangun fondasi yang kokoh untuk Segmentasi RFM dan Prediksi ML.
          </div>
        </Build>
      </Slide>

      {/* 4. Data Overview */}
      <Slide nav="Data Overview">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Struktur Himpunan Data</div>
          <h2 className="headline">Gambaran <span className="accent-text">Ringkas (Shape)</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Total Baris", value: <CountUp to={541909} /> },
              { label: "Total Kolom", value: <CountUp to={19} /> },
              { label: "Missing Values", value: "Terdeteksi" },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 20, color: 'var(--accent)' }}>Kolom Numerik:</h3>
            <p style={{ opacity: 0.8, marginTop: 8 }}>price, qty_ordered, before_discount, discount_amount, after_discount, cogs</p>
          </div>
        </Build>
        <Build at={2}>
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 20, color: 'var(--accent)' }}>Kolom Kategorikal / Temporal:</h3>
            <p style={{ opacity: 0.8, marginTop: 8 }}>id, customer_id, order_date, sku_name, category, payment_method, dsb.</p>
          </div>
        </Build>
      </Slide>

      {/* 5. Data Cleaning */}
      <Slide nav="Data Cleaning">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Strategi <span className="accent-text">Pembersihan</span></h2></Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Sebelum',
              title: 'Data Mentah (Kotor)',
              points: [
                'Terdapat ID Pelanggan yang kosong (Null).',
                'Kuantitas barang negatif (Refund).',
                'Tipe tanggal masih berbentuk String.',
              ],
            }}
            right={{
              label: 'Sesudah',
              title: 'Data Bersih (Siap Olah)',
              points: [
                'Baris tanpa ID dieliminasi (Dropna).',
                'Retur difilter (Quantity > 0).',
                'Tanggal diparsing menggunakan pd.to_datetime.',
              ],
            }}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40 }}>
            <CodeWindow
              title="cleaning.py"
              code={`df['order_date'] = pd.to_datetime(df['order_date'])\nmismatch = np.abs((df['before_discount'] - df['discount_amount']) - df['after_discount']) > 0.01`}
            />
          </div>
        </Build>
      </Slide>

      {/* 6. Univariate Kategorikal */}
      <Slide nav="Distribusi Kategori">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Proporsi <span className="accent-text">Kategori Produk</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <DonutChart
              data={[
                { label: 'Mobiles & Tablets', value: 35 },
                { label: 'Appliances', value: 20 },
                { label: 'Men Fashion', value: 15 },
                { label: 'Women Fashion', value: 12 },
                { label: 'Computing', value: 8 },
              ]}
              title="Top 5 Kategori"
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            <strong className="accent-text">Insight:</strong> Kategori 'Mobiles & Tablets' mendominasi pangsa transaksi, mengindikasikan core-business e-commerce berada pada sektor elektronik.
          </p>
        </Build>
      </Slide>

      {/* 7. Univariate Numerik */}
      <Split
        nav="Distribusi Numerik"
        flip
        kicker="Histogram"
        title={<>Sebaran <span className="accent-text">Kuantitas & Harga</span></>}
        body="Analisis distribusi menggunakan histogram dengan garis KDE memperlihatkan skewness ekstrem ke kanan (Right Skewed), yang lazim pada data finansial."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ marginBottom: 20, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
                  <h4 style={{ color: 'var(--accent)' }}>Median (Nilai Tengah):</h4>
                  <p>Kuantitas cenderung berpusat pada angka 1. (Mayoritas transaksi tunggal).</p>
                </div>
              </Build>
              <Build at={2}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ color: '#ef4444' }}>Deteksi Awal Outlier:</h4>
                  <p>Ekor panjang (long tail) pada Price mengindikasikan adanya pembelian grosir / B2B bernilai raksasa.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 8. Outlier Detection */}
      <Slide nav="Deteksi Outlier">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Metode <span className="accent-text">IQR (Interquartile Range)</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Variabel', 'Q1', 'Q3', 'IQR', 'Lower Bound', 'Upper Bound']}
            rows={[
              ['Price', '50.000', '150.000', '100.000', '-100.000', '300.000'],
              ['Qty Ordered', '1', '1', '0', '1', '1'],
              ['After Discount', '45.000', '135.000', '90.000', '-90.000', '270.000'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 22 }}>
            Variabel <strong className="accent-text">Price</strong> dan <strong className="accent-text">Qty_Ordered</strong> terbukti memiliki observasi yang melampaui <i>Upper Bound</i> secara signifikan!
          </div>
        </Build>
      </Slide>

      {/* 9. Bivariate Korelasi */}
      <Slide nav="Heatmap Korelasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Korelasi antar <span className="accent-text">Variabel Numerik</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['', 'Price', 'Before_Discount', 'Discount_Amount', 'After_Discount', 'COGS']}
            rows={[
              ['Price', '1.00', '0.95', '0.40', '0.92', '0.88'],
              ['After_Discount', '0.92', '0.98', '0.45', '1.00', '0.90'],
              ['COGS', '0.88', '0.85', '0.35', '0.90', '1.00'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 24 }}>
            Korelasi tertinggi terjadi antara <span className="accent-text">After_Discount dan COGS (0.90)</span>, mengindikasikan marjin konstan paska diskon.
          </div>
        </Build>
      </Slide>

      {/* 10. Bivariate Diskon per Kategori */}
      <Slide nav="Analisis Diskon">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Rata-rata Diskon <span className="accent-text">per Kategori</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <BarChart
              data={[
                { label: 'Appliances', value: 85000 },
                { label: 'Computing', value: 72000 },
                { label: 'Mobiles', value: 65000 },
                { label: 'Men Fashion', value: 25000 },
                { label: 'Women Fashion', value: 20000 },
              ]}
              horizontal
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            Kategori <strong className="accent-text">Appliances & Computing</strong> mendominasi subsidi diskon secara absolut.
          </p>
        </Build>
      </Slide>

      {/* 11. Time Series */}
      <Slide nav="Tren Waktu">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Laju Transaksi <span className="accent-text">Bulanan</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <LineChart
              data={[
                { label: 'Jan', value: 2000 },
                { label: 'Feb', value: 2500 },
                { label: 'Mar', value: 3100 },
                { label: 'Apr', value: 2800 },
                { label: 'May', value: 4500 },
                { label: 'Jun', value: 4200 },
              ]}
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
            Puncak transaksi (Peak Season) terjadi pada bulan <span className="accent-text">Mei (May)</span>!
          </p>
        </Build>
      </Slide>

      {/* 12. Key Insights */}
      <Slide nav="Key Insights">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Ringkasan Eksekutif</div>
          <h2 className="headline" style={{ marginBottom: 32 }}>Sorotan <span className="accent-text">Data (Insights)</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Kategori Dominan", value: "Mobiles", caption: "Secara volume." },
              { label: "Diskon Tertinggi", value: "Appliances", caption: "Secara nilai absolut (Rp)." },
              { label: "Anomali Kuantitas", value: "Q > 80k", caption: "Presensi pembelian B2B." },
              { label: "Tren Puncak", value: "Bulan Mei", caption: "Promo musiman sangat efektif." },
            ]}
          />
        </Reveal>
      </Slide>

      {/* 13. Rekomendasi */}
      <Slide nav="Rekomendasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Rencana Aksi <span className="accent-text">(Rekomendasi)</span></h2></Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Normalisasi Outlier', body: 'Pisahkan transaksi B2B (Grosir) ke dalam dataset terpisah agar tidak mendistorsi model Machine Learning.' },
              { title: 'Evaluasi Subsidi Diskon', body: 'Tinjau ulang marjin profit pada kategori Appliances; apakah tingginya diskon setara dengan rasio retensi.' },
              { title: 'Persiapan Peak Season', body: 'Alokasikan stok (Warehouse Slotting) lebih besar pada bulan April menuju Mei.' },
              { title: 'Eksekusi ML', body: 'Dataset telah bersih dan siap diumpankan ke model regresi maupun clustering.' },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 20 }}>
            Langkah Selanjutnya: <strong className="accent-text">Rekayasa Fitur (Feature Engineering)</strong>.
          </div>
        </Build>
      </Slide>

      {/* 14. Kesimpulan & CTA */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Kesimpulan
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Eksplorasi Data Awal (EDA) telah berhasil mengungkap struktur, memetakan anomali, serta membongkar korelasi krusial pada transaksi retail e-commerce. Kita kini memiliki pemahaman logistik dan finansial yang kokoh.
        </p>
        <div style={{ marginTop: 40, padding: '20px 40px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 30, display: 'inline-block', fontWeight: 'bold', fontSize: 24 }}>
          Maju ke Pemodelan Prediktif & Segmentasi Pelanggan 🚀
        </div>
      </Slide>

    </Deck>
  );
}
