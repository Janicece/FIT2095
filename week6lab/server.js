//Import packages
const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const morgan = require('morgan');

// Configure Express
const app = express();
let iurl = require('url');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('images'));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));
app.listen(8080);


//Configure MongoDB
const MongoClient = mongodb.MongoClient;

//Configure URL
const url = "mongodb://localhost:27017/";

//reference to the database(i.e. collection)
let db;
//connect to mongoDB.server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
            
        }
    });

//Routes Handlers

//Insert new User
//GET request: send page to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
//POST request: receive the details from the clients and insert new document(i.e. object) to the collection (i.e. table)
app.post('/addnewtask', function (req, res) {
    let taskDetails = req.body;
    taskid=Math.round(Math.random()*1000000);
    db.collection('task').insertOne({TaskID:taskid,Taskname: taskDetails.taskname, assign_to: taskDetails.assignto, Due_date: new Date(taskDetails.duedate),task_status: taskDetails.taskstatus,task_description: taskDetails.taskdescription});
    res.redirect('/gettasks'); // redirect client to list users page
});

app.get('/gettasks', function (req, res) {
    db.collection ('task').find({}).toArray(function (err, data) {
        res.render('listtasks', { tasksDb: data });
    });
});

//Update user:
//GET request: send the page to the client
app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updatetask.html');
});

//POST request: receive the details from the client and do the update
app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;  
    let filter = {TaskID: parseInt(taskDetails.taskID)};
    
    let theUpdate = {$set:{task_status: taskDetails.taskstatus}};
    db.collection('task').updateOne(filter, theUpdate);
    res.redirect('/gettasks');// redirect the client to list users page
})



//Delete user:

app.get('/deletetasks', function (req, res) {
    res.sendFile(__dirname + '/views/deletetasks.html');
});
//POST request: receive the user's name and do the delete operation
app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { TaskID: parseInt(taskDetails.taskID) };
    console.log(taskDetails)
    console.log(filter)

    db.collection('task').deleteOne(filter);
    res.redirect('/gettasks');// redirect the client to list users page
});
app.get('/deletealltasks', function (req, res) {
   
    db.collection('task').find({}).toArray(function (err, data) {
    res.render('deleteall', { tasksDb: data });
    })
});
app.post('/deletealldata', function (req, res) {
    db.collection('task').deleteMany({});
    res.redirect('/gettasks');// redirect the client to list users page
});


app.get('/insertMany', function (req, res) {
    res.sendFile(__dirname + '/views/insertMany.html');
});
app.post('/insertManydata', function (req, res) {
    let taskDetails = req.body;
    number=taskDetails.number
    
    var i;
    for (i = 0; i < number; i++) { 
        taskid=Math.round(Math.random()*1000000);
        db.collection('task').insertOne({TaskID:taskid,Taskname: taskDetails.taskname, assign_to: taskDetails.assignto, Due_date: taskDetails.duedate,task_status: taskDetails.taskstatus,task_description: taskDetails.taskdescription});

    } 
     
        
    res.redirect('/gettasks'); // redirect the client to list users page
});

app.get('/deleteOldComplete',function(req,res){
    res.sendFile(__dirname + '/views/deleteOldComplete.html');
});
app.post('/deleteOldComplete',function(req,res){
    let today = new Date();
    let date = today.getFullYear()+ '-' +today.getMonth()+ '-' + today.getDate();
    let d2 = new Date();
    db.collection('task').deleteMany({$and:[{task_status:'Complete'},{Due_date:{$lt:d2}}]},function(req,obj){
        console.log(obj.result);
        
    });
    res.redirect('/gettasks'); //redirect the client to list users page
});
