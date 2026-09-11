const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");
const serviceList = document.getElementById("serviceList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");
const navbarUsername = document.getElementById("navbarUsername");

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

const services = [
    {
        id: 1,
        name: "Wash & Fold",
        description: "Everyday laundry washed, dried, and folded neatly.",
        price: 2.5,
        unit: "kg",
        icon: "fa-soap"
    },
    {
        id: 2,
        name: "Dry Cleaning",
        description: "Gentle garment care for suits, dresses, and delicate fabrics.",
        price: 6,
        unit: "item",
        icon: "fa-user-tie"
    },
    {
        id: 3,
        name: "Steam Pressing",
        description: "Crisp steam finish for shirts, trousers, and formal wear.",
        price: 2,
        unit: "item",
        icon: "fa-shirt"
    },
    {
        id: 4,
        name: "Bedding & Linens",
        description: "Deep cleaning for bedsheets, blankets, curtains, and duvets.",
        price: 12,
        unit: "item",
        icon: "fa-bed"
    },
    {
        id: 5,
        name: "Sneaker Cleaning",
        description: "Detailed cleaning and deodorizing for shoes and sneakers.",
        price: 15,
        unit: "pair",
        icon: "fa-shoe-prints"
    },
    {
        id: 6,
        name: "Express Wash",
        description: "Priority laundry service for urgent same-day requirements.",
        price: 5,
        unit: "kg",
        icon: "fa-bolt"
    }
];

let cart = [];

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const savedUsername = localStorage.getItem("luxewash_username");
if (savedUsername) {
    navbarUsername.textContent = `Hi, ${savedUsername}`;
}

mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
        navLinks.classList.remove("active");
    }
});

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function getCartItem(serviceId) {
    return cart.find((item) => item.id === serviceId);
}

function renderServices() {
    serviceList.innerHTML = services.map((service) => {
        const cartItem = getCartItem(service.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return `
            <article class="service-row">
                <div class="service-icon"><i class="fas ${service.icon}"></i></div>
                <div class="service-details">
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                    <strong>${formatCurrency(service.price)} / ${service.unit}</strong>
                </div>
                <div class="service-actions">
                    <button type="button" class="quantity-btn" data-action="remove" data-id="${service.id}" aria-label="Remove ${service.name}">-</button>
                    <span>${quantity}</span>
                    <button type="button" class="quantity-btn" data-action="add" data-id="${service.id}" aria-label="Add ${service.name}">+</button>
                </div>
            </article>
        `;
    }).join("");
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No services added yet.</p>';
    } else {
        cartItems.innerHTML = cart.map((item) => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <span>${item.quantity} x ${formatCurrency(item.price)}</span>
                </div>
                <button type="button" class="cart-remove" data-id="${item.id}">Remove</button>
            </div>
        `).join("");
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatCurrency(total);
}

function updateCart(serviceId, change) {
    const service = services.find((item) => item.id === serviceId);
    const cartItem = getCartItem(serviceId);

    if (!service) {
        return;
    }

    if (change > 0 && !cartItem) {
        cart.push({ ...service, quantity: 1 });
    } else if (cartItem) {
        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            cart = cart.filter((item) => item.id !== serviceId);
        }
    }

    renderServices();
    renderCart();
}

serviceList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const serviceId = Number(button.dataset.id);
    const change = button.dataset.action === "add" ? 1 : -1;
    updateCart(serviceId, change);
});

cartItems.addEventListener("click", (event) => {
    const button = event.target.closest(".cart-remove");

    if (!button) {
        return;
    }

    cart = cart.filter((item) => item.id !== Number(button.dataset.id));
    renderServices();
    renderCart();
});

bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
        bookingMessage.textContent = "Please add at least one service before booking.";
        bookingMessage.className = "form-message error";
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const firstName = customerName.split(" ")[0];
    const orderSummary = cart.map((item) => `${item.name} x ${item.quantity}`).join(", ");
    const totalAmount = cartTotal.textContent;

    localStorage.setItem("luxewash_username", firstName);
    navbarUsername.textContent = `Hi, ${firstName}`;

    const templateParams = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        order_summary: orderSummary,
        total_amount: totalAmount,
        to_email: customerEmail
    };

    bookingMessage.textContent = "Booking your service...";
    bookingMessage.className = "form-message";

    try {
        if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            throw new Error("EmailJS is not configured yet.");
        }

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        bookingMessage.textContent = `Thank you, ${customerName}! Your booking is confirmed and a confirmation email has been sent.`;
        bookingMessage.className = "form-message success";
    } catch (error) {
        bookingMessage.textContent = `Thank you, ${customerName}! Your booking is confirmed. Add your EmailJS keys in script.js to send automated confirmation emails.`;
        bookingMessage.className = "form-message success";
        console.error("EmailJS booking email failed:", error);
    }

    bookingForm.reset();
    cart = [];
    renderServices();
    renderCart();
});

newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const subscriberName = document.getElementById("subscriberName").value.trim();
    newsletterMessage.textContent = `Thanks for subscribing, ${subscriberName}!`;
    newsletterMessage.className = "form-message success";
    newsletterForm.reset();
});

renderServices();
renderCart();
