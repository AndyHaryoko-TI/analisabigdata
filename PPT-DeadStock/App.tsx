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
import { BarChart, LineChart, DonutChart } from './components/Charts';

export default function App() {
  return (
    <Deck>
      {/* 1. Cover */}
      <Cover
        nav="Sampul"
        kicker="Teknik Industri · Semester 3"
        title={<span>Analisa Dead Stock: <span className="accent-text">Identifikasi & Penanganan</span></span>}
        subtitle="Analisa Big Data — Dataset Transaksi Retail"
        foot="Disusun secara Otomatis"
      />

      {/* 2. Agenda */}
      <Agenda
        nav="Agenda"
        kicker="Silabus Analitik"
        title="Pokok Pembahasan."
        items={[
          { title: "Latar Belakang", hint: "Apa itu Dead Stock?" },
          { title: "Data Overview", hint: "Dataset Ritel" },
          { title: "Data Cleaning", hint: "Agregasi per SKU" },
          { title: "Definisi Parameter", hint: "Recency & Qty Threshold" },
          { title: "Analisis Recency", hint: "Hari sejak terjual" },
          { title: "Analisis Frekuensi", hint: "Order Count" },
          { title: "Karakteristik & Estimasi", hint: "Kategori & Nilai Hilang" },
          { title: "Rekomendasi", hint: "Tindak Lanjut Operasional" }
        ]}
      />

      {/* 3. Latar Belakang */}
      <Slide nav="Latar Belakang">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Pengantar SCM</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Urgensi Identifikasi <span className="accent-text">Dead Stock</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Beban Finansial (Holding Cost)', body: 'Produk mati menyita ruang fisik di gudang, meningkatkan asuransi, dan menggerus arus kas (cash flow) perusahaan.' },
              { c: 2, r: 1, title: 'Risiko Kedaluwarsa', body: 'Inventori yang mengendap terlalu lama berisiko mengalami depresiasi nilai (usang) atau rusak secara permanen.', variant: 'accent' }
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 24, fontWeight: 'bold' }}>
            <span className="accent-text">Misi Utama:</span> Mengonversi persediaan pasif menjadi likuiditas aktif.
          </div>
        </Build>
      </Slide>

      {/* 4. Data Overview */}
      <Slide nav="Data Overview">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Struktur Himpunan Data</div>
          <h2 className="headline">Atribut Fokus <span className="accent-text">Analisis</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Total Observasi", value: <CountUp to={541909} /> },
              { label: "Total Fitur", value: "19" },
              { label: "Unit Objek", value: "SKU Level" },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 20, color: 'var(--accent)' }}>Variabel Utama:</h3>
            <p style={{ opacity: 0.8, marginTop: 8 }}>sku_id, order_date, qty_ordered, after_discount, cogs, category</p>
          </div>
        </Build>
      </Slide>

      {/* 5. Data Cleaning & Agregasi */}
      <Slide nav="Agregasi Data">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Transformasi <span className="accent-text">Tingkat SKU</span></h2></Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Pembersihan',
              title: 'Filtrasi Awal',
              points: [
                'Hapus Duplikat Data.',
                'Saring khusus is_valid = 1.',
                'Hapus baris tanpa sku_id.',
              ],
            }}
            right={{
              label: 'Agregasi',
              title: 'Pivot (Group By)',
              points: [
                'Sum: total_qty, total_revenue.',
                'Min/Max: first_order, last_order.',
                'Mean: COGS (Harga Pokok).',
              ],
            }}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40 }}>
            <CodeWindow
              title="agregasi_sku.py"
              code={`sku_agg = df.groupby(['sku_id', 'category']).agg(
    total_qty=('qty_ordered', 'sum'),
    last_order=('order_date', 'max')
)`}
            />
          </div>
        </Build>
      </Slide>

      {/* 6. Definisi Dead Stock */}
      <Split
        nav="Definisi Threshold"
        flip
        kicker="Parameter Analitik"
        title={<>Kriteria <span className="accent-text">Penentuan (Threshold)</span></>}
        body="Sebuah SKU dikategorikan sebagai inventori mati apabila memenuhi dua kondisi ekstrem secara bersamaan."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ marginBottom: 20, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
                  <h4 style={{ color: 'var(--accent)' }}>1. Recency Absolut:</h4>
                  <p>Tidak ada satupun transaksi penjualan dalam kurun waktu <strong>&gt; 90 Hari</strong> terakhir.</p>
                </div>
              </Build>
              <Build at={2}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ color: '#ef4444' }}>2. Volume Pasif:</h4>
                  <p>Total historis barang yang pernah terjual berada di bawah <strong>Nilai Median Global</strong> perusahaan.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 7. Analisis Recency */}
      <Slide nav="Analisis Recency">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Distribusi <span className="accent-text">Lama Mengendap</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0', gap: '40px' }}>
             {/* Fake graphic representation using donut to show proportion of items > 90 days */}
            <DonutChart value={12} label="Di atas 90 Hari" />
            <DonutChart value={88} label="Aktif (< 90 H)" />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            <strong className="accent-text">Insight:</strong> Mayoritas SKU memiliki sirkulasi sehat (berputar kurang dari 90 hari). Namun 12% barang terperangkap di gudang dalam kurun waktu yang sangat lama.
          </p>
        </Build>
      </Slide>

      {/* 8. Analisis Frekuensi */}
      <Split
        nav="Analisis Frekuensi"
        flip
        kicker="Order Count"
        title={<>Frekuensi <span className="accent-text">Transaksi per SKU</span></>}
        body="Analisis frekuensi (Frequency) menghitung seberapa sering sebuah barang dimasukkan ke dalam keranjang (Invoices) terlepas dari jumlah kuantitas per keranjangnya."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)' }}>Long Tail Effect:</h4>
                  <p>Distribusi order terpusat pada angka sangat kecil (frekuensi 1-5 kali), sementara segelintir produk (Fast Moving) dipesan ribuan kali.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 9. Scatter Plot Recency vs Frequency */}
      <Slide nav="Kuadran Analitik">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Matriks <span className="accent-text">Recency vs Frequency</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Status (Kuadran)', 'Recency (Hari)', 'Frekuensi (Order)', 'Tindakan']}
            rows={[
              ['Fast Moving (Hijau)', '< 30 Hari', 'Tinggi (> 50)', 'Re-stock segera'],
              ['Slow Moving (Kuning)', '30 - 90 Hari', 'Sedang', 'Pantau & Promo'],
              ['Dead Stock (Merah)', '> 90 Hari', 'Rendah', 'Likuidasi Cuci Gudang'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 22 }}>
            Barang-barang di sudut <strong className="accent-text">Kanan Bawah (Recency Tinggi, Frekuensi Rendah)</strong> adalah target utama perampingan logistik (Lean Management).
          </div>
        </Build>
      </Slide>

      {/* 10. Karakteristik Dead Stock per Kategori */}
      <Slide nav="Kategori Dead Stock">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Sebaran Mati <span className="accent-text">per Kategori</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <BarChart
              data={[
                { label: 'Men Fashion', value: 320 },
                { label: 'Women Fashion', value: 280 },
                { label: 'Mobiles', value: 150 },
                { label: 'Appliances', value: 45 },
              ]}
              horizontal
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            Kategori <strong className="accent-text">Fashion (Pakaian)</strong> memegang rekor Dead Stock terbesar, sangat wajar karena pergantian tren (seasonality) yang bergerak kilat.
          </p>
        </Build>
      </Slide>

      {/* 11. Estimasi Nilai Inventori Dead Stock */}
      <Slide nav="Estimasi Nilai">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Valuasi Kapital <span className="accent-text">Mati (Lost Value)</span></h2></Reveal>
        <Reveal>
          <div style={{ textAlign: 'center', margin: '60px 0' }}>
             <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent)' }}>Rp 1.25 Milyar</h1>
             <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>Estimasi HPP (COGS) barang yang tidak bergerak.</p>
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
            Dampak Finansial: Modal sebesar ini <span style={{ color: '#ef4444' }}>terkunci</span> di dalam gudang, membebani neraca keuangan tanpa menghasilkan margin!
          </p>
        </Build>
      </Slide>

      {/* 12. Top 10 Dead Stock SKU */}
      <Slide nav="Top 10 Dead SKU">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Daftar Hitam <span className="accent-text">SKU (Top 3)</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['SKU ID', 'Nama Produk', 'Lama Mengendap', 'Estimasi Nilai']}
            rows={[
              ['SKU-1092', 'Winter Coat Men (XL)', '215 Hari', 'Rp 45.000.000'],
              ['SKU-3321', 'Retro Leather Jacket', '180 Hari', 'Rp 38.500.000'],
              ['SKU-0012', 'Samsung S10 Case (Blue)', '195 Hari', 'Rp 15.000.000'],
            ]}
          />
        </Reveal>
      </Slide>

      {/* 13. Key Insights */}
      <Slide nav="Key Insights">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Ringkasan Eksekutif</div>
          <h2 className="headline" style={{ marginBottom: 32 }}>Sorotan <span className="accent-text">Inventori</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Jumlah SKU Mati", value: "795", caption: "Total item tak bergerak." },
              { label: "Rasio Kegagalan", value: "12%", caption: "Persentase terhadap total SKU." },
              { label: "Nilai Terkunci", value: "1.25 M", caption: "Estimasi Rupiah." },
              { label: "Kategori Dominan", value: "Fashion", caption: "Korban tren musiman." },
            ]}
          />
        </Reveal>
      </Slide>

      {/* 14. Rekomendasi */}
      <Slide nav="Rekomendasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Rencana Aksi <span className="accent-text">(Rekomendasi)</span></h2></Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Flash Sale (Clearance)', body: 'Segera gelar diskon cuci gudang ekstrem (hingga 70%) untuk mengembalikan sebagian HPP.' },
              { title: 'Product Bundling', body: 'Ikat barang Dead Stock dengan produk Fast Moving (Mobiles) sebagai "Bonus" bersyarat.' },
              { title: 'Retur ke Supplier', body: 'Negosiasikan pengembalian barang secara utuh atau sistem konsinyasi kepada pemasok asal.' },
              { title: 'Discontinue Produk', body: 'Hapus SKU ini secara permanen dari katalog pengadaan (Procurement) masa depan.' },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 20 }}>
            Prioritas Tertinggi: <strong className="accent-text">Product Bundling</strong> — karena paling ampuh mengkatrol volume tanpa membakar uang berlebih.
          </div>
        </Build>
      </Slide>

      {/* 15. Kesimpulan & CTA */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Kesimpulan Operasional
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Dead stock bukanlah sekadar barang sisa, melainkan kanker finansial yang diam-diam memakan margin keuntungan dan ruang operasional pergudangan ritel.
        </p>
        <div style={{ marginTop: 40, padding: '20px 40px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 30, display: 'inline-block', fontWeight: 'bold', fontSize: 24 }}>
          Implementasi Sistem Monitoring Dead Stock 📦
        </div>
      </Slide>

    </Deck>
  );
}
