import Header from "../components/Header";
import Hero from "../components/Hero";
import Countdown from "../components/Countdown";
import Tokenomics from "../components/Tokenomics";
import Exchanges from "../components/Exchanges";
import Stake from "../components/Stake";
import Chest from "../components/Chest";
import Story from "../components/Story";
import { SOCIALS } from "../lib/constants";

export default function Home(){
  return (
    <div className="container">
      <Header />
      <Hero />
      <Countdown />
      <Tokenomics />
      <Exchanges />
      <Stake />
      <Chest />
      <div id="community" className="section">
        <h2>Topluluk</h2>
        <div className="grid">
          {SOCIALS.map((s,i)=>(
            <a key={i} className="card" href={s.href} target="_blank" rel="noreferrer">
              <b>{s.name}</b>
              <div className="muted">Takip et ve etkinliklere katıl</div>
            </a>
          ))}
        </div>
      </div>
      <Story />
      <div className="footer">© {new Date().getFullYear()} ZUZUCOIN • Tüm hakları saklıdır.</div>
    </div>
  );
}
