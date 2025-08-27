export default function Footer(){
  return (
    <div className="footer">
      © {new Date().getFullYear()} ZUZUCOIN • Tüm hakları saklıdır.
      <div style={{marginTop:8,fontSize:12}}>
        <a className="muted" href="#community">Topluluk</a> •{" "}
        <a className="muted" href="#about">Hakkımızda</a>
      </div>
    </div>
  );
}
