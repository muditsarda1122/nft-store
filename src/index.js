import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import CartPage from "./CartPage";

function Main() {
  const initialPictures = [
    {
      id: 1,
      name: "Lily",
      price: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1567428051128-5f09a0200655?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGlseXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 2,
      name: "Jasmine",
      price: 15,
      imageUrl:
        "https://exoticflora.in/cdn/shop/products/281922814698.jpg?v=1499121869",
    },
    {
      id: 3,
      name: "Sunflower",
      price: 30,
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/types-of-sunflowers-1646756873.jpg",
    },
    {
      id: 4,
      name: "Daisy",
      price: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFpc2llc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 5,
      name: "Rose",
      price: 30,
      imageUrl:
        "https://5.imimg.com/data5/SELLER/Default/2023/2/BZ/LH/VO/3569567/red-rose.jpeg",
    },
    {
      id: 6,
      name: "Marigold",
      price: 10,
      imageUrl:
        "https://www.bhg.com/thmb/aSvc0PJqG6FRKE7rk_LKgo4uwNo=/4000x0/filters:no_upscale():strip_icc()/African-Marigolds-Tagetes-erecta-ClX7nBkn4249Jtr_56xLiE-8a86e59a8cbb4b45812f4b8385556173.jpg",
    },
  ];

  const [pictures, setPictures] = useState(initialPictures);
  const [cart, setCart] = useState([]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <App
            pictures={pictures}
            setPictures={setPictures}
            cart={cart}
            setCart={setCart}
          />
        }
      />
      <Route
        path="/cart"
        element={<CartPage cart={cart} setCart={setCart} />}
      />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Main />
  </Router>
);
