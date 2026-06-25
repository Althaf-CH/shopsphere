const API_URL =
"https://shopsphere-production-963f.up.railway.app";

//go to payment page
function goToPayment(){
    window.location.href =
    "payment.html";
}


// Load Cart Function

async function loadCart(){

    const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const response =
    await fetch(
        `${API_URL}/products`
    );

    const products =
    await response.json();

    const selectedProducts =
products.filter(product =>

    cart.some(
        item => item.id === product.id
    )

);

    const container =
    document.getElementById(
        "cartContainer"
    );

    container.innerHTML = "";

    let total = 0;

    selectedProducts.forEach(product=>{

    const cartItem =
    cart.find(
        item => item.id === product.id
    );

    const quantity =
    cartItem.quantity;

    total +=
    Number(product.price) *
    quantity;

    container.innerHTML += `

<div class="cart-card">

    <img
    src="${product.image}"
    class="cart-image">

    <div class="cart-info">

        <h3>${product.name}</h3>

        <p>${product.description}</p>

        <h4>₹${product.price}</h4>

        <p>
            Quantity : ${quantity}
        </p>

        <div class="cart-actions">

            <button
            onclick="decreaseQuantity(${product.id})">
                -
            </button>

            <button
            onclick="increaseQuantity(${product.id})">
                +
            </button>

            <button
            onclick="removeFromCart(${product.id})">
                Remove
            </button>

        </div>

    </div>

</div>

`;

});

    container.innerHTML += `
    <hr>

    <h2>Total : ₹${total}</h2>
<button onclick="goToPayment()">

    Proceed To Payment

</button>
    
    `;

    if(cart.length === 0){

    container.innerHTML = `

        <div class="empty-box">

            <h2>Your Cart Is Empty</h2>

            <a href="index.html">
                Continue Shopping
            </a>

        </div>

    `;

    return;
}
}

// Checkout Function

async function checkout(total){

    if(total <= 0){

        alert("Cart is empty");

        return;

    }

    const userId =
    localStorage.getItem("userId");

    const response =
    await fetch(
        `${API_URL}/orders`,
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                user_id:userId,

                total

            })
        }
    );

    const data =
    await response.json();

    alert(data.message);

    localStorage.removeItem("cart");

    window.location =
    "orders.html";

}

// Remove From Cart

function removeFromCart(productId){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart = cart.filter(

        item =>
        item.id !== productId

    );

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    loadCart();

}
//increase quantity
function increaseQuantity(productId){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const item =
    cart.find(
        item => item.id === productId
    );

    item.quantity++;

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    loadCart();

}
//decrease quantity
function decreaseQuantity(productId){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const item =
    cart.find(
        item => item.id === productId
    );

    item.quantity--;

    if(item.quantity <= 0){

        cart =
        cart.filter(

            item =>
            item.id !== productId

        );

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    loadCart();

}
loadCart();