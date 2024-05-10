const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const methodoverride=require("method-override");

app.use( express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
let posts=[
    {
        id: uuidv4(),
        username:"Vishal yadav",
        content:"I love coding"
    },
    {
        id: uuidv4(),
       username:"Akshita yadav",
       content:"Hard work is important to achieve success"
    },
    {
        id: uuidv4(),
        username:"Ansh agrawal",
        content:"I got selected for my 1st internship !"
    },
];
app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
})
app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
})
app.post("/posts",(req,res)=>{
  let{username,content}=req.body;
  let id=uuidv4();
  posts.push({id,username,content});
  res.redirect("/posts");
})
app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let post =posts.find((p)=>id === p.id);
    res.render("show.ejs",{post})
});

app.patch("/posts/:id",(req,res)=>{
 let {id}=req.params;
  let newcontent=req.body.content;
  let post =posts.find((p)=>id === p.id);
  post.content=newcontent;
  console.log(post);
  res.redirect("/posts");
})

app.get("/posts/:id/edit",(req,res)=>{
   let{id}=req.params;
   let post =posts.find((p)=>id === p.id);
   res.render("edit.ejs",{post});
});
 app.delete("/posts/:id",(req,res)=>{
    let{id}=req.params;
     posts =posts.filter((p)=>id !== p.id);
     res.redirect("/posts");
 })
app.listen(port,()=>{
    console.log("app listen:8080");
})

