// ============================================
//  CONFIGURATION DES PRODUITS & STOCKS
// ============================================
//
// DEUX MODES POSSIBLES :
//
// 1. MODE SIMPLE (par défaut)
//    → Les produits sont définis ci-dessous dans PRODUCTS
//    → Tu modifies le stock à la main dans ce fichier
//
// 2. MODE AUTOMATIQUE (recommandé)
//    → Les produits + stocks viennent d’un Google Sheet
//    → Tu modifies les stocks directement dans le tableur (depuis ton téléphone)
//    → Le site se met à jour tout seul
//
// Pour activer le mode automatique :
// 1. Suis le guide dans README.md (section "Gestion automatique des stocks")
// 2. Remplace l’URL ci-dessous par ton endpoint
// 3. Mets USE_REMOTE_PRODUCTS à true

const USE_REMOTE_PRODUCTS = true;  // ← passe à true une fois le Google Sheet prêt

// ============================================================
// URL unique de ton Google Apps Script
// Cette URL sert à DEUX choses :
//   1. Charger les produits / stocks (GET)
//   2. Recevoir les commandes + envoyer l'email (POST)
//
// Après chaque modification du script → Déployer → Nouveau déploiement
// puis colle ici la NOUVELLE URL.
// ============================================================
const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbxQsCGV5jxW0aSYmn1CgiTkWnXKrNMZ525nonMNWt_04KlXBEto77Ybl9Mf-qrYi-mN/exec";


// ============================================
//  PRODUITS DE SECOURS (utilisés si le mode remote est off ou en erreur)
// ============================================
const PRODUCTS_FALLBACK = [
  {
    id: "tomates",
    name: "Tomates anciennes",
    category: "legume",
    price: 4.50,
    unit: "kg",
    stock: 8,
    image: "images/tomates.jpg",
    description: "Variétés anciennes, juteuses et parfumées"
  },
  {
    id: "pommes",
    name: "Pommes Golden",
    category: "fruit",
    price: 2.80,
    unit: "kg",
    stock: 15,
    image: "images/pommes.jpg",
    description: "Croquantes, récoltées à maturité"
  },
  {
    id: "courgettes",
    name: "Courgettes",
    category: "legume",
    price: 2.50,
    unit: "kg",
    stock: 6,
    image: "images/courgettes.jpg",
    description: "Tendres, parfaites pour la ratatouille"
  },
  {
    id: "carottes",
    name: "Carottes nouvelles",
    category: "legume",
    price: 3.20,
    unit: "kg",
    stock: 10,
    image: "images/carottes.jpg",
    description: "Avec fanes, goût sucré"
  },
  {
    id: "fraises",
    name: "Fraises",
    category: "fruit",
    price: 6.00,
    unit: "barquette",
    stock: 4,
    image: "images/fraises.jpg",
    description: "Barquette de 250g environ"
  },
  {
    id: "pommes-de-terre",
    name: "Pommes de terre",
    category: "legume",
    price: 2.00,
    unit: "kg",
    stock: 20,
    image: "images/pommes-de-terre.jpg",
    description: "Variété Charlotte, idéales à la vapeur"
  }
];

// ============================================
//  CRÉNEAUX DE RETRAIT
// ============================================
const PICKUP_SLOTS = [
  { id: "semaine-16-19", label: "En semaine de 16h00 à 19h00" },
  { id: "dimanche-16-19", label: "Le dimanche de 16h00 à 19h00" },
  { id: "autre", label: "Autre (précisez dans le message)" }
];
