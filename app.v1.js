// ========= Global App Config =========
const ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.005,            // 1 ZUZU = 0.005 USDT (örnek)
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF", // SENİN SOL ALICI
  collectionUrl: "https://thirdweb.com",  // koleksiyon sayfan varsa buraya
  // Pre-sale hedef tarihi (İstanbul)
  launchAtISO: "2025-11-05T13:00:00+03:00",
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: [
    { id:0, name:"ZUZU Hero",      rarity:"Epic",      supply:200 },
    { id:1, name:"ZUZU Rogue",     rarity:"Rare",      supply:2500 },
    { id:2, name:"ZUZU Berserker", rarity:"Epic",      supply:800 },
    { id:3, name:"ZUZU Hacker",    rarity:"Rare",      supply:600 },
    { id:4, name:"ZUZU Sorceress", rarity:"Epic",      supply:750 },
    { id:5, name:"ZUZU Warrior",   rarity:"Rare",      supply:900 },
    { id:6, name:"ZUZU Maiden",    rarity:"Rare",      supply:1100 },
    { id:7, name:"ZUZU Ranger",    rarity:"Rare",      supply:1000 },
    { id:8, name:"ZUZU Scientist", rarity:"Epic",      supply:1100 },
    { id:9, name:"ZUZU Titan",     rarity:"Legendary", supply:250 }
  ]
};

// Dil butonları lang.js tarafından basılıyor
