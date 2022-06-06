// import dependencies for express
const bodyParser = require('body-parser');
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const roomIdGenerator = require("./util/roomIdGenerator.js");
const mongoose = require("mongoose"); //used for mongoDb
const config = require("config"); //used to access the config file
const Room = require("./models/rooms");
const roomMessages = require("./models/roomMessages");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = config.get("JWT_SECRET");

// import handlers to handle requests to view the homepage
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");
const registrationHandler = require("./controllers/registration.js");
const loginHandler = require("./controllers/login.js");
const profileHandler = require("./controllers/profile.js");


const res = require("express/lib/response");
const { process_params } = require("express/lib/router");

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
    content: req.body.content,
    votes: 0,
    messageID: roomIdGenerator.roomIdGenerator()
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

app.delete("/deleteMsg", async (req, res) => {
  let messageId = req.body.messageID;
  let temp = await roomMessages.deleteOne(
    {"messageID": messageId}
  );
  console.log(temp);
  res.send("resolved delete");
});

app.post("/updateMsg", async (req, res) => {
  let messageId = req.body.messageID;
  let message = req.body.newMessage.trim();
  let temp = await roomMessages.updateOne(
    {"messageID": messageId},
    {$set: {content: message}}
  );
  res.send("resolved update msg");
});

app.post("/vote", async (req, res) => {
  let value = req.body.vote;
  //console.log(req.body.messageID);
  let temp = await roomMessages.updateOne(
    { "messageID": req.body.messageID },
    { $inc: {votes: value} }
 );
 //console.log(temp);
 res.send("resolved vote");
})

app.post("/api/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username : username.trim()});
  
  if (!user) {
    return res.json({status: "error", error: "Invalid username/password."});
  }
  
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      id: user._id,
      username: user.username
    }, 
    JWT_SECRET);
    //console.log(token);
    const result = {status: "success", data: token};
    return res.json(result);
  }

  console.log("failed...");
  return res.json({status: "error", error: "Invalid username/password."});
});

app.post("/api/register", async (req,res) => {
  //console.log(req.body);

  const {username, password: plainTextPassword, email} = req.body;
  const user = await User.findOne({username : username.trim()}).lean();
  if (user) {
    return res.json({status: "error", error: "Username already exists! Please choose another one."});
  }

  if (!username || typeof username !== 'string') {
    return res.json({status: "error", error: "Invalid username."});
  }

  if (!plainTextPassword || typeof plainTextPassword !=="string") {
    return res.json({status: "error", error: "Invalid password."});
  }

  if (plainTextPassword.length < 4) {
    return res.json({status: "error", error: "Password is too short!"});
  }

  const emailCheck = await User.findOne({email : email.trim()}).lean();
  if (emailCheck) {
    return res.json({status: "error", error: "This email is already registered!"});
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    await User.create({
      username,
      password,
      email
    });
  } catch(error) {
    console.log(error);
    return res.json({status: "error"});
  }
  return res.json({status: "success"});
});

app.post("/api/change-password", async (req, res) => {
  const {newPassword: plainTextPassword, token} = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({status: "error", error: "Invalid password."});
  }

  if (plainTextPassword.length < 4) {
    return res.json({status: "error", error: "Password is too short!"});
  }

  try {//Verify JWT received
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
  
    const password = await bcrypt.hash(plainTextPassword, 10);
    await User.updateOne(
      {_id},
      {
        $set:{password: password}
      }
    );
    res.json({status:"ok"});
    console.log("password update successful");
  } catch (error) {
    console.log(error);
    res.json({status: "error", error: "Authentication Failed"});
  }

})

app.post("/api/userData", async (req, res) => {
  const token = req.body.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const userData = await User.findOne({_id : _id});
    console.log(userData);
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.json({status: "error", error: "Authentication Failed"});
  }
});
// Create controller handlers to handle requests at each endpoint
app.get("/", registrationHandler.getRegistration);
app.get("/login", loginHandler.getLogin);
app.get("/home", homeHandler.getHome);
app.get("/profile", profileHandler.getProfile);
app.get("/:roomName", roomHandler.getRoom);
app.get('/:roomName/messages', roomHandler.getRoom);            

// Create endpoint - to create a new room in the database

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
