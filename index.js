const express=require("express");
const app=express();
const port=8080;
app.use(express.static("public"));
app.set("view engine","ejs");
app.get("/",(req,res)=>{
 res.render("home page");
});
app.get("/ig/:username",(req,res)=>{
    let{ username }=req.params;
   const insta=require("./data.json");
   console.log(insta);
   const data=insta[username];
   if(data){
    res.render("home.ejs",{ data});
   }else{
    res.render("error.ejs");
   }
   });
   

app.listen(port,()=>{
    console.log(`the app is listening${port}`);
});