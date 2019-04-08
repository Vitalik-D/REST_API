const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));
app.get("/api/users", function(req, res){

    const content = fs.readFileSync("users.json", "utf8");
    const users = JSON.parse(content);
    res.send(users);
});
app.get("/api/users/:id", function(req, res){

    let id = req.params.id; // получаем id
    const content = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(content);
    let user = null;
    for(let i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
app.post("/api/users", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {name: userName, age: userAge};

    let data = fs.readFileSync("users.json", "utf8");
    const users = JSON.parse(data);

    const id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    user.id = id+1;
    users.push(user);
    data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
});
app.delete("/api/users/:id", function(req, res){

    const id = req.params.id;
    const data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    let index = -1;
    for(let i=0; i<users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        const user = users.splice(index, 1)[0];
        const data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
app.put("/api/users", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    const data = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(data);
    let user;
    for(let i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    if(user){
        user.age = userAge;
        user.name = userName;
        const data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});

app.listen(3000, function(){
    console.log("Loading...");
});