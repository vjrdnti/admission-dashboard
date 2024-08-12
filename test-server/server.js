// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(cors());

const user = require('./data/user.json');
const filters = require('./data/filters.json');
const boughtCourses = require('./data/boughtCourses.json');
const courses = require('./data/courses.json');

// Now you can use these constants in your backend code.
console.log(user);
console.log(filters);
console.log(boughtCourses);
console.log(courses);
const news = [{'subhan': 'allah'}];
fs.writeFileSync('./data/boughtCourses.json', JSON.stringify(news, null, 2), 'utf-8');


