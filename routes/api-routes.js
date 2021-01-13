//Define Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const { jwtSign } = require('./../middleware/jwt')
const verifyToken = require('../middleware/verifyToken');
const isStrong = require('../middleware/checkpassstrength');


//Create new Shop
router.post('/create-shop', verifyToken, async (req, res) => {
    const { authData } = req;
    if (authData.role !== "admin") {
        res.status(403).send("You are not authorized to create a shop")
    }
    db.Shop.create({ name: req.body.name, category: req.body.category })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(403).send('Failed to create new shop'));
});

//Create First Admin Only without a token
router.post('/create-first-admin', async (req, res) => {
    try {
        const users = await db.User.findAll();
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        if (users.length === 0 && req.body.role === "admin") {
            if (!isStrong(req.body.password)) {
                return res.status(403).send("Password should be 8-30 characters, a mix of letters and numbers and with no space")
            }
            db.User.create({ email: req.body.email, password: hashedPass, role: "admin" })
                .then(data => res.status(200).json({ msg: "First admin created successfully" }))
                .catch(err => res.status(403).send(err));
        }
        else {
            res.status(403).send("Sorry, you can't create a new admin, contact your admin")
        }
    }
    catch (err) {
        throw new Error(err)
    }
});

//User Login
router.post('/login', async (req, res) => {
    let user;
    try {
        user = await db.User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (user == null) {
            res.status(401).send(`${req.body.email} is not registered, please sign up`);
        }
        const result = await bcrypt.compare(req.body.password, user.dataValues.password)
        if (result) {
            const token = await jwtSign({ email: user.email, role: user.role }, '15m');
            res.status(200).json({ token: token.token, role: user.role, balance: user.balance })
            return
        } else {
            res.status(401).send("wrong email or password");
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

//Sign Up
router.post('/signup', async (req, res) => {
    let user;
    try {
        user = await db.User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (user !== null) {
            res.status(403).send("user already exists");
            return
        }
        else {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            if (!isStrong(req.body.password)) {
                return res.status(403).json("Password should be 8-30 characters, a mix of letters and numbers and with no space")
            }
            const token = await jwtSign({ email: req.body.email, role: req.body.password }, '15m');
            db.User.create({ email: req.body.email, password: hashedPass, role: "user" })
                .then(data => res.status(200).json({ token: token.token, role: "user", balance: 0 }))
                .catch(err => res.status(403).json({ err: 'Failed to create new user', error_details: err.message }));
        }
    }
    catch (err) {
        throw err;
    }
});


//Create Menu Item
router.post('/create-menu-item', verifyToken, async (req, res) => {
    try {
        console.log('I came here');
        const { token, authData } = req;
        console.log(req.body, authData);
        const { item_name, item_desc, item_pic, unit, serve, price } = req.body;
        //use authData to let only merchant at the ShopId can add items
        const user = await db.User.findOne({
            where:
            {
                email: authData.email,
                role: "merchant",
            }
        })
        if (!user.dataValues) {
            return res.status(403).send("You are noy authorized")
        }
        db.Menu.create({ item_name, item_desc, item_pic, unit, serve, price, ShopId: user.dataValues.ShopId })
            .then(data => res.status(200).send("Item created successfully"))
            .catch(err => { res.status(403).send("Creation failed", err) })

    }
    catch (err) {
        res.send(err)
    }
});

//Get All users and merchants for admin
router.get('/users', verifyToken, async (req, res) => {
    try {
        const { token, authData } = req;
        if (authData.role !== "admin") {
            res.status(403).send("Not Authorized to access this end point")
        }
        db.User.findAll({ attributes: ["email", "role", "balance", "ShopId"], where: { role: ["user", "merchant"] } })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => res.status(403).json({ err: 'Failed to create new menu item', error_details: err.message }));

    }
    catch (err) {
        res.send(err)
    }
});
//Update Role and/ or balance
router.put('/updateBalanceRole', verifyToken, async (req, res) => {
    try {
        const { token, authData, body } = req;
        if (authData.role !== "admin") {
            return res.status(403).send("You are not authorized to update users data")
        }
        console.log(req.body);
        await db.User.update({
            role: body.role, ShopId: body.ShopId, balance: db.sequelize.literal(`balance+${body.balance == null ? 0 : body.balance}`)
        }, { where: { email: body.email } })
        db.User.findOne({ where: { email: body.email } })
            .then(data => res.status(200).json(data))
            .catch(err => res.send(err))
    }
    catch (err) {
        throw new Error(err)
    }
})

//Get all shops
router.get('/allshops', async (req, res) => {
    try {
        const shops = await db.Shop.findAll({})
        res.status(200).json(shops)
    }
    catch (err) {
        throw new Error(err)
    }
})

//export router
module.exports = router