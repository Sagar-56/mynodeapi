let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv')
dotenv.config()
let port = process.env.PORT || 4356;
const mongoUrl = "mongodb://localhost:27017";
const mongoLiveUrl = "mongodb+srv://Sagarbehera:Sagar456@cluster0.96hmj.mongodb.net/eduInternJan?retryWrites=true&w=majority";
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("Let's Express")
})

MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log(`Error While Connecting`);
    db = client.db('eduInternJan');
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
})

app.get('/productData/', (req,res) => {
    // let id = req.params.id;
    let id = req.query.id;
    console.log(">>>>id",id);
    db.collection('productData').find().toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})
app.get('/productDetails', (req,res) => {
    let query = {};
    let stateId = Number(req.query.State_id);
    let pId = Number(req.query.p_id);
    let productId = Number(req.query.Product_id);
    if(stateId){
        query = {State_id:stateId};
    }else if(pId){
        query = {'package_size.p_id':pId};
    }else if(productId){
        query = {Product_id:productId}
    }
    db.collection('productDetails').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})


app.get('/viewOrder', (req,res) => {
    let query= {};
     let email = req.query.email;
     if(email){
         query = {'email':email}
     }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menuItem', (req,res) => {
    console.log(req.body);
if(Array.isArray(req.body)){
    db.collection('productDetails').find({Product_id:{$in:req.body}}).toArray((err,result) => {
      if(err) throw err;
      res.send(result);
    })
}else{
    res.send('Invalid Input')
}
})

    