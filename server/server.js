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
fs.writeFileSync(path.join(__dirname, './data/user.json'), JSON.stringify('[]', null, 2), 'utf-8');
const users = require('./users.json');
const filters = require('./data/filters.json');
//const boughtCourses = require('./data/boughtCourses.json');
let cart = [];

////login logic

app.post('/api/register', (req, res) => {
  const newUser = req.body;
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
  res.status(200).json(filters);
});

app.get('/api/courses', (req, res) => {
  const courses = JSON.parse(fs.readFileSync('./data/courses.json'));
  const { degree, branch, district } = req.query;
  //console.log(degree);
  let filteredCourses = courses.filter(course => course.status === 'verified');;
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

app.post('/api/purchasesp', (req, res) => {
  const { invoice } = req.body;
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  cart.forEach(item => {
  	//boughtCourses.forEach(bought => {
  		//if bought.course.isin(cart)
  	//});
	const row = {'user': user, 'course': item, 'invoice': invoice};
	boughtCourses.push(row);
	fs.writeFileSync('./data/boughtCourses.json', JSON.stringify(boughtCourses, null, 2), 'utf-8');
	//console.log(row);
  });
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


