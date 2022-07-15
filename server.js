const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors");
const { rename } = require("fs");
require('dotenv').config();

mongoose.connect('mongodb+srv://sathvika:malathi24@cluster0.c0qibzd.mongodb.net/users?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true},(err,db)=>{
    if(!err){
        console.log("connection is successful");
    }
    else{
        console.log(err);
    }
})

var schme1=new mongoose.Schema({
    username:{
        type:String,
        required:"this field is required"
    },
    mobile_no:{
        type:String,
        
    },
    acc_num:{
        type:String
    },
    balance:{
        type:Number
    }
})

mongoose.model("user_info",schme1)

var schme2=new mongoose.Schema({
    sender_name:{
        type:String
    },
    sender_accno:{
        type:String
    },
    receiver_name:{
        type:String
    },
    receiver_accno:{
        type:String
    },
    money:{
        type:Number
    }
})
mongoose.model("transction",schme2)

var user=mongoose.model("user_info");
var trans=mongoose.model("transction")


const app=express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors())

app.listen(process.env.PORT || 7000 ,()=>{
    console.log("server is running successfully running on port");

})

app.post("/table",(req,res)=>{
    user.find({},(err,data)=>{
        if(!err){
            res.send({users:data})
        }
        else{
            res.send(err)
        }
    })


})

app.get("/",(req,res)=>{
    res.send("backend server")
})

app.post("/transfer",(req,res)=>{
    
    
    user.find({username:req.body.sname,acc_num:req.body.sacc_no},(err,data)=>{
       
        
        if(Object.keys(data).length > 0){
            user.find({username:req.body.rname,acc_num:req.body.racc_no},(err,data1)=>{
                
                
                if(!err){
                   
                    if(Object.keys(data1).length >0){
                      
                        
                    
                        if(req.body.money <= data[0].balance){
                           user.findByIdAndUpdate(data[0]._id,{$inc : {balance : -req.body.money}},(err,data)=>{
            
                            if(!err){
                                user.findByIdAndUpdate(data1[0]._id,{$inc : {balance : req.body.money}},(err,data)=>{
                                    if(!err){
                                        trans.insertMany({sender_name:req.body.sname,sender_accno:req.body.sacc_no,receiver_name:req.body.rname,receiver_accno:req.body.racc_no,money:req.body.money},(err,doc)=>{
                                            if(err){
                                                res.send(err)
                                            }
                                            else{
                                                console.log("tranc okk")
                                            }
                                        })
                                        res.send({message:"TRANSCTION SUCCESSFUL"})
                                       

                                    }
                                    else{
                                        res.send(err)
                                    }
                                })

                            }
                            else{
                                res.send(err)
                                
                            }
                           })
                        }
                        else{
                           res.send({message:"INSUFFICIENT BALANCE IN SENDERS ACCOUNT"})
                        }
                    

                    }
                    else{
                        res.send({message:"INCORRECT DETAILS"})
                    }
                    
                }

            })


        }
        else{
           res.send({message:"INCORRECT DETAILS"})
           

        }
    })
})

app.post("/transctions",(req,res)=>{
    trans.find({},(err,data)=>{
        if(!err){
            res.send({trans:data})
        }
        else{
            res.send(err)
        }
    })


})


