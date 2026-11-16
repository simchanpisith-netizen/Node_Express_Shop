const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { where } = require('sequelize');


const {User} = require("../../models");
const router = express.Router();

router.post("/register",async (req, res) =>{
   try {
    const {firstName, lastName, email, password, gender} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);


    const Createduser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender
    });
    


     res.json({
        message: "User created successfully",
        data: Createduser,
    })
    
   } catch (error) {
    console.log("Error", error)
    
   }
})

router.post("/login",async (req, res) =>{
   try {
    const { email, password } = req.body;

    //Check email in db
    const user = await User.findOne({where: {email}});
    if(!user) {
        res.json({
            message: `User email=${email} not found`
        })
    }
    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        res.json({
            message: "Invalid Password"
        });
    }

    //Generate token
    const token = jwt.sign({
        id: user.id, 
        email: user.email, 
        fullName: user.firstName + user.lastName
    }, 'express');
    
    
     res.json({
        message: "User Login successfully",
        data: token,
    })
    
   } catch (error) {
    console.log("Error", error)
    
   }
})

module.exports = router;