// ============================================
//  APPLICATION PRINCIPALE
// ============================================

// État du panier
let cart = JSON.parse(localStorage.getItem('jardinCart') || '{}');

// Éléments DOM
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const totalPrice = document.getElementById('totalPrice');
const submitBtn = document.getElementById('submitBtn');
const orderForm = document.getElementById('orderForm');
const slotsContainer = document.getElementById('slots');
const yearEl = document.getElementById('year');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = new Date().getFullYear();
  renderProducts();
  renderSlots();
  updateCartUI();
  setupFilters();
  setupCartDrawer();
  setupForm();
});

// ===== Affichage des produits =====
function renderProducts(filter = 'all') {
  productsGrid.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  filtered.forEach(product => {
    const isOut = product.stock <= 0;
    const isLow = product.stock > 0 && product.stock <= 3;
    
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy"
           onerror="this.src='https://placehold.co/400x300/e8f0eb/4a7c59?text=${encodeURIComponent(product.name)}'">
      <div class="product-body">
        <div class="product-category">${product.category === 'fruit' ? 'Fruit' : 'Légume'}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)} / ${product.unit}</div>
        <div class="product-stock ${isOut ? 'out' : isLow ? 'low' : ''}">
          ${isOut ? 'Épuisé pour le moment' : 
            isLow ? `Plus que ${product.stock} ${product.unit}${product.stock > 1 ? 's' : ''} !` : 
            `${product.stock} ${product.unit}${product.stock > 1 ? 's' : ''} disponible${product.stock > 1 ? 's' : ''}`}
        </div>
        ${product.description ? `<p style="font-size:0.85rem;color:var(--text-light);margin-bottom:0.8rem">${product.description}</p>` : ''}
        <div class="product-actions">
          <input type="number" class="qty-input" min="0.5" max="${product.stock}" step="0.5" value="1" 
                 ${isOut ? 'disabled' : ''} data-id="${product.id}">
          <button class="add-btn" data-id="${product.id}" ${isOut ? 'disabled' : ''}>
            ${isOut ? 'Indisponible' : 'Ajouter'}
          </button>
        </div>
      </div>
    `;
    
    productsGrid.appendChild(card);
  });

  // Événements boutons
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      const qty = parseFloat(input.value) || 1;
      addToCart(id, qty);
    });
  });
}

// ===== Filtres =====
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

// ===== Créneaux =====
function renderSlots() {
  slotsContainer.innerHTML = PICKUP_SLOTS.map(slot => `
    <label class="slot-label">
      <input type="checkbox" name="creneaux" value="${slot.label}">
      ${slot.label}
    </label>
  `).join('');
}

// ===== Panier =====
function addToCart(id, qty) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  // Limite au stock disponible
  const currentQty = cart[id]?.qty || 0;
  const newQty = Math.min(currentQty + qty, product.stock);
  
  cart[id] = {
    id: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit,
    qty: newQty
  };

  saveCart();
  updateCartUI();
  
  // Feedback visuel
  const btn = document.querySelector(`.add-btn[data-id="${id}"]`);
  const original = btn.textContent;
  btn.textContent = '✓ Ajouté';
  btn.style.background = '#2d5a3d';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1200);
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('jardinCart', JSON.stringify(cart));
}

function updateCartUI() {
  const items = Object.values(cart);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);

  // Badge
  cartCount.textContent = count % 1 === 0 ? count : count.toFixed(1);

  // Liste panier
  if (items.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide. Ajoutez des produits ci-dessus.</p>';
    cartTotal.style.display = 'none';
    submitBtn.disabled = true;
  } else {
    cartItems.innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-qty">${item.qty} ${item.unit} × ${formatPrice(item.price)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <strong>${formatPrice(item.price * item.qty)}</strong>
          <button class="cart-item-remove" data-id="${item.id}" title="Retirer">×</button>
        </div>
      </div>
    `).join('');
    
    cartTotal.style.display = 'flex';
    totalPrice.textContent = formatPrice(total);
    submitBtn.disabled = false;

    // Boutons supprimer
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
  }

  // Mise à jour des champs cachés pour le formulaire
  document.getElementById('panierHidden').value = items.map(i => 
    `${i.name} : ${i.qty} ${i.unit} (${formatPrice(i.price * i.qty)})`
  ).join('\n');
  document.getElementById('totalHidden').value = formatPrice(total);
}

function formatPrice(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

// ===== Formulaire =====
function setupForm() {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedSlots = [...document.querySelectorAll('input[name="creneaux"]:checked')]
      .map(cb => cb.value);

    if (selectedSlots.length === 0) {
      alert('Veuillez sélectionner au moins un créneau de retrait.');
      return;
    }

    if (Object.keys(cart).length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    // Préparation des données
    const formData = new FormData(orderForm);
    formData.set('creneaux', selectedSlots.join(' | '));
    
    // IMPORTANT : Remplacez l'URL ci-dessous par votre endpoint Formspree
    // 1. Allez sur https://formspree.io
    // 2. Créez un compte gratuit
    // 3. Créez un nouveau formulaire
    // 4. Copiez l'URL du type https://formspree.io/f/xxxxxx
    const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
      // Si Formspree n'est pas encore configuré, on simule + affiche un message
      if (FORMSPREE_URL.includes('YOUR_FORM_ID')) {
        // Mode démo : affiche un résumé et vide le panier
        console.log('Données de commande (démo) :', Object.fromEntries(formData));
        showSuccessDemo(formData);
      } else {
        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showSuccess();
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      }
    } catch (err) {
      alert('Une erreur est survenue. Réessayez ou contactez-moi directement.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer ma précommande';
    }
  });
}

function showSuccess() {
  orderForm.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem">
      <div style="font-size:3rem;margin-bottom:1rem">✅</div>
      <h3 style="font-family:var(--font-display);color:var(--green-900);margin-bottom:0.8rem">
        Précommande envoyée !
      </h3>
      <p style="color:var(--text-light);margin-bottom:1.5rem">
        Merci ! Je vais vérifier les stocks et vous recontacter rapidement 
        (sous 24h en général) pour confirmer votre commande et le créneau de retrait.
      </p>
      <button class="btn btn-primary" onclick="location.reload()">Retour à l'accueil</button>
    </div>
  `;
  cart = {};
  saveCart();
  updateCartUI();
}

function showSuccessDemo(formData) {
  const name = formData.get('name');
  const phone = formData.get('phone');
  const slots = formData.get('creneaux');
  const panier = formData.get('panier');
  const total = formData.get('total');

  orderForm.innerHTML = `
    <div style="text-align:center;padding:1.5rem 1rem">
      <div style="font-size:3rem;margin-bottom:1rem">✅</div>
      <h3 style="font-family:var(--font-display);color:var(--green-900);margin-bottom:0.8rem">
        Précommande simulée (mode démo)
      </h3>
      <p style="color:var(--text-light);margin-bottom:1rem;font-size:0.95rem">
        Formspree n’est pas encore configuré. Voici le résumé de ce qui aurait été envoyé :
      </p>
      <div style="background:var(--cream);padding:1rem;border-radius:8px;text-align:left;font-size:0.9rem;margin-bottom:1.5rem">
        <strong>Nom :</strong> ${name}<br>
        <strong>Téléphone :</strong> ${phone}<br>
        <strong>Créneaux :</strong> ${slots}<br>
        <strong>Panier :</strong><br>
        <pre style="white-space:pre-wrap;margin:0.3rem 0 0;font-size:0.85rem">${panier}</pre>
        <strong>Total :</strong> ${total}
      </div>
      <p style="font-size:0.85rem;color:var(--text-light);margin-bottom:1.2rem">
        Pour recevoir les vraies commandes par email, suivez les instructions dans le fichier <code>README.md</code>.
      </p>
      <button class="btn btn-primary" onclick="location.reload()">Recharger la page</button>
    </div>
  `;
  cart = {};
  saveCart();
  updateCartUI();
}

// ===== Drawer mobile =====
function setupCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  const cartBtn = document.getElementById('cartBtn');
  const closeBtn = document.getElementById('closeDrawer');

  cartBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    overlay.classList.add('show');
    // Sync content
    document.getElementById('drawerItems').innerHTML = cartItems.innerHTML;
  });

  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
}
