const app = require("express")
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const { Product, ProductImage, Category } = require("../../models");
const { Op } = require("sequelize");
const productimage = require("../../models/productimage");


const router = app.Router()

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let whereCondition = {};
    if (req.query.search) {
      whereCondition.name = {
        [Op.iLike]: `%${req.query.search}%`,
      };
    }

    if(req.query.categoryId){
      whereCondition.categoryId = {
        [Op.eq]: req.query.categoryId,
      }
    }

    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    const totalPages = Math.ceil(total / limit);

    res.json({
      message: "Product fetched successfully",
      data: products,
      pagination: {
        currentPage: page,
        limit,
        total,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.log("Creating product error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});




router.post("/:id/upload",async (req, res) => {
    try {

        const {file } = req.files;
        const productId =req.params.id

        const product = await Product.findByPk(productId)
        if(!product){
            res.json({
                message:`Product ID:${productId} not found `
            })
        }
        console.log("File:", file)


        const fileName = `${uuidv4()}${path.extname(file.name)}`;

        // file will save to uploads/products/
        const uploadPath = path.join(process.cwd(), "uploads/products", fileName);

        await file.mv(uploadPath)

        // Domain + fileName
        const domain = `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${domain}/uploads/products/${fileName}`;

        // Save image to database
        const savedImage = await ProductImage.create({
            productId,
            imageUrl,
            fileName: file.name
        });

        res.json({
            message: "Upload Image successfully",
            data: savedImage
        })
    } catch (error) {
        console.error("Upload error:", error);

        return res.status(500).json({
            message: "Failed to upload image",
            error: error.message
        });
    }
});

router.get("/images/:imageId/download",async (req, res) =>{
    try {
        const {imageId} = req.params

        const image = await ProductImage.findByPk(imageId)

        if(!image) {
            res.json({
                message: `Product image:${imageId} not found`
            })
        }

        const fileName = image.imageUrl.split("/").pop();
        console.log("fileName:", fileName)

        const filePath = path.join(process.cwd(), "uploads/products", fileName);
        if(!fs.existsSync(filePath)){
            res.json({
                message: "File not found"
            })
        }

        res.download(filePath, image.fileName);


    } catch (error) {
        
    }
   
})


module.exports = router