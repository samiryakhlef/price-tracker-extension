import React, { useState, useEffect, useCallback } from "react";
import "./AddProduct.css"; // Fichier CSS pour les styles

const AddProduct = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer les produits et le statut premium
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_PRODUCTS" }, (response) => {
      if (chrome.runtime.lastError) {
        setError("Erreur de communication avec l'extension.");
        return;
      }
      setProductCount(response.products.length);
      setIsPremium(response.isPremium || false);
    });
  }, []);

  // Ajouter un produit
  const handleAddProduct = useCallback(async () => {
    if (!url || !name) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!isPremium && productCount >= 10) {
      setError(
        "Vous avez atteint la limite de 10 produits. Passez au plan premium pour en ajouter plus."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await chrome.runtime.sendMessage({
        type: "ADD_PRODUCT",
        product: { url, name },
      });
      setUrl("");
      setName("");
      setProductCount((prev) => prev + 1);
    } catch (error) {
      setError("Erreur lors de l'ajout du produit. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [url, name, isPremium, productCount]);

  return (
    <div className="add-product">
      <h2 className="title">Ajouter un produit à suivre</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="productUrl" className="label">
          URL du produit
        </label>
        <input
          type="url"
          id="productUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="input"
          aria-required="true"
        />
      </div>
      <div className="form-group">
        <label htmlFor="productName" className="label">
          Nom du produit
        </label>
        <input
          type="text"
          id="productName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: iPhone 13"
          className="input"
          aria-required="true"
        />
      </div>
      <button
        onClick={handleAddProduct}
        disabled={!url || !name || isLoading}
        className="add-button"
      >
        {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
      </button>
      {!isPremium && (
        <p className="product-count">
          Produits suivis : {productCount}/10 (Plan gratuit)
        </p>
      )}
    </div>
  );
};

export default AddProduct;
