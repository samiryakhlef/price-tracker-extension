import React from "react";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Subscription from "./components/Subscription";

const App = () => {
  return (
    <div className="App">
      <h1>Price Tracker</h1>
      <AddProduct />
      <ProductList />
      <Subscription />
    </div>
  );
};

export default App;
