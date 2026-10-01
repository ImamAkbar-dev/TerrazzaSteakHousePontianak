document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    updateCartBadge();
    
    if(document.getElementById('menu-container')) renderMenu();
    if(document.getElementById('order-list')) renderOrder();
    if(document.getElementById('queue-display')) initQueue();
    if(document.getElementById('reservation-form-container')) initReservationPage();
    if(document.getElementById('payment-summary')) initPaymentPage();
});


function getCart() { return JSON.parse(localStorage.getItem('terrazza_cart')) || []; }

function saveCart(cart) { 
    localStorage.setItem('terrazza_cart', JSON.stringify(cart)); 
    updateCartBadge(); 
}

function updateCartBadge() {
    const cart = getCart();
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => {
        b.textContent = totalItems;
        b.style.transform = "scale(1.2)";
        setTimeout(() => b.style.transform = "scale(1)", 200);
    });
}

function formatRp(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    const icon = type === 'success' 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

function goToPayment(type) {
    localStorage.setItem('terrazza_payment_type', type);
    window.location.href = 'pembayaran.html';
}


const menuDatabase = [
    { id: 1, name: "Garlic Bread", desc: "Homemade supercrisp buttery garlic bread 4pcs", price: 49500, type: 1, category: "Appetizer / Snacks", img: "image/menu/GarlicBread.webp" },
    { id: 2, name: "Onion Ring", desc: "Deep-fried crunchy, golden-looking onion rings", price: 49500, type: 1, category: "Appetizer / Snacks", img: "image/menu/OnionRing.webp" },
    { id: 3, name: "Cheese Fingers", desc: "Fried mozzarella cheese sticks", price: 63000, type: 1, category: "Appetizer / Snacks", img: "image/menu/CheeseFingers.webp" },
    { id: 4, name: "Cheese French Fries", desc: "Topped with our signature cheese sauce", price: 63000, type: 1, category: "Appetizer / Snacks", img: "image/menu/CheeseFrenchFries.webp" },
    { id: 5, name: "Mashed Potatoes", desc: "Classic homemade creamy mashed potatoes", price: 49500, type: 1, category: "Appetizer / Snacks", img: "image/menu/MashedPotatoes.webp" },
    { id: 6, name: "Cheese Potato Wedges", desc: "Topped with Terrazza's signature cheese sauce", price: 70000, type: 1, category: "Appetizer / Snacks", img: "image/menu/CheesePotatoWedges.webp" },
    { id: 7, name: "Potato Wedges", desc: "Golden, large fried potatoes w/ mayonnaise & sweet chilli", price: 54000, type: 1, category: "Appetizer / Snacks", img: "image/menu/PotatoWedges.webp" },
    { id: 8, name: "French Fries", desc: "Supercrisp, straight cut fries, imported from Belgium", price: 47000, type: 1, category: "Appetizer / Snacks", img: "image/menu/FrenchFries.webp" },
    { id: 9, name: "Fish & Chips", desc: "Deep-fried battered dory fillet w/ french fries & tartar sauce", price: 77000, type: 1, category: "Appetizer / Snacks", img: "image/menu/FishChips.webp" },
    { id: 10, name: "Fried Tofu (12pcs)", desc: "Traditional fried tofu", price: 37000, type: 1, category: "Appetizer / Snacks", img: "image/menu/FriedTofu.webp" },
    { id: 11, name: "Fried Tempeh (5pcs)", desc: "Traditional fried tempeh", price: 37000, type: 1, category: "Appetizer / Snacks", img: "image/menu/FriedTempeh.webp" },
    { id: 12, name: "Spring Rolls", desc: "Filled with jicama, carrot, green beans, chicken, and shrimp", price: 47000, type: 1, category: "Appetizer / Snacks", img: "image/menu/Lumpia.webp" },
    { id: 13, name: "Snacks Platter", desc: "French Fries + potato wedges + onion ring + garlic bread", price: 96000, type: 1, category: "Appetizer / Snacks", img: "image/menu/SnacksPlatter.webp" },
    { id: 14, name: "Chicken Caesar Salad", desc: "Fresh lettuce, boiled egg, crispy smoked beef, grilled chicken", price: 83000, type: 1, category: "Salad & Soup", img: "image/menu/ChickenSalad.webp" },
    { id: 15, name: "Chicken Caesar Kebab", desc: "Salad Wrap", price: 92000, type: 1, category: "Salad & Soup", img: "image/menu/CaesarKebab.jpeg" },
    { id: 16, name: "Creamy Chicken Sweet Corn Soup", desc: "Creamy soup filled with tender chicken pieces and fresh sweet corn", price: 61000, type: 1, category: "Salad & Soup", img: "image/menu/CreamyChicken.webp" },
    { id: 17, name: "Chicken Melt", desc: "Boneless crispy chicken breast topped with melted cheese", price: 99000, type: 1, category: "Chicken", img: "image/menu/ChickenMelt.webp" },
    { id: 18, name: "Crispy Chicken Steak", desc: "Served with your choice of side dish and sauce", price: 112000, type: 2, category: "Chicken", img: "image/menu/CrispyChicken.webp" },
    { id: 19, name: "Grilled Chicken Steak", desc: "Served with your choice of side dish and sauce", price: 112000, type: 2, category: "Chicken", img: "image/menu/GrilledChicken.webp" },
    { id: 20, name: "Tenderloin Prime", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 375000, type: 2, category: "Australian Prime Beef", img: "image/menu/TenderloinPrime.webp" },
    { id: 21, name: "Striploin Prime", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 307000, type: 2, category: "Australian Prime Beef", img: "image/menu/StriploinPrime.webp" },
    { id: 22, name: "Hamburg Steak (200gr)", desc: "Two beef patties with melted cheese, topped with sunny side up", price: 126000, type: 2, category: "Australian Prime Beef", img: "image/menu/HamburgSteak.webp" },
    { id: 23, name: "Rib Eye Prime", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 335000, type: 2, category: "Australian Prime Beef", img: "image/menu/RibEyePrime.webp" },
    { id: 24, name: "Rib Eye Wagyu MB4+", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 402000, type: 2, category: "Australian Wagyu Beef MB4+", img: "image/menu/Rib Eye Wagyu.webp" },
    { id: 25, name: "Striploin Wagyu MB4+", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 375000, type: 2, category: "Australian Wagyu Beef MB4+", img: "image/menu/StriploinWagyu.webp" },
    { id: 26, name: "T-Bone (500gr)", desc: "Special Menu Limited Stock. Choice of side dish, doneness, sauce", price: 815000, type: 2, category: "Australian Grain Fed Premium Beef", img: "image/menu/TBone.webp" },
    { id: 27, name: "Striploin Grain-Fed 100-Day", desc: "Black Angus. Served with side dish, doneness, and sauce", price: 540000, type: 2, category: "Australian Grain Fed Premium Beef", img: "image/menu/StriploinGrain.webp" },
    { id: 28, name: "Striploin Tajima MB9+ (300gr)", desc: "Special Menu Limited Stock. Choice of side dish, doneness, sauce", price: 1228000, type: 2, category: "Premium Wagyu Tajima MB9+", img: "image/menu/StriploinTajima.webp" },
    { id: 29, name: "Rib Eye Tajima MB9+ (300gr)", desc: "Special Menu Limited Stock. Choice of side dish, doneness, sauce", price: 1283000, type: 2, category: "Premium Wagyu Tajima MB9+", img: "image/menu/RibEyeTajima.webp" },
    { id: 30, name: "Lamb Chop (200gr)", desc: "Served with your choice of side dish, steak doneness, and sauce", price: 305000, type: 2, category: "Australian Lamb", img: "image/menu/LambChop.webp" },
    { id: 31, name: "Lamb Hamburg Steak (200gr)", desc: "Two lamb patties with melted cheese, topped with sunny side up", price: 140000, type: 2, category: "Australian Lamb", img: "image/menu/LambHam.webp" },
    { id: 32, name: "Norwegian Salmon Steak", desc: "Pan-seared salmon trout, served with Potato Wedges & Veggies", price: 278000, type: 4, category: "Fish", img: "image/menu/NorwegianSalmon.webp" },
    { id: 33, name: "Salmon Belly", desc: "Fine fatty cut. Served with Potato Wedges, Veggies, and Sauce", price: 126000, type: 4, category: "Fish", img: "image/menu/SalmonBelly.webp" },
    { id: 34, name: "Pan-seared Silver Dory", desc: "Served with Potato Wedges, Sauteed Veggies, and Sauce", price: 126000, type: 4, category: "Fish", img: "image/menu/SilverDory.webp" },
    { id: 35, name: "Deep-fried Silver Dory", desc: "Served with Potato Wedges, Sauteed Veggies, and Sauce", price: 126000, type: 4, category: "Fish", img: "image/menu/FriedDory.webp" },
    { id: 36, name: "Salmon Sashimi", desc: "Fresh raw salmon, accompanied by a vegetable salad and lime", price: 180000, type: 4, category: "Fish", img: "image/menu/SalmonSashimi.webp" },
    { id: 37, name: "Deep Fried Salmon Head", desc: "Served with Potato Wedges, Sauteed Veggies, and Sauce", price: 139000, type: 4, category: "Fish", img: "image/menu/FriedSalmon.webp" },
    { id: 38, name: "Sweet Chilli Fried Fish", desc: "Sweet and Spicy Fried Dory, served with Savory Rice", price: 79000, type: 1, category: "Fish", img: "image/menu/ChiliFish.webp" },
    { id: 39, name: "Beef Burger", desc: "Fresh homemade beef patty with sweet gherkins, onion ring, cheese", price: 83000, type: 1, category: "Burgers", img: "image/menu/BeefBurger.webp" },
    { id: 40, name: "Lamb Burger", desc: "Fresh lamb patty with jalapeno, onion ring, rosemary garlic mayo", price: 83000, type: 1, category: "Burgers", img: "image/menu/BeefBurger.webp" },
    { id: 41, name: "Fish Burger", desc: "Crisp silver dory fish with onion ring, tartar sauce, cheese", price: 83000, type: 1, category: "Burgers", img: "image/menu/FishBurger.webp" },
    { id: 42, name: "Crispy Chicken Burger", desc: "Crispy chicken breast with onion ring, sweet chilli mayo, cheese", price: 78000, type: 1, category: "Burgers", img: "image/menu/CrispyChickenBurger.webp" },
    { id: 43, name: "Chicken Kebab", desc: "Authentic Chicken Kebab", price: 67000, type: 1, category: "Kebab", img: "image/menu/Kebab.webp" },
    { id: 44, name: "Beef Kebab", desc: "Authentic Beef Kebab", price: 78000, type: 1, category: "Kebab", img: "image/menu/Kebab.webp" },
    { id: 45, name: "Lamb Kebab", desc: "Authentic Lamb Kebab", price: 83000, type: 1, category: "Kebab", img: "image/menu/Kebab.webp" },
    { id: 46, name: "Beef Fettuccine Carbonara", desc: "Fresh fettuccine with smoked beef, egg, cream, parmesan", price: 83000, type: 1, category: "Pasta", img: "image/menu/FettCarbonara.webp" },
    { id: 47, name: "Spaghetti Bolognese", desc: "Fresh spaghetti with ground beef, tomatoes, fresh herbs", price: 83000, type: 1, category: "Pasta", img: "image/menu/Spaghetti.webp" },
    { id: 48, name: "Fettuccine Alfredo", desc: "Fresh fettuccine with chicken, mushroom, cream, parmesan", price: 83000, type: 1, category: "Pasta", img: "image/menu/FettAlfredo.webp" },
    { id: 49, name: "Shabu-Shabu Kit", desc: "Cook-it-Yourself Kit (Beef / Chicken / Seafood / Complit)", price: 182000, type: 1, category: "Shabu-shabu", img: "image/menu/Shabu.webp" },
    { id: 50, name: "Beef Rib Sop", desc: "Served with crushed chili sambal", price: 93000, type: 1, category: "Local Dishes", img: "image/menu/BeefSop.webp" },
    { id: 51, name: "Kalasan Chicken Set", desc: "Kalasan Chicken + rice + tofu + tempeh + pickles + sambal", price: 62000, type: 1, category: "Local Dishes", img: "image/menu/Kalasan.webp" },
    { id: 52, name: "Fried Rice (Chicken/Beef)", desc: "Traditional fried rice", price: 39000, type: 1, category: "Local Dishes", img: "image/menu/FriedRice.webp" },
    { id: 53, name: "Fried Rice (Seafood/Kalbi)", desc: "Premium traditional fried rice", price: 45000, type: 1, category: "Local Dishes", img: "image/menu/FriedRiceS.jpeg" },
    { id: 54, name: "Fried Kwetiau (Chicken/Beef)", desc: "Traditional fried kwetiau", price: 39000, type: 1, category: "Local Dishes", img: "image/menu/FriedKwetiau.webp" },
    { id: 55, name: "Fried Kwetiau (Seafood/Kalbi)", desc: "Premium traditional fried kwetiau", price: 45000, type: 1, category: "Local Dishes", img: "image/menu/KwetiauSeafood.jpeg" },
    { id: 56, name: "Wonton Noodles", desc: "Chicken and Mushroom Wonton Noodles", price: 39000, type: 1, category: "Local Dishes", img: "image/menu/PangsitNoodle.webp" },
    { id: 57, name: "Rice with Cap Chay (Chicken/Beef)", desc: "Stir-fried Mixed Vegetables", price: 50000, type: 1, category: "Local Dishes", img: "image/menu/CapChay.webp" },
    { id: 58, name: "Steamed Rice", desc: "White Rice", price: 10000, type: 1, category: "Local Dishes", img: "image/menu/SRice.webp" },
    { id: 59, name: "Butter Rice", desc: "Savory Butter Rice", price: 18000, type: 1, category: "Local Dishes", img: "image/menu/BRice.webp" },
    { id: 60, name: "Butter Rice with Sweet Corns", desc: "Savory Butter Rice with fresh sweet corns", price: 20000, type: 1, category: "Local Dishes", img: "image/menu/CRice.webp" },
    { id: 61, name: "Premium BBQ & Grill (Yakiniku)", desc: "Sesame oil & signature sauce included. Min. order 3 Selections.", price: 0, type: 3, category: "Grill", img: "image/menu/Grill.jpeg" },
    { id: 62, name: "Vanilla Volcano", desc: "Cotton cheesecake + vanilla ice cream topped with oreo & maple", price: 49000, type: 1, category: "Dessert", img: "image/menu/VanillaV.jpeg" },
    { id: 63, name: "Affogato", desc: "Vanilla ice cream topped with whipped cream, served with espresso", price: 49000, type: 1, category: "Dessert", img: "image/menu/Affogato.jpeg" },
    { id: 64, name: "La Dolce", desc: "Cotton cheesecake + vanilla ice cream + oreo + topping", price: 49000, type: 1, category: "Dessert", img: "image/menu/La Dolce.jpeg" },
    { id: 65, name: "Wheat Grass", desc: "Healthy fresh wheat grass", price: 29000, type: 1, category: "Drinks", img: "image/menu/WheatGrass.webp" },
    { id: 66, name: "Thai Iced Tea", desc: "Authentic Thai Tea", price: 29000, type: 1, category: "Drinks", img: "image/menu/ThaiTea.webp" },
    { id: 67, name: "Snow Shake", desc: "Choice of Choco, Vanilla, Strawberry, Lychee, Mango, Orange", price: 29000, type: 1, category: "Drinks", img: "image/menu/SnowShake.webp" },
    { id: 68, name: "Iced Cappuccino", desc: "Cold brewed espresso & milk", price: 29000, type: 1, category: "Drinks", img: "image/menu/IceCap.webp" },
    { id: 69, name: "Iced Chocolate", desc: "Premium iced chocolate", price: 29000, type: 1, category: "Drinks", img: "image/menu/IceChoco.webp" },
    { id: 70, name: "Lemon Squash", desc: "Fresh lemon squash", price: 29000, type: 1, category: "Drinks", img: "image/menu/Lemon.webp" },
    { id: 71, name: "Flavoured Iced Tea", desc: "Various flavoured iced tea", price: 29000, type: 1, category: "Drinks", img: "image/menu/FTea.webp" },
    { id: 72, name: "Hot Cappuccino", desc: "Hot premium brewed espresso", price: 25000, type: 1, category: "Drinks", img: "image/menu/HotCap.jpeg" }
];

let currentMenuSelection = null;
let bbqCart = {};

function renderMenu(filter = "All") {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';
    
    const filteredMenus = filter === "All" ? menuDatabase : menuDatabase.filter(m => m.category === filter);
    const fallbackImage = 'https://via.placeholder.com/400x300/141414/c5a059?text=Terrazza+Menu';

    filteredMenus.forEach(menu => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${menu.img}" alt="${menu.name}" onerror="this.src='${fallbackImage}'">
            </div>
            <div class="menu-info">
                <div>
                    <h3>${menu.name}</h3>
                    <p>${menu.desc}</p>
                </div>
                <div class="menu-price-row">
                    <span class="menu-price">${menu.type === 3 ? 'Bervariasi' : formatRp(menu.price)}</span>
                    <button class="btn-cta" onclick="handleAddToCart(${menu.id})">Order</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('cat-btn')) {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.getAttribute('data-category'));
    }
});


function handleAddToCart(id) {
    const menu = menuDatabase.find(m => m.id === id);
    if(menu.type === 1) {
        addToCartDirect(menu);
        showToast(`${menu.name} berhasil ditambahkan!`, 'success');
    } else if (menu.type === 2) {
        openVariantModal(menu);
    } else if (menu.type === 3) {
        openBBQModal(menu);
    } else if (menu.type === 4) {
        openFishModal(menu);
    }
}

function addToCartDirect(menu, variants = null, customPrice = null, qty = 1) {
    const cart = getCart();
    const price = customPrice !== null ? customPrice : menu.price;
    cart.push({ id: Date.now(), menuId: menu.id, name: menu.name, price: price, variants: variants, qty: qty });
    saveCart(cart);
}

function toggleModal(modalId, forceState) {
    const modal = document.getElementById(modalId);
    if(forceState === true) modal.classList.add('show');
    else if(forceState === false) modal.classList.remove('show');
    else modal.classList.toggle('show');
}

function openVariantModal(menu) {
    currentMenuSelection = menu;
    document.getElementById('var-menu-name').textContent = menu.name;
    document.getElementById('var-menu-price').textContent = formatRp(menu.price);
    document.getElementById('form-variant').reset();
    document.getElementById('btn-add-variant').disabled = true;
    
    document.getElementById('form-variant').onchange = () => {
        const data = new FormData(document.getElementById('form-variant'));
        if(data.get('sidedish') && data.get('doneness') && data.get('sauce')) {
            document.getElementById('btn-add-variant').disabled = false;
        }
    };
    toggleModal('modal-variant', true);
}

function submitVariant() {
    const data = new FormData(document.getElementById('form-variant'));
    const variants = { Side: data.get('sidedish'), Kematangan: data.get('doneness'), Saus: data.get('sauce') };
    addToCartDirect(currentMenuSelection, variants);
    toggleModal('modal-variant', false);
    showToast(`${currentMenuSelection.name} berhasil ditambahkan!`, 'success');
}

function openFishModal(menu) {
    currentMenuSelection = menu;
    document.getElementById('fish-menu-name').textContent = menu.name;
    document.getElementById('fish-menu-price').textContent = formatRp(menu.price);
    
    const formFish = document.getElementById('form-fish');
    const btnFish = document.getElementById('btn-add-fish');
    
    formFish.reset();
    btnFish.disabled = true;
    
    formFish.onchange = () => {
        const data = new FormData(formFish);
        if(data.get('sauce')) {
            btnFish.disabled = false;
        }
    };
    toggleModal('modal-fish', true);
}

function submitFish() {
    const data = new FormData(document.getElementById('form-fish'));
    const variants = { Saus: data.get('sauce') }; 
    addToCartDirect(currentMenuSelection, variants);
    toggleModal('modal-fish', false);
    showToast(`${currentMenuSelection.name} berhasil ditambahkan!`, 'success');
}

const bbqItems = [
    {id: 'b1', name: 'Regular Beef', price: 49000},
    {id: 'b2', name: 'Kalbi Beef', price: 55000},
    {id: 'b3', name: 'Rib Eye Prime', price: 60000},
    {id: 'b4', name: 'Striploin Prime', price: 60000},
    {id: 'b5', name: 'Lamb Fillet', price: 60000},
    {id: 'b6', name: 'Chicken Fillet', price: 40000},
    {id: 'b7', name: 'Salmon Fillet', price: 65000},
    {id: 'b8', name: 'Silver Dory Fish', price: 40000},
    {id: 'b9', name: 'Prawn', price: 40000},
    {id: 'b10', name: 'Squid', price: 40000},
    {id: 'b11', name: 'Fresh Salad', price: 35000}
];

function openBBQModal(menu) {
    currentMenuSelection = menu;
    bbqCart = {};
    bbqItems.forEach(item => { bbqCart[item.id] = 0; });
    renderBBQList();
    toggleModal('modal-bbq', true);
}

function renderBBQList() {
    const container = document.getElementById('bbq-list');
    container.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;
    
    bbqItems.forEach(item => {
        const qty = bbqCart[item.id];
        totalQty += qty;
        totalPrice += (qty * item.price);
        
        container.innerHTML += `
            <div class="bbq-item">
                <div>
                    <h4 class="bbq-js-name">${item.name}</h4>
                    <small class="bbq-js-price">${formatRp(item.price)}</small>
                </div>
                <div class="counter-btn">
                    <button onclick="updateBBQ('${item.id}', -1)">-</button>
                    <span class="bbq-js-qty">${qty}</span>
                    <button onclick="updateBBQ('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('bbq-total-price').textContent = `Total: ${formatRp(totalPrice)}`;
    const btnAdd = document.getElementById('btn-add-bbq');
    
    if(totalQty >= 3) {
        btnAdd.disabled = false;
        btnAdd.textContent = `Konfirmasi BBQ (${totalQty} Item)`;
    } else {
        btnAdd.disabled = true;
        btnAdd.textContent = `Pilih min. 3 item (${totalQty}/3)`;
    }
}

function updateBBQ(id, val) {
    if(bbqCart[id] + val >= 0) { bbqCart[id] += val; renderBBQList(); }
}

function submitBBQ() {
    let totalPrice = 0; let details = [];
    bbqItems.forEach(item => {
        if(bbqCart[item.id] > 0) {
            totalPrice += bbqCart[item.id] * item.price;
            details.push(`${bbqCart[item.id]}x ${item.name}`);
        }
    });
    addToCartDirect(currentMenuSelection, { Rincian: details.join(', ') }, totalPrice);
    toggleModal('modal-bbq', false);
    showToast(`Paket Premium BBQ berhasil ditambahkan!`, 'success');
}


function renderOrder() {
    const cart = getCart();
    const container = document.getElementById('order-list');
    const totalEl = document.getElementById('order-total');
    let total = 0;
    
    container.innerHTML = '';
    if(cart.length === 0) {
        container.innerHTML = '<p class="queue-msg-empty">Keranjang Anda kosong. Silakan kunjungi halaman Menu.</p>';
        document.getElementById('btn-checkout').disabled = true;
        return;
    }
    
    document.getElementById('btn-checkout').disabled = false;
    
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        let varText = item.variants ? `<br><small class="cart-item-variants">${Object.values(item.variants).join(' | ')}</small>` : '';
        container.innerHTML += `
            <div class="bbq-item cart-item-wrapper">
                <div>
                    <h4 class="cart-item-title">${item.name} <span class="cart-item-qty">x${item.qty}</span></h4>
                    ${varText}
                </div>
                <div class="cart-item-price-wrapper">
                    <b class="cart-item-price">${formatRp(item.price * item.qty)}</b><br>
                    <small class="cart-item-remove" onclick="removeCart(${index})">Hapus</small>
                </div>
            </div>
        `;
    });
    totalEl.textContent = formatRp(total);
}

function removeCart(index) {
    let cart = getCart(); 
    cart.splice(index, 1); 
    saveCart(cart); 
    renderOrder();
}


function initReservationPage() {
    const confirmedRes = JSON.parse(localStorage.getItem('terrazza_res_confirmed'));
    if (confirmedRes) {
        document.getElementById('reservation-form-container').style.display = 'none';
        const ticket = document.getElementById('reservation-ticket');
        ticket.style.display = 'block';
        ticket.innerHTML = `
            <h2 class="ticket-title">Reservasi Terkonfirmasi!</h2>
            <p class="ticket-desc">Tunjukkan halaman ini kepada resepsionis kami saat Anda tiba.</p>
            <div class="ticket-details">
                <p><b>Nama:</b> ${confirmedRes.name}</p>
                <p><b>WhatsApp:</b> ${confirmedRes.phone}</p>
                <p><b>Tamu:</b> ${confirmedRes.guests}</p>
                <p><b>Tanggal:</b> ${confirmedRes.date}</p>
                <p><b>Waktu:</b> ${confirmedRes.timeStart} - ${confirmedRes.timeEnd}</p>
                <hr class="ticket-divider">
                <p class="ticket-status"><b>Status DP:</b> LUNAS (${formatRp(confirmedRes.dp)})</p>
            </div>
            <br><br>
            <button class="btn-cta" onclick="localStorage.removeItem('terrazza_res_confirmed'); window.location.reload();">Buat Reservasi Baru</button>
        `;
        return; 
    }

    const resForm = document.getElementById('reservation-form');
    const timeStart = document.getElementById('time-start');
    const timeEnd = document.getElementById('time-end');
    const errorMsg = document.getElementById('res-error-msg');

    const openTime = "10:00"; const closeTime = "22:00";
    const showError = (msg) => {
        errorMsg.innerHTML = msg; errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 4000); 
    };
    const enforceOperatingHours = (input) => {
        if (!input.value) return; 
        if (input.value < openTime) { input.value = openTime; showError('⚠️ Disesuaikan ke jam buka (10:00).'); } 
        else if (input.value > closeTime) { input.value = closeTime; showError('⚠️ Disesuaikan ke batas tutup (22:00).'); }
    };

    timeStart.addEventListener('change', () => enforceOperatingHours(timeStart));
    timeEnd.addEventListener('change', () => enforceOperatingHours(timeEnd));

    resForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        if (timeEnd.value <= timeStart.value) {
            showError('⚠️ Waktu selesai harus lebih besar dari waktu mulai.');
            return;
        }

        const guestsVal = document.getElementById('res-guests').value;
        let dpAmount = 0;
        if (guestsVal.includes('1 - 2')) dpAmount = 50000;
        else if (guestsVal.includes('3 - 4')) dpAmount = 100000;
        else dpAmount = 200000;

        const pendingRes = {
            name: document.getElementById('res-name').value,
            phone: document.getElementById('res-phone').value,
            guests: guestsVal,
            date: document.getElementById('res-date').value,
            timeStart: timeStart.value,
            timeEnd: timeEnd.value,
            dp: dpAmount
        };
        
        localStorage.setItem('terrazza_res_pending', JSON.stringify(pendingRes));
        goToPayment('reservasi');
    });
}


function initPaymentPage() {
    const payType = localStorage.getItem('terrazza_payment_type');
    const summaryEl = document.getElementById('payment-summary');
    const nameGroup = document.getElementById('form-name-group');
    const payName = document.getElementById('pay-name');
    
    const tableGroup = document.getElementById('form-table-group');
    const payTable = document.getElementById('pay-table');
    
    if (payType === 'reservasi') {
        const res = JSON.parse(localStorage.getItem('terrazza_res_pending'));
        if(!res) { window.location.href = 'reservasi.html'; return; }
        
        nameGroup.style.display = 'none';
        payName.value = res.name;
        
        if (tableGroup) {
            tableGroup.style.display = 'none';
            payTable.removeAttribute('required'); 
        }

        summaryEl.innerHTML = `
            <h3 class="summary-title">Detail DP Reservasi</h3>
            <p class="summary-text">Atas Nama: <b>${res.name}</b></p>
            <p class="summary-text">Jumlah Tamu: <b>${res.guests}</b></p>
            <p class="summary-text">Waktu: <b>${res.date} | ${res.timeStart} - ${res.timeEnd}</b></p>
            <h2 class="summary-total">Total DP: ${formatRp(res.dp)}</h2>
        `;
    } else {
        const cart = getCart();
        if(cart.length === 0) { window.location.href = 'menu.html'; return; }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        summaryEl.innerHTML = `
            <h3 class="summary-title">Ringkasan Pesanan Menu</h3>
            <p class="summary-text">Jumlah Item: <b>${cart.length} Item</b></p>
            <h2 class="summary-total">Grand Total: ${formatRp(total)}</h2>
        `;
    }
}

function processPayment(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-pay');
    btn.innerHTML = 'Memverifikasi...';
    btn.disabled = true;
    
    setTimeout(() => {
        const payType = localStorage.getItem('terrazza_payment_type');
        
        if (payType === 'reservasi') {
            const pending = localStorage.getItem('terrazza_res_pending');
            localStorage.setItem('terrazza_res_confirmed', pending);
            localStorage.removeItem('terrazza_res_pending');
            
            showToast('Pembayaran DP Reservasi Berhasil!', 'success');
            setTimeout(() => { window.location.href = 'reservasi.html'; }, 1500);
        } else {
            const queueNo = Math.floor(Math.random() * 50) + 1; 
            localStorage.setItem('terrazza_queue_user', queueNo);
            
            localStorage.setItem('terrazza_queue_current', Math.max(1, queueNo - 3)); 
            
            saveCart([]); 
            
            showToast('Pembayaran Pesanan Berhasil!', 'success');
            setTimeout(() => { window.location.href = 'antrian.html'; }, 1500);
        }
    }, 2000);
}


function initQueue() {
    const userQ = parseInt(localStorage.getItem('terrazza_queue_user'));
    let currentQ = parseInt(localStorage.getItem('terrazza_queue_current')) || 0;
    
    if(!userQ) {
        document.getElementById('queue-display').innerHTML = "<h3 class='queue-msg-empty'>Anda belum memiliki pesanan aktif.</h3>";
        return;
    }
    
    const updateUI = () => {
        document.getElementById('user-q').textContent = `T-${userQ}`;
        document.getElementById('current-q').textContent = `T-${currentQ}`;
        
        if(currentQ >= userQ) {
            document.getElementById('queue-status').innerHTML = "<h2 class='queue-msg-ready'>Pesanan Anda Telah Siap</h2>";
            document.getElementById('queue-status').classList.add('pulse');
        } else {
            document.getElementById('queue-status').innerHTML = "<h3 class='queue-msg-wait'>Chef kami sedang menyiapkan pesanan Anda dengan seksama...</h3>";
        }
    };
    
    updateUI();
    setInterval(() => {
        if(currentQ < userQ) {
            currentQ++;
            localStorage.setItem('terrazza_queue_current', currentQ);
            updateUI();
        }
    }, 60000); 
}
