const items = [
  { name:"Binance", color:"#f3ba2f" },
  { name:"MEXC", color:"#2bd1a7" },
  { name:"OKX", color:"#fff" },
  { name:"Bybit", color:"#f4b93a" }
];

export default function Exchanges(){
  return (
    <div className="section">
      <h2>Borsa Hedefleri</h2>
      <div className="grid">
        {items.map((x,i)=>(
          <div key={i} className="card" style={{textAlign:"center",padding:"26px 14px"}}>
            <div style={{fontWeight:800,fontSize:22,color:x.color}}>{x.name}</div>
            <div className="muted" style={{marginTop:6}}>Listeleme hedefi</div>
          </div>
        ))}
      </div>
    </div>
  );
}
