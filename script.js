// script.js - Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });

    // Cart functionality
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const productGrid = document.getElementById('productGrid');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let cart = [];

    // Generate products
    function generateProducts() {
        // Add featured products first
        for (const [id, product] of Object.entries(productConfig.featured)) {
            createProductCard(product, true);
        }

        // Add highlighted products
        for (const [id, product] of Object.entries(productConfig.highlighted)) {
            createProductCard(product, false);
        }

        // Add regular products
        productConfig.regularProducts.forEach(product => {
            createProductCard(product, false);
        });
    }

    function createProductCard(product, isFeatured) {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0
        }).format(product.price).replace('UGX', 'UGX ');

        const productCard = document.createElement('div');
        productCard.className = `product-card ${isFeatured ? 'featured-product' : ''}`;
        productCard.innerHTML = `
            ${isFeatured ? '<span class="featured-badge">FEATURED</span>' : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formattedPrice}</p>
                <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-img="${product.image}">
                    Add to Cart
                </button>
            </div>
        `;
        
        // Insert featured products at beginning if specified
        if (isFeatured && product.position === 'first') {
            productGrid.insertBefore(productCard, productGrid.firstChild);
        } else {
            productGrid.appendChild(productCard);
        }

        // Add event listener to the new button
        productCard.querySelector('.add-to-cart').addEventListener('click', addToCart);
    }

    // Add to cart function
    function addToCart(e) {
        const button = e.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');

        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                img,
                quantity: 1
            });
        }

        updateCart();
        cartSidebar.classList.add('active');
    }

    // Update cart function
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'UGX',
                    minimumFractionDigits: 0
                }).format(item.price).replace('UGX', 'UGX ');

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Watch'">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">${formattedPrice} x ${item.quantity}</p>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', removeFromCart);
            });
        }

        // Update total
        const formattedTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0
        }).format(total).replace('UGX', 'UGX ');
        cartTotal.textContent = formattedTotal;
    }

    // Remove from cart function
    function removeFromCart(e) {
        const id = e.target.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    // Checkout function
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        let message = "Hello JAMAL-CLASSICS,\n\nI'd like to purchase the following items:\n\n";
        
        cart.forEach(item => {
            message += `- ${item.name} (Qty: ${item.quantity})\n`;
        });

        message += `\nTotal: ${cartTotal.textContent}\n\nPlease confirm availability and payment details.`;

        // Encode the message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/256761761347?text=${encodedMessage}`, '_blank');
    });

    // Toggle cart sidebar
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });

    // Generate products on page load
    generateProducts();
});