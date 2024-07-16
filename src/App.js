import React from "react";
import { useNavigate } from "react-router-dom";
import PictureList from "./PictureList";

function App({ pictures, setPictures, cart, setCart }) {
  const navigate = useNavigate();

  const addToCart = (picture) => {
    setCart([...cart, picture]);
    setPictures(pictures.filter((p) => p.id !== picture.id));
  };

  const goToCart = () => {
    navigate("/cart", { state: { cart } });
  };

  return (
    <div>
      <h1>NFT Store</h1>
      <PictureList pictures={pictures} addToCart={addToCart} />
      <button onClick={goToCart}>Buy Now</button>
    </div>
  );
}

export default App;
