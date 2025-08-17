// categoryButtons
function scrollToProductsHeading() { // Function name changed
    document.getElementById('products-heading').scrollIntoView({ behavior: 'smooth' }); // Target ID changed
}

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-button');
    const productParts = document.querySelectorAll('.product-part');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.category;

            // Remove 'active' class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');

            productParts.forEach(product => {
                const productCategory = product.dataset.category;
                if (selectedCategory === 'all' || productCategory === selectedCategory) {
                    product.style.display = 'block'; // Show the product
                } else {
                    product.style.display = 'none'; // Hide the product
                }
            });
        });
    });
});


// cart

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-button');
    const productParts = document.querySelectorAll('.product-part');
    const cartLink = document.getElementById('cart-link');
    const cart = document.getElementById('cart');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    let cartItems = [];

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.category;
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            productParts.forEach(product => {
                const productCategory = product.dataset.category;
                product.style.display =
                    (selectedCategory === 'all' || productCategory === selectedCategory)
                        ? 'block' : 'none';
            });
        });
    });

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const product = productParts[index];
            const name = product.querySelector('h2').innerText;
            const price = parseInt(product.querySelector('.price').innerText.replace(/[₹,]/g,''));
            const img = product.querySelector('img').src;

            // check if already in cart
            const existing = cartItems.find(item => item.name === name);
            if(existing){
                existing.quantity++;
            } else {
                cartItems.push({name, price, img, quantity: 1});
            }
            updateCart();
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cartItems.forEach((item, idx) => {
            total += item.price * item.quantity;
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <img src="${item.img}" alt="">
                <div>
                    <h4>${item.name}</h4>
                    <p class="price">₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                    <div class="qty-controls">
                        <button class="qty-btn decrease" data-index="${idx}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase" data-index="${idx}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-index="${idx}">X</button>
            `;
            cartItemsContainer.appendChild(div);
        });
        cartTotal.innerText = `₹${total}`;
        cartCount.innerText = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // Quantity + / - buttons
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                cartItems[btn.dataset.index].quantity++;
                updateCart();
            });
        });
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cartItems[btn.dataset.index];
                if(item.quantity > 1) item.quantity--;
                updateCart();
            });
        });

        // Remove item
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cartItems.splice(btn.dataset.index,1);
                updateCart();
            });
        });
    }

    // Open/Close Cart
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cart.classList.add('active');
    });
    closeCart.addEventListener('click', () => {
        cart.classList.remove('active');
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if(cartItems.length === 0){
            alert("Your cart is empty!");
            return;
        }

        const userDetails = prompt("Enter your details:\nFormat: Name, Address, Mobile Number");
        if(!userDetails) return;

        let bill = "------ BILL ------\n";
        let total = 0;
        cartItems.forEach(item => {
            bill += `${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.price*item.quantity}\n`;
            total += item.price * item.quantity;
        });
        bill += "------------------\n";
        bill += `Total: ₹${total}\n\n`;
        bill += `Customer Info: ${userDetails}`;

        alert(bill);
        cartItems = [];
        updateCart();
        cart.classList.remove('active'); // also close cart panel
    });
});
