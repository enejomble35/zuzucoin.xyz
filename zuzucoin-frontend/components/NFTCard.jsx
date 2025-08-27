export default function NFTCard({ id, name, image }){
  return (
    <div className="card">
      <img src={image} alt={name}/>
      <div className="meta"><b>{name}</b> • #{id}</div>
    </div>
  );
}
