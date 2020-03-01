const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const stylus = require("stylus");

function getFiles(dir, d, files_,) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, d, files_);
        } else {
            files_.push(name.slice(d.length+1));
        }
    }
    return files_;
}
let arr = getFiles("./front/img", "./front/img");


const port = process.env.PORT || 3000;
const app = express();

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");
app.use(stylus.middleware({
    src: __dirname + "/front",
    compile: function(str, path) {
        return stylus(str).set("filename", path);
    }
}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static(__dirname + "/front"));
app.use(express.json({limit: "50mb"}));
const data = require("./data.js");
let animals = data.animals;

app.get("/", function(req, res) {
    res.render("index", {
        head: {
            description: "Main Page",
            keywords: "shop, pets, raccoon",
            title: "PetShop",
            robots: "noindex,nofollow"
        },
        pets: animals
    });
    res.end();
});

const petRouter = require("./routes/friends.js");
const userRouter = require("./routes/people.js");
const imgLoader = require("./routes/loader.js");
app.use("/pet", petRouter);
app.use("/user", userRouter);
app.use("/loader", imgLoader);


const server = http.createServer(app);
server.listen(port);
