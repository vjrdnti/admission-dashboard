import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const uri = 'mongodb://0.0.0.0'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;
let filtersCollection;
let coursesCollection;
let boughtCoursesCollection;
let cart = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    const db = client.db('mydb');

    usersCollection = db.collection('users');
    filtersCollection = db.collection('filters');
    coursesCollection = db.collection('courses');
    boughtCoursesCollection = db.collection('boughtCourses');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
}
connectToDB();

app.post('/api/register', upload.single('marksheet'), async (req, res) => {
  try {
    const { name, email, password, loginType, course, percentile } = req.body;
    const marksheet = req.file ? req.file.filename : null;
    const percentileInt = parseInt(percentile, 10);
    if (!name || !email || !password || !loginType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (loginType === 'student') {
      if (!course || isNaN(percentileInt)) {
        return res.status(400).json({ success: false, message: 'Missing or invalid course or percentile' });
      }
    }
    const newUser = { name, email, password, loginType, course: loginType === 'student' ? course : null, percentile: loginType === 'student' ? percentileInt : null, marksheet };
    await usersCollection.insertOne(newUser);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/register:', error); // Log the error
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      console.log('Logged-in user:', user); // Log user data
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    console.log('User ID:', userId); 
    const result = await cartsCollection.updateOne(
      { userId: userId }, 
      { $set: { items: [] } } 
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true, message: 'Logout successful, cart cleared' });
    } else {
      res.status(404).json({ success: false, message: 'Cart not found for user' });
    }
  } catch (error) {
    console.error('Error during logout:', error); // Log the exact error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
});


// Get User
app.get('/api/user', async (req, res) => {
  try {
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Courses
app.get('/api/courses', async (req, res) => {
  try {
    const { degree, branch, district } = req.query;
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    let filteredCourses = await coursesCollection.find({ status: 'verified' }).toArray();

    filteredCourses = filteredCourses.filter(course => course.cutoff <= user.percentile);

    if (degree) {
      filteredCourses = filteredCourses.filter(course => course.title === degree);
    }
    if (branch) {
      const branchArray = branch.split(',');
      filteredCourses = filteredCourses.filter(course => branchArray.includes(course.branch));
    }
    if (district) {
      const districtArray = district.split(',');
      filteredCourses = filteredCourses.filter(course => districtArray.includes(course.district));
    }

    res.json(filteredCourses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add Course
app.post('/api/add-course', async (req, res) => {
  try {
    const newCourse = req.body;
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    newCourse.college = user.college;
    newCourse.status = 'unverified';

    const lastCourse = await coursesCollection.find().sort({ id: -1 }).limit(1).toArray();
    newCourse.id = (lastCourse[0] ? lastCourse[0].id : 0) + 1;

    await coursesCollection.insertOne(newCourse);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cart operations
app.post('/api/cart', async (req, res) => {
  try {
    const { course } = req.body;
    if (!cart.find(item => item.id === course.id)) {
      cart.push(course);
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/cart', (req, res) => {
  try {
    res.json(cart);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/cart', (req, res) => {
  try {
    const { courseId } = req.body;
    cart = cart.filter(item => item.id !== courseId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/purchasesp', async (req, res) => {
  const { user, courses, invoice } = req.body;
  console.log("Received data:", { user, courses, invoice });
  if (!user || !courses || !invoice) {
    console.error('Missing required fields:', { user, courses, invoice });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!user._id) {
    console.error('User ID is missing');
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const boughtCourses = courses.map(course => ({
      user,
      course,  
      invoice,
      purchaseDate: new Date()
    }));
    await boughtCoursesCollection.insertMany(boughtCourses);
    await Promise.all(courses.map(course =>
      coursesCollection.updateOne(
        { _id: course._id },
        { $inc: { count: 1 } }
      )
    ));
    res.status(200).json({ message: 'Purchase recorded successfully' });
  } catch (error) {
    console.error('Error recording purchase:', error);
    res.status(500).json({ error: 'Error recording purchase' });
  }
});

// Get Filters
app.get('/api/filters', async (req, res) => {
  try {
    const filters = await filtersCollection.findOne(); // Adjust based on your filter structure
    res.json(filters);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Purchased Courses for User
app.get('/api/purchases', async (req, res) => {
  try {
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    const boughtCourses = await boughtCoursesCollection.find({ user: user._id }).toArray();
    res.json(boughtCourses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get College Posts
app.get('/api/college-posts', async (req, res) => {
  try {
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    const postedCourses = await coursesCollection.find({ college: user.college }).toArray();
    res.json(postedCourses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get College Courses Sold
app.get('/api/college-courses-sold', async (req, res) => {
  try {
    const user = await usersCollection.findOne(); // Adjust based on actual user identification method
    const boughtCourses = await boughtCoursesCollection.find({ 'course.college': user.college }).toArray();
    res.json(boughtCourses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Course Status
app.post('/api/courses-admin', async (req, res) => {
  try {
    const updatedCourses = req.body;
    const branches = [...new Set(updatedCourses.map(course => course.branch))];
    const districts = [...new Set(updatedCourses.map(course => course.district))];

    await coursesCollection.deleteMany({}); // Clear existing courses
    await coursesCollection.insertMany(updatedCourses);

    const filters = {
      branches: branches.sort(),
      districts: districts.sort()
    };
    await filtersCollection.updateOne({}, { $set: filters }, { upsert: true });

    res.status(200).send('Courses updated successfully');
  } catch (error) {
    res.status(500).send('Error updating courses: ' + error.message);
  }
});

// Get All Courses (for admin)
app.get('/api/courses-admin', async (req, res) => {
  try {
    const courses = await coursesCollection.find().toArray();
    res.json(courses);
  } catch (error) {
    res.status(500).send('Error fetching courses: ' + error.message);
  }
});

// Get Purchases for Admin
app.get('/api/purchases-admin', async (req, res) => {
  try {
    const boughtCourses = await boughtCoursesCollection.find().toArray();
    res.json(boughtCourses);
  } catch (error) {
    res.status(500).send('Error fetching purchases: ' + error.message);
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await usersCollection.find({ loginType: 'student' }).toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
