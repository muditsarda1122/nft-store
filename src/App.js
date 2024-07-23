import React, { useState } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Mint from "./pages/Mint";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.ready;
        const signer = provider.getSigner();
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
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <br />
          <Link to="/mint">Mint</Link>
          <br />
          {account ? (
            <p>Connected as: {account}</p>
          ) : (
            <button onClick={connectWallet}>Connect Metamask</button>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Home account={account} provider={provider} signer={signer} />
            }
          />
          <Route
            path="/mint"
            element={
              <Mint account={account} provider={provider} signer={signer} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
