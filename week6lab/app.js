//1- Ref -->MongoDB Module
let mongodb=require("mongodb");
let express=require("express");
let bodyParser=require('body-parser');

//2- get client form the Refget access todb from the client
let mongodbClient=mongodb.MongodbClient;

let app=express();
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

//3- get access to db from client
let url="mongodb//localhost:27017/";
let viewsPath=__dirname+"viewsPathname";
let db=null;
let col=null;

mongodbClient.connect(url,{useNewUrlParser: true},function(err,client){

db=client.db("fit2095")
col=db.collection("week5table");
//col.insertOne({name:"Tim",age:23});
//col.insertOne({name:"gohn",address:Mel});
});


app.get('/',function(req,res){
    col.insertOnecol({name:"gohn",address:Mel});
    res.sendFile(viewsPath+"index.html")
});
app.post('/newCustomer',function(req,res){
    col.insertOne(req.body);
    res.sendFile(viewsPath+"index.html")
});
app.get('/getall',function(req,res){
    col.find({}).toArray()(function(err,data){
            res.send(data);
    })
})
app.listen(8080);


//4- get access to collection from db 

//5- call insert, update,delete,find from collection