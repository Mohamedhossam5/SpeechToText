const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const app = express();


app.use(express.json());

app.set("view engine", "ejs");

const uri =
  "mongodb+srv://mohamedhossam1044:JCGcKtYFWRBtHAut@cluster0.syupowe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const store = new mongodbStore({
  uri: uri,
  collection: "sessions",
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "FAfawdfqwefaco01Nc",
    resave: "false",
    saveUninitialized: false,
    store: store,
  })
);

app.use(cors({
  origin: "*",
}));

// const adminRoutes = require("./routes/admin");
const noteRoutes = require("./routes/note");
const authRoutes = require("./routes/auth");

// app.use(adminRoutes);
app.use("/api/notes",noteRoutes);
app.use("/api/auth",authRoutes);

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(3000);
    console.log("Connected woohooo!");
  })
  .catch((err) => {
    console.log(err);
    throw "Database issues";
  });
