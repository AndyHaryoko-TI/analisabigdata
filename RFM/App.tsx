import Deck from './deck/Deck';
import Split from './components/Split';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';

export default function App() {
  return (
    <Deck>
      <Cover nav="Sampul" kicker="Modul 3" title={<span>Segmentasi <span className="accent-text">RFM</span></span>} subtitle="Metode Klasifikasi Loyalitas Konsumen" />
      <Split nav="Agregasi" flip kicker="Skoring" title={<>Agregasi <span className="accent-text">Serentak</span></>} body="Recency, Frequency, Monetary dirangkum menggunakan agregasi Pandas." media={<div style={{ position: 'relative', padding: 36, width: '100%' }}><CodeWindow title="3_rfm_agg.py" code={`rfm = df.groupby('CustomerID').agg({\n    'InvoiceDate': lambda x: (snapshot - x.max()).days,\n    'InvoiceNo': 'nunique',\n    'TotalSales': 'sum'\n})`} /></div>} />
      <Split nav="Kuartil" kicker="Pembobotan" title={<>Sistem <span className="accent-text">Kuartil (qcut)</span></>} body="Membagi distribusi ke dalam 4 skala adil (Persentil). Recency dibalik karena hari terkecil berarti skor tertinggi." media={<div style={{ position: 'relative', padding: 36, width: '100%' }}><CodeWindow title="4_rfm_score.py" code={`rfm['R_Score'] = pd.qcut(rfm['Recency'], 4, labels=[4, 3, 2, 1])\nrfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 4, labels=[1, 2, 3, 4])`} /></div>} />
    </Deck>
  );
}
