require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/auth-router");
const connectDB = require("./database/db");

//Middleware
app.use(express.json());

//To use the router in your main express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", router);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
