// script.js
// ---------- MENU DATA ----------
const menuData = [
  // Starters
  { id: 1, category: "Starters", name: "Paneer Tikka", price: 250, img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=280&h=180&fit=crop" },
  { id: 2, category: "Starters", name: "Crispy Spring Rolls", price: 210, img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=280&h=180&fit=crop" },
  { id: 3, category: "Starters", name: "Garlic Bread Cheesy", price: 180, img: "./assets/garlic-bread.png" },
  // Main Course
  { id: 4, category: "Main Course", name: "Butter Chicken", price: 420, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=280&h=180&fit=crop" },
  { id: 5, category: "Main Course", name: "Veg Biryani", price: 310, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=280&h=180&fit=crop" },
  { id: 6, category: "Main Course", name: "Paneer Butter Masala", price: 340, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=280&h=180&fit=crop" },
  // Drinks
  { id: 7, category: "Drinks", name: "Mojito", price: 150, img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=280&h=180&fit=crop" },
  { id: 8, category: "Drinks", name: "Fresh Lime Soda", price: 120, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=280&h=180&fit=crop" },
  { id: 9, category: "Drinks", name: "Mango Lassi", price: 140, img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=280&h=180&fit=crop" },
  // Desserts
  { id: 10, category: "Desserts", name: "Gulab Jamun", price: 130, img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=280&h=180&fit=crop&auto=format" },
  { id: 11, category: "Desserts", name: "Chocolate Brownie", price: 190, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=280&h=180&fit=crop" },
  { id: 12, category: "Desserts", name: "Ice Cream Sundae", price: 170, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=280&h=180&fit=crop" }
];

// Cart state: array of { id, name, price, quantity }
let cart = [];

// ---------- Helper functions ----------
function saveCartToLocal() {
  localStorage.setItem('mamithaCart', JSON.stringify(cart));
}

function loadCartFromLocal() {
  const stored = localStorage.getItem('mamithaCart');
  if (stored) {
    cart = JSON.parse(stored);
  } else {
    cart = [];
  }
  renderCart();
  updateCartCounters();
}

// update cart count badge (mobile + desktop optional)
function updateCartCounters() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const mobileBadge = document.getElementById('cartCountMobile');
  if (mobileBadge) mobileBadge.innerText = totalItems;
  const navBadge = document.getElementById('cartCountBadge');
  if (navBadge) {
    navBadge.innerText = totalItems;
    navBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

// Render all menu items dynamically with categories
function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;
  container.innerHTML = '';
  const categories = [...new Set(menuData.map(item => item.category))];
  categories.forEach(cat => {
    const catItems = menuData.filter(item => item.category === cat);
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-group';
    categoryDiv.innerHTML = `<h3 class="category-title"><i class="fas fa-${cat === 'Starters' ? 'pepper-hot' : cat === 'Main Course' ? 'utensil-spoon' : cat === 'Drinks' ? 'wine-bottle' : 'ice-cream'}"></i> ${cat}</h3><div class="menu-grid" id="grid-${cat.replace(/\s/g,'')}"></div>`;
    container.appendChild(categoryDiv);
    const gridDiv = categoryDiv.querySelector('.menu-grid');
    catItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'food-card';
      card.innerHTML = `
        <img class="card-img" src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="card-info">
          <h3>${item.name}</h3>
          <div class="price">₹${item.price}</div>
          <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        </div>
      `;
      gridDiv.appendChild(card);
    });
  });
  // attach event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      addToCart(id, name, price);
    });
  });
}

// Add to cart logic (increment quantity if exists)
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCartToLocal();
  renderCart();
  updateCartCounters();
  // subtle feedback (optional)
  showToast(`${name} added to cart!`);
}

// remove item completely
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCartToLocal();
  renderCart();
  updateCartCounters();
}

// update quantity
function updateQuantity(id, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(id);
    return;
  }
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = newQuantity;
    saveCartToLocal();
    renderCart();
    updateCartCounters();
  }
}

// clear entire cart
function clearCart() {
  if (cart.length > 0 && confirm('Clear all items from your basket?')) {
    cart = [];
    saveCartToLocal();
    renderCart();
    updateCartCounters();
  }
}

// render cart items and total
function renderCart() {
  const cartContainer = document.getElementById('cart-items-list');
  const totalSpan = document.getElementById('cart-total-price');
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-basket"></i> Your cart feels hungry! Add tasty dishes.</div>`;
    if (totalSpan) totalSpan.innerText = `₹0`;
    renderOrderSummary();
    return;
  }
  
  let cartHtml = '';
  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    cartHtml += `
      <div class="cart-item" data-id="${item.id}">
        <div class="item-details">
          <strong>${item.name}</strong> <span>₹${item.price}</span>
        </div>
        <div class="item-quantity">
          <button class="qty-decr" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-incr" data-id="${item.id}">+</button>
        </div>
        <div class="item-subtotal">₹${itemTotal}</div>
        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
  });
  cartContainer.innerHTML = cartHtml;
  if (totalSpan) totalSpan.innerText = `₹${total}`;
  renderOrderSummary();
  
  // attach quantity events
  document.querySelectorAll('.qty-decr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find(i => i.id === id);
      if (item) updateQuantity(id, item.quantity - 1);
    });
  });
  document.querySelectorAll('.qty-incr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find(i => i.id === id);
      if (item) updateQuantity(id, item.quantity + 1);
    });
  });
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });
}

// render right-column order summary
function renderOrderSummary() {
  const summaryEl = document.getElementById('order-summary-list');
  if (!summaryEl) return;
  if (cart.length === 0) {
    summaryEl.innerHTML = `<div class="order-summary-empty"><i class="fas fa-utensils"></i><p>No items yet.<br>Browse the menu and add dishes!</p></div>`;
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(item => {
    const sub = item.price * item.quantity;
    total += sub;
    html += `<div class="summary-row">
      <span class="summary-name">${item.name} <em>x${item.quantity}</em></span>
      <span class="summary-price">₹${sub}</span>
    </div>`;
  });
  html += `<div class="summary-total-row"><span>Grand Total</span><span>₹${total}</span></div>`;
  summaryEl.innerHTML = html;
}

// WhatsApp order
function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add items before ordering 🍽️");
    return;
  }

  // Validate delivery address
  const addressInput = document.getElementById('deliveryAddress');
  const addressError = document.getElementById('address-error');
  const address = addressInput ? addressInput.value.trim() : '';

  if (!address) {
    if (addressError) addressError.style.display = 'flex';
    if (addressInput) {
      addressInput.focus();
      addressInput.style.borderColor = '#e74c3c';
    }
    return;
  }

  // Hide error if it was shown
  if (addressError) addressError.style.display = 'none';
  if (addressInput) addressInput.style.borderColor = '#25D366';

  const phone = "+918300528221";
  let message = "🍽️ *Order from Mamitha's Restarunt* 🍛%0A";
  let orderSummary = "";
  let grandTotal = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    grandTotal += subtotal;
    orderSummary += `• ${item.name} x ${item.quantity} = ₹${subtotal}%0A`;
  });
  message += orderSummary;
  message += `%0A💰 *Total: ₹${grandTotal}*%0A`;
  message += `%0A📍 *Delivery Address:* ${encodeURIComponent(address)}%0A`;
  message += `%0A🙏 Thank you!`;
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Simple toast feedback (non-intrusive)
function showToast(msg) {
  let toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#e67e22';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '50px';
  toast.style.fontWeight = '500';
  toast.style.zIndex = '999';
  toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  toast.style.fontFamily = 'inherit';
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 1800);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  loadCartFromLocal();
  
  // clear cart button
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
  
  // whatsapp order button
  const whatsappBtn = document.getElementById('whatsappOrderBtn');
  if (whatsappBtn) whatsappBtn.addEventListener('click', sendWhatsAppOrder);
  
  // smooth nav scroll
  document.querySelectorAll('.nav-links a, .btn-primary').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  
  // Mobile cart icon scroll to orders section
  const mobileCartIcon = document.getElementById('mobileCartIcon');
  if (mobileCartIcon) {
    mobileCartIcon.addEventListener('click', () => {
      const ordersSection = document.getElementById('orders');
      if (ordersSection) ordersSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Hide nav badge initially if cart empty
  updateCartCounters();
});
