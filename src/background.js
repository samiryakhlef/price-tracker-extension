async function getTrackedProducts() {
  return new Promise((resolve) => {
    chrome.storage.local.get("products", (result) => {
      resolve(result.products || []);
    });
  });
}

async function fetchPrice(url) {
  // Basic implementation
  try {
    const response = await fetch(url);
    const text = await response.text();
    // Add your price extraction logic here
    return 0; // Temporary return value
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
}

function notifyPriceChange(product, newPrice) {
  const message = `Le prix de ${product.name} a changé : ${newPrice}€`;
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon48.png",
    title: "Changement de prix",
    message,
  });
}

function updateProductPrice(id, newPrice) {
  chrome.storage.local.get("products", (result) => {
    const products = result.products || [];
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, price: newPrice } : product,
    );
    chrome.storage.local.set({ products: updatedProducts });
  });
}

async function checkPrices() {
  const products = await getTrackedProducts();
  products.forEach(async (product) => {
    const newPrice = await fetchPrice(product.url);
    if (newPrice !== product.price) {
      notifyPriceChange(product, newPrice);
      updateProductPrice(product.id, newPrice);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkPrices", { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkPrices") {
    checkPrices();
  }
});
