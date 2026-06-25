const API_URL =
"https://shopsphere-production-963f.up.railway.app";


// REGISTER

const registerBtn =
document.getElementById("registerBtn");

if(registerBtn){

    registerBtn.addEventListener(
        "click",
        async ()=>{

            const name =
            document.getElementById("name").value;

            const email =
            document.getElementById("email").value;

            const password =
            document.getElementById("password").value;

            const response =
            await fetch(
                `${API_URL}/register`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        name,
                        email,
                        password

                    })

                }
            );

            const data =
            await response.json();

            alert(data.message);

            if(response.ok){

                window.location =
                "login.html";

            }

        }
    );

}



// LOGIN

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

    loginBtn.addEventListener(
        "click",
        async ()=>{

            const email =
            document.getElementById("loginEmail").value;

            const password =
            document.getElementById("loginPassword").value;

            const response =
            await fetch(
                `${API_URL}/login`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        email,
                        password

                    })

                }
            );

            const data =
            await response.json();

            alert(data.message);

            if(response.ok){

                localStorage.setItem(
                    "userId",
                    data.userId
                );

                localStorage.setItem(
                    "userName",
                    data.name
                );

                localStorage.setItem(
                    "role",
                    data.role
                );

                window.location =
                "index.html";

            }

        }
    );

}