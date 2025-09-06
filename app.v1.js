// ==== Global Config ====
const ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.005,
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  collectionUrl: "https://thirdweb.com",
  launchAtISO: "2025-11-05T13:00:00+03:00",
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: Array.from({length:10},(_,i)=>({
    id:i, name:["Hero","Rogue","Berserker","Hacker","Sorceress","Warrior","Maiden","Ranger","Scientist","Titan"][i]||("ZUZU #"+i),
    rarity:["Epic","Rare","Epic","Rare","Epic","Rare","Rare","Rare","Epic","Legendary"][i],
    supply:[200,2500,800,600,750,900,1100,1000,1100,250][i]
  }))
};
