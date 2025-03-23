import React from "react";

const Subscription = () => {
  const handleUpgrade = () => {
    // Logique pour gérer l'abonnement,
    chrome.storage.local.set({ isPremium: true }, () => {
      // Use browser notifications instead of alert
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: "Abonnement Premium",
        message: "Vous êtes maintenant abonné au plan premium !",
      });
    });
  };

  return (
    <div>
      <h2>Plan Premium</h2>
      <p>Passez au plan premium pour suivre un nombre illimité de produits.</p>
      <button type="button" onClick={handleUpgrade}>
        Passer au plan premium (15€/mois)
      </button>
    </div>
  );
};

export default Subscription;
