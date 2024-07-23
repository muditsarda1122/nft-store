import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SimpleNft from "../ABIs/simpleNft.json";

function Home({ account, provider, signer }) {
  const [nfts, setNfts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const contractAddress = "0x65d8f81b373f6833DE1b20648f3c8fe6C29fc287";
  //   const receivingWallet = "0xe7De586B036bDE068D399311df0569E82C060A31";
  const pinataGatewayUrl = process.env.REACT_APP_PINATA_GATEWAY_URL;

  useEffect(() => {
    const loadNFTs = async () => {
      if (signer) {
        try {
          const contract = new ethers.Contract(
            contractAddress,
            SimpleNft,
            provider
          );

          const tokenIds = await contract.getAllTokenIds(); //gives array of tokenIds as BigNumber
          console.log("tokenIds", tokenIds);

          const nftsData = await Promise.all(
            tokenIds.map(async (id) => {
              const tokenId = id.toNumber(); //convert BigNumber to number
              console.log("tokenId", tokenId);

              const tokenURI = await contract.tokenURI(tokenId);

              const tokenURIHash = tokenURI.split("/").pop();
              console.log("tokenURIHash", tokenURIHash);

              const tokenURIUrl = `${pinataGatewayUrl}/ipfs/${tokenURIHash}`;
              console.log("TokenURIurl", tokenURIUrl);

              const res = await fetch(tokenURI);
              console.log("Res", res);

              const metadata = res.json(); // .json() or .json ?
              console.log("Metadata", metadata);

              return {
                id: tokenId,
                ...metadata,
                name: metadata.name,
                image: tokenURIHash,
                price: metadata.price,
              };
            })
          );
          console.log("nftsData", nftsData);

          setNfts(nftsData);
          console.log("nftsData2", nfts);
        } catch (error) {
          {
            error ? console.error(error) : console.log("No error");
          }
        }
      }
    };
    loadNFTs();
  }, [signer]);

  const addToCart = (nft) => {
    setCart([...cart, nft]);
    setTotal(total + parseFloat(nft.price));
    setNfts(nfts.filter((item) => item.id !== nft.id));
  };

  //   const handlePay = async () => {
  //     if (!signer) {
  //       alert("Please connect to MetaMask first");
  //       return;
  //     }

  //     try {
  //       const tx = await signer.sendTransaction({
  //         to: receivingWallet, // My wallet
  //         value: ethers.utils.parseUnits(total.toString(), "ether"),
  //       });
  //       await tx.wait();

  //       setCart([]);
  //       setTotal(0);
  //     } catch (error) {
  //       console.error("Payment failed: ", error);
  //     }
  //   };

  return (
    <div>
      <h1>Available NFTs</h1>
      <div>
        {nfts.length === 0 ? (
          <p>No NFTs available</p>
        ) : (
          nfts.map((nft) => (
            <div key={nft.id}>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${nft.image}`}
                alt={nft.name}
                width="100"
              />
              <h3>{nft.name}</h3>
              <p>Price: {nft.price} ETH</p>
              <button onClick={() => addToCart(nft)}>Buy</button>
            </div>
          ))
        )}
      </div>
      <h2>Shopping Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={index}>
              <img
                src={`${process.env.REACT_APP_PINATA_GATEWAY_URL}/ipfs/${item.image}`}
                alt={item.name}
                width="100"
              />
              <h3>{item.name}</h3>
              <p>Price: {item.price} ETH</p>
            </div>
          ))
        )}
        <h3>Total: {total} ETH</h3>
      </div>
    </div>
  );
}

export default Home;