export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 137); // Polygon
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CLAIM_ADDRESS = process.env.NEXT_PUBLIC_CLAIM_ADDRESS || "0x0000000000000000000000000000000000000000";

// NFT sayısı (public/metadata ve public/nft altındaki dosya sayısı ile eşleşsin)
export const NFT_COUNT = 10;

// Roadmap / Airdrop haftalık dağıtımlar (örnek değerler)
export const WEEKLY_REWARDS = [
  { week: 1, amount: "1,000,000 ZUZU", note: "Ön satış katılımcıları + erken üyeler" },
  { week: 2, amount: "2,000,000 ZUZU", note: "Sosyal görevler + referans" },
  { week: 3, amount: "3,000,000 ZUZU", note: "Tap-to-Earn mini event" },
  { week: 4, amount: "4,000,000 ZUZU", note: "Büyük çekiliş + topluluk oylaması" }
];

// Tokenomi örnekleri
export const TOKENOMICS = [
  { title: "Topluluk / Airdrop", pct: 35, color: "#00d3ff" },
  { title: "Likidite + Borsa",  pct: 25, color: "#8a5bff" },
  { title: "Ekip / Danışman",  pct: 15, color: "#39d98a" },
  { title: "Ekosistem / Oyun", pct: 25, color: "#ffcd4b" }
];

export const SOCIALS = [
  { name: "Telegram", href: "https://t.me/zuzu" },
  { name: "Twitter / X", href: "https://twitter.com/zuzu" },
  { name: "Discord", href: "https://discord.gg/zuzu" }
];
