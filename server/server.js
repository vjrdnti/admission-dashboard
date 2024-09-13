//import { MongoClient, ObjectId } from 'mongodb';
//import bodyParser from 'body-parser';
//import multer from 'multer';
//import path from 'path';
//import { fileURLToPath } from 'url';

// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());
//app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(cors());
fs.writeFileSync(path.join(__dirname, './data/user.json'), JSON.stringify('[]', null, 2), 'utf-8');
const users = require('./users.json');
let len = users.length;
//const boughtCourses = require('./data/boughtCourses.json');
let cart = [];

////login logic

app.post('/api/register', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  let newUser = {};
  newUser = req.body;
  //console.log('new user');
  //console.log(newUser);
  len = len+1;
  newUser.id = len;
  users.push(newUser);
  //fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), 'utf-8');
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    try {
      fs.writeFileSync(path.join(__dirname, './data/user.json'), JSON.stringify(user, null, 2), 'utf-8');
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error writing to user.json:', error);
      res.status(500).json({ success: false, message: 'Error saving user data' });
    }
  } else {
    res.json({ success: false });
  }
});

////login end

app.get('/api/user', (req, res) => {
  try {
    const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
    //console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error reading user.json:', error);
    res.status(500).json({ success: false, message: 'Error reading user data' });
  }
});

app.get('/api/filters', (req, res) => {
  let filters = JSON.parse(fs.readFileSync('./data/filters.json'));
  res.status(200).json(filters);
});

app.get('/api/courses', (req, res) => {
  const courses = JSON.parse(fs.readFileSync('./data/courses.json'));
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const { degree, branch, district } = req.query;
  //console.log(degree);
  let filteredCourses = courses.filter(course => course.status === 'verified');
  filteredCourses = courses.filter(course => course.cutoff <= user.percentile);
  console.log(user.percentile);
  if(degree){
   filteredCourses = filteredCourses.filter(course => course.title === degree);
  }
  if (branch) {
    const branchArray = branch.split(',');
    //console.log(branchArray);
    filteredCourses = filteredCourses.filter(course => branchArray.includes(course.branch));
  }

  if (district) {
  	const districtArray = district.split(',');
    filteredCourses = filteredCourses.filter(course => districtArray.includes(course.district));
  }

  res.status(200).json(filteredCourses);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/api/cart', (req, res) => {
  
  res.status(200).json(cart);
});

app.get('/api/purchases', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const boughtCourses = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  res.status(200).json(boughtCourses.filter(item => item.user.id === user.id));
});


app.get('/api/college-posts', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const postedCourses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  res.status(200).json(postedCourses.filter(item => item.college === user.college));
});


app.get('/api/college-courses-sold', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const boughtCourses = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  res.status(200).json(boughtCourses.filter(item => item.course.college === user.college));
});

app.post('/api/college-posts', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const postedCourses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  const { updatedCourses } = req.body;
  //console.log("durr durr*******");
  //console.log(updatedCourses);
  //console.log("durr durr*******");
  if (updatedCourses) {
  let final = [];
    try {
      for (var course of postedCourses)
      //console.log(course); 
		{
		  if(course.college !== user.college){
		  	final.push(course);
		  }
		  else{
		  	if(updatedCourses.find(item => item.id === course.id)){
		  		final.push(course);
		  	}
		  	else{
		  		console.log(course);
		  	}
		  }
		}
      fs.writeFileSync(path.join(__dirname, './data/courses.json'), JSON.stringify(final, null, 2), 'utf-8');
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error writing to user.json:', error);
      res.status(500).json({ success: false, message: 'Error saving user data' });
    }
  } else {
    res.json({ success: false });
  }

});

app.post('/api/cart', (req, res) => {
  //console.log(res.json(cart));
  const { course } = req.body;
  //if(cart.length!==0){
  if (!cart.find(item => item.id === course.id)) {
    cart.push(course);
  }
  //res.status(200).json(cart);
  //}
  res.status(200).json(cart);
});

app.delete('/api/cart', (req, res) => {
  const { courseId } = req.body;  
  cart = cart.filter(item => item.id !== courseId);
  res.status(200).json(cart);
});

app.delete('/api/logout', (req, res) => {
  cart = [];
  res.status(200).json(cart);
});


app.post('/api/purchasesp', (req, res) => {
  const { invoice } = req.body;
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  let boughtCourses  = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  let courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  cart.forEach(item => {
	const row = {'user': user, 'course': item, 'invoice': invoice};
	boughtCourses.push(row);	
	//console.log(row);
	courses.forEach(upd =>{
	  if(upd.id===item.id){
	  	upd.count+=1;
	  }
	 });
  });
  fs.writeFileSync('./data/courses.json', JSON.stringify(courses, null, 2), 'utf-8');
  fs.writeFileSync('./data/boughtCourses.json', JSON.stringify(boughtCourses, null, 2), 'utf-8');
  while(cart.length > 0) {
    cart.pop();
   }
  res.status(200);
});


app.post('/api/add-course', (req, res) => {
  const newCourse = req.body;
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  newCourse.college = user.college;
  newCourse.status= 'unverified';
  let courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  //console.log(newCourse);
  newCourse.id = courses[courses.length-1].id + 1;
  //console.log(newCourse);
  //console.log('executed');
  if(!courses.find(item => item === newCourse)){
   console.log(newCourse);
   courses.push(newCourse);
   fs.writeFileSync('./data/courses.json', JSON.stringify(courses, null, 2));
   res.status(200).json({ success: true });
   }
});

app.get('/api/courses-admin', (req, res) => {
	try{
   		 const data = fs.readFileSync('./data/courses.json', 'utf8');
   		 res.status(200).send(JSON.parse(data));
        }
    catch (error){
        res.status(500).send('Error reading courses file');
    }
    });

// API to update course status
app.post('/api/courses-admin', (req, res) => {
    try{
    	const updatedCourses = req.body;
		//let courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf8'));
		//courses = courses.map(course => course.id === updatedCourse.id ? updatedCourse : course);
		const branches = [...new Set(updatedCourses.map(course => course.branch))];
		const districts = [...new Set(updatedCourses.map(course => course.district))];
		fs.writeFileSync('./data/courses.json', JSON.stringify(updatedCourses, null, 2), 'utf8');
		res.status(200).send('Course updated successfully');
		
		const filters = {
        branches: branches.sort(),
        districts: districts.sort()
    	};
    	fs.writeFileSync('./data/filters.json', JSON.stringify(filters, null, 2), 'utf8');
    
    } catch (error){
    	res.status(500).send('Error reading courses file '+error);
    }
    });
    
    
app.get('/api/purchases-admin', (req, res) => {
  const boughtCourses = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  res.status(200).json(boughtCourses);
});

app.get('/api/students', async (req, res) => {
  try {
    let students = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    students = students.filter(item => item.type === "student");
    console.log(students);
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    users = students.filter(item => item.id !== id);
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
    if (users.filter(item => item.id === id).length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
