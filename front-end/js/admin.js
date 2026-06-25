const API_URL =
"https://shopsphere-production-963f.up.railway.app";

let allProducts = [];
// Load Products

async function loadProducts(){

    const response =
    await fetch(
        `${API_URL}/products`
    );

    allProducts = await response.json();

    const container =
    document.getElementById(
        "productsContainer"
    );

    container.innerHTML = "";

    allProducts.forEach(product=>{

        container.innerHTML += `
        <div>

            <h3>${product.name}</h3>

            <p>${product.price}</p>

            <p>${product.category}</p>

            <button
    onclick="editProduct(${product.id})"
>
    Edit
</button>

<button
    onclick="deleteProduct(${product.id})"
>
    Delete
</button>

        </div>

        <hr>
        `;
    });

}

// Add Product

async function addProduct(){

    const name =
    document.getElementById("name").value.trim();

    const description =
    document.getElementById("description").value.trim();

    const price =
    document.getElementById("price").value.trim();

    const category =
    document.getElementById("category").value.trim();

    const image =
    document.getElementById("image").value.trim();

    if(
        !name ||
        !description ||
        !price ||
        !category ||
        !image
    ){

        alert(
            "Please fill all fields"
        );

        return;

    }

    const response =
    await fetch(
        `${API_URL}/products`,
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                name,
                description,
                price,
                category,
                image

            })
        }
    );

    const data =
    await response.json();

    alert(data.message);

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";

    loadProducts();

}

// Delete Product

async function deleteProduct(id){

    const confirmDelete =
    confirm(
        "Delete Product?"
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
    loadDashboard();

}

// Edit Product
function editProduct(id){

    const product =
    allProducts.find(
        p => p.id === id
    );
 console.log(product);
 
    document.getElementById("editId").value =
    product.id;

    document.getElementById("editName").value =
    product.name;

    document.getElementById("editDescription").value =
    product.description;

    document.getElementById("editPrice").value =
    product.price;

    document.getElementById("editCategory").value =
    product.category;

    document.getElementById("editImage").value =
    product.image;

}
// Update Product
async function updateProduct(){

    const id =
    document.getElementById("editId").value;

    const name =
    document.getElementById("editName").value;

    const description =
    document.getElementById("editDescription").value;

    const price =
    document.getElementById("editPrice").value;

    const category =
    document.getElementById("editCategory").value;

    const image =
    document.getElementById("editImage").value;

    const response =
    await fetch(

        `${API_URL}/products/${id}`,

        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                name,
                description,
                price,
                category,
                image

            })

        }

    );

    const data =
    await response.json();

    alert(data.message);

    loadProducts();
    loadDashboard();
    document.getElementById("editId").value = "";

document.getElementById("editName").value = "";

document.getElementById("editDescription").value = "";

document.getElementById("editPrice").value = "";

document.getElementById("editCategory").selectedIndex = 0;

document.getElementById("editImage").value = "";
}
// Load Orders
async function loadOrders(){

    const response =
    await fetch(
        `${API_URL}/orders`
    );

    const orders =
    await response.json();

    const container =
    document.getElementById(
        "ordersContainer"
    );

    container.innerHTML = "";

    orders.forEach(order=>{

        container.innerHTML += `

<div>

<h3>Order #${order.id}</h3>

<p>User : ${order.user_id}</p>

<p>Total : ₹${order.total}</p>

<p>Status : ${order.status}</p>

<select
onchange="
updateOrderStatus(
${order.id},
this.value
)
">

<option value="">
Change Status
</option>

<option value="Pending">
Pending
</option>

<option value="Shipped">
Shipped
</option>

<option value="Delivered">
Delivered
</option>

</select>

</div>

<hr>

`;

    });

}

//
async function updateOrderStatus(
id,
status
){

    await fetch(

        `${API_URL}/orders/${id}`,

        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                status

            })

        }

    );

    loadOrders();
    loadDashboard();

}
async function loadOrders(){

    const response =
    await fetch(
        `${API_URL}/orders`
    );

    const orders =
    await response.json();

    const container =
    document.getElementById(
        "ordersContainer"
    );

    container.innerHTML = "";

    orders.forEach(order=>{

        container.innerHTML += `

<div class="order-card">

<h3>Order #${order.id}</h3>

<p>User ID : ${order.user_id}</p>

<p>Total : ₹${order.total}</p>

<p>Status : ${order.status}</p>

${
order.status === "Delivered" ||
order.status === "Cancelled"

?

`

<select disabled>

<option>
${order.status}
</option>

</select>

`

:

`

<select
onchange="
updateOrderStatus(
${order.id},
this.value
)
">

<option>
Change Status
</option>

<option value="Pending">
Pending
</option>

<option value="Shipped">
Shipped
</option>

<option value="Delivered">
Delivered
</option>

<option value="Cancelled">
Cancelled
</option>

</select>

`
}
</div>

<hr>

`;

    });

}
async function updateOrderStatus(
id,
status
){

    await fetch(

        `${API_URL}/orders/${id}`,

        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                status

            })

        }

    );

    loadOrders();

}
async function loadDashboard(){

    // Products

    const productResponse =
    await fetch(
        `${API_URL}/products`
    );

    const products =
    await productResponse.json();

    document.getElementById(
        "totalProducts"
    ).innerText =
    products.length;

    // Orders

    const orderResponse =
    await fetch(
        `${API_URL}/orders`
    );

    const orders =
    await orderResponse.json();

    document.getElementById(
        "totalOrders"
    ).innerText =
    orders.length;

    // Users

    const userResponse =
    await fetch(
        `${API_URL}/users`
    );

    const users =
    await userResponse.json();

    document.getElementById(
        "totalUsers"
    ).innerText =
    users.length;

    // Revenue

    let revenue = 0;

    orders.forEach(order=>{

        if(
            order.status !==
            "Cancelled"
        ){

            revenue +=
            Number(order.total);

        }

    });

    document.getElementById(
        "totalRevenue"
    ).innerText =
    `₹${revenue}`;

}
loadProducts();

loadOrders();

loadDashboard()