import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Reveal from './deck/Reveal';
import Split from './components/Split';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';
import Steps from './components/Steps';

export default function App() {
  return (
    <Deck>
      <Cover nav="Sampul" kicker="Modul 4" title={<span>Market <span className="accent-text">Basket Analysis</span></span>} subtitle="Mengungkap Asosiasi Produk di Balik Struk Belanja" />
      <Split nav="Himpunan Irisan" flip kicker="Python" title={<>Korelasi <span className="accent-text">Produk</span></>} body="Tanpa library kompleks, irisan himpunan (Set Intersection) dapat membuktikan korelasi belanja dua produk." media={<div style={{ position: 'relative', padding: 36, width: '100%' }}><CodeWindow title="5_assoc.py" code={`tas_merah = set(df[df['Desc'] == 'RED BAG']['InvoiceNo'])\ntas_pink = set(df[df['Desc'] == 'PINK BAG']['InvoiceNo'])\ndibeli_bersama = tas_merah.intersection(tas_pink)`} /></div>} />
      <Slide nav="Implementasi">
        <Reveal><h2 className="headline" style={{ textAlign: 'center' }}>Strategi <span className="accent-text">Logistik SCM</span></h2></Reveal>
        <Reveal>
          <Steps items={[ { title: 'Warehouse Slotting', body: 'Barang berasosiasi mutlak didekatkan di rak yang sama demi efisiensi travel-time.' }, { title: 'Product Bundling', body: 'Paket promosi silang (Cross-selling) pada platform E-Commerce.' } ]} />
        </Reveal>
      </Slide>
    </Deck>
  );
}
