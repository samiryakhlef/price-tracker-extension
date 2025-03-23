import React, { useState } from "react";

const AddProduct = () => {
  const [url, setUrl] = useState("");

  const handleAddProduct = () => {
    // Logique pour ajouter un produit
    console.log("Produit ajouté :", url);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="URL du produit"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="button" onClick={handleAddProduct}>
        Ajouter
      </button>
    </div>
  );
};

export default AddProduct;
