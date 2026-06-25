const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./ecommerce.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            category TEXT,
            image TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total REAL,
            status TEXT
        )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS reviews(
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         product_id INTEGER,
         user_id INTEGER,
         rating INTEGER,
         review TEXT
       )

    `);

});

// Register User

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    const hashedPassword =
    await bcrypt.hash(password, 10);

    db.run(
        `
        INSERT INTO users
        (name,email,password)
        VALUES(?,?,?)
        `,
        [name,email,hashedPassword],

        function(err){

            if(err){

                return res.status(400).json({
                    message:"Email already exists"
                });

            }

            res.json({
                message:"User Registered"
            });

        }
    );

});

// Login User

app.post("/login", (req,res)=>{

    const { email, password } = req.body;

    db.get(
        `
        SELECT * FROM users
        WHERE email = ?
        `,
        [email],

        async (err,user)=>{

            if(!user){

                return res.status(404).json({
                    message:"User not found"
                });

            }

            const match =
            await bcrypt.compare(
                password,
                user.password
            );

            if(!match){

                return res.status(401).json({
                    message:"Invalid Password"
                });

            }

            res.json({

                message:"Login Successful",

                userId:user.id,

                name:user.name,

                role:user.role

            });

        }

    );

});

app.get("/", (req,res)=>{

    res.send("ShopSphere Backend Running");

});

// Add Product

app.post("/products", (req,res)=>{

    const {
        name,
        description,
        price,
        category,
        image
    } = req.body;
    if(
    !name ||
    !description ||
    !price ||
    !category
){

    return res.status(400).json({
        message:"All fields are required"
    });

}

    db.run(
        `
        INSERT INTO products
        (
            name,
            description,
            price,
            category,
            image
        )
        VALUES(?,?,?,?,?)
        `,
        [
            name,
            description,
            price,
            category,
            image
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                message:"Product Added"

            });

        }

    );

});

// Get Products

app.get("/products",(req,res)=>{

    db.all(
        `
        SELECT *
        FROM products
        ORDER BY id DESC
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});
// Delete Product

app.delete("/products/:id", (req,res)=>{

    db.run(
        `
        DELETE FROM products
        WHERE id = ?
        `,
        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                message:"Product Deleted"

            });

        }

    );

});
// Place Order
app.post("/orders", (req,res)=>{

    const {
        user_id,
        total
    } = req.body;

    db.run(
        `
        INSERT INTO orders
        (
            user_id,
            total,
            status
        )
        VALUES(?,?,?)
        `,
        [
            user_id,
            total,
            "Pending"
        ],

        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Order Placed"
            });

        }
    );

});
// Get Orders for a User
app.get("/orders/:userId",(req,res)=>{

    db.all(
        `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [req.params.userId],

        (err,rows)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }
    );

});

// Update Product

app.put("/products/:id", (req,res)=>{

    const {
    name,
    description,
    price,
    category,
    image
} = req.body;

    db.run(

`
UPDATE products
SET
name = ?,
description = ?,
price = ?,
category = ?,
image = ?
WHERE id = ?
`,

[
    name,
    description,
    price,
    category,
    image,
    req.params.id
],

function(err){

    if(err){

        return res.status(500).json(err);

    }

    res.json({
        message:"Product Updated"
    });

}
);

});

// Cancel Order

app.put(
    "/orders/cancel/:id",
    (req,res)=>{

        db.run(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [
                "Cancelled",
                req.params.id
            ],

            function(err){

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json({

                    message:
                    "Order Cancelled"

                });

            }
        );

    }
);

// Update Order Status

app.put("/orders/:id",(req,res)=>{

    const { status } = req.body;

    db.run(

        `
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `,

        [
            status,
            req.params.id
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                message:"Order Updated"

            });

        }

    );

});

// Get All Orders

app.get("/orders",(req,res)=>{

    db.all(

        `
        SELECT *
        FROM orders
        ORDER BY id DESC
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

// Update Order Status

app.put("/orders/:id",(req,res)=>{

    const { status } = req.body;

    db.run(

        `
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `,

        [
            status,
            req.params.id
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({
                message:"Order Updated"
            });

        }

    );

});

// Get All Users

app.get("/users",(req,res)=>{

    db.all(

        `
        SELECT *
        FROM users
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

//
app.post("/reviews",(req,res)=>{

    const {
        product_id,
        user_id,
        rating,
        review
    } = req.body;

    db.get(
        "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
        [product_id, user_id],

        (err,row)=>{

            if(err){
                return res.status(500).json(err);
            }

            if(row){
                return res.status(400).json({
                    message:"You already reviewed this product"
                });
            }

            db.run(
                "INSERT INTO reviews (product_id,user_id,rating,review) VALUES (?,?,?,?)",
                [
                    product_id,
                    user_id,
                    rating,
                    review
                ],

                function(err){

                    if(err){
                        return res.status(500).json(err);
                    }

                    res.json({
                        message:"Review Added"
                    });

                }
            );

        }
    );

});

app.get("/reviews/:productId",(req,res)=>{

    db.all(

        `
        SELECT *
        FROM reviews
        WHERE product_id = ?
        `,

        [req.params.productId],

        (err,rows)=>{

            if(err){

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{

    console.log(`Server Running on Port ${PORT}`);

});