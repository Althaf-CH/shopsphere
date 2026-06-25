const API_URL = "http://localhost:5000";

let allProducts = [];
let currentCategory = "All";

async function loadProducts() {

    const response = await fetch(`${API_URL}/products`);

    allProducts = await response.json();

    displayProducts(allProducts);
}

function displayProducts(products) {

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";
    if(products.length===0){

    container.innerHTML=`

    <h2>
        No Products Found
    </h2>

    `;

    return;
}
    products.forEach(product => {

        container.innerHTML += `
<div class="product-card"
onclick="openProduct(${product.id})">    
    <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image"
    >
    <h3>${product.name}</h3>

    <p>${product.description}</p>

    <h4>₹${product.price}</h4>

    

   <button onclick="addToCart(${product.id})">
    Add To Cart
</button>

</div>
`;
    });

}
// Filter Products
function filterProducts(){

    const selectedCategory =
    document.getElementById(
        "filterCategory"
    ).value;

    const searchText =
    document.getElementById(
        "searchProduct"
    ).value.toLowerCase();

    let filteredProducts =
    allProducts;

    if(selectedCategory !== "All"){

        filteredProducts =
        filteredProducts.filter(
            product =>
            product.category === selectedCategory
        );

    }

    if(searchText !== ""){

        filteredProducts =
        filteredProducts.filter(
            product =>
            product.name
            .toLowerCase()
            .includes(searchText)
        );

    }

    displayProducts(filteredProducts);

}
// Add to Cart Function
function addToCart(productId){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existing =
    cart.find(
        item => item.id === productId
    );

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            id:productId,

            quantity:1

        });

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    if(typeof updateCartCount === "function"){

        updateCartCount();

    }

    alert("Added To Cart");

}
//cart count 

function updateCartCount(){

    const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const cartCount =
    document.getElementById(
        "cartCount"
    );

    if(cartCount){

        cartCount.innerText =
        cart.reduce(
            (sum,item)=>
            sum + item.quantity,
            0
        );

    }

}
//delete product
async function deleteProduct(id){

    const confirmDelete =
    confirm(
        "Delete this product?"
    );

    if(!confirmDelete){

        return;

    }

    await fetch(

        `${API_URL}/products/${id}`,

        {
            method:"DELETE"
        }

    );

    loadProducts();

}
// Open Product Details Page
function openProduct(id){

    window.location =
    `product-details.html?id=${id}`;

}
function logout() {

    localStorage.removeItem("userId");

    localStorage.removeItem("role");

    localStorage.removeItem("name");

    localStorage.removeItem("cart");

    window.location = "login.html";

}
document
.getElementById("searchProduct")
.addEventListener(
    "input",
    filterProducts
);
updateCartCount();
loadProducts();