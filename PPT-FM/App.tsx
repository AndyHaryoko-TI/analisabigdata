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
import { BarChart, DonutChart, LineChart } from './components/Charts';

export default function App() {
  return (
    <Deck>
      {/* 1. Cover */}
      <Cover
        nav="Sampul"
        kicker="Teknik Industri · Semester 3"
        title={<span>Analisis RFM: <span className="accent-text">Segmentasi Pelanggan</span></span>}
        subtitle="Analisa Big Data — Dataset Transaksi Retail"
        foot="Disusun secara Otomatis"
      />

      {/* 2. Agenda */}
      <Agenda
        nav="Agenda"
        kicker="Silabus Analitik"
        title="Pokok Pembahasan."
        items={[
          { title: "Latar Belakang", hint: "Apa itu RFM?" },
          { title: "Data Overview", hint: "Data Pelanggan" },
          { title: "Data Cleaning", hint: "Agregasi Profil" },
          { title: "Parameter Recency", hint: "Keterbaruan Transaksi" },
          { title: "Parameter Frequency", hint: "Loyalitas Kunjungan" },
          { title: "Parameter Monetary", hint: "Nilai Belanja" },
          { title: "Sistem Scoring", hint: "Kuartil 1-4" },
          { title: "Rekomendasi Strategi", hint: "Personalisasi Segmen" }
        ]}
      />

      {/* 3. Latar Belakang */}
      <Slide nav="Latar Belakang">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Pengantar CRM</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Mengapa <span className="accent-text">RFM Analysis?</span>
          </h2>
        </Reveal>
        <Reveal>
          <Bento
            tiles={[
              { c: 2, r: 1, title: 'Prinsip Pareto (Aturan 80/20)', body: '80% dari total pendapatan biasanya berasal dari 20% pelanggan teratas. Kita harus tahu siapa mereka!' },
              { c: 2, r: 1, title: 'Menghindari Pemasaran Membabi Buta', body: 'Pelanggan setia butuh apresiasi (rewards), pelanggan pasif butuh stimulus (diskon). Satu strategi tidak bisa memuaskan semuanya.', variant: 'accent' }
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 24, fontWeight: 'bold' }}>
            <span className="accent-text">Misi Utama:</span> Mengklasifikasikan database konsumen untuk kampanye pemasaran (Marketing Campaign) yang presisi.
          </div>
        </Build>
      </Slide>

      {/* 4. Data Overview */}
      <Slide nav="Data Overview">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>Struktur Himpunan Data</div>
          <h2 className="headline">Atribut Fokus <span className="accent-text">Pelanggan</span></h2>
        </Reveal>
        <Reveal>
          <StatGrid
            stats={[
              { label: "Transaksi Terekam", value: <CountUp to={541909} /> },
              { label: "Unit Observasi", value: "Customer Level" },
              { label: "Metrik", value: "R, F, M" },
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 20, color: 'var(--accent)' }}>Variabel Utama:</h3>
            <p style={{ opacity: 0.8, marginTop: 8 }}>customer_id, order_date (R), id (F), after_discount (M)</p>
          </div>
        </Build>
      </Slide>

      {/* 5. Data Cleaning & Agregasi */}
      <Slide nav="Agregasi Pelanggan">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Transformasi <span className="accent-text">Profil Konsumen</span></h2></Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Pembersihan',
              title: 'Filtrasi Anomali',
              points: [
                'Hapus pelanggan tamu (tanpa customer_id).',
                'Ambil khusus transaksi berstatus valid.',
              ],
            }}
            right={{
              label: 'Agregasi RFM',
              title: 'Pivot (Group By ID)',
              points: [
                'Recency: (Hari Ini - max order_date).',
                'Frequency: count distinct id (order).',
                'Monetary: sum(after_discount).',
              ],
            }}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40 }}>
            <CodeWindow
              title="rfm_agg.py"
              code={`rfm = df.groupby('customer_id').agg(
    Recency=('order_date', lambda x: (snapshot - x.max()).days),
    Frequency=('id', 'nunique'),
    Monetary=('after_discount', 'sum')
)`}
            />
          </div>
        </Build>
      </Slide>

      {/* 6. Perhitungan Recency */}
      <Split
        nav="Recency (R)"
        flip
        kicker="Parameter Pertama"
        title={<>Definisi <span className="accent-text">Recency</span></>}
        body="Recency menghitung jumlah hari sejak interaksi belanja terakhir pelanggan. Semakin KECIL angkanya (baru saja belanja), semakin TINGGI probabilitas mereka untuk belanja lagi."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)' }}>Insight Distribusi:</h4>
                  <p>Distribusi Recency umumnya terpecah dua (Bimodal): kelompok yang baru saja bertransaksi bulan ini, dan kelompok dorman (Churn) yang sudah absen berbulan-bulan.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 7. Perhitungan Frequency */}
      <Split
        nav="Frequency (F)"
        flip
        kicker="Parameter Kedua"
        title={<>Definisi <span className="accent-text">Frequency</span></>}
        body="Frequency menghitung total frekuensi kunjungan atau transaksi valid (jumlah setruk). Menandakan seberapa 'loyal' konsumen berbelanja berulang kali."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)' }}>Insight Distribusi:</h4>
                  <p>Memiliki ekor panjang (Long Tail) esktrem. 70% pelanggan mungkin hanya belanja 1-2 kali (One-time buyers), sedangkan segelintir pelanggan loyal bisa belanja &gt;50 kali.</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 8. Perhitungan Monetary */}
      <Split
        nav="Monetary (M)"
        flip
        kicker="Parameter Ketiga"
        title={<>Definisi <span className="accent-text">Monetary</span></>}
        body="Monetary adalah total nilai kontribusi uang (Revenue) yang disetorkan pelanggan selama periode observasi."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <Build at={1}>
                <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ color: '#ef4444' }}>Peringatan Skewness:</h4>
                  <p>Sangat berkorelasi positif dengan Frequency. Nilainya bisa mengandung anomali (Outliers) jika ada transaksi kelas B2B (Grosir).</p>
                </div>
              </Build>
            </div>
          </>
        }
      />

      {/* 9. Scoring RFM */}
      <Slide nav="RFM Scoring">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Metode <span className="accent-text">Kuartil (1 - 4)</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Parameter', 'Kuartil 1 (Terburuk)', 'Kuartil 4 (Terbaik)']}
            rows={[
              ['Recency (R)', 'Sangat lama absen (>180 Hari)', 'Baru saja belanja (<30 Hari)'],
              ['Frequency (F)', 'Belanja 1 kali saja', 'Sering belanja (>15 Kali)'],
              ['Monetary (M)', 'Nilai belanja amat kecil', 'Menghabiskan jutaan rupiah'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 22 }}>
            Semua parameter akan dilebur menjadi satu identitas <strong className="accent-text">RFM Score</strong> (contoh: "444" adalah pelanggan sempurna, "111" adalah pelanggan terburuk).
          </div>
        </Build>
      </Slide>

      {/* 10. Segmentasi Pelanggan */}
      <Slide nav="Pemetaan Segmen">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Segmentasi <span className="accent-text">Logis</span></h2></Reveal>
        <Reveal>
          <Table
            columns={['Segmen Pemasaran', 'Logika Filter (Skala 4)', 'Deskripsi Konsumen']}
            rows={[
              ['Champions', 'R=4, F=4, M=4', 'Terbaik: Baru belanja, sering, habis banyak uang.'],
              ['Loyal Customers', 'F=3/4, M=3/4', 'Penyumbang margin stabil.'],
              ['At Risk', 'R=1, F=3/4', 'Mantan pelanggan setia yang kini menghilang.'],
              ['New Customers', 'R=4, F=1', 'Pengguna baru mendaftar & transaksi pertama.'],
              ['Hibernating', 'R=1, F=1, M=1', 'Lama pergi dan nilainya kecil.'],
            ]}
          />
        </Reveal>
      </Slide>

      {/* 11. Visualisasi Distribusi Segmen */}
      <Slide nav="Distribusi Segmen">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Proporsi Populasi <span className="accent-text">Pelanggan</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <BarChart
              data={[
                { label: 'Champions', value: 450 },
                { label: 'Loyal', value: 850 },
                { label: 'Potential Loyalist', value: 1200 },
                { label: 'At Risk', value: 320 },
                { label: 'Hibernating', value: 2100 },
              ]}
              horizontal
            />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 22 }}>
            <strong className="accent-text">Insight:</strong> Segmen "Hibernating" mendominasi secara populasi kepala (Headcount). Ini wajar dalam siklus e-commerce.
          </p>
        </Build>
      </Slide>

      {/* 12. Heatmap & Scatter RFM */}
      <Slide nav="Kuadran Retensi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Matriks <span className="accent-text">R vs F</span></h2></Reveal>
        <Reveal>
           <div style={{ textAlign: 'center', margin: '20px 0', fontSize: 18, color: 'var(--fg-muted)' }}>
              (Sumbu Y: Frekuensi Kunjungan | Sumbu X: Keterbaruan)
           </div>
           <Table
            columns={['Frekuensi \ Recency', 'Baru (R=4)', 'Lama Absen (R=1)']}
            rows={[
              ['Sering (F=4)', 'Champions (Pertahankan)', 'At Risk (Harus direbut kembali)'],
              ['Jarang (F=1)', 'New Customers (Sambut)', 'Lost / Hibernating (Biarkan)'],
            ]}
          />
        </Reveal>
        <Build at={1}>
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 24 }}>
            Fokuskan budget (Diskon/Promo) pada kelompok <strong className="accent-text">At Risk</strong> untuk menarik mereka kembali sebelum jatuh ke tangan kompetitor!
          </div>
        </Build>
      </Slide>

      {/* 13. Revenue per Segmen */}
      <Slide nav="Revenue per Segmen">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Kontribusi <span className="accent-text">Revenue (Rupiah)</span></h2></Reveal>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <DonutChart value={65} label="Porsi Champions & Loyal" size={200} />
          </div>
        </Reveal>
        <Build at={1}>
          <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
            Ironisnya, meski <strong style={{ color: '#ef4444' }}>Hibernating</strong> terbanyak secara kepala, <span className="accent-text">Champions & Loyal</span> lah yang menyumbang 65% total uang masuk perusahaan!
          </p>
        </Build>
      </Slide>

      {/* 14. Key Insights & Rekomendasi */}
      <Slide nav="Rekomendasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center', marginBottom: 40 }}>Rencana <span className="accent-text">Pemasaran</span></h2></Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Reward Champions', body: 'Berikan akses eksklusif perilisan produk baru (VIP Treatment). Jangan berikan diskon, karena mereka sudah pasti beli tanpa diskon.' },
              { title: 'Re-engage At Risk', body: 'Kirim email personalisasi dengan kupon diskon agresif "Kami Rindu Anda!".' },
              { title: 'Nurture New Customers', body: 'Kirimkan guide/bantuan produk, usahakan agar mereka belanja untuk kedua kalinya (Onboarding).' },
              { title: 'Ignore Lost', body: 'Hentikan biaya iklan (Ads) terhadap mereka untuk menekan efisiensi CAC (Customer Acquisition Cost).' },
            ]}
          />
        </Reveal>
      </Slide>

      {/* 15. Kesimpulan & CTA */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Personalisasi adalah Kunci
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Tidak semua pelanggan diciptakan setara. Analisis RFM merubah basis data mentah menjadi amunisi untuk menciptakan strategi CRM (Customer Relationship Management) yang bernilai tinggi secara emosional dan finansial.
        </p>
        <div style={{ marginTop: 40, padding: '20px 40px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 30, display: 'inline-block', fontWeight: 'bold', fontSize: 24 }}>
          Implementasi Strategi Retensi & Personalisasi 🤝
        </div>
      </Slide>

    </Deck>
  );
}
