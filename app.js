require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/shopPetDB');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/thongbao", function(req, res) {
    res.render("thongbao");
});

app.get("/giohang", function(req, res) {
    res.render("giohang");
});

app.get("/shopCho", function(req, res) {
    res.render("shopCho");
});

app.get("/cho", function(req, res) {
    res.render("cho");
});

app.get("/doAnCho", function(req, res) {
    res.render("doAnCho");
});

app.get("/phuKienCho", function(req, res) {
    res.render("phuKienCho");
});

app.get("/shopMeo", function(req, res) {
    res.render("shopMeo");
});

app.get("/meo", function(req, res) {
    res.render("meo");
});

app.get("/doAnMeo", function(req, res) {
    res.render("doAnMeo");
});

app.get("/phuKienMeo", function(req, res) {
    res.render("phuKienMeo");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            });
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    User.register({username: req.body.username, email: req.body.email}, req.body.password).then(function(user) {
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    }).catch(function(err) {
        console.log(err);
        res.redirect("/register");
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});