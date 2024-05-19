const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app=express();
const { v4: uuidv4 } = require("uuid");
const path=require("path");
const methodOverride= require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"/views"));
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"hpww",
    password:"vishal55yadav"
});
let createRandomUser =()=> {
    return [
       faker.datatype.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
      
    ];
  }
  //home page
app.get("/",(req,res)=>{
  let q="select count(*) from user";
  try{
   connection.query(q,(err,result)=>{
        if(err)throw err;
        let count=(result [0]["count(*)"]);
        res.render("home.ejs",{count});
    });
} catch (err){
   console.log(err);
   res.send(err);;
  }
  
});
 

//show route
app.get("/user",(req,res)=>{
  let q="select * from user ";
  try{
    connection.query(q,(err,users)=>{
         if(err)throw err;
         res.render("show.ejs",{users});
     });
 } catch (err){
    console.log(err);
    res.send(err);;
   }
})
//add route 

app.get("/user/new",(req,res)=>{
  res.render("add.ejs");
});
app.post("/user/new",(req,res)=>{
  let{email,username,password}=req.body;
  let id =uuidv4();
  let q = `INSERT INTO user (id, email, username, password) VALUES ('${id}','${email}','${username}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }

});
//edit route
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q="select * from user where id=?"
  try{
    connection.query(q,id,(err,result)=>{
         if(err)throw err;
         let user=result[0];
         res.render("edit.ejs",{user});
     });
 } catch (err){
    console.log(err);
    res.send(err);;
   }
})
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formpass, username:newusername}=req.body;
  let q="select * from user where id=?"
  try{
    connection.query(q,id,(err,result)=>{
         if(err)throw err;
         let user=result[0];
         if(formpass!= user.password){
          res.send("wrong password try again !");
         }else{
          let q2="update user set username=? where id=?";
          connection.query(q2,[newusername,id],(err,result)=>{
             if (err) throw err;
             res.redirect("/user");
          });
         }
         
     });
 } catch (err){
    console.log(err);
    res.send(err);;
   }
})
app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q= "select*from user where id=?";
  try{
    connection.query(q,id,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      res.render("delete.ejs",{user});

    });
    
  }catch(err){
   console.log(err);
   res.send(err);
  }

})
app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});


app.listen("8080",()=>{
    console.log("working is proper");
});
