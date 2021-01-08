const express = require("express");
const http = require('http');
const path = require("path");
const PORT = process.env.PORT;
const app = express();
const db = require('./models');

const server = http.createServer(app)

//Socket IO
const socketio = require('socket.io')
const io = socketio(server);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Initialise server
db.sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`The Express Server is now Up and running on PORT : ${PORT}`));
});