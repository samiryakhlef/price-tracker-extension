import { createRoot } from "react-dom/client";
import App from "../src/App";

chrome.runtime.sendMessage({ type: "GET_PRODUCTS" }, (response) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<App products={response.products} />);
});
