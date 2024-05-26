const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const util = require('util');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User "+username+" successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User "+username+ " already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Missing username or password"});
});


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}



// Get the book list available in the shop

public_users.get('/', function (req, res) {
  fetchBooks()
      .then(books => {
          res.send(JSON.stringify(books, null, 4));
      })
      .catch(err => {
          res.status(500).json({ error: err.toString() });
      });
});

function fetchBooks() {
    return new Promise((resolve, reject) => {
      // Simulating async operation
      setTimeout(() => {
          resolve(books);
      }, 1000);
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  fetchBooksBasedOnIsbn()
  .then(books => {
          res.send(books[isbn]);
  })
  .catch(err => {
      res.status(500).json({ error: err.toString() });
  });
 
 });

 function fetchBooksBasedOnIsbn() {
  return new Promise((resolve, reject) => {
    // Simulating async operation
    setTimeout(() => {
        resolve(books);
    }, 1000);
});
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    const keys= Object.keys(books);
    const requestedAuthors=[];
    fetchBooksBasedOnAuthor()
    .then(books => {
      keys.forEach(key => {
        if(books[key].author === author)
       {
               requestedAuthors.push(books[key]);
              
       }
   });
     return res.send(requestedAuthors);
})
.catch(err => {
  res.status(500).json({ error: err.toString() });
});

});
   
function fetchBooksBasedOnAuthor() {
  return new Promise((resolve, reject) => {
    // Simulating async operation
    setTimeout(() => {
        resolve(books);
    }, 1000);
});
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title=req.params.title;
    const keys= Object.keys(books);
    const requestedTitles=[];
    fetchBooksBasedOnTitle()
    .then(books => {
      keys.forEach(key => {
       if(books[key].title === title)
      {
              requestedTitles.push(books[key]);
             
      }
  });
    return res.send(requestedTitles);
})
.catch(err => {
  res.status(500).json({ error: err.toString() });
});

});
   
function fetchBooksBasedOnTitle() {
  return new Promise((resolve, reject) => {
    // Simulating async operation
    setTimeout(() => {
        resolve(books);
    }, 1000);
});
}
   
 
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);

});

module.exports.general = public_users;
