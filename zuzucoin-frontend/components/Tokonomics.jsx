import { TOKENOMICS } from "../lib/constants";

export default function Tokenomics(){
  const total = TOKENOMICS.reduce((a,b)=>a+b.pct,0);
  return (
    <div id="tokenomics" className="section">
      <h2>Tokenomi</h2>
      <div className="grid">
        {TOKENOMICS.map((t,i)=>(
          <div key={i} className="card">
            <div className="badgelg" style={{background:"transparent"}}>
              <span className="badge" style={{background:t.color+"22", borderColor:t.color+"66"}} />
              <b style={{marginLeft:8}}>{t.title}</b>
            </div>
            <h3 style={{marginTop:12, color:t.color}}>{t.pct}%</h3>
            <div className="muted">Toplamın %{Math.round((t.pct/total)*100)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
