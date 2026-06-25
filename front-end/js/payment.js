const API_URL = "https://shopsphere-production-963f.up.railway.app";

async function placeOrder(){

const paymentMethod =
document.querySelector(
    'input[name="payment"]:checked'
);

if(!paymentMethod){

    alert(
        "Please select a payment option first"
    );

    return;
}

const btn =
document.getElementById(
    "placeOrderBtn"
);

btn.disabled = true;

btn.innerText =
"Processing...";

const cart =
JSON.parse(
    localStorage.getItem("cart")
) || [];

if(cart.length === 0){

    alert(
        "Cart is empty , please add products to cart first"
    );

    return;
}

const userId =
localStorage.getItem("userId");
const response =
await fetch(
    `${API_URL}/products`
);

const products =
await response.json();

let total = 0;

cart.forEach(item=>{

    const product =
    products.find(
        p => p.id === item.id
    );

    if(product){

        total +=
        Number(product.price) *
        item.quantity;
    }

});
await fetch(
    `${API_URL}/orders`,
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            user_id:userId,
            total:total
        })
    }
);

alert("Order Placed Successfully");

localStorage.removeItem("cart");

btn.disabled = true;

btn.onclick = null;

btn.innerText =
"Order Already Placed";

btn.style.cursor =
"not-allowed";

return;

}
window.onload = function(){

    const btn =
    document.getElementById(
        "placeOrderBtn"
    );

    if(
        localStorage.getItem(
            "orderPlaced"
        ) === "true"
    ){

        btn.disabled = true;

        btn.innerText =
        "Order Already Placed";

        btn.style.cursor =
        "not-allowed";
    }

};