import React from "react";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Subscription from "./components/Subscription";
import "./styles.css";

const App = () => {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="App">
      <button className="close-button" onClick={handleClose}>×</button>
      <div className="popup-header">
        <h1>Price Tracker</h1>
      </div>
      <AddProduct />
      <ProductList />
      <Subscription />
    </div>
  );
};

export default App;
