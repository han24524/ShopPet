require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

// tên đăng nhập và mật khẩu database
const nameAdmin = process.env.NAME;
const passDB = process.env.PASS_DB;

mongoose.set('strictQuery', false);

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://'+nameAdmin+':'+passDB+'@cluster0.0vhqbnh.mongodb.net/shopPetDB');
    } catch (error) {
        console.log('Connect failure');
    }
}

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

connect();

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

const productsSchema = new mongoose.Schema({
    index: String,
    pricture: String,
    title: String,
    content: String,
    price: Number
});

const Product = new mongoose.model("Product", productsSchema);

var tenTK = "";

app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("index", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("index", {taiKhoan: "khong"});
    }
});

app.get("/thongBao", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("thongbao", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("thongbao", {taiKhoan: "khong"});
    }
});

app.get("/gioHang", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("giohang", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("giohang", {taiKhoan: "khong"});
    }
});

app.get("/shopCho", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("shopCho", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("shopCho", {taiKhoan: "khong"});
    }
});

app.get("/cho", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("cho", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("cho", {taiKhoan: "khong"});
    }
});

app.get("/doAnCho", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("doAnCho", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("doAnCho", {taiKhoan: "khong"});
    }
});

app.get("/phuKienCho", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("phuKienCho", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("phuKienCho", {taiKhoan: "khong"});
    }
});

app.get("/shopMeo", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("shopMeo", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("shopMeo", {taiKhoan: "khong"});
    }
});

app.get("/meo", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("meo", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("meo", {taiKhoan: "khong"});
    }
});

app.get("/doAnMeo", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("doAnMeo", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("doAnMeo", {taiKhoan: "khong"});
    }
});

app.get("/phuKienMeo", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("phuKienMeo", {taiKhoan: "co", tenTK: tenTK});
    } else {
        res.render("phuKienMeo", {taiKhoan: "khong"});
    }
});

app.get("/dangNhap", function(req, res) {
    var mes = req.session.messages;
    if (typeof(mes) === "object") {
        mes = mes[0];
    };
    res.render("dangnhap", {err: mes});
});

app.post("/dangNhap", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/dangNhap", {err: req.session.messages});
        } else {
            passport.authenticate("local", {failureRedirect: "/dangNhap", failureMessage: true})(req, res, function() {
                tenTK = req.body.username;
                res.redirect("/");
            });
        }
    });
});

var mes = "khong";
app.get("/dangKy", function(req, res) {
    res.render("dangky", {err: mes});
    mes = "khong";
});

app.post("/dangKy", function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var checkPasswork = req.body.checkPassword;

    if (password != checkPasswork) {
        mes = "matKhau";
        res.redirect("/dangKy");
    } else {
        User.findOne({username: username}).then(function(foundUser) {
            if (!foundUser) {
                User.register({username: username, email: email}, password).then(function(user) {
                    passport.authenticate("local")(req, res, function() {
                        tenTK = username;
                        res.redirect("/");
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.redirect("/dangKy");
                });
            } else {
                mes = "tonTai";
                res.redirect("/dangKy");
            }
        });
    }
});

app.get("/cho/:sanPham", function(req, res) {
    if (req.isAuthenticated()) {
        const requestedSanPham = req.params.sanPham;
        Product.findOne({index: requestedSanPham}).then(function(foundProduct) {
            res.render("sanPham", {
                taiKhoan: "co", 
                tenTK: tenTK,
                pricture: foundProduct.pricture,
                title: foundProduct.title,
                content: foundProduct.content,
                price: foundProduct.price
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        const requestedSanPham = req.params.sanPham;
        Product.findOne({index: requestedSanPham}).then(function(foundProduct) {
            res.render("sanPham", {
                taiKhoan: "khong",
                pricture: foundProduct.pricture,
                title: foundProduct.title,
                content: foundProduct.content,
                price: foundProduct.price
            });
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.get("/meo/:sanPham", function(req, res) {
    if (req.isAuthenticated()) {
        const requestedSanPham = req.params.sanPham;
        Product.findOne({index: requestedSanPham}).then(function(foundProduct) {
            res.render("sanPham", {
                taiKhoan: "co", 
                tenTK: tenTK,
                pricture: foundProduct.pricture,
                title: foundProduct.title,
                content: foundProduct.content,
                price: foundProduct.price
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        const requestedSanPham = req.params.sanPham;
        Product.findOne({index: requestedSanPham}).then(function(foundProduct) {
            res.render("sanPham", {
                taiKhoan: "khong",
                pricture: foundProduct.pricture,
                title: foundProduct.title,
                content: foundProduct.content,
                price: foundProduct.price
            });
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.get("/dangXuat", function(req, res) {
    req.logout(function(err) {
        if (err) { 
            console.log(err); 
        } else {
            tenTK = '';
            res.redirect("/");
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});