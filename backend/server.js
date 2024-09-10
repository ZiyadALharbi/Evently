require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");

app.use(
  cors({
    // origin: "http://127.0.0.1:5177",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth_routes.js");
const organizerRoutes = require("./routes/organizer_routes.js");
const studentRoutes = require("./routes/student_routes.js");
const general_route = require("./routes/general_routes.js");
const admin_route = require("./routes/admin_routes.js");

app.use("/auth", authRoutes);
app.use("/organizer", organizerRoutes);
app.use("/student", studentRoutes);
app.use("/general", general_route);
app.use("/admin", admin_route);

mongoose
  .connect(
    "mongodb+srv://ZiyadAlharbi:12345@eventmanagmentdb.tdbn3.mongodb.net/Event-API?retryWrites=true&w=majority&appName=eventManagmentDB"
  )
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(6001, () => {
  console.log(`Server is listening on port 6001`);
});
