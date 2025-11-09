// This file contains JavaScript functions specific to product-related actions, such as fetching product details.

const apiUrl = 'http://localhost:3000/api/products';

// Sample products array (should match your main.js)
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 49.99,
        description: "High-quality wireless headphones with noise cancellation.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 89.99,
        description: "Track your fitness and notifications with this smart watch.",
        image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 29.99,
        description: "Portable speaker with deep bass and long battery life.",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
    }
];

// Function to fetch all products
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products on the page
function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <a href="product.html?id=${product.id}">View Details</a>
        `;
        productContainer.appendChild(productElement);
    });
}

// Function to fetch product details by ID
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to display product details on the product page
function displayProductDetails(product) {
    const productDetailContainer = document.getElementById('product-detail');
    productDetailContainer.innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
}

// Get product ID from URL (e.g., product.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = products.find(p => p.id === productId);

const detailsDiv = document.getElementById('product-details');
if (product) {
    detailsDiv.innerHTML = `
        <div style="display:flex;gap:2em;align-items:center;max-width:700px;margin:2em auto;">
            <img src="${product.image}" alt="${product.name}" style="width:250px;border-radius:10px;">
            <div>
                <h2>${product.name}</h2>
                <p><strong>Price:</strong> ₹${product.price.toLocaleString('en-IN')}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
} else {
    detailsDiv.innerHTML = "<p>Product not found.</p>";
}

// Review system (localStorage-based demo)
const reviewsKey = `reviews_${productId}`;
function renderReviews() {
    const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    const reviewsList = document.getElementById('reviews-list');
    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews yet.</p>";
        return;
    }
    reviewsList.innerHTML = reviews.map(r => `
        <div style="border-bottom:1px solid #eee;padding:0.5em 0;">
            <span style="color:#FFD700;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
            <p>${r.feedback}</p>
        </div>
    `).join('');
}
renderReviews();

// Star rating logic
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const val = parseInt(this.dataset.value);
        document.getElementById('rating').value = val;
        document.querySelectorAll('.star').forEach(s => {
            s.style.color = (parseInt(s.dataset.value) <= val) ? '#FFD700' : '#ccc';
        });
    });
});

// Review form submit
document.getElementById('review-form').onsubmit = function(e) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('rating').value);
    const feedback = document.getElementById('feedback').value;
    if (!rating) {
        alert('Please select a star rating.');
        return;
    }
    const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    reviews.push({ rating, feedback });
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));
    document.getElementById('review-form').reset();
    document.querySelectorAll('.star').forEach(s => s.style.color = '#ccc');
    document.getElementById('rating').value = 0;
    renderReviews();
};

// Add to cart function (same as main.js)
function addToCart(productId) {
    if (!localStorage.getItem('loggedIn')) {
        alert('Please login to add products to cart.');
        window.location.href = 'login.html';
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}

// Check if on product page and fetch product details
if (window.location.pathname === '/product.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        fetchProductById(productId);
    }
}

// Fetch products on the index page
if (window.location.pathname === '/index.html') {
    fetchProducts();
}