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
            const token = await jwtSign({ email: user.email, id: user.dataValues.id, role: user.role }, '59m');
            res.status(200).json({ token: token.token, role: user.dataValues.role, email: user.dataValues.email, balance: user.dataValues.balance })
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
                return res.status(403).send("Password should be 8-30 characters, a mix of letters and numbers and with no space")
            }

            const newUser = await db.User.create({ email: req.body.email, password: hashedPass, role: "user" })
            const token = await jwtSign({ email: req.body.email, id: newUser.dataValues.id, role: "user" }, '59m');
            res.status(200).json({ token: token.token, role: "user", balance: 0 })
        }
    }
    catch (err) {
        res.status(403).send('Failed to create new user')
    }
});
//Get user Data By Token to Handle Page Refresh 
router.get('/get-this', verifyToken, async (req, res) => {
    try {
        const { token, authData } = req;
        const user = await db.User.findOne({
            where:
            {
                email: authData.email,
            }
        })
        res.status(200).json({ token, role: user.dataValues.role, email: user.dataValues.email, balance: user.dataValues.balance })
    }
    catch (err) {
        throw new Error(err)
    }
})

//Create Menu Item
router.post('/create-menu-item', verifyToken, async (req, res) => {
    try {
        const { token, authData } = req;
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
            return res.status(403).send("You are not authorized")
        }
        db.Menu.create({ item_name, item_desc, item_pic, unit, serve, price, ShopId: user.dataValues.ShopId })
            .then(data => res.status(200).send("Item created successfully"))
            .catch(err => { res.status(403).send("Creation failed", err) })

    }
    catch (err) {
        res.send(err)
    }
});

//Delete Menu Item
router.delete('/delete-menu-item', verifyToken, async (req, res) => {
    try {
        const { token, authData } = req;
        const { item_id } = req.body;
        //use authData to let only merchant at the ShopId can add items
        const user = await db.User.findOne({
            where:
            {
                email: authData.email,
                role: "merchant",
            }
        })
        if (!user.dataValues) {
            return res.status(403).send("You are not authorized")
        }
        await db.Menu.update({ availability: false }, { where: { id: item_id } })
        res.status(200).send("Item Deleted Successfully")
    }
    catch (err) {
        res.status(403).send(err)
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

//Get all shops
router.get('/allmenu-users', async (req, res) => {
    try {
        const menus = await db.Menu
            .findAll({
                where: { availability: true },

                include: [{ model: db.Shop }]
            }
            )
        res.status(200).json(menus)
    }
    catch (err) {
        throw new Error(err)
    }
})
//Get all Menu Items for merchant
router.get('/allmenu', verifyToken, async (req, res) => {
    try {
        const { authData } = req;
        if (authData.role !== "merchant") {
            return res.status(403).send("You are not authorized to update users data")
        }
        const user = await db.User.findOne({ where: { email: authData.email } })
        const menus = await db.Menu.findAll({ where: { ShopId: user.dataValues.ShopId, availability: true } })
        res.status(200).json(menus)
    }
    catch (err) {
        throw new Error(err)
    }
})
//Get Shop Active Orders by ShopID
router.get('/activeorders', verifyToken, async (req, res) => {
    try {
        const { authData } = req;
        if (authData.role !== "merchant") {
            return res.status(403).send("You are not authorized to update users data")
        }
        const user = await db.User.findOne({ where: { email: authData.email } })
        const orders = await db.Order
            .findAll(
                {
                    where:
                    {
                        ShopId: user.dataValues.ShopId,
                        order_status: ['paid', 'ready']
                    }
                    ,
                    include: [{ model: db.User, attributes: ['email'] }]
                })
        res.status(200).json(orders)
    }
    catch (err) {
        throw new Error(err)
    }
})
//Get User's Active Orders
router.get('/myactiveorders', verifyToken, async (req, res) => {
    try {
        const { authData } = req;
        if (authData.role !== "user") {
            return res.status(403).send("You are not authorized to view users data")
        }
        // const user = await db.User.findOne({ where: { email: authData.email } })
        const orders = await db.Order
            .findAll(
                {
                    where:
                    {
                        UserId: authData.id,
                        order_status: ['paid', 'ready']
                    },
                    include: [{ model: db.Shop, attributes: ['name'] },
                    { model: db.Transaction, attributes: ['id', 'amount'] }
                    ]
                })
        res.status(200).json(orders)
    }
    catch (err) {
        throw new Error(err)
    }
})
//Process Payment and Create Order
router.post('/processpayment', verifyToken, async (req, res) => {
    try {
        const { authData, body } = req;

        const response = {};
        if (body.total < 1 || authData.role !== "user") {
            return res.status(403).send("Unauthorized Payment")
        }
        //Deduct from User account and update his balance
        await db.User.update({
            balance: db.sequelize.literal(`balance-${body.total}`)
        }, { where: { email: authData.email } })
        const user = await db.User.findOne({ where: { email: authData.email } })

        //Record Transaction in transactions table
        const transaction = await db.Transaction.create({ UserId: user.dataValues.id, amount: body.total });

        response.transaction = transaction.dataValues;
        const orders = JSON.parse(body.orders);

        const subTotal = body.subTotal
        console.log(orders);
        for (shop in orders) {
            console.log(shop);
            const tempOrder = await db.Order.create({ order_custom_id: `${transaction.dataValues.id}${shop}`, order_items: JSON.stringify(orders[shop]), ShopId: parseInt(shop), order_total: subTotal[shop], UserId: user.dataValues.id, TransactionId: transaction.dataValues.id })
            response[shop] = tempOrder.dataValues;
            response[shop]["email"] = authData.email;
            response[shop]["total"] = subTotal[shop];
            //add value to shop balance
            await db.Shop.update({
                balance: db.sequelize.literal(`balance+${subTotal[shop]}`)
            },
                {
                    where: { id: parseInt(shop) }
                })
        }
        res.status(200).json(response)
    }
    catch (err) {
        throw new Error(err)
    }
})


//export router
module.exports = router