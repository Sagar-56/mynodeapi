let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
// const mongoUrl = "mongodb://localhost:23476"
const dotenv = require('dotenv')
dotenv.config()
let port = 4356;
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

// app.get('/productData/:id', (req,res) => {
//     let id = req.params.id;
//     console.log(">>>>id",id);
//     db.collection('productData').find().toArray((err,result) => {
//        if(err) throw err;
//        res.send(result);
//  })
// })
app.get('/productData/', (req,res) => {
    // let id = req.params.id;
    let id = req.query.id;
    console.log(">>>>id",id);
    db.collection('productData').find().toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
// })
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

//delete Data

// db.orders.remove({'_id':"6255331d2afe184ceb6f7145"})
// db.orders.remove({"phone":7077371197})

//Update

// db.orders.updateOne(
//     {_id:"6255345232f4f1a37bd9678b"},
//     {
//         $set:{
//             "status":"Delivered",
//             "bank": "SBI"
//         }
//     }
// )
// db.orders.updateOne(
//     {_id:"6255345232f4f1a37bd9678b"},
//     {
//         $unset:{
//             "meniItem":""
//         }
//     }
// )


//bank update

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

app.delete('/deleteOrders', (req,res) => {
    db.collection('orders').remove({},(err,result) => {
        res.send('Orders Deleted')
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

app.get('/productDetails/:id', (req,res) => {
//    let productId = Number(req.params.id)
let productId = mongo.ObjectId(req.params.id)
    db.collection('productDetails').find({_id:productId}).toArray((err,result) => {
       if(err) throw err;
       res.send(result);
 })
})

// app.get('/productdetails',(req,res) => {
//     db.collection('productDetails').find().toArray((err,result) => {
//         if(err) throw err;
//         res.send(result);
//     })
// })
    