const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => { 
    res.render("index");
});

app.get("/read", async (req, res) => {
    let users = await userModel.find(); 
    res.render("read", { users });
});

// ✅ Modified Delete Route
app.get("/delete/:id", async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id); 
    res.redirect("/read");  // Redirect after deleting the specific user
});

app.get("/edit/:userid", async (req, res) => {
    let user = await userModel.findById(req.params.userid);
    res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => { 
    let { name, email, image } = req.body;
    await userModel.findByIdAndUpdate(req.params.userid, { name, email, image });
    res.redirect("/read");  
});

app.post("/create", async (req, res) => { 
    let { name, email, image } = req.body;
    await userModel.create({
        name,
        email,
        image
    });
    res.redirect("/read");
});
app.listen(7000);