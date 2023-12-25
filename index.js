
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import { Blog,defaultBlogs } from "./Model/blogModel.js";
import {port,mongooseUrl} from "./config.js"
import routes from "./Routes/blogRoutes.js"


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/",routes)




mongoose.connect(mongooseUrl)
 .then(()=>{
   console.log("Database is connected");
   app.listen(port, function () {
    console.log(` Server started on ${port}` );
  })
})
  .catch((error)=>{
    console.log(error);
  })


 

          

 
  