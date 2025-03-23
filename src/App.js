import React from "react";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Price Tracker</h1>
      <AddProduct />
      <ProductList />
    </div>
  );
}

export default App;
