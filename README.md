# Mon Jardin – Site de vente de fruits & légumes

Petit site statique prêt à être hébergé gratuitement sur **GitHub Pages**.  
Idéal pour partager un lien sur Facebook ou Leboncoin au lieu de répondre à chaque message.

## Fonctionnalités

- Catalogue de produits avec photo, prix, stock et description
- Filtres Fruits / Légumes
- Panier (enregistré dans le navigateur)
- Formulaire de précommande avec :
  - Coordonnées client
  - Sélection de créneaux horaires de retrait
  - Message libre
- Envoi de la commande par email (via Formspree – gratuit)
- Design moderne, responsive (mobile-friendly)
- Facile à mettre à jour : un seul fichier pour les produits et les stocks

## Déploiement en 5 minutes (GitHub Pages)

1. Créez un compte GitHub si vous n’en avez pas.
2. Créez un **nouveau dépôt** (ex. `mon-jardin` ou `fruits-legumes`).
3. Uploadez **tous les fichiers** de ce dossier (ou clonez et poussez).
4. Dans les paramètres du dépôt → **Pages** → Source = `main` (ou `master`) / dossier `/ (root)`.
5. Attendez 1-2 minutes. Votre site sera disponible à :
   `https://VOTRE-PSEUDO.github.io/NOM-DU-REPO/`

Vous pouvez ensuite partager ce lien sur Facebook et Leboncoin.

## Configuration indispensable

### 1. Recevoir les commandes par email (Formspree)

Le formulaire est prêt, mais il faut le connecter à votre boîte mail :

1. Allez sur [https://formspree.io](https://formspree.io) et créez un compte gratuit.
2. Cliquez sur **New Form**.
3. Donnez-lui un nom (ex. « Commandes Jardin »).
4. Copiez l’URL qui ressemble à `https://formspree.io/f/xxxxxx`.
5. Ouvrez le fichier `js/app.js` et remplacez la ligne :

```js
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';
```

par votre vraie URL.

À partir de ce moment, chaque précommande arrive directement dans votre email.

### 2. Personnaliser les informations

| Fichier | Ce qu’il faut changer |
|---------|-----------------------|
| `index.html` | Adresse de retrait, email, numéro WhatsApp, lien Facebook |
| `js/products.js` | Liste des produits, prix, stocks, créneaux horaires |
| `images/` | Vos propres photos (gardez les mêmes noms ou mettez à jour le chemin) |

### 3. Mettre à jour les stocks (très simple)

Ouvrez `js/products.js` et changez uniquement le chiffre `stock` :

```js
{
  id: "tomates",
  name: "Tomates anciennes",
  ...
  stock: 8,   // ← changez ici (0 = épuisé)
  ...
}
```

Puis re-uploadez le fichier sur GitHub. C’est tout.

## Améliorations déjà présentes / idées

- **Panier persistant** : le client peut fermer l’onglet et revenir plus tard
- **Stock bas** : indication visuelle « Plus que X ! »
- **Mode démo** : tant que Formspree n’est pas configuré, le site montre un résumé de la commande
- **Créneaux flexibles** : le client coche plusieurs possibilités, vous validez le meilleur
- **Design soigné** : typographie élégante, couleurs naturelles, responsive

### Idées supplémentaires que vous pouvez ajouter plus tard

- Photo de vous ou du jardin dans la section « À propos »
- Intégration d’une vraie carte Google Maps (embed gratuit)
- Bouton WhatsApp flottant
- Page « Prochaines récoltes » pour donner de la visibilité
- Ajout d’un code promo simple (via un champ dans le formulaire)
- Export des commandes vers un Google Sheet (avancé, via Zapier ou Make)

## Structure des fichiers

```
jardin-vente/
├── index.html          ← page principale
├── css/styles.css      ← styles
├── js/
│   ├── products.js     ← ⭐ produits + créneaux (à modifier souvent)
│   └── app.js          ← logique (Formspree ici)
├── images/             ← vos photos
└── README.md           ← ce fichier
```

## Conseils d’utilisation

- Mettez le lien du site en description de vos annonces Facebook / Leboncoin.
- Répondez rapidement aux précommandes (sous 24h) pour garder la confiance.
- Mettez les stocks à jour régulièrement, surtout le week-end.
- Vous pouvez créer plusieurs dépôts si vous voulez tester des versions.

---

Fait avec soin pour les jardiniers qui vendent leurs surplus 🌱  
Bonnes récoltes !
