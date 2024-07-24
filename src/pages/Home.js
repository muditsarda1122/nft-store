import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SimpleNft from "../ABIs/simpleNft.json";

function Home({ account, provider, signer }) {
  const [nfts, setNfts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");

  const contractAddress = "0x1253EaDE825b60bC06e17dC663F8DC2b8A8EC7f7";

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

          const nftsData = await Promise.all(
            tokenIds.map(async (id) => {
              const tokenId = id.toNumber(); //convert BigNumber to number

              //get tokenURIHash for displaying the image
              const tokenURI = await contract.tokenURI(tokenId);
              const tokenURIHash = tokenURI.split("/").pop();

              const tokenName = await contract.getName(tokenId);

              const tokenPriceBN = await contract.getPrice(tokenId);
              const tokenPrice = ethers.utils.formatEther(tokenPriceBN);

              const tokenOwner = await contract.ownerOfToken(tokenId);

              return {
                id: tokenId,
                name: tokenName,
                image: tokenURIHash,
                price: tokenPrice,
                owner: tokenOwner,
              };
            })
          );

          setNfts(nftsData);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
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

  const handlePay = async () => {
    if (!signer) {
      alert("Please connect to MetaMask first");
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, SimpleNft, signer);
      setStatus("Processing payment...");

      for (const item of cart) {
        const tx = await contract.buyNFT(item.id, {
          value: ethers.utils.parseEther(item.price.toString()),
        });
        await tx.wait();

        console.log(`Purchase for tokenId ${item.id} successful!`);
      }

      setCart([]);
      setTotal(0);
      setStatus("Payment and transfer successful!");
    } catch (error) {
      console.error("Payment failed: ", error);
      setStatus("Payment or transfer failed.");
    }
  };

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
              <p>Price: {nft.price} MATIC</p>
              <p>Owner: {nft.owner}</p>
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
                src={`https://gateway.pinata.cloud/ipfs/${item.image}`}
                alt={item.name}
                width="100"
              />
              <h3>{item.name}</h3>
              <p>Price: {item.price} MATIC</p>
              <p>Owner: {item.owner}</p>
            </div>
          ))
        )}
        <h3>Total: {total} MATIC</h3>
        <button onClick={handlePay}>Pay</button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}

export default Home;
