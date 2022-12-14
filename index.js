const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dbConfig = require("./config/db.config");

const auth = require("./middlewares/auth");
const errors = require("./middlewares/errors");

const { unless } = require("express-unless");

const socket = require("socket.io");

const app = express();
app.use(cors());

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected successfully");
    },
    (error) => {
      console.log("Could not connect to database: " + error);
    }
  );

auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
    ],
  })
);

app.use(express.json());

app.use("/users", require("./routes/users.routes"));
app.use("/messages", require("./routes/messages.routes"));

app.use(errors.errorHandler);

const server = app.listen(process.env.PORT || 3001, () => {
  console.log("Server is ready");
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", async (data) => {
    const token = data.from;
    const user = await auth.quickAuth(token);

    const receiverSocketId = onlineUsers.get(data.to);
    const sendUserSocket = onlineUsers.get(user.id);
    console.log(data);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg", {
        fromSender: false,
        message: data.message,
      });
    }
  });
});
