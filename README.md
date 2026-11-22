# Mon Jardin – Site de vente de fruits & légumes

Petit site statique prêt à être hébergé gratuitement sur **GitHub Pages**.  
Idéal pour partager un lien sur Facebook ou Leboncoin au lieu de répondre à chaque message.

## Fonctionnalités

- Catalogue de produits avec photo, prix, stock et description
- **Gestion des stocks en live** (via Google Sheet)
- Filtres Fruits / Légumes
- Panier (enregistré dans le navigateur)
- Formulaire de précommande avec créneaux de retrait
- **Enregistrement automatique des commandes dans un Google Sheet**
- **Envoi d’email de notification** (via Google Apps Script – 100 % gratuit)
- Design moderne et responsive

---

## Configuration complète (Google Sheet + commandes + email)

Tout passe par **un seul Google Apps Script** (gratuit) :
- Lecture des produits / stocks
- Enregistrement des commandes dans un onglet « Commandes »
- Envoi d’un email à chaque nouvelle commande

### 1. Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et crée un nouveau tableur.
2. **Onglet 1** (renomme-le `Produits` si tu veux) – première ligne :

| id | name | category | price | unit | stock | image | description |
|----|------|----------|-------|------|-------|-------|-------------|

Exemple :

| id | name | category | price | unit | stock | image | description |
|----|------|----------|-------|------|-------|-------|-------------|
| tomates | Tomates anciennes | legume | 4.50 | kg | 8 | images/tomates.jpg | Variétés anciennes |
| pommes | Pommes Golden | fruit | 2.80 | kg | 15 | images/pommes.jpg | Croquantes |

> L’`id` doit être unique et sans espace (`tomates`, `pommes-de-terre`…).

3. **Onglet 2** – crée un nouvel onglet et nomme-le exactement `Commandes`.  
   Première ligne :

| Date | Nom | Téléphone | Email | Créneaux | Panier | Total | Message |
|------|-----|-----------|-------|----------|--------|-------|---------|

### 2. Installer le Google Apps Script

1. Dans ton Google Sheet → **Extensions → Apps Script**
2. Efface tout le code existant et colle **exactement** le code ci-dessous :

```javascript
// ============================================================
//  CONFIGURATION – À MODIFIER
// ============================================================
const EMAIL_DESTINATAIRE = "ton.email@gmail.com";   // ← mets ton email ici
const NOM_DU_JARDIN = "Mon Jardin";                 // nom qui apparaît dans l'email

// ============================================================
//  LECTURE DES PRODUITS (appelé en GET par le site)
// ============================================================
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // On prend le premier onglet (ou celui nommé "Produits")
  const sheet = ss.getSheetByName("Produits") || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = data[i][index];
    });
    if (row.id) rows.push(row);
  }

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  RÉCEPTION DES COMMANDES (appelé en POST par le site)
// ============================================================
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Commandes");

    if (!sheet) {
      return jsonResponse({ ok: false, error: "Onglet 'Commandes' introuvable" });
    }

    // Données envoyées par le formulaire
    const p = e.parameter || {};
    const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    const nom = p.name || "";
    const telephone = p.phone || "";
    const email = p.email || "";
    const creneaux = p.creneaux || "";
    const panier = p.panier || "";
    const total = p.total || "";
    const message = p.message || "";

    // 1. Enregistrement dans le tableur
    sheet.appendRow([date, nom, telephone, email, creneaux, panier, total, message]);

    // 2. Envoi de l'email de notification
    envoyerEmailCommande({
      date, nom, telephone, email, creneaux, panier, total, message
    });

    return jsonResponse({ ok: true });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ============================================================
//  EMAIL
// ============================================================
function envoyerEmailCommande(data) {
  const sujet = `🌿 Nouvelle précommande – ${NOM_DU_JARDIN}`;

  const corps = `
Nouvelle précommande reçue sur le site ${NOM_DU_JARDIN}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date       : ${data.date}
Nom        : ${data.nom}
Téléphone  : ${data.telephone}
Email      : ${data.email || "(non renseigné)"}
Créneaux   : ${data.creneaux}
Total      : ${data.total}

Panier :
${data.panier}

Message du client :
${data.message || "(aucun)"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu peux répondre directement à ce client ou le rappeler.
  `.trim();

  GmailApp.sendEmail(EMAIL_DESTINATAIRE, sujet, corps);
}

// ============================================================
//  UTILITAIRE
// ============================================================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Modifie la ligne** :
   ```js
   const EMAIL_DESTINATAIRE = "ton.email@gmail.com";
   ```
   Mets **ton vrai email**.

4. Clique sur **Enregistrer** (icône disquette).

5. Clique sur **Déployer → Nouveau déploiement**
   - Type : **Application Web**
   - Description : `API Jardin (produits + commandes)`
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tous**
   - Clique sur **Déployer**

6. **Autorise** le script quand Google te le demande (première fois uniquement).

7. **Copie l’URL** qui s’affiche  
   (elle ressemble à `https://script.google.com/macros/s/XXXXXXXX/exec`)

> ⚠️ À chaque modification du script, tu dois refaire un **Nouveau déploiement** et mettre à jour l’URL dans le site.

### 3. Brancher le site

1. Ouvre `js/products.js`
2. Colle ton URL ici :

```js
const PRODUCTS_API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

3. Vérifie que cette ligne est bien à `true` :

```js
const USE_REMOTE_PRODUCTS = true;
```

4. Pousse les fichiers sur GitHub.

C’est tout !

---

## Déploiement en 5 minutes (GitHub Pages)

1. Crée un compte GitHub si besoin
2. Crée un nouveau dépôt (ex. `mon-jardin`)
3. Uploade **tous les fichiers** de ce dossier
4. Paramètres du dépôt → **Pages** → Source = `main` / dossier racine
5. Ton site sera en ligne à :  
   `https://ton-pseudo.github.io/mon-jardin/`

---

## Personnaliser les infos du site

| Fichier | Ce qu’il faut changer |
|---------|-----------------------|
| `index.html` | Adresse de retrait, email, WhatsApp, Facebook |
| `js/products.js` | URL de l’API + créneaux horaires (en bas du fichier) |
| `images/` | Tes propres photos |

---

## Mode simple (sans Google Sheet)

Si tu ne veux pas utiliser Google Sheet, laisse simplement :

```js
const USE_REMOTE_PRODUCTS = false;
```

Les produits restent dans `js/products.js` et tu modifies le stock à la main dans le fichier.  
**Attention** : dans ce mode les commandes ne seront plus enregistrées ni envoyées par email.

---

## Structure des fichiers

```
jardin/
├── index.html
├── css/styles.css
├── js/
│   ├── products.js     ← configuration (URL API + fallback produits)
│   └── app.js
├── images/
└── README.md
```

---

## Astuces

- Tu peux partager le Google Sheet avec un autre compte (conjoint, etc.) pour gérer les stocks à deux.
- Sur téléphone, l’application Google Sheets est très pratique pour baisser les stocks rapidement.
- L’historique complet des commandes se trouve dans l’onglet **Commandes**.
- Quota gratuit Gmail : environ 100 emails/jour (largement suffisant pour un petit jardin).

---

## En cas de problème

1. Ouvre la console du navigateur (F12 → Console) et regarde s’il y a des erreurs.
2. Vérifie que l’URL dans `js/products.js` est bien celle du **dernier** déploiement.
3. Dans Apps Script → **Exécutions** : tu vois si le `doPost` a bien tourné.
4. Vérifie que l’onglet s’appelle exactement `Commandes` (avec un « s »).
```
