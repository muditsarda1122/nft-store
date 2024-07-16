import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CartPage({ setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state;
  const total = cart.reduce((acc, picture) => acc + picture.price, 0);

  const handlePay = () => {
    setCart([]);
    navigate("/");
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index}>
              <img src={item.imageUrl} alt={item.name} width="100" />
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
            </div>
          ))}
          <h3>Total: ${total}</h3>
          <button onClick={handlePay}>Pay</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
