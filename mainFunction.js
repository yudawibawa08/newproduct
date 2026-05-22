/**
 * Bali Dhupa - Complete Dynamic E-commerce Core Engine Script
 */

// 1. Database Produk Terpusat (Single Source of Truth) dengan Informasi Detail Lengkap
const BD_PRODUCTS_DB = [
    {
        id: "prod-01",
        name: "Deva Dhupa Premium Censer",
        price: 25.00,
        image: "img/insence.jpg",
        description: "Exquisitely hand-carved terracotta incense burner modeled after classic Balinese temple arches. Designed to disperse streams of soothing ritual smoke uniformly while elevating the interior aesthetics of your home sanctuary.",
        // Informasi Tambahan Khusus PDP
        materials: "100% Premium Terracotta Clay, Hand-Carved",
        burnDuration: "Continuous distribution (Aroma stays up to 24 hours in closed room)",
        weight: "450 grams",
        dimensions: "12cm x 12cm x 15cm"
    },
    {
        id: "prod-02",
        name: "Amrita Sacred Incense Sticks",
        price: 15.50,
        image: "img/insence.jpg",
        description: "Infused with raw sandalwood oil, majestic frangipani blossoms, and aged forest resins. Hand-rolled by traditional artisans in Klungkung, Bali, ensuring a slow, pure, and clean burn to invite supreme serenity.",
        // Informasi Tambahan Khusus PDP
        materials: "Raw Sandalwood Oil, Majestic Frangipani Blossoms, Aged Forest Resins, Natural Bamboo Stick",
        burnDuration: "Approx. 60 - 75 minutes per stick",
        weight: "200 grams (approx. 50 sticks per pack)",
        dimensions: "Length: 22cm"
    },
    {
        id: "prod-03",
        name: "Tirta Cleansing Oud Blend",
        price: 18.00,
        image: "img/insence.jpg",
        description: "A profound blend of rich agarwood essence paired with subtle hints of sweet honey and highland spices. Formulated specially to purify energy blocks, deepen focus, and anchor deep mindfulness during meditation sessions.",
        // Informasi Tambahan Khusus PDP
        materials: "Premium Agarwood (Oud) Essence, Wild Forest Honey, Highland Spices, Coconut Shell Charcoal",
        burnDuration: "Approx. 45 - 60 minutes per stick",
        weight: "150 grams (approx. 40 sticks per pack)",
        dimensions: "Length: 20cm"
    },
    {
        id: "prod-04",
        name: "Mantra Meditation Bundle",
        price: 22.00,
        image: "img/insence.jpg",
        description: "A professional collection of premium Balinese aromatic elements. Ideal for daily meditation, space purifications, or creating a deeply relaxing environment in your living area.",
        // Informasi Tambahan Khusus PDP
        materials: "Combination of Amrita Sticks, Tirta Oud Blend, and a Mini Ceramic Holder",
        burnDuration: "Varies based on selected item inside the bundle",
        weight: "350 grams (Complete Bundle)",
        dimensions: "Box size: 25cm x 15cm x 5cm"
    }
];

// Data Tarif Ekspedisi Internasional (Origin: Klungkung, Bali)
const SHIPPING_ZONES = {
    id: { name: "Indonesia (Domestic)", ratePerItem: 2.00, baseRate: 3.00 },
    sg: { name: "Singapore (Expedited)", ratePerItem: 5.00, baseRate: 15.00 },
    au: { name: "Australia (Standard International)", ratePerItem: 8.00, baseRate: 25.00 },
    us: { name: "United States (Global Express)", ratePerItem: 12.00, baseRate: 35.00 }
};

// Sinkronisasi data Keranjang Belanja via LocalStorage
let appCartState = JSON.parse(localStorage.getItem('bd_shared_cart_store')) || [];

// Inisialisasi fungsi utama saat halaman web selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    initNavbarScrollEffect();
    renderStorefrontProducts();
    refreshCartUI();
    
    // Daftarkan status awal halaman beranda ke dalam riwayat browser untuk back button Android
    if (!history.state) {
        history.replaceState({ page: 'storefront' }, "", "#home");
    }
});

// 2. Efek Perubahan Warna Navigasi Saat Di-scroll
function initNavbarScrollEffect() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });
}

// 3. Menampilkan Produk ke Grid Utama Berdasarkan Database Secara Dinamis
function renderStorefrontProducts() {
    const gridContainer = document.getElementById("propertiesGrid");
    if (!gridContainer) return;

    let htmlBuffer = "";

    BD_PRODUCTS_DB.forEach(product => {
        htmlBuffer += `
            <div class="property-card" onclick="openProductDetailPage('${product.id}')">
                <div class="property-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="property-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="property-footer">
                        <span class="property-price">$ ${product.price.toFixed(2)}</span>
                        <button class="property-btn" onclick="handleCartButtonClick(event, '${product.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = htmlBuffer;
}

// Handler tombol keranjang di homepage agar tidak memicu pembukaan halaman PDP
function handleCartButtonClick(event, productId) {
    event.stopPropagation(); 
    executeAddToCart(productId, 1);
    openCartSidebar();
}

// 4. Fungsi Geser Halaman Halus (Scroll To Section)
function scrollToSection(sectionId) {
    navigateToPage('storefront');
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// 5. Operasi Manajemen Keranjang Belanja (Cart Engine)
function executeAddToCart(productId, qty) {
    const product = BD_PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;

    const existingItem = appCartState.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += parseInt(qty);
    } else {
        appCartState.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: parseInt(qty)
        });
    }
    saveCartState();
    refreshCartUI();
}

// Mengubah jumlah produk (+1 atau -1) langsung dari Cart
function changeCartItemQty(productId, changeValue) {
    const targetItem = appCartState.find(item => item.id === productId);
    if (!targetItem) return;

    targetItem.qty += changeValue;

    if (targetItem.qty < 1) {
        appCartState = appCartState.filter(item => item.id !== productId);
    }

    saveCartState();
    refreshCartUI();
}

// Menghapus produk secara total menggunakan tombol silang (✕)
function clearCartItem(productId) {
    appCartState = appCartState.filter(item => item.id !== productId);
    saveCartState();
    refreshCartUI();
}

function saveCartState() {
    localStorage.setItem('bd_shared_cart_store', JSON.stringify(appCartState));
}

function refreshCartUI() {
    const badge = document.getElementById("cartBadge");
    const container = document.getElementById("cartSidebarItems");
    const subtotalText = document.getElementById("cartSubtotalText");

    if (!badge || !container || !subtotalText) return;

    const totalItems = appCartState.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = totalItems;

    if (appCartState.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#999;margin-top:3rem;">Your cart is empty.</p>`;
        subtotalText.innerText = "$ 0.00";
    } else {
        let htmlContent = "";
        let calculatedSubtotal = 0;

        appCartState.forEach(item => {
            calculatedSubtotal += (item.price * item.qty);
            htmlContent += `
                <div class="cart-item-row" style="display: flex; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); align-items: center;">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div class="cart-item-info" style="flex: 1;">
                        <h5 style="font-family: 'Playfair Display', serif; font-size: 0.95rem; margin-bottom: 0.2rem;">${item.name}</h5>
                        <p class="cart-item-price" style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">$ ${item.price.toFixed(2)}</p>
                        
                        <div class="cart-qty-control" style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="changeCartItemQty('${item.id}', -1)" style="width: 24px; height: 24px; background: #e8e0d5; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">-</button>
                            <span style="font-weight: bold; font-size: 0.9rem; min-width: 20px; text-align: center;">${item.qty}</span>
                            <button onclick="changeCartItemQty('${item.id}', 1)" style="width: 24px; height: 24px; background: #e8e0d5; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" onclick="clearCartItem('${item.id}')" style="background: transparent; border: none; color: #cc0000; cursor: pointer; font-size: 1.1rem; padding: 0 0.5rem;">✕</button>
                </div>
            `;
        });
        container.innerHTML = htmlContent;
        subtotalText.innerText = `$ ${calculatedSubtotal.toFixed(2)}`;
    }
}

function toggleCartSidebar() {
    document.getElementById("cartSidebar").classList.toggle("open");
    document.getElementById("sidebarOverlay").classList.toggle("open");
}

function openCartSidebar() {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("open");
}

function closeCartSidebar() {
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("open");
}

// 6. SPA Dynamic Router (Dengan Dukungan Tombol Back Fisik Android & Laptop)
function navigateToPage(pageTarget, isPopState = false) {
    closeCartSidebar();
    
    document.getElementById("storefrontView").classList.add("hidden");
    document.getElementById("pdpPageView").classList.add("hidden");
    document.getElementById("checkoutPageView").classList.add("hidden");

    if (pageTarget === 'storefront') {
        document.getElementById("storefrontView").classList.remove("hidden");
        document.body.style.overflow = "auto";
    } else if (pageTarget === 'pdp') {
        document.getElementById("pdpPageView").classList.remove("hidden");
        document.getElementById("pdpPageView").scrollTop = 0;
        document.body.style.overflow = "auto";
    } else if (pageTarget === 'checkout') {
        renderCheckoutFormView();
        document.getElementById("checkoutPageView").classList.remove("hidden");
        document.getElementById("checkoutPageView").scrollTop = 0;
        document.body.style.overflow = "auto";
    }

    // Masukkan log halaman baru ke riwayat browser jika BUKAN dipicu oleh tombol back fisik
    if (!isPopState) {
        const urlHash = pageTarget === 'storefront' ? "#home" : `#${pageTarget}`;
        history.pushState({ page: pageTarget }, "", urlHash);
    }
}

// 7. Render Halaman Detail Produk (PDP) dengan Kolom Tindakan Sticky Kontekstual
function openProductDetailPage(productId) {
    const product = BD_PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;

    const pdpContainer = document.getElementById("pdpPageView");
    pdpContainer.innerHTML = `
        <button class="back-to-store-btn" onclick="navigateToPage('storefront')" style="margin-bottom: 1.5rem;">← Back to Collections</button>
        
        <div class="pdp-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: flex-start; position: relative;">
            
            <div class="pdp-gallery">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 6px; object-fit: cover;">
            </div>
            
            <div class="pdp-details-info" style="display: flex; flex-direction: column; gap: 1.5rem; position: relative;">
                
                <div>
                    <h2>${product.name}</h2>
                    <div class="pdp-price">$ ${product.price.toFixed(2)}</div>
                    <p class="pdp-description">${product.description}</p>
                </div>
                
                <div class="pdp-specifications" style="padding: 1.25rem; background: rgba(139, 115, 85, 0.08); border-radius: 6px; border-left: 4px solid var(--primary);">
                    <h4 style="font-family: 'Playfair Display', serif; margin-bottom: 0.75rem; color: var(--dark); font-size: 1.1rem;">Product Specifications</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; line-height: 1.5;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);"><td style="padding: 0.5rem 0; font-weight: bold; width: 35%;">Composition:</td><td style="padding: 0.5rem 0; color: #444;">${product.materials}</td></tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);"><td style="padding: 0.5rem 0; font-weight: bold;">Burn Duration:</td><td style="padding: 0.5rem 0; color: #444;">${product.burnDuration}</td></tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);"><td style="padding: 0.5rem 0; font-weight: bold;">Net Weight:</td><td style="padding: 0.5rem 0; color: #444;">${product.weight}</td></tr>
                        <tr><td style="padding: 0.5rem 0; font-weight: bold;">Dimensions:</td><td style="padding: 0.5rem 0; color: #444;">${product.dimensions}</td></tr>
                    </table>
                </div>
                
                <div class="pdp-sticky-purchase-card" style="position: -webkit-sticky; position: sticky; top: 120px; background: #fdfbf7; padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); z-index: 10;">
                    
                    <div class="form-field-control" style="margin-bottom: 1.25rem;">
                        <label style="display: block; font-weight: bold; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--dark);">Select Quantity</label>
                        <select class="pdp-qty-select" id="pdpQtySelectField" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; font-weight: bold; background: white;">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    
                    <div class="pdp-actions-row" style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <button class="cta-button" style="width: 100%; text-align: center; margin: 0; padding: 0.85rem; font-weight: bold;" onclick="handlePdpAddToCart('${product.id}')">🛒 Add to Shopping Cart</button>
                        <button class="checkout-now-btn" style="width: 100%; background: #2c2416; color: #ffffff; border: none; padding: 0.85rem; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: background 0.3s;" onclick="handlePdpDirectCheckout('${product.id}')">🛍️ Buy It Now</button>
                    </div>
                    
                </div>
                
            </div>
        </div>
    `;
    navigateToPage('pdp');
}

function handlePdpAddToCart(productId) {
    const qty = document.getElementById("pdpQtySelectField").value;
    executeAddToCart(productId, qty);
    navigateToPage('storefront');
    openCartSidebar();
}

function handlePdpDirectCheckout(productId) {
    const qty = document.getElementById("pdpQtySelectField").value;
    executeAddToCart(productId, qty);
    navigateToPage('checkout');
}

// 8. Render Tampilan Formulir Lembar Checkout & Ekspedisi Zonal
function renderCheckoutFormView() {
    const view = document.getElementById("checkoutPageView");
    if (appCartState.length === 0) {
        view.innerHTML = `
            <button class="back-to-store-btn" onclick="navigateToPage('storefront')">← Back to Store</button>
            <div style="text-align:center; padding:5rem 0;">
                <h3 style="font-family:'Playfair Display', serif;">Your cart is empty.</h3>
                <button class="cta-button" style="margin-top:1.5rem;" onclick="navigateToPage('storefront')">Shop Our Products</button>
            </div>
        `;
        return;
    }

    let summaryItemsHtml = "";
    let itemSubtotal = 0;
    let totalItemsCount = 0;

    appCartState.forEach(item => {
        itemSubtotal += (item.price * item.qty);
        totalItemsCount += item.qty;
        summaryItemsHtml += `
            <div class="summary-row-line">
                <span>${item.name} (x${item.qty})</span>
                <span>$ ${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    const defaultZone = SHIPPING_ZONES['id'];
    const initialShippingCost = defaultZone.baseRate + (defaultZone.ratePerItem * totalItemsCount);
    const initialGrandTotal = itemSubtotal + initialShippingCost;

    view.innerHTML = `
        <button class="back-to-store-btn" onclick="navigateToPage('storefront')">← Continue Shopping</button>
        <div class="checkout-container">
            <div class="checkout-card">
                <h3>Delivery Destination Address</h3>
                <p style="font-size:0.85rem; color:#666; margin-bottom:1.5rem;">Dispatching from: <strong>Klungkung, Bali, Indonesia</strong></p>
                <form id="purchaseSubmitForm" onsubmit="executeOrderFinalization(event)">
                    <div class="form-group-row">
                        <div class="form-field-control"><label>First Name</label><input type="text" required></div>
                        <div class="form-field-control"><label>Last Name</label><input type="text" required></div>
                    </div>
                    <div class="form-field-control"><label>Email Address</label><input type="email" required></div>
                    
                    <div class="form-field-control">
                        <label>Destination Country</label>
                        <select id="checkoutCountrySelect" onchange="updateShippingCost(${itemSubtotal}, ${totalItemsCount})" required>
                            <option value="id">Indonesia</option>
                            <option value="sg">Singapore</option>
                            <option value="au">Australia</option>
                            <option value="us">United States</option>
                        </select>
                    </div>

                    <div class="form-field-control"><label>Full Shipping Address</label><input type="text" placeholder="Street Name, Building/Unit No." required></div>
                    <div class="form-group-row">
                        <div class="form-field-control"><label>City / State</label><input type="text" required></div>
                        <div class="form-field-control"><label>Postal Code</label><input type="text" required></div>
                    </div>
                    <div class="form-field-control">
                        <label>Secure Payment Option</label>
                        <select required>
                            <option value="qris">Instant Global QRIS / Credit Card</option>
                            <option value="paypal">PayPal Secure Account</option>
                            <option value="transfer">International Bank Wire Transfer</option>
                        </select>
                    </div>
                    <button type="submit" class="cta-button" style="width:100%; text-align:center; margin-top:1.5rem; padding:1rem;">Complete Secure Purchase</button>
                </form>
            </div>
            <div class="order-summary-box">
                <h3 style="font-family:'Playfair Display', serif; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.5rem;">Order Review</h3>
                <div id="checkoutSummaryItems">${summaryItemsHtml}</div>
                <div class="summary-row-line" style="margin-top:1.25rem;"><span>Items Subtotal</span><span>$ ${itemSubtotal.toFixed(2)}</span></div>
                <div class="summary-row-line">
                    <span>International Shipping<br><small style="color:#777;" id="shippingZoneMethod">Via Indonesia (Domestic)</small></span>
                    <span id="checkoutShippingCostText">$ ${initialShippingCost.toFixed(2)}</span>
                </div>
                <div class="summary-row-line grand-total"><span>Grand Total</span><span id="checkoutGrandTotalText">$ ${initialGrandTotal.toFixed(2)}</span></div>
            </div>
        </div>
    `;
}

// 9. Fungsi Kalkulator Real-time Ekspedisi Internasional
function updateShippingCost(itemSubtotal, totalItemsCount) {
    const countryKey = document.getElementById("checkoutCountrySelect").value;
    const selectedZone = SHIPPING_ZONES[countryKey];
    
    if (!selectedZone) return;

    const newShippingCost = selectedZone.baseRate + (selectedZone.ratePerItem * totalItemsCount);
    const newGrandTotal = itemSubtotal + newShippingCost;

    document.getElementById("shippingZoneMethod").innerText = `Via ${selectedZone.name}`;
    document.getElementById("checkoutShippingCostText").innerText = `$ ${newShippingCost.toFixed(2)}`;
    document.getElementById("checkoutGrandTotalText").innerText = `$ ${newGrandTotal.toFixed(2)}`;
}

// 10. Eksekusi Pembelian Akhir (Simulasi Selesai Belanja)
function executeOrderFinalization(event) {
    event.preventDefault();
    alert("Om Shanti Shanti Shanti Om. Matur Suksma! Your international order has been successfully locked and processed. Tracking details from Klungkung, Bali will be sent to your email.");
    appCartState = [];
    saveCartState();
    refreshCartUI();
    navigateToPage('storefront');
}

// 11. Event Listener Popstate untuk Menangkap Tombol Back Android & Laptop Browser
window.addEventListener("popstate", (event) => {
    if (event.state && event.state.page) {
        navigateToPage(event.state.page, true);
    } else {
        navigateToPage('storefront', true);
    }
});
