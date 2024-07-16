import React from "react";

function PictureList({ pictures, addToCart }) {
  return (
    <div>
      <h2>Available Flower NFTs</h2>
      <div>
        {pictures.map((picture) => (
          <div key={picture.id}>
            <img src={picture.imageUrl} alt={picture.name} width="100" />
            <h3>{picture.name}</h3>
            <p>Price: ${picture.price}</p>
            <button onClick={() => addToCart(picture)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PictureList;
