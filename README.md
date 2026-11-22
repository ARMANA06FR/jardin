# Mon Jardin – Site de vente de fruits & légumes

Petit site statique prêt à être hébergé gratuitement sur **GitHub Pages**.  
Idéal pour partager un lien sur Facebook ou Leboncoin au lieu de répondre à chaque message.

## Fonctionnalités

- Catalogue de produits avec photo, prix, stock et description
- **Gestion des stocks en live** (via Google Sheet – recommandé)
- Filtres Fruits / Légumes
- Panier (enregistré dans le navigateur)
- Formulaire de précommande avec créneaux de retrait
- Envoi de la commande par email (Formspree)
- Design moderne et responsive

---

## Gestion automatique des stocks (recommandé)

Au lieu de modifier le code à chaque vente, tu gères tout depuis un **Google Sheet** (comme un Excel en ligne).  
Tu changes le stock depuis ton téléphone → le site se met à jour tout seul.

### Étape 1 : Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et crée un nouveau tableur.
2. Dans la première ligne, mets exactement ces en-têtes :

| id | name | category | price | unit | stock | image | description |
|----|------|----------|-------|------|-------|-------|-------------|

3. Remplis avec tes produits. Exemple :

| id | name | category | price | unit | stock | image | description |
|----|------|----------|-------|------|-------|-------|-------------|
| tomates | Tomates anciennes | legume | 4.50 | kg | 8 | images/tomates.jpg | Variétés anciennes |
| pommes | Pommes Golden | fruit | 2.80 | kg | 15 | images/pommes.jpg | Croquantes |
| courgettes | Courgettes | legume | 2.50 | kg | 6 | images/courgettes.jpg | Tendres |

> **Astuce** : l’`id` doit être unique et sans espace (ex. `tomates`, `pommes-de-terre`).

### Étape 2 : Transformer le tableur en API (Google Apps Script – 100 % gratuit)

1. Dans ton Google Sheet → menu **Extensions** → **Apps Script**
2. Efface tout le code et colle celui-ci :

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = data[i][index];
    });
    // On ignore les lignes vides
    if (row.id) rows.push(row);
  }

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Clique sur **Déployer** → **Nouveau déploiement**
4. Type : **Application Web**
5. Description : `API Produits Jardin`
6. Exécuter en tant que : **Moi**
7. Qui a accès : **Tous** (même les utilisateurs anonymes)
8. Clique sur **Déployer**
9. **Copie l’URL** qui apparaît (elle ressemble à `https://script.google.com/macros/s/XXXXXXXX/exec`)

### Étape 3 : Brancher le site

1. Ouvre le fichier `js/products.js`
2. Change ces deux lignes :

```js
const USE_REMOTE_PRODUCTS = true;   // ← passe à true
const PRODUCTS_API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";  // ← colle ton URL
```

3. Re-uploade le fichier sur GitHub.

C’est tout !  
Maintenant, dès que tu modifies le stock dans le Google Sheet, le site affiche la nouvelle quantité (rafraîchissement de la page).

### Comment gérer les stocks au quotidien

1. Un client passe commande → tu reçois l’email
2. Tu vérifies et tu valides (tu lui réponds)
3. Tu ouvres ton Google Sheet (sur téléphone c’est très pratique)
4. Tu diminues le stock du produit
5. Le site est à jour

C’est beaucoup plus simple que de modifier du code.

---

## Déploiement en 5 minutes (GitHub Pages)

1. Crée un compte GitHub si besoin
2. Crée un nouveau dépôt (ex. `mon-jardin`)
3. Uploade **tous les fichiers** de ce dossier
4. Paramètres du dépôt → **Pages** → Source = `main` / dossier racine
5. Ton site sera en ligne à :  
   `https://ton-pseudo.github.io/mon-jardin/`

---

## Configuration de base

### Recevoir les commandes par email (Formspree)

1. Va sur [formspree.io](https://formspree.io) → crée un compte gratuit
2. Crée un nouveau formulaire
3. Copie l’URL (`https://formspree.io/f/xxxxxx`)
4. Dans `js/app.js`, remplace la ligne :

```js
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';
```

### Personnaliser les infos du site

| Fichier | Ce qu’il faut changer |
|---------|-----------------------|
| `index.html` | Adresse de retrait, email, WhatsApp, Facebook |
| `js/products.js` | URL de l’API + créneaux horaires |
| `images/` | Tes propres photos |

---

## Mode simple (sans Google Sheet)

Si tu ne veux pas utiliser Google Sheet, laisse simplement :

```js
const USE_REMOTE_PRODUCTS = false;
```

Les produits restent dans `js/products.js` et tu modifies le stock à la main dans le fichier.

---

## Structure des fichiers

```
jardin-vente/
├── index.html
├── css/styles.css
├── js/
│   ├── products.js     ← configuration (API + fallback)
│   └── app.js
├── images/
└── README.md
```

---

## Astuces

- Tu peux partager le Google Sheet avec un autre compte (conjoint, etc.) pour gérer les stocks à deux.
- Sur téléphone, l’application Google Sheets est très pratique pour baisser les stocks rapidement.
- Garde toujours quelques lignes d’exemple dans le tableur pour ne pas te tromper de colonnes.
- Si le site n’affiche plus les produits, vérifie que le déploiement Apps Script est bien en « Tous ».

Bonnes récoltes ! 🌱
