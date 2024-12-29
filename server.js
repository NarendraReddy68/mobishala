const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "Database.db");
let db;

const initializeDbAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3000, () => console.log("Server running at http://localhost:3000"))
    }
    catch(e){
        console.log(e.message);
    }
}
initializeDbAndServer()


// Adding item to Cart
app.post("/cart/", async (request, response) => {
    const {id, user_id, product_id, quantity} = request.body;

    const newCartItemQuery = `
    INSERT INTO cart(id, user_id, product_id, quantity)
    VALUES(${id}, ${user_id}, ${product_id}, ${quantity})
    `
    await db.run(newCartItemQuery);
    response.send("Cart Item Added Successfully");
})

// Removing item from Cart
app.delete("/cart/:id", async (request, response) => {
    const {id} = request.params;

    const removeCartItemQuery = `
    DELETE FROM cart
        WHERE id = ${id} 
    `
    await db.run(removeCartItemQuery);
    response.send("Cart Item Deleted Successfully");
})

// Updating Cart Item
app.put("/cart/:id", async (request, response) => {
    const {user_id, product_id, quantity} = request.body;
    const {id} = request.params;

    const updateCartItemQuery = `
    UPDATE cart
    SET user_id = ${user_id}, product_id = ${product_id}, quantity = ${quantity}
    WHERE id = ${id};
    `
    await db.run(updateCartItemQuery);
    response.send("Cart Item Updated Successfully");
})

// Fetching Cart Details for a user
app.get("/users/:id/cart/", async (request, response) => {
    const {id} = request.params;

    const userCartDetailsQuery = `
    SELECT * FROM cart
    WHERE user_id = ${id}
    `

    const userDetails = await db.get(userCartDetailsQuery);
    response.send(userDetails);
})