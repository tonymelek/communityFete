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
        await db.Order.update({
          order_status: data.status
        }, { where: { id: data.id } })

        const updatedOrder = await db.Order.findOne({ where: { id: data.id } });
        const activeOrders = await db.Order
          .findAll({
            where: {
              UserId: updatedOrder.dataValues.UserId
              // , order_status: ['paid', 'ready'] 
            }
            ,
            include: [{ model: db.Shop, attributes: ['name'] },
            { model: db.User, attributes: ['email'] }
            ]
          })
        //Send updated Orders to users
        io.to(users[updatedOrder.dataValues.UserId]).emit('activeOrders', activeOrders);
        const shopOrders = await db.Order
          .findAll({
            where: { ShopId: updatedOrder.dataValues.ShopId }
            ,
            include: [{ model: db.Shop, attributes: ['name', 'balance'] },
            { model: db.User, attributes: ['email'] }
            ]
          })
        io.to(updatedOrder.dataValues.ShopId.toString()).emit('oldOrders', shopOrders)
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
          socket.join(ShopId) //Add all merchants of same shop to a achat root to send them updates and orders of this shop
          io.to(ShopId).emit('shopConnection', `You are now connected as Shop-${ShopId}`)
          const orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: user.dataValues.ShopId
                  // ,order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name', 'balance'] }]
              })
          io.to(ShopId).emit('oldOrders', orders)
        } else {
          users[user.dataValues.id] = socket.id //record user ID and socket to send them orders updates
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  UserId: user.dataValues.id
                  // , order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name'] }
                ]
              })
          io.to(users[user.dataValues.id]).emit('userOrders', user_orders)

        }
      }
    })


    //Handle new orders from users
    socket.on('newOrder', async data => {
      for (key in data) {
        if (key !== 'transaction') {
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: parseInt(key)
                  // ,order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name', 'balance'] }
                ]
              })
          io.to(key).emit('oldOrders', user_orders) //send order to shop room chat as they come in from user
        }
      }

    })
  })

});