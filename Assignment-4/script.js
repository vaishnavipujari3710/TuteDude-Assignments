// Dom Selectors
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');
const serviceType = document.getElementById('serviceType');
const quantityInput = document.getElementById('quantity');
const unitLabel = document.getElementById('unitLabel');
const totalPriceDisplay = document.getElementById('totalPrice');
const bookBtn = document.getElementById('bookBtn');

// Navbar Toggle Engine
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Structural Adjustment & Dynamic Math Engine
function handlePricingUpdate() {
    const selectedOption = serviceType.options[serviceType.selectedIndex];
    const rate = parseFloat(selectedOption.value);
    const unitType = selectedOption.getAttribute('data-unit');
    
    // Dynamically change label based on option attribute metadata
    unitLabel.textContent = `Quantity (${unitType})`;

    let qty = parseInt(quantityInput.value) || 0;
    if (qty < 1) {
        qty = 1;
        quantityInput.value = 1;
    }

    const calculatedTotal = rate * qty;
    totalPriceDisplay.textContent = `$${calculatedTotal.toFixed(2)}`;
}

// Attach Event Observers
serviceType.addEventListener('change', handlePricingUpdate);
quantityInput.addEventListener('input', handlePricingUpdate);

// Booking Confirmation Modal Hook
bookBtn.addEventListener('click', () => {
    const totalAmount = totalPriceDisplay.textContent;
    const serviceName = serviceType.options[serviceType.selectedIndex].text.split(' (')[0];
    
    alert(`✨ Booking Initiated! \n\nService: ${serviceName}\nEstimated Invoice: ${totalAmount}\n\nOur logistics team will text you within 15 minutes to confirm the pickup time window.`);
});