import React, { useState } from "react";
import { ethers } from "ethers";

function App() {
  const initialPictures = [
    {
      id: 1,
      name: "Lily",
      price: 0.01,
      imageUrl:
        "https://images.unsplash.com/photo-1567428051128-5f09a0200655?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGlseXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 2,
      name: "Jasmine",
      price: 0.015,
      imageUrl:
        "https://exoticflora.in/cdn/shop/products/281922814698.jpg?v=1499121869",
    },
    {
      id: 3,
      name: "Sunflower",
      price: 0.03,
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/types-of-sunflowers-1646756873.jpg",
    },
    {
      id: 4,
      name: "Daisy",
      price: 0.025,
      imageUrl:
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFpc2llc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 5,
      name: "Rose",
      price: 0.03,
      imageUrl:
        "https://5.imimg.com/data5/SELLER/Default/2023/2/BZ/LH/VO/3569567/red-rose.jpeg",
    },
    {
      id: 6,
      name: "Marigold",
      price: 0.01,
      imageUrl:
        "https://www.bhg.com/thmb/aSvc0PJqG6FRKE7rk_LKgo4uwNo=/4000x0/filters:no_upscale():strip_icc()/African-Marigolds-Tagetes-erecta-ClX7nBkn4249Jtr_56xLiE-8a86e59a8cbb4b45812f4b8385556173.jpg",
    },
  ];

  const [pictures, setPictures] = useState(initialPictures);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  const addToCart = (picture) => {
    const updatedCart = [...cart, picture];
    const remainingPictures = pictures.filter((p) => p.id !== picture.id);
    setCart(updatedCart);
    setPictures(remainingPictures);
    setTotal(total + picture.price);
  };

  const handlePay = async () => {
    if (!signer) {
      alert("Please connect to MetaMask first");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: "0xe7De586B036bDE068D399311df0569E82C060A31", //address of my sepolia testnet wallet
        value: ethers.utils.parseUnits(total.toString(), "ether"),
      });
      await tx.wait();

      setCart([]);
      setTotal(0);
    } catch (error) {
      console.error("Payment failed: ", error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.ready; // Wait until the provider is ready
        const signer = await provider.getSigner(); // Await the signer
        setProvider(provider);
        setSigner(signer);
        setAccount(account);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <h1>NFT Store</h1>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Metamask</button>
      )}
      <h2>Available Flower NFTs</h2>
      <div>
        {pictures.length === 0 ? (
          <p>No NFTs available</p>
        ) : (
          <div>
            {pictures.map((picture) => (
              <div key={picture.id}>
                <img src={picture.imageUrl} alt={picture.name} width="100" />
                <h3>{picture.name}</h3>
                <p>Price: {picture.price} ETH</p>
                <button onClick={() => addToCart(picture)}>Buy</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2>Shopping Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index}>
                <img src={item.imageUrl} alt={item.name} width="100" />
                <h3>{item.name}</h3>
                <p>Price: {item.price} ETH</p>
              </div>
            ))}
            <h3>Total: {total} ETH</h3>
            <button onClick={handlePay}>Pay</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
