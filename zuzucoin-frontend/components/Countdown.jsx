import dayjs from "dayjs";
import { WEEKLY_REWARDS } from "../lib/constants";
import { useEffect, useState } from "react";

function nextWeekStart(weekIndex){
  // Bugünden itibaren her hafta Pazartesi 00:00 hedefi
  const now = dayjs();
  const monday0 = now.startOf("week").add(1, "day"); // Pazartesi
  const base = now.isAfter(monday0) ? monday0.add(1,"week") : monday0;
  return base.add(weekIndex, "week");
}

export default function Countdown(){
  const [tick, setTick] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setTick(v=>v+1),1000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div id="roadmap" className="section">
      <h2>4 Haftalık Geri Sayım & Dağıtımlar</h2>
      <div className="grid">
        {WEEKLY_REWARDS.map((w,idx)=>{
          const target = nextWeekStart(idx);
          const diff = target.diff(dayjs(),"second");
          const s = Math.max(0, diff);
          const days = Math.floor(s/86400);
          const hours = Math.floor((s%86400)/3600);
          const mins = Math.floor((s%3600)/60);
          const secs = s%60;
          return (
            <div key={idx} className="card">
              <div className="tagrow">
                <span className="badge">Hafta {w.week}</span>
                <span className="badge">{w.amount}</span>
              </div>
              <h3 style={{marginTop:10}}>Hedef: {target.format("DD MMM YYYY, HH:mm")}</h3>
              <div className="kpi">
                <div className="card"><div className="muted">Gün</div><b>{days}</b></div>
                <div className="card"><div className="muted">Saat</div><b>{hours}</b></div>
                <div className="card"><div className="muted">Dakika</div><b>{mins}</b></div>
                <div className="card"><div className="muted">Saniye</div><b>{secs}</b></div>
              </div>
              <div className="hr"></div>
              <div className="muted">{w.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
