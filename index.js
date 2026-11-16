const express = require('express');
const db = require("./models")
const cors = require("cors");
const app = express()
const authRoute = require("./src/routes/auth");
const customerRoute = require("./src/routes/customer");
const productRoute = require("./src/routes/product")
const userRoute = require("./src/routes/user")

const path = require("path");
const fileUpload = require("express-fileupload");
const authMiddleware = require("./src/middlewares/authmiddleware")


const port = 3000
const { Category, Product, Customer} = require('./models');
const product = require('./models/product');
app.use(cors({
  origin: "http://localhost:5173",
}));
const { Model } = require('sequelize');
app.use(express.json())
app.use(
  fileUpload({
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
    createParentPath: true,
  })
);
app.use(
  "/uploads/products",
  express.static(path.join(process.cwd(), "uploads/products"))
);




db.sequelize
.authenticate()
.then(()=> console.log("Database connected successfully"))
.catch((err) => console.log("Unable connect to database", err))




app.use("/api/v1/auth", authRoute);
app.use("/api/v1/customers", customerRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);







app.post("/api/v1/categories", async(req, res) => {
    const name =req.body.name
    const isActive= req.body.isActive

    const created = await Category.create({name, isActive})
    res.json({
        message:"Category Created Successfully",
        data:created
    })

    

})
app.get("/api/v1/categories", async(req, res) => {
    

    const categories = await Category.findAll({
        include: [{
            model: Product, as: "products"
        }],
    })

    res.json({
        message:"Category Result Successfully",
        data:categories
    }) 
})

app.get("/api/v1/products", async(req, res) => {
    const products = await Product.findAll({
        include: [{model: Category, as :"category"}],
        
    });

    res.json({
        message:"Product Fetched Successfully",
        data: products
    })
})


app.post("/api/v1/products", async(req, res) => {
    // const name = req.body.name
    // const price = req.body.price
    // const categoryId = req.body.categoryId
    const {name, price, categoryId,qty, isActive} = req.body;
    const createdProduct = await Product.create({name, price, categoryId,qty, isActive})
    

    res.json({
        message:"Product Created Successfully",
        data: createdProduct
    })
})

app.post("/api/v1/orders", async (req, res) => {
    try {
        console.log("Request Body", req.body)
        const {customerId, location, item, discount} = req.body; 
        const customer = await Customer.findByPk(customerId)
        console.log("Customer", customer)

        if(!customer){
            res.json({
                message: "Customer not found"
            })
        }

        const orderdetailsdata = [];
        let total = 0;
        for (const item of items){
            const {productId, qty} = item;


            //Get  product info
            const product = await Product.findByPk(productId);
            if(!product){
                res.json({
                    message:`Product id =${productId} not found`,   
                });
            }


            console.log("Product", product)
            const amount = product.price * qty

            //
            total += amount

            orderdetailsdata.push({
                productId,
                productName : product.name,
                productPrice: product.price,
                qty,
                amount
            })

        }


        console.log("OrderDetail", orderdetailsdata)

        res.json({
            data: customer
        })
    } catch (error) {
        console.log("Error", error)
    }
})








app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})