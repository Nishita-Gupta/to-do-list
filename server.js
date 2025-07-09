const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'todo_list'
});

db.connect((err) =>{
    if (err) 
        throw err;
    console.log("Connected To Database");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',(req,res) => {
    db.query("SELECT * FROM todos",(err,results) => {
        if (err)
            throw err;
        res.render('index',{todos:results});
    });
});

app.post('/add',(req,res) => {
    const task = req.body.task;
    db.query("INSERT INTO todos (task) VALUES (?) " ,[task], (err) => {
        if (err)
            throw err;
        res.redirect('/');
    });
});

app.post('/delete/:id',(req,res) =>{
    const id = req.params.id;
    db.query("DELETE FROM todos WHERE id = ?", [id],(err) =>{
        if (err)
            throw err;
        res.redirect('/');
    });
});

app.post('/edit/:id',(req,res) =>{
    const updatedTask = req.body.updatedTask;
    const id = req.params.id;
    db.query("UPDATE todos SET task = ? WHERE id = ?",[updatedTask,id], (err) =>{
        if (err)
            throw err;
        res.redirect('/')
    });
});

app.post('/toggle/:id', (req, res) => {
  const id = req.params.id;
  db.query("UPDATE todos SET completed = NOT completed WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});


app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
});