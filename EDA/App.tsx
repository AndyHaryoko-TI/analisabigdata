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
import Quote from './components/Quote';

export default function App() {
  return (
    <Deck>
      {/* 1. Cover */}
      <Cover
        nav="Sampul"
        kicker="Program Studi Teknik Industri (Semester 3)"
        title={<span>Eksplorasi Data <span className="accent-text">Awal (EDA)</span></span>}
        subtitle="Analisis Deskriptif dan Prapemrosesan Dataset Ritel dengan Python"
        foot="Mata Kuliah: Analisis Big Data"
      />

      {/* 2. Agenda */}
      <Agenda
        nav="Agenda Perkuliahan"
        kicker="Silabus Modul EDA"
        title="Pokok Bahasan Praktikum."
        items={[
          { title: "Filosofi EDA", hint: "Urgensi kebersihan data bagi SCM" },
          { title: "Pemuatan & Inspeksi", hint: "Mengimpor Pandas & observasi struktur" },
          { title: "Kualitas Data", hint: "Kuantifikasi nilai hilang (Missing Values)" },
          { title: "Statistika Deskriptif", hint: "Evaluasi matematis (Mean, Min, Max)" },
          { title: "Reduksi Anomali", hint: "Memisahkan data logistik terbalik (Retur)" }
        ]}
      />

      {/* 3. Konsep */}
      <Slide center nav="Signifikansi EDA" notes="Tekankan bahwa data mentah industri tidak pernah bersih.">
        <Quote
          text="Dalam rantai pasok modern, akurasi algoritma prediksi permintaan (forecasting) bergantung mutlak pada integritas data yang diumpankan. Sampah yang masuk, sampah pula yang keluar (Garbage In, Garbage Out)."
          author="Prinsip Analitik Industri"
          title="Urgensi Prapemrosesan"
        />
      </Slide>

      {/* 4. Persiapan Data */}
      <Split
        nav="Pemuatan Data"
        flip
        kicker="Tahap 1: Persiapan Lingkungan"
        title={<>Pemuatan Himpunan <span className="accent-text">Data</span></>}
        body="Tahapan inisiasi menggunakan pustaka komputasi numerik Pandas. Dataset bervolume raksasa dimuat dari file statis menjadi objek Kerangka Data (DataFrame) agar dapat dimanipulasi memori."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="1_load_data.py"
                highlight={[1, 4]}
                code={`import pandas as pd
import numpy as np

# Memuat himpunan data transaksi e-commerce
df = pd.read_csv('Dataset_Transaction_Retail.csv', sep=';')

print("Pemuatan data ke dalam memori (RAM) selesai.")`}
              />
            </div>
          </>
        }
      />

      {/* 5. Inspeksi Dimensi */}
      <Split
        nav="Inspeksi Dimensi"
        kicker="Tahap 2: Karakteristik Data"
        title={<>Inspeksi Dimensi & <span className="accent-text">Tipe Atribut</span></>}
        body="Sebelum memproses secara matematis, seorang Data Analyst wajib memverifikasi jumlah observasi (baris) dan memastikan klasifikasi tipe data (numerik vs nominal) telah sesuai."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="2_inspect_data.py"
                highlight={[2, 6]}
                code={`# Mengembalikan tupel (jumlah_baris, jumlah_kolom)
print("Dimensi Data:", df.shape)
# Output: (541909, 8)

# Menampilkan informasi komprehensif tipe data tiap variabel
df.info()

# Analisis Kritis: 
# Apakah 'InvoiceDate' sudah berupa Datetime?
# Apakah 'Quantity' dan 'UnitPrice' terdeteksi numerik?`}
              />
            </div>
          </>
        }
      />

      {/* 6. Observasi Visual */}
      <Split
        nav="Tinjauan Sampel"
        flip
        kicker="Tahap 3: Observasi Visual"
        title={<>Tinjauan <span className="accent-text">Sampel Observasi</span></>}
        body="Penggunaan fungsi head() memungkinkan kita mengintip konfigurasi data paling awal. Hal ini penting guna memastikan delimitator file terbaca secara presisi oleh kompilator."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="3_sample_data.py"
                code={`# Menampilkan 5 pengamatan (baris) pertama
display(df.head())

''' Output Ringkas:
InvoiceNo | StockCode | Description  | Quantity | UnitPrice | CustomerID
   536365 |    85123A | WHITE HANGING|        6 |      2.55 |      17850
   536365 |     71053 | WHITE METAL  |        6 |      3.39 |      17850
'''`}
              />
            </div>
          </>
        }
      />

      {/* 7. Kualitas Data */}
      <Slide nav="Integritas Data">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Tahap 4: Identifikasi Kualitas</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Inspeksi Kualitas <span className="accent-text">Pengamatan</span>
          </h2>
        </Reveal>
        <Reveal>
          <Contrast
            left={{
              label: 'Nilai Kosong (NaN)',
              title: 'Presensi Missing Values',
              points: [
                'Data logistik kerap kali tidak utuh akibat kelalaian input atau kesalahan sensor.',
                'Atribut krusial seperti CustomerID dapat kosong jika pengguna membeli sebagai "Tamu" (Guest).',
              ],
            }}
            right={{
              label: 'Nilai Ekstrem (Anomali)',
              title: 'Presensi Pencilan (Outliers)',
              points: [
                'Transaksi dengan Kuantitas berjumlah negatif.',
                'Merepresentasikan pengembalian uang (Refund) atau logistik terbalik (Retur Gudang).',
              ],
            }}
          />
        </Reveal>
      </Slide>

      {/* 8. Kuantifikasi Null */}
      <Split
        nav="Kuantifikasi Null"
        kicker="Tahap 5: Kuantifikasi Null"
        title={<>Kalkulasi <span className="accent-text">Nilai Hilang</span></>}
        body="Secara matematis, kita menghitung total akumulasi entri kosong pada masing-masing variabel. Temuan ini menjadi landasan argumentasi akademis untuk menghapus (drop) atau mengisi (impute) data."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="4_check_null.py"
                highlight={[2]}
                code={`# Mengkalkulasi akumulasi nilai kosong secara Boolean
print(df.isnull().sum())

'''
InvoiceNo           0
StockCode           0
Description      1454
Quantity            0
InvoiceDate         0
UnitPrice           0
CustomerID     135080
Country             0
'''`}
              />
            </div>
          </>
        }
      />

      {/* 9. Penanganan Null */}
      <Split
        nav="Resolusi Null"
        flip
        kicker="Tahap 6: Eksekusi Eliminasi"
        title={<>Resolusi <span className="accent-text">Listwise Deletion</span></>}
        body="Untuk kepentingan klasifikasi pelanggan (seperti RFM), keberadaan identitas (CustomerID) bersifat mandatori (wajib). Oleh sebab itu, kita melakukan eliminasi pada baris cacat tersebut."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="5_drop_null.py"
                highlight={[2, 4]}
                code={`# Menghapus rekod (pengamatan) yang tidak memiliki CustomerID
df_clean = df.dropna(subset=['CustomerID']).copy()

print(f"Total observasi tersisa: {len(df_clean)} baris.")
# Dari 541 ribu pengamatan, kita menyisakan 406 ribu data teridentifikasi.`}
              />
            </div>
          </>
        }
      />

      {/* 10. Statistika Deskriptif */}
      <Split
        nav="Statistika Deskriptif"
        kicker="Tahap 7: Evaluasi Matematis"
        title={<>Evaluasi <span className="accent-text">Statistika Deskriptif</span></>}
        body="Fungsi describe() menyajikan tendensi sentral (Mean, Median) serta dispersi (Standar Deviasi) dari variabel kontinu (numerik). Ini membongkar presensi pencilan ekstrem."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="6_describe.py"
                highlight={[2, 6]}
                code={`# Menampilkan matriks ringkasan komputasi statistik
display(df_clean.describe())

''' Analisis Temuan Numerik:
- Rata-rata Kuantitas (Quantity) = 12 unit.
- Nilai Minimum (Min) Kuantitas = -80.995 unit. (INDIKASI RETUR)
- Nilai Maksimum (Max) Kuantitas = 80.995 unit. (INDIKASI GROSIR EKSTREM)
'''`}
              />
            </div>
          </>
        }
      />

      {/* 11. Filtrasi Boolean */}
      <Split
        nav="Filtrasi Retur"
        flip
        kicker="Tahap 8: Filtrasi Kondisional"
        title={<>Eliminasi Data <span className="accent-text">Logistik Terbalik</span></>}
        body="Transaksi dengan kuantitas kurang dari nol mendistorsi nilai arus kas masuk. Dengan pengindeksan kondisional (Boolean Indexing), kita menyaring hanya pesanan valid."
        media={
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunken)' }} />
            <div style={{ position: 'relative', padding: 36, width: '100%' }}>
              <CodeWindow
                title="7_filter_anomaly.py"
                highlight={[2, 6]}
                code={`# Mengekstraksi hanya transaksi penjualan dengan kuantitas > 0
df_valid = df_clean[df_clean['Quantity'] > 0].copy()

# Opsional: Memisahkan data retur untuk analisis Quality Control
df_retur = df_clean[df_clean['Quantity'] < 0].copy()

print(f"Data penjualan yang menghasilkan arus kas murni: {len(df_valid)}")`}
              />
            </div>
          </>
        }
      />

      {/* 12. Konklusi */}
      <Slide nav="Konklusi Prapemrosesan">
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12, textAlign: 'center' }}>Penyelesaian Prapemrosesan</div>
          <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto', marginBottom: 'clamp(20px,3vh,32px)' }}>
            Kesiapan Data untuk <span className="accent-text">Pemodelan ML</span>
          </h2>
        </Reveal>
        <Reveal>
          <Steps
            items={[
              { title: 'Integritas Leksikal', body: 'Tipe data telah terverifikasi, variabel temporal (waktu) dan numerik telah diselaraskan dengan fungsi komputasi.' },
              { title: 'Reduksi Distorsi (Noise)', body: 'Himpunan data kini bebas dari pencilan ekstrem matematis maupun variabel beridentitas anonim.' },
              { title: 'Transisi Fase Analitik', body: 'Struktur data yang bersih siap diumpankan pada algoritma klasifikasi tingkat lanjut (RFM) maupun Association Rules (Apriori).' },
            ]}
          />
        </Reveal>
      </Slide>

      {/* 13. Penutup */}
      <Slide center nav="Penutup">
        <h2 className="headline" style={{ textAlign: 'center', marginInline: 'auto' }}>
          Data mentah layaknya <span className="accent-text">bijih besi.</span><br/>
          EDA adalah proses <span className="accent-text">penempaannya.</span>
        </h2>
        <p className="body" style={{ marginInline: 'auto', textAlign: 'center', marginTop: 20 }}>
          Sesi Modul 1 Berakhir. Silakan ujicoba kode Python tersebut pada mesin lokal Anda.
        </p>
      </Slide>

    </Deck>
  );
}
