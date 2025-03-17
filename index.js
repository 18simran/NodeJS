const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { faker, fa } = require("@faker-js/faker");
const mysql = require("mysql2");
const port = 5000;
const path = require("path");
const methodOverride = require("method-override");
const exp = require("constants");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "new_app",
  password: `${process.env.PASSWORD}`,
});
// let q = "SELECT * FROM TEMP";
// let users = [
//   ["654", "siraj", "siraj@gmail.com", "451237"],
//   ["145", "janvi", "janvi@gmail.com", "254687"],
// ];
let getRandomUser = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }
  return users;
};
const fakeUsers = getRandomUser(100);

// connection.end(); don't need to write in routes

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user_data`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      const count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }
});
//show route
app.get("/user", (req, res) => {
  let q = `select * from user_data`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("show_user.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }
});
//edit route
app.get("/user/:id/edit", (req, res) => {
  const { id } = req.params;
  let q = `select * from user_data where id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }
});
//update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user_data WHERE id='${id}' `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        q2 = `UPDATE user_data SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

app.listen(port, (err, res) => {
  console.log("connected on 5000");
});
