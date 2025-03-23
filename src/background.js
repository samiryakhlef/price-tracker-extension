import * as cheerio from "cheerio";

async function getTrackedProducts() {
  return new Promise((resolve) => {
    chrome.storage.local.get("products", (result) => {
      resolve(result.products || []);
    });
  });
}

async function fetchPrice(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const $ = cheerio.load(text);
    
    // Utiliser différents sélecteurs selon le domaine
    const domain = new URL(url).hostname;
    const priceSelector = getPriceSelectorForDomain(domain);
    const priceText = $(priceSelector).text();
    
    if (!priceText) {
      throw new Error('Prix non trouvé');
    }
    
    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
    return isNaN(price) ? null : price;
  } catch (error) {
    console.error("Erreur lors de la récupération du prix :", error);
    return null;
  }
}

function getPriceSelectorForDomain(domain) {
  const selectors = {
    'amazon.fr': '#priceblock_ourprice, #priceblock_dealprice, .a-price-whole',
    'cdiscount.com': '.fpPrice, .price',
    'fnac.com': '.f-priceBox__price',
    'default': '.price, .product-price, [data-price]'
  };
  return selectors[domain] || selectors.default;
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
      product.id === id ? { ...product, price: newPrice } : product
    );
    chrome.storage.local.set({ products: updatedProducts });
  });
}

function addProduct(product, sendResponse) {
  chrome.storage.local.get("products", (result) => {
    const products = result.products || [];
    products.push(product);
    chrome.storage.local.set({ products }, () => {
      sendResponse({ success: true, products });
    });
  });
}

function getProducts(sendResponse) {
  chrome.storage.local.get("products", (result) => {
    sendResponse({ products: result.products || [] });
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

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "ADD_PRODUCT") {
    addProduct(request.product, sendResponse);
    return true;
  }
  if (request.type === "GET_PRODUCTS") {
    getProducts(sendResponse);
    return true;
  }
  return false;
});
