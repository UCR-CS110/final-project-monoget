// import dependencies for express
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const roomIdGenerator = require("./util/roomIdGenerator.js");
const mongoose = require("mongoose"); //used for mongoDb
const config = require("config"); //used to access the config file
const Room = require("./models/rooms");
const roomMessages = require("./models/roomMessages");

// import handlers to handle requests to view the homepage
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");
const res = require("express/lib/response");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const db = config.get("mongoURI"); //extracts db connection from default.json

mongoose.connect(
  db, //connect to db
  (error) => {
    if (error) throw error;
    console.log("Connected to MongoDB."); //log out the connection if connection was made.
  }
);
// set up stylesheets route

// TODO: Add server side code

//createRoom
app.post("/create", (req, res) => {
  const newRoom = new Room({
    name: req.body.roomName,
    id: roomIdGenerator.roomIdGenerator(),
  });
  newRoom
    .save()
    .then(console.log("Room has been added!"))
    .catch((err) => console.log("Error when creating room."));
});

app.post("/message", (req, res) => {
  console.log(req.body.content);
  const newMessage = new roomMessages({
    room: req.body.roomName,
    username: req.body.userName,
    dateEntry: Date.now(),
    content: req.body.content
  });
  newMessage.save().then(console.log('Message added to db'))
  .catch(err => console.log("Error: ", err));
  res.send("message sent!")
});

//getRoom - return json of all rooms in the mongo database
app.get("/getRoom", (req, res) => {
  //order of endpoints matter, keep /getRoom before /:roomName
  //controllermvc(model vu controller)
  Room.find()
    .lean()
    .then((item) => {
      res.json(item);
    });
});

app.get("/getMessages", (req, res) => {
  roomMessages.find().lean().then(items => {
    res.json(items);
  });
});

// Create controller handlers to handle requests at each endpoint
app.get("/", homeHandler.getHome);
app.get("/:roomName", roomHandler.getRoom);
app.get('/:roomName/messages', roomHandler.getRoom);            

// Create endpoint - to create a new room in the database

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
