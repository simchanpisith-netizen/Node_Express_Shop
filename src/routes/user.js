const app = require('express');
const { User } = require("../../models");
const { where } = require('sequelize');


const router = app.Router();


router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const {firstName, lastName } = req.body;

        const user = await User.findByPk(id)
        console.log("User", user)

        if(!user) {
            res.json({
                message: `User ID= ${id} not found`
            })
        }

        
        await user.update({
            firstName, lastName
        })

        console.log("Updated User", user);

        res.json({
            message: "User updated successfully",
            data: user,
        })



    } catch (error) {
        console.log("Error", error)
        
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id)
        console.log("User", user)

        if(!user) {
            res.json({
                message: `User ID= ${id} not found`
            })
        }
        
        await user.destroy()
        // await User.destroy({
        //     where:{
        //         id
        //     }
        // })
        
        

        console.log("Deleted User", user);

        res.json({
            message: "User deleted successfully",
            data: user,
        })



    } catch (error) {
        console.log("Error", error)
        
    }
})


module.exports = router