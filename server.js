const express = require("express");
const http = require('http');
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./models');
const { jwtVerify } = require('./middleware/jwt')


//Socket IO
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
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Initialise server
const users = {}
db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => console.log(`The Express Server is now Up and running on PORT : ${PORT}`));
  const io = socketio(server);
  io.on("connection", socket => {
    console.log(`New Connection Established ${socket.id}`);
    socket.on('updateOrderStatus', async data => {
      try {
        await db.Order.update({
          order_status: data.status
        }, { where: { id: data.id } })

        const updatedOrder = await db.Order.findOne({ where: { id: data.id } });
        const activeOrders = await db.Order
          .findAll({
            where: { UserId: updatedOrder.dataValues.UserId, order_status: ['paid', 'ready'] }
            ,
            include: [{ model: db.Shop, attributes: ['name'] },
            { model: db.User, attributes: ['email'] }
            ]
          })
        io.to(users[updatedOrder.dataValues.UserId]).emit('activeOrders', activeOrders);
        //   const orders = await db.Order
        //     .findAll(
        //       {
        //         where:
        //         {
        //           ShopId: updatedOrder.dataValues.ShopId,
        //           order_status: ['paid', 'ready']
        //         }
        //         ,
        //         include: [{ model: db.User, attributes: ['email'] }]
        //       })
        //   io.to(updatedOrder.dataValues.ShopId.toString()).emit('oldOrders', orders)
      }

      catch (err) {
        throw err
      }

    })





    socket.on("userId", async data => {
      console.log("userId", data);
      if (data !== undefined) {
        const user = await db.User.findOne({ where: { email: data } })
        if (user.dataValues.ShopId !== null) {
          let ShopId = user.dataValues.ShopId.toString()
          socket.join(ShopId)
          io.to(ShopId).emit('shopConnection', `You are now connected as Shop-${ShopId}`)
          const orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: user.dataValues.ShopId,
                  order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name'] }]
              })
          io.to(ShopId).emit('oldOrders', orders)
        } else {
          users[user.dataValues.id] = socket.id
          console.log(users[user.dataValues.id]);
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  UserId: user.dataValues.id,
                  order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name'] }
                ]
              })
          console.log(user_orders);
          io.to(users[user.dataValues.id]).emit('userOrders', user_orders)

        }
      }
    })



    socket.on('newOrder', async data => {
      console.log('newOrder', data);
      for (key in data) {
        if (key !== 'transaction') {
          const user_orders = await db.Order
            .findAll(
              {
                where:
                {
                  ShopId: parseInt(key),
                  order_status: ['paid', 'ready']
                }
                ,
                include: [{ model: db.User, attributes: ['email'] },
                { model: db.Shop, attributes: ['name'] }
                ]
              })
          io.to(key).emit('oldOrders', user_orders)
        }
      }

    })
  })

});