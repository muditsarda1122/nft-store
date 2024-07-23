import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleNft from "../ABIs/simpleNft.json";

function Mint({ account, provider, signer }) {
  const [name, setName] = useState(""); //name
  const [price, setPrice] = useState(""); //price
  const [selectedFile, setSelectedFile] = useState(null); //image
  const [status, setStatus] = useState("");

  const contractAddress = "0xe9e3d9fA8C7126F251530593C52191C9A1952059";
  //   const receivingWallet = "0xe7De586B036bDE068D399311df0569E82C060A31";
  const pinataGatewayUrl = process.env.REACT_APP_PINATA_GATEWAY_URL;

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleMint = async () => {
    if (!name || !price || !selectedFile) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    try {
      // generating form data for IPFS
      const formData = new FormData();
      formData.append("file", selectedFile);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      //generating contract
      const contract = new ethers.Contract(contractAddress, SimpleNft, signer);
      const currentTokenId = await contract.currentTokenId();

      const metadata = JSON.stringify({
        name: name,
        price: price,
        tokenId: currentTokenId.toNumber() + 1,
      });
      formData.append("pinataMetadata", metadata);

      // pinata API call
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();

      // calling smart contract
      const tokenURI = `${process.env.REACT_APP_PINATA_GATEWAY_URL}/ipfs/${resData.IpfsHash}`;
      const tx = await contract.mint(
        tokenURI,
        name,
        ethers.utils.parseEther(price)
      );
      await tx.wait();

      setStatus("NFT minted successfully!");
    } catch (error) {
      console.error("Minting failed: ", error);
      setStatus("Failed to mint NFT.");
    }
  };

  return (
    <div>
      <h1>Mint a New NFT</h1>
      <p>
        --------------------------------------------------------------------------------------------------
      </p>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <br />
      {/* <label>
        Image URL:
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>
      <br /> */}
      <label>
        Choose File:
        <input type="file" onChange={handleFileChange} />
      </label>
      <br />
      <button onClick={handleMint}>Mint</button>
      <p>{status}</p>
    </div>
  );
}

export default Mint;
