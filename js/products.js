// ============================================
//  PRODUITS – MODIFIEZ ICI FACILEMENT
// ============================================
// 
// Pour chaque produit :
// - id        : identifiant unique (ne changez pas après publication)
// - name      : nom affiché
// - category  : "legume" ou "fruit"
// - price     : prix en euros
// - unit      : "kg" ou "pièce" ou "botte" etc.
// - stock     : quantité disponible (0 = épuisé)
// - image     : chemin de la photo (dans /images/)
// - description : courte description (optionnel)
//
// Astuce : mettez stock à 0 pour masquer temporairement un produit
//          ou changez simplement la quantité quand vous vendez.

const PRODUCTS = [
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
//  CRÉNEAUX DE RETRAIT – MODIFIEZ ICI
// ============================================
const PICKUP_SLOTS = [
  { id: "mar-17-19", label: "Mardi 17h – 19h" },
  { id: "jeu-17-19", label: "Jeudi 17h – 19h" },
  { id: "sam-9-12",  label: "Samedi 9h – 12h" },
  { id: "autre",     label: "Autre (précisez dans le message)" }
];
