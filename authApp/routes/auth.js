const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/User')

const {registerValidation, loginValidation} = require('../validation')

const router = express.Router();

router.post('/register',async (req,res) => {


    // validation of data
    const {error} = registerValidation(req.body);
    if(error){return res.status(400).send(error.details[0].message);}

    // check for duplicate email
    const email_exist = await User.findOne({email: req.body.email});
    if(email_exist) return res.status(400).send("Email already exists");

    // Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    // Creating a new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password: hashedPassword
    });

    try{

        const savedUser = await user.save();
        res.send({user:savedUser._id});

    }catch(e){

        console.log("error registering user");
        res.status(400).send(e);
    }

})

router.post('/login',async (req,res) => {

    // validation of data
    const {error} = loginValidation(req.body);
    if(error){return res.status(400).send(error.details[0].message);}

    // check for email
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email doesn't exists");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send("Wrong Password");


    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth_token',token).send(token);
})

module.exports = router;