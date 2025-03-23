import React from "react";
import ProductItem from "./ProductItem";

const ProductList = () => {
  const products = [
    {
      id: 1,
      name: "Produit 1",
      price: 100,
      url: "https://example.com/product1",
    },
    {
      id: 2,
      name: "Produit 2",
      price: 200,
      url: "https://example.com/product2",
    },
  ];

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
