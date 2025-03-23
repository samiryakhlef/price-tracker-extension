import React from "react";
import ProductItem from "./ProductItem";

const ProductList = () => {
  const products = [];

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
