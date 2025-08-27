// pages/nft.js
import React from "react";
import Head from "next/head";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useNFTs,
} from "@thirdweb-dev/react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function NFTPage() {
  const address = useAddress();

  // Kontratı tip tanımı olmadan yakalıyoruz (nft-drop üzerinde çalışacak)
  const { contract, isLoading: contractLoading } = useContract(
    CONTRACT_ADDRESS
  );

  // Koleksiyondaki NFT’leri çek
  const { data: nfts, isLoading: nftsLoading } = useNFTs(contract, {
    count: 100,
  });

  return (
    <>
      <Head>
        <title>ZUZU • NFT Koleksiyonları</title>
        <meta
          name="description"
          content="ZUZU NFT Koleksiyonları • Tap-to-earn & Airdrop"
        />
      </Head>

      <main className="container">
        {/* Üst Bar */}
        <header className="header">
          <div className="brand">
            <img src="/zuzu-logo.png" alt="ZUZU" />
            <h1>ZUZU • NFT Koleksiyonları</h1>
          </div>
          <ConnectWallet theme="dark" />
        </header>

        {/* Durumlar */}
        {contractLoading && <p>Kontrat yükleniyor…</p>}

        {!contractLoading && !contract && (
          <div className="error">
            <b>Kontrat bulunamadı.</b>
            <p>
              Lütfen <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> env değişkenini
              kontrol et.
            </p>
          </div>
        )}

        {/* NFT Liste */}
        <section className="grid">
          {nftsLoading && <p>İçerik getiriliyor…</p>}

          {!nftsLoading && nfts?.length === 0 && (
            <p>Şu an listelenecek NFT bulunamadı.</p>
          )}

          {!nftsLoading &&
            nfts?.map((nft) => (
              <NFTCard key={nft?.metadata?.id} nft={nft} contract={contract} />
            ))}
        </section>

        {/* Bilgi Alanı */}
        <section className="info">
          <h2>Yayın Planı</h2>
          <ul>
            <li>1. Hafta: 250 adet • Ön satış</li>
            <li>2. Hafta: 500 adet • Topluluk Mint</li>
            <li>3. Hafta: 750 adet • Airdrop ve Çekilişler</li>
            <li>4. Hafta: 1000 adet • Public Mint + Borsa Duyuruları</li>
          </ul>
        </section>
      </main>

      <style jsx>{`
        .container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          color: #e6e6e6;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .info {
          margin-top: 40px;
          background: #0f0f14;
          border: 1px solid #1f1f2a;
          border-radius: 12px;
          padding: 16px;
        }
        .error {
          margin: 20px 0;
          padding: 12px;
          background: #2a0f0f;
          border: 1px solid #4a1f1f;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

/** Basit Kart komponenti (aynı dosyada tanımladık – istersen components/NFTCard.jsx’e taşıyabilirsin) */
import { Web3Button } from "@thirdweb-dev/react";

function NFTCard({ nft, contract }) {
  const image =
    nft?.metadata?.image ||
    nft?.metadata?.imageUrl ||
    nft?.metadata?.image_url;

  return (
    <article className="card">
      <div className="media">
        {image ? (
          // thirdweb gateway linklerini düzgün göstermek için
          <img src={image?.toString()} alt={nft?.metadata?.name} />
        ) : (
          <div className="placeholder">NFT</div>
        )}
      </div>

      <div className="body">
        <h3>{nft?.metadata?.name ?? "ZUZU NFT"}</h3>
        <p className="desc">{nft?.metadata?.description ?? ""}</p>

        <Web3Button
          contractAddress={contract?.getAddress()}
          action={async (cntr) => {
            // ERC721 Drop için 1 adet mint
            await cntr.erc721.claim(1);
          }}
          onSuccess={() => alert("Mint başarılı! 🎉")}
          onError={(e) => alert(`Mint hatası: ${e?.message ?? e}`)}
          theme="dark"
        >
          Mint Et
        </Web3Button>
      </div>

      <style jsx>{`
        .card {
          background: #0c0c12;
          border: 1px solid #1b1b25;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .media {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #101018;
          display: grid;
          place-items: center;
        }
        .media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder {
          color: #6e6e86;
          font-weight: 600;
        }
        .body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .desc {
          min-height: 38px;
          color: #bfc3d9;
          font-size: 0.9rem;
        }
      `}</style>
    </article>
  );
}
