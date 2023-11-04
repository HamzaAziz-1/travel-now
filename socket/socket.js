const express = require("express");
const app = express();
app.use(express.json())

const http = require("http");
const { Server } = require("socket.io");
  const server = http.createServer(app); // Create an HTTP server
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://travel-now-client.vercel.app",
      ],
    },
  });


console.log("hello");
let users = [];
const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((u) => u.userId === userId);

  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};
const userRemove = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.find((u) => u.userId === id);
};

const userLogout = (userId) => {
  users = users.filter((u) => u.userId !== userId);
};

io.on("connection", (socket) => {
  console.log("Socket is connecting...");
  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit("getUser", users);

    const us = users.filter((u) => u.userId !== userId);
    const con = "new_user_add";
    for (var i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit("new_user_add", con);
    }
  });
  socket.on("sendMessage", (data) => {
    const user = findFriend(data.receiverId);

    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessage", data);
    }
  });

  socket.on("messageSeen", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("msgSeenResponse", msg);
    }
  });

  socket.on("delivaredMessage", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("msgDelivaredResponse", msg);
    }
  });
  socket.on("seen", (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("seenSuccess", data);
    }
  });

  socket.on("typingMessage", (data) => {
    const user = findFriend(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("typingMessageGet", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        msg: data.msg,
      });
    }
  });

  socket.on("logout", (userId) => {
    userLogout(userId);
  });

  socket.on("disconnect", () => {
    console.log("user is disconnect... ");
    userRemove(socket.id);
    io.emit("getUser", users);
  });
});


    server.listen(process.env.PORT || 8000, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Server running at PORT: ", process.env.PORT);
      }
    });