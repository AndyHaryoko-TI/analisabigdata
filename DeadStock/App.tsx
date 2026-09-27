import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Reveal from './deck/Reveal';
import Split from './components/Split';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';
import Bento from './components/Bento';

export default function App() {
  return (
    <Deck>
      <Cover nav="Sampul" kicker="Modul 2" title={<span>Analisis <span className="accent-text">Dead Stock</span></span>} subtitle="Mendeteksi kapital mati di gudang" />
      <Slide nav="Konsep">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Ancaman <span className="accent-text">Penyimpanan</span></h2></Reveal>
        <Reveal>
          <Bento tiles={[ { c: 2, r: 1, title: 'Dead Stock', body: 'Barang tidak laku berbulan-bulan.', variant: 'accent' }, { c: 2, r: 1, title: 'Holding Cost', body: 'Beban asuransi dan modal mati.' }, { c: 2, r: 1, title: 'Solusi', body: 'Flash Sale (Clearance) & Bundling.' } ]} />
        </Reveal>
      </Slide>
      <Split nav="Algoritma Python" kicker="Deteksi" title={<>Algoritma <span className="accent-text">Otomatis</span></>} body="Memfilter barang yang tidak disentuh konsumen lebih dari 180 hari." media={<div style={{ position: 'relative', padding: 36, width: '100%' }}><CodeWindow title="2_dead_stock.py" code={`snapshot_date = df['InvoiceDate'].max() + pd.Timedelta(days=1)\nperf = df.groupby('StockCode').agg({'InvoiceDate': lambda x: (snapshot_date - x.max()).days})\ndead_stock = perf[perf['InvoiceDate'] > 180]`} /></div>} />
    </Deck>
  );
}
