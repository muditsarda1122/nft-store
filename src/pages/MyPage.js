import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SimpleNft from "../ABIs/simpleNft.json";

function MyPage({ account, provider, signer }) {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [boughtNFTs, setBoughtNFTs] = useState([]);

  const contractAddress = "0x6216cB9c931dba70Be04CCa41B5BBF47f7Ca2F2e";
  const pinataGatewayUrl = process.env.REACT_APP_PINATA_GATEWAY_URL;

  useEffect(() => {
    const loadMyNfts = async () => {
      if (signer) {
        try {
          const contract = new ethers.Contract(
            contractAddress,
            SimpleNft,
            signer
          );
          const [mintedIds, boughtIds] = await contract.getMyNFTs();

          const mintedNFTsData = await Promise.all(
            mintedIds.map(async (id) => {
              const tokenId = id.toNumber();
              const tokenURI = await contract.tokenURI(tokenId);
              const tokenURIHash = tokenURI.split("/").pop();
              const tokenName = await contract.getName(tokenId);
              const tokenPriceBN = await contract.getPrice(tokenId);
              const tokenPrice = ethers.utils.formatEther(tokenPriceBN);
              return {
                id: tokenId,
                name: tokenName,
                image: tokenURIHash,
                price: tokenPrice,
              };
            })
          );

          const boughtNFTsData = await Promise.all(
            boughtIds.map(async (id) => {
              const tokenId = id.toNumber();
              const tokenURI = await contract.tokenURI(tokenId);
              const tokenURIHash = tokenURI.split("/").pop();
              const tokenName = await contract.getName(tokenId);
              const tokenPriceBN = await contract.getPrice(tokenId);
              const tokenPrice = ethers.utils.formatEther(tokenPriceBN);
              return {
                id: tokenId,
                name: tokenName,
                image: tokenURIHash,
                price: tokenPrice,
              };
            })
          );

          setMintedNFTs(mintedNFTsData);
          setBoughtNFTs(boughtNFTsData);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };
    loadMyNfts();
  }, [signer]);

  return (
    <div>
      <h1>MyPage</h1>
      <p>
        --------------------------------------------------------------------------------------------------
      </p>
      <h2>NFTs you minted</h2>
      <div>
        {mintedNFTs.length === 0 ? (
          <p>No NFTs minted</p>
        ) : (
          mintedNFTs.map((nft) => (
            <div key={nft.id}>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${nft.image}`}
                alt={nft.name}
                width="100"
              />
              <h3>{nft.name}</h3>
              <p>Price: {nft.price} MATIC</p>
            </div>
          ))
        )}
      </div>
      <h2>NFTs you bought</h2>
      <div>
        {boughtNFTs.length === 0 ? (
          <p>No NFTs bought</p>
        ) : (
          boughtNFTs.map((nft) => (
            <div key={nft.id}>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${nft.image}`}
                alt={nft.name}
                width="100"
              />
              <h3>{nft.name}</h3>
              <p>Price: {nft.price} MATIC</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPage;
