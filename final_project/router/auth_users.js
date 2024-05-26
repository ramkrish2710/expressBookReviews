const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password)=>{
   //returns boolean
  //code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User " +username+ " successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check your username and password"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.query.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];
  const reviews = [];
  const _ = require('lodash');
  if (!isbn || !review || !username) {
    res.status(400).send('Missing parameters');
    return;
  }

  // Check if the user has already posted a review for the given ISBN
      if(!_.isEmpty(books[isbn].reviews)){
       // Modify the existing review

       const reviews = books[isbn].reviews;
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].username === username) {
        reviews[i].review = review;

      }
      else{
        reviews.push({"username":username,"review":review});
        books[isbn].reviews=reviews; 
    
      }
    }  
    res.send(`Review modified successfully for ${books[isbn].title}`);
  } 
  else {
      // Add a new review
    if (_.isEmpty(books[isbn].reviews)) {
      reviews.push({"username":username,"review":review});
      books[isbn].reviews=reviews; 
     
    }
    
    res.send(`Review added successfully for ${books[isbn].title}`);
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.query.isbn;
  const username = req.session.authorization['username'];
  books[isbn].reviews = (books[isbn].reviews).filter((review) => review.username != username);
  res.send(`Book review of  ${username} deleted for ${books[isbn].title}.`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
