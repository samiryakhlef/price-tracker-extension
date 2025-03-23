import React from "react";

const ProductItem = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Prix : {product.price}€</p>
      <p>
        URL :{" "}
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          {product.url}
        </a>
      </p>
    </div>
  );
};

export default ProductItem;
