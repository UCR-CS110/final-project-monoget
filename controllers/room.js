// Controller handler to handle functionality in room page

const roomGenerator = require("../util/roomIdGenerator.js");
const room = require("../models/rooms"); //will use another schema instead

const roomMessages = require("../models/roomMessages");//this schema contains more information

// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response) {
  roomMessages
    .find({ name: request.params.roomName })
    .lean()
    .then((items) => {
      response.render("room", {
        title: "chatroom",
        messages: items,
        roomName: request.params.roomName,
        newRoomId: roomGenerator.roomIdGenerator(),
        isAvailable: true,
      });
    });

  // response.render("room", {
  //   title: "chatroom",
  //   roomName: request.params.roomName,
  //   newRoomId: roomGenerator.roomIdGenerator(),
  // });
}

module.exports = {
  getRoom
};
