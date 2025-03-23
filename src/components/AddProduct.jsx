import React, { useState, useEffect } from "react";

const AddProduct = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_PRODUCTS" }, (response) => {
      setProductCount(response.products.length);
      setIsPremium(response.isPremium || false);
    });
  }, []);

  const handleAddProduct = () => {
    if (url && name) {
      if (!isPremium && productCount >= 10) {
        alert(
          "Vous avez atteint la limite de 10 produits pour le plan gratuit. Passez au plan premium pour ajouter plus de produits."
        );
        return;
      }
      const newProduct = { id: Date.now(), name, url, price: null };
      chrome.runtime.sendMessage(
        { type: "ADD_PRODUCT", product: newProduct },
        (response) => {
          if (response.success) {
            console.log("Produit ajouté :", newProduct);
            setUrl("");
            setName("");
            setProductCount(response.products.length);
          }
        }
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nom du produit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL du produit"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="button" onClick={handleAddProduct}>
        Ajouter
      </button>
      {!isPremium && <p>Produits suivis : {productCount}/10 (Plan gratuit)</p>}
    </div>
  );
};

export default AddProduct;
