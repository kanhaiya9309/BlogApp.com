import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { Blog,defaultBlogs } from "../Model/blogModel.js"

const routes = express.Router();




routes.get("/", function (req, res) {
    // Find all items in the database and render them
  
  
    Blog.find({}).then(function(FoundItems){
      if(FoundItems.length === 0){
  
        Blog.insertMany(defaultBlogs)
        .then(function () {
          console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
       res.redirect("/");
      } else{
        res.render("index.ejs", {posts:FoundItems});
  
      }
    })
     .catch(function(err){
      console.log(err);
    })
  
  });


routes.get('/modify', (req, res) => {
    res.render('modify.ejs',{heading:"New Post",submit:"Create Post"});
  });
 
routes.post("/create", function (req, res) {
  const currentDate = new Date();
  const options = { 
     year: 'numeric', 
     month: 'numeric', 
     day: 'numeric', 
     hour: 'numeric', 
     minute: 'numeric', 
     second: 'numeric', 
     timeZoneName: 'short' 
  };
const blogDate = currentDate.toLocaleString(undefined, options);

    const blogtitle = req.body.title;
    const blogcontent = req.body.content;
    const blogauthor = req.body.author;

    const newBlog = new Blog({
        title: blogtitle,
        content: blogcontent,
        author: blogauthor,
        date: blogDate
    });

    console.log(newBlog);

    newBlog.save()
        .then(function () {
          console.log("Successfully saved new items to DB");
          res.redirect("/");
        })
        .catch(function (err) {
          console.log(err);
        });
});


routes.get("/delete/:_id", function(req, res){
        const blogId = req.params._id;
      
        Blog.findByIdAndRemove(blogId)
          .then(function(){
            console.log("Successfully deleted");
            res.redirect("/");
        })
        .catch(function(err){
            console.log(err);
        });
    });
    
routes.get('/edit/:_id', (req, res) => {
        const postId = req.params._id;
      
        // Fetch the post from the database by ID
        Blog.findById(postId)
        .then(function(post){
            res.render('modify.ejs', {heading:"Edit Post",submit:"Save Post", post});
        })
        .catch(function(err){
            console.log(err);
        });
      });

routes.post('/update/:id', async (req, res) => {
        const postId = req.params.id;
        const updatedTitle = req.body.title;
        const updatedContent = req.body.content;
        const updateAuthor =req.body.author ;
      
        try {
          // Use Mongoose to update the post with the new content
          const updatedPost = await Blog.findByIdAndUpdate(postId, { title: updatedTitle, content: updatedContent , author:updateAuthor});
      
          if (!updatedPost) {
            // Handle the case where the post with the given ID was not found
            return res.status(404).send('Post not found');
          }
      
          // Redirect to the post details page or another appropriate page
          res.redirect("/");
        } catch (error) {
          // Handle errors
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });


export default routes