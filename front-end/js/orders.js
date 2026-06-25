const API_URL =
"http://localhost:5000";

async function loadOrders(){

    const userId =
    localStorage.getItem("userId");

    const response =
    await fetch(
        `${API_URL}/orders/${userId}`
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

            <h3>
                Order #${order.id}
            </h3>

            <p>
                ₹${order.total}
            </p>

            <p class="status">

    Status :

    <span class="order-status ${order.status}">
    ${order.status}
</span>

</p>
            ${
        order.status === "Pending"
        ?
        `
        <button
        onclick="cancelOrder(${order.id})">
            Cancel Order
        </button>
        `
        :
        ""
    }

        </div>
        `;
    });

    if(orders.length === 0){

    container.innerHTML = `

        <div class="empty-box">

            <h2>No Orders Yet</h2>

        </div>

    `;

    return;
}
}
// Cancel Order Function
async function cancelOrder(id){

    const confirmCancel =
    confirm(
        "Cancel this order?"
    );

    if(!confirmCancel){

        return;

    }

    await fetch(

        `${API_URL}/orders/cancel/${id}`,

        {
            method:"PUT"
        }

    );

    loadOrders();

}
loadOrders();