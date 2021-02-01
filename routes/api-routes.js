//Define Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const { jwtSign } = require('./../middleware/jwt')
const verifyToken = require('../middleware/verifyToken');
const isStrong = require('../middleware/checkpassstrength');
const { sequelize } = require('../models');


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
        console.log('orders', orders);
        for (shop in orders) {
            console.log('shop', shop);
            for (item of orders[shop]) {
                console.log(item);
                const tempOrder = await db.Order.create(
                    {
                        order_custom_id: `${transaction.dataValues.id}${shop}`
                        , MenuId: item.id,
                        item_qty: item.qty,
                        ShopId: parseInt(shop),
                        order_total: subTotal[shop],
                        UserId: user.dataValues.id,
                        TransactionId: transaction.dataValues.id
                    })
                console.log(tempOrder.dataValues);
                response[shop] = tempOrder.dataValues;
                response[shop]["total"] = subTotal[shop];
            }


            //add value to shop balance
            await db.Shop.update({
                balance: db.sequelize.literal(`balance+${subTotal[shop]}`)
            },
                {
                    where: { id: parseInt(shop) }
                })
        }
        console.log(response);
        res.status(200).json(response)
    }
    catch (err) {
        throw new Error(err)
    }
})

//Get number of merchants for a shop id
router.get('/merchants/:email', async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { email: req.params.email } })
        const merchantsCount = await db.User.count({ where: { ShopId: user.dataValues.ShopId } })
        console.log(req.params.email, merchantsCount);
        res.json({ merchantsCount })
    }
    catch (err) {
        throw new Error(err)
    }
})

//Get Admin Statistics
router.get('/admin-stats', verifyToken, async (req, res) => {
    try {
        const { authData, token } = req
        console.log(token);
        if (authData.role !== "admin") {
            return res.status(403).send("Sorry you are not authorized to access this information")
        }
        // Get number of users
        const numberOfUsers = await db.User.count({ where: { role: "user" } })
        const numberOfMerchants = await db.User.count({ where: { role: "merchant" } })
        const numberOfOrders = await db.Order.aggregate('TransactionId', 'DISTINCT', { plain: false })
        const totalSpend = await db.Transaction.findAll({
            where: { amount: { [db.Sequelize.Op.gt]: 0 } },
            attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']]
        })
        console.log(totalSpend);
        const highestSpender = await db.Transaction.findAll({
            where: { amount: { [db.Sequelize.Op.gt]: 0 } },
            attributes: ['UserId', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
            group: ['UserId'],
            include: [{ model: db.User, attributes: ['email'] }],
            order: sequelize.literal('total DESC'),
            limit: 1
        })
        const orders = await db.Order.findAll({ include: [{ model: db.Shop, attributes: ['name'] }] })
        res.json({ numberOfUsers, numberOfMerchants, numberOfOrders: numberOfOrders.length, totalSpend, highestSpender, orders })
    }
    catch (err) {
        throw new Error(err)
    }
})

//AdminFooterDetails
router.get('/admin-footer', verifyToken, async (req, res) => {
    try {
        const { authData, token } = req
        if (authData.role !== "admin") {
            return res.status(403).send("Sorry you are not authorized to access this information")
        }
        const shops = await db.Shop.count()
        const users = await db.User.count()
        res.json({ shops, users })
    }
    catch (err) {
        throw err
    }
})


//TEST API BEST SELLERS
router.get('/test', async (req, res) => {
    try {
        const test = await db.Order.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('item_qty')), 'totalSold']],
            group: ['MenuId'],
            include: [{ model: db.Menu, attributes: ['item_name'] }, { model: db.Shop, attributes: ['name'] }],
            order: sequelize.literal('totalSold DESC'),
            limit: 3
        })
        res.json(test)

    } catch (error) {
        throw error
    }
})

//TEST DISTINCT
router.get('/test2', async (req, res) => {
    try {
        const test = await db.Order.findAll({
            attributes: [[sequelize.fn('distinct', sequelize.col('order_custom_id')), 'order_custom_id'], 'order_total', 'ShopId'],
            order: sequelize.literal('ShopId ASC')
        })


        res.json(test)

    } catch (error) {
        throw error
    }
})

//export router
module.exports = router