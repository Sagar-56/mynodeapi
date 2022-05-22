let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config(); 
let port = process.env.PORT || 4356;
const mongoUrl = "mongodb+srv://Sagarbehera:Sagar456@cluster0.96hmj.mongodb.net/eduInternJan?retryWrites=true&w=majority";
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("Let's Express")
})

MongoClient.connect(mongoUrl, (err, client) => {
    if(err) console.log(`Error While Connecting`);
    db = client.db('eduInternJan');
    app.listen(port,() => {
        console.log(`server is running on port ${port}`)
    })
})

app.get('/productData', (req,res) => {
    let query = {};
    let id = req.query.id;
    console.log(`id is ${id}`);
    db.collection('productData').find(query).toArray((err,result) => {
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


app.get('/cashbackdetails', (req,res) => {
    let query = {};
    let stateId = Number(req.query.state_id);
    let cashbackId = Number(req.query.cashback_id);
    if(stateId){
        query = {state_id:stateId};
    }
    else if(cashbackId){
        query = {cashback_id:cashbackId}
    }
    db.collection('cashbackdetails').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})


app.get('/dealsdata', (req,res) => {
    let query = {};
    let stateId = Number(req.query.state_id);
    let dealsId = Number(req.query.deals_id);
    if(stateId){
        query = {state_id:stateId};
    }
    else if(dealsId){
        query = {deals_id:dealsId}
    }
    db.collection('dealsdata').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})

app.get('/feature', (req,res) => {
    let query = {};
    let stateId = Number(req.query.state_id);
    let featureId = Number(req.query.feature_id);
    if(stateId){
        query = {state_id:stateId};
    }
    else if(featureId){
        query = {feature_id:featureId}
    }
    db.collection('feature').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})


app.get('/healthArticle', (req,res) => {
    let query = {};
    let stateId = Number(req.query.state_id);
    let healthId = Number(req.query.health_id);
    if(stateId){
        query = {state_id:stateId};
    }else if(healthId){
        query = {health_id:healthId};
    }
    db.collection('healthArticle').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})


app.get('/price', (req,res) => {
    db.collection('price').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/productLists', (req,res) => {
    let query = {};
    let stateId =  Number(req.query.State_id);
    let categoryId = Number(req.query.Category_id);
    if(stateId){
        query ={State_id:stateId}
    }
    if(categoryId){
        query = {Category_id:categoryId}
    }
    db.collection('productLists').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})


// bank update

app.put('/bankUpdate/:id', (req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('orders').updateOne(
        {_id:oId},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bankName
            }},(err,result) => {
            if(err) throw err;
           res.send(`status updated to ${req.body.status}`)
        })
})


app.post('/placeOrder', (req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('orderPlaced')
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



    