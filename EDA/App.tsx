import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Reveal from './deck/Reveal';
import Split from './components/Split';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';
import Contrast from './components/Contrast';

export default function App() {
  return (
    <Deck>
      <Cover nav="Sampul" kicker="Modul 1" title={<span>Eksplorasi Data <span className="accent-text">Awal (EDA)</span></span>} subtitle="Pembersihan dataset & filtrasi anomali" />
      <Slide nav="Kualitas Data">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Inspeksi Himpunan <span className="accent-text">Data Mentah</span></h2></Reveal>
        <Reveal>
          <Contrast
            left={{ label: 'Isu Nilai Kosong', title: 'Missing Values', points: ['Terdapat 135.080 transaksi tanpa ID.', 'Penanganan: Listwise Deletion (Dropna).'] }}
            right={{ label: 'Isu Nilai Ekstrem', title: 'Anomali Logistik', points: ['Kuantitas negatif merepresentasikan retur.', 'Penanganan: Filter kuantitas > 0.'] }}
          />
        </Reveal>
      </Slide>
      <Split nav="Kode Pembersihan" flip kicker="Skrip Python" title={<>Prapemrosesan <span className="accent-text">Data</span></>} body="Membersihkan anomali dan menciptakan fitur pendapatan." media={<div style={{ position: 'relative', padding: 36, width: '100%' }}><CodeWindow title="1_eda_cleaning.py" code={`df_clean = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]\ndf_clean = df_clean.dropna(subset=['CustomerID'])\ndf_clean['TotalSales'] = df_clean['Quantity'] * df_clean['UnitPrice']`} /></div>} />
    </Deck>
  );
}
