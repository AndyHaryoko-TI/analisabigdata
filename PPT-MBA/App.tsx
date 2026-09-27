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
import { BarChart, DonutChart } from './components/Charts';

export default function App() {
  return (
    <Deck>
      {/* 1. Cover */}
      <Cover
        nav="Sampul"
        kicker="Teknik Industri · Semester 3"
        title={<span>Market Basket Analysis: <span className="accent-text">Pola Pembelian</span></span>}
        subtitle="Analisa Big Data — Dataset Transaksi Retail"
        foot="Disusun secara Otomatis"
      />

      {/* 2. Agenda */}
      <Agenda
        nav="Agenda"
        kicker="Silabus Analitik"
        title="Pokok Pembahasan."
        items={[
          { title: "Latar Belakang", hint: "Apa itu MBA?" },
          { title: "Data Overview", hint: "Format Transaksi" },
          { title: "Data Preparation", hint: "One-Hot Encoding" },
          { title: "Konsep Asosiasi", hint: "Support, Confidence, Lift" },
          { title: "Frequent Itemsets", hint: "Apriori Algorithm" },
          { title: "Association Rules", hint: "Aturan Logis A -> B" },
          { title: "Visualisasi Data", hint: "Scatter, Heatmap, Network" },
          { title: "Rekomendasi", hint: "Cross-Selling & Tata Letak" }
        ]}
      />

      {/* 3. Latar Belakang */}
      <Slide nav="Latar Belakang">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Pengantar Data Mining</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Mengapa <span className="accent-text">Market Basket Analysis?</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Menyingkap Asosiasi Bawah Sadar', body: 'Menemukan hubungan antar produk yang sering dibeli bersamaan (seperti fenomena Bir dan Popok).' },
              { c: 2, r: 1, title: 'Optimasi Tata Letak (Layout)', body: 'Meletakkan barang yang saling melengkapi berdekatan untuk memicu pembelian impulsif.', variant: 'accent' }
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 24, fontWeight: 'bold' }}>
            <span className="accent-text">Misi Utama:</span> Meningkatkan ukuran keranjang rata-rata (Average Order Value) via Cross-Selling.
          </div>
        </Build>
      </Slide>

      {/* 4. Data Overview */}
      <Slide nav="Data Overview">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Struktur Himpunan Data</div>
          <h2 className="headline">Kebutuhan <span className="accent-text">Atribut MBA</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "ID Transaksi (Struk)", value: "id" },
              { label: "Nama Item", value: "sku_name" },
              { label: "Entitas Pembeli", value: "customer_id" },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, color: 'var(--accent)' }}>Konversi Vertikal ke Horizontal:</h3>
            <p style={{ opacity: 0.8, marginTop: 8, fontSize: 20 }}>
              Algoritma Apriori tidak bisa membaca data berbasis kolom. Ia butuh format <i>List of Lists</i> (Setiap Baris = 1 Keranjang).
            </p>
          </div>
        </Build>
      </Slide>

      {/* 5. Data Preparation */}
      <Slide nav="Persiapan Data">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Rekayasa <span className="accent-text">One-Hot Encoding</span></h2></Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Sebelum (Tabular)',
              title: 'Format Relasional',
              points: [
                'Struk 01: Susu',
                'Struk 01: Roti',
                'Struk 02: Susu',
              ],
            }}
            right={{
              label: 'Sesudah (Matrix Biner)',
              title: 'Format TransactionEncoder',
              points: [
                '[Susu: 1, Roti: 1, Gula: 0]',
                '[Susu: 1, Roti: 0, Gula: 0]',
                'True / False Boolean.',
              ],
            }}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40 }}>
            <CodeWindow
              title="basket_prep.py"
              code={`from mlxtend.preprocessing import TransactionEncoder
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)`}
            />
          </div>
        </Build>
      </Slide>

      {/* 6. Konsep Asosiasi */}
      <Slide nav="Tiga Pilar Asosiasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Metrik <span className="accent-text">Kekuatan Pola</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Metrik', 'Penjelasan Sederhana', 'Fungsi']}
            rows={[
              ['Support', 'Seberapa populer item tersebut di seluruh toko.', 'Menyaring item langka.'],
              ['Confidence', 'Jika beli A, berapa persen pasti beli B?', 'Mengukur keandalan aturan.'],
              ['Lift', 'Peningkatan probabilitas (ketergantungan).', 'Skor > 1 = Asosiasi Kuat.'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 22 }}>
            Fokus utama kita adalah mencari kombinasi dengan <strong className="accent-text">LIFT Score melampaui 1.0</strong> (Saling tarik menarik secara positif).
          </div>
        </Build>
      </Slide>

      {/* 7. Frequent Itemsets */}
      <Slide nav="Frequent Itemsets">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Pencarian Kombinasi <span className="accent-text">(Apriori)</span></h2></Reveal>
        <Reveal>
           <div style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>
             Parameter: <strong className="accent-text">min_support = 0.01 (1%)</strong>
           </div>
          <Table
            columns={['Itemset (Kombinasi)', 'Panjang', 'Support (%)']}
            rows={[
              ['[Mobiles & Tablets]', '1 Item', '35.0%'],
              ['[Appliances]', '1 Item', '20.5%'],
              ['[Mobiles & Tablets, Men Fashion]', '2 Item', '12.0%'],
              ['[Mobiles, Appliances, Gadget]', '3 Item', '1.5%'],
            ]}
          />
        </Reveal>
        <Build at={1}>
           <div style={{ marginTop: 30, textAlign: 'center', fontSize: 22, color: 'var(--fg-muted)' }}>
              (Kombinasi di bawah 1% dieleminasi dari memori agar algoritma berjalan cepat)
           </div>
        </Build>
      </Slide>

      {/* 8. Association Rules */}
      <Slide nav="Association Rules">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Daftar Aturan <span className="accent-text">Logis (A → B)</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Antecedents (Jika Beli..)', 'Consequents (Maka Beli..)', 'Confidence', 'Lift']}
            rows={[
              ['Mobiles', 'Men Fashion', '65%', '1.85'],
              ['Appliances', 'Women Fashion', '55%', '1.42'],
              ['Computing', 'Mobiles', '80%', '2.10'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 24 }}>
            Rule terkuat: <strong className="accent-text">Computing → Mobiles</strong>. Konsumen yang membeli periferal komputer hampir dipastikan juga membeli produk seluler/tablet!
          </div>
        </Build>
      </Slide>

      {/* 9. Visualisasi Scatter Plot */}
      <Split
        nav="Sebaran Aturan"
        flip
        kicker="Visualisasi Scatter"
        title={<>Pemetaan <span className="accent-text">Rules</span></>}
        body="Scatter plot memvisualisasikan seluruh rule yang tercipta. Support di sumbu X, Confidence di sumbu Y, dan warna mewakili intensitas Lift."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)' }}>Pojok Kanan Atas (Ideal):</h4>
                  <p>Aturan yang berada di sudut kanan atas memiliki frekuensi keterjadian tinggi dan tingkat kepastian luar biasa. Inilah kandidat utama Bundling.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 10. Visualisasi Top Rules */}
      <Slide nav="Top Lift Rules">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Ranking Aturan <span className="accent-text">Tertinggi (Lift)</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <BarChart
              data={[
                { label: 'Computing -> Mobiles', value: 2.10 },
                { label: 'Men F. -> Mobiles', value: 1.85 },
                { label: 'Appliances -> Women F.', value: 1.42 },
                { label: 'Mobiles -> Gadget', value: 1.30 },
              ]}
              horizontal
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            <strong className="accent-text">Interpretasi:</strong> Membeli "Computing" meningkatkan peluang membeli "Mobiles" sebesar 2.1 kali lipat dari peluang normalnya.
          </p>
        </Build>
      </Slide>

      {/* 11. Co-occurrence Heatmap */}
      <Slide nav="Heatmap Produk">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Matriks Kebersamaan <span className="accent-text">(Co-occurrence)</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Korelasi', 'Mobiles', 'Computing', 'Appliances', 'Fashion']}
            rows={[
              ['Mobiles', '1.00', '0.68', '0.22', '0.54'],
              ['Computing', '0.68', '1.00', '0.15', '0.11'],
              ['Appliances', '0.22', '0.15', '1.00', '0.45'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 24 }}>
            Korelasi Pearson biner mengkonfirmasi kuatnya tarikan magnet antara <span className="accent-text">Mobiles dan Computing (0.68)</span>.
          </div>
        </Build>
      </Slide>
      
      {/* 12. Network Graph */}
      <Slide nav="Jaringan Asosiasi">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Topologi Penjualan</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: '32px' }}>
            Network <span className="accent-text">Graph (Nodes & Edges)</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Node Besar (Hub)', body: 'Mobiles bertindak sebagai "Pusat Gravitasi" yang memiliki panah penghubung ke hampir semua kategori lain.' },
              { c: 2, r: 1, title: 'Edge Tebal (Koneksi)', body: 'Garis tebal melambangkan Lift Score tinggi antar simpul (node).', variant: 'accent' }
            ]}
          />
        </Reveal>
      </Slide>

      {/* 13. Key Insights */}
      <Slide nav="Key Insights">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Ringkasan Eksekutif</div>
          <h2 className="headline" style={{ marginBottom: 32 }}>Sorotan <span className="accent-text">Pembelian</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Top Antecedent", value: "Computing", caption: "Pemicu kuat." },
              { label: "Top Consequent", value: "Mobiles", caption: "Sasaran konversi." },
              { label: "Lift Maksimal", value: "2.10x", caption: "Lonjakan peluang." },
              { label: "Rules > 1.0", value: "14", caption: "Pola signifikan." },
            ]}
          />
        </Reveal>
      </Slide>

      {/* 14. Rekomendasi */}
      <Slide nav="Rekomendasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Rencana <span className="accent-text">Operasional</span></h2></Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Bundling Produk', body: 'Jual Computing dan Mobiles dalam satu paket harga diskon (Bundle Pricing).' },
              { title: 'Cross-Selling Digital', body: 'Tampilkan tab "Yang beli ini juga beli..." di halaman checkout aplikasi/web e-commerce.' },
              { title: 'Layout Gudang / Toko', body: 'Dekatkan lorong (Aisle) barang Elektronik dengan Aksesoris/Fashion pria.' },
              { title: 'Promosi Bersyarat', body: 'Beli Appliance min. 1 Juta, dapat diskon 50% untuk Fashion Wanita.' },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 20 }}>
            Tindakan Tercepat: <strong className="accent-text">Cross-Selling UI Tracker</strong> pada halaman aplikasi.
          </div>
        </Build>
      </Slide>

      {/* 15. Kesimpulan & CTA */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Membaca Pikiran Konsumen
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Algoritma Apriori berhasil mengungkap insting tersembunyi konsumen kita. Data menunjukkan bahwa pembelian suatu barang bukanlah probabilitas acak, melainkan sebuah jaring keterikatan yang bisa kita eksploitasi.
        </p>
        <div style={{ marginTop: 40, padding: '20px 40px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 30, display: 'inline-block', fontWeight: 'bold', fontSize: 24 }}>
          Mulai Optimasi Tata Letak & Katalog 🛒
        </div>
      </Slide>

    </Deck>
  );
}
