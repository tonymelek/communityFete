//Define Dependencies
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./models');
const socketio = require('socket.io');


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//  API routes
app.use('/api', require('./routes/api-routes'))

// Send every other request to the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Initialise server
const users = {}
db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => console.log(`The Express Server is now Up and running on PORT : ${PORT}`));

  //Socket IO Script for Live updates
  const io = socketio(server);
  io.on("connection", socket => { //Listen to Connections from users/merchants
    console.log(`New Connection Established ${socket.id}`);
    socket.on('updateOrderStatus', async data => { //Listen to order updates from merchants
      try {
        const ordersToUpdate = await db.Order.findAll({ where: { order_custom_id: data.id } })

        for (let order of ordersToUpdate) {
          await db.Order.update({
            order_status: data.status
          }, { where: { id: order.dataValues.id } })
        }
        const updatedOrder = await db.Order.findOne({ where: { order_custom_id: data.id } });
        const activeOrders = await db.Order
          .findAll({
            where: {
              UserId: updatedOrder.dataValues.UserId
              , order_status: ['paid', 'ready']
            }
            ,
            include: [{ model: db.Shop, attributes: ['name'] },
            { model: db.User, attributes: ['email'] },
            { model: db.Menu, attributes: ['item_name', 'price'] }
            ]
          })
        //Send updated Orders to users
        io.to(users[updatedOrder.dataValues.UserId]).emit('activeOrders', activeOrders);
        const shopOrders = await db.Order
          .findAll({
            where: { ShopId: updatedOrder.dataValues.ShopId, order_status: ['paid', 'ready'] }
            ,
            include: [{ model: db.Shop, attributes: ['name', 'balance'] },
            { model: db.User, attributes: ['email'] },
            { model: db.Menu, attributes: ['item_name', 'price'] }
            ]
          })
        io.to(updatedOrder.dataValues.ShopId.toString()).emit('shopOrders', shopOrders)
      }

      catch (err) {
        throw err
      }

    })

    //Handle new user / merchant connection establishment and send initial data
    socket.on("userId", async data => {
      if (data !== undefined) {
        const user = await db.User.findOne({ where: { email: data } })
        if (user.dataValues.ShopId !== null) {
          let ShopId = user.dataValues.ShopId.toString()
          socket.join(ShopId) //Add all merchants of same shop to a chat room to send them updates and orders of this shop
          io.to(ShopId).emit('shopConnection', `You are now connected as Shop-${ShopId}`)
          console.log(socket.id, ShopId);
          const orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: user.dataValues.ShopId
                  , order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name', 'balance'] },
                { model: db.Menu, attributes: ['item_name', 'price'] }]
              })
          io.to(ShopId).emit('shopOrders', orders)
        } else {
          users[user.dataValues.id] = socket.id //record user ID and socket to send them orders updates
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  UserId: user.dataValues.id
                  , order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name'] }
                  , { model: db.Menu, attributes: ['item_name', 'price'] }]
              })

          io.to(users[user.dataValues.id]).emit('userOrders', user_orders)

        }
      }
    })


    //Handle new orders from users
    socket.on('newOrder', async data => {
      console.log(users)
      for (key in data) {
        if (key !== 'transaction') {
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: parseInt(key)
                  , order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name', 'balance'] },
                { model: db.Menu, attributes: ['item_name', 'price'] }
                ]
              })
          io.to(key).emit('shopOrders', user_orders) //send order to shop room chat as they come in from user
        }
      }

    })



  })

});