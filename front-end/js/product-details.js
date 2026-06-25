const API_URL =
"http://localhost:5000";

const params =
new URLSearchParams(
window.location.search
);

const productId =
params.get("id");

async function loadProduct(){

    const response =
    await fetch(
        `${API_URL}/products`
    );

    const products =
    await response.json();

    const product =
    products.find(
        p => p.id == productId
    );

    const container =
    document.getElementById(
        "productDetails"
    );

    container.innerHTML = `

    <img
    src="${product.image}"
    class="detail-image">

    <h1>${product.name}</h1>

    <p>${product.description}</p>

    <h2>₹${product.price}</h2>

    <p>${product.category}</p>

    <button
    onclick="addToCart(${product.id})">

        Add To Cart

    </button>
    <hr>

<h2>Reviews</h2>

<select id="rating">

    <option value="5">⭐⭐⭐⭐⭐</option>
    <option value="4">⭐⭐⭐⭐</option>
    <option value="3">⭐⭐⭐</option>
    <option value="2">⭐⭐</option>
    <option value="1">⭐</option>

</select>

<br><br>

<textarea
id="reviewText"
placeholder="Write your review">
</textarea>

<br><br>

<button
id="reviewBtn"
onclick="submitReview()">

    Submit Review

</button>

<hr>

<div id="reviewsContainer"></div>

    `;
}

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

    updateCartCount();

    alert("Added To Cart");

}
//update cart count
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
// add review function
async function submitReview(){

    const rating =
    document.getElementById(
        "rating"
    ).value;

    const review =
    document.getElementById(
        "reviewText"
    ).value;

    const userId =
    localStorage.getItem(
        "userId"
    );

    const response =
    await fetch(

        `${API_URL}/reviews`,

        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                product_id:productId,

                user_id:userId,

                rating,

                review

            })

        }

    );

    const data =
    await response.json();

   alert(data.message);

    document.getElementById("rating").value = "5";

    document.getElementById("reviewText").value = "";
    
    document.getElementById("reviewBtn").disabled = true;

loadReviews();

}
// Load Reviews Function
async function loadReviews(){

    const response =
    await fetch(
        `${API_URL}/reviews/${productId}`
    );

    const reviews =
    await response.json();

    let totalRating = 0;

reviews.forEach(review=>{

    totalRating +=
    Number(review.rating);

});

let average = 0;

if(reviews.length > 0){

    average =
    (
        totalRating /
        reviews.length
    ).toFixed(1);

}

    const container =
    document.getElementById(
        "reviewsContainer"
    );

    container.innerHTML = `

<h3>

⭐ ${average}/5

(${reviews.length} Reviews)

</h3>

`;

    reviews.forEach(review=>{

        container.innerHTML += `

        <div class="review-card">

            <h4>
                ${"⭐".repeat(review.rating)}
            </h4>

            <p>
                ${review.review}
            </p>

            <hr>

        </div>

        `;

    });

}

loadProduct();
updateCartCount();

setTimeout(()=>{

    loadReviews();

},500);