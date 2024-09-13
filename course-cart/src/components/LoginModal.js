import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './LoginModal.css';

const LoginTypeSelector = ({ type, handleLoginTypeChange }) => (
  <div className="login-type">
    <label>
      <input
        type="radio"
        value="student"
        checked={type === 'student'}
        onChange={handleLoginTypeChange}
      />
      Student
    </label>
    <label>
      <input
        type="radio"
        value="college"
        checked={type === 'college'}
        onChange={handleLoginTypeChange}
      />
      College
    </label>
    <label>
      <input
        type="radio"
        value="admin"
        checked={type === 'admin'}
        onChange={handleLoginTypeChange}
      />
      Admin
    </label>
  </div>
);

const LoginForm = ({
isRegistering,
email,
setEmail,
password,
type,
setType,
setPassword,
name,
setName,
course,
setCourse,
percentile,
setPercentile,
marksheet,
setMarksheet,
college,
setCollege,
handleFormSubmit
}) => (
  <div className="login-form">
    {isRegistering && type!=='admin' && (
      <>
        <input
          required
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {type === 'student' && (
          <>
            <input
          	  required
              type="text"
              placeholder="Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <input
          	  required
              type="number"
              placeholder="Percentile"
              value={percentile}
              onChange={(e) => setPercentile(e.target.value)}
            />
            <input
          	  required
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={(e) => setMarksheet(e.target.files[0])}
            />
          </>
        )}
        {type === 'college' && (
          <>
            <input
          	  required
              type="text"
              placeholder="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </>
        )}
      </>
    )}
    <input
	  required
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      required
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    required/>
    {type!=='admin'?
    <button onClick={handleFormSubmit}>
      {isRegistering ? 'Register' : 'Login'}
    </button>:
    <button onClick={handleFormSubmit}>
      login
    </button>
    }
  </div>
);

const LoginModal = () => {
  const [type, setType] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [college, setCollege] = useState('');
  const [percentile, setPercentile] = useState('');
  const [marksheet, setMarksheet] = useState(null);
  //const [type, setType] = useState(null);
  const navigate = useNavigate();

  const handleLoginTypeChange = (e) => setType(e.target.value);

  const handleFormSubmit = async () => {
  	if( type=== 'admin' && isRegistering===true){
  	setIsRegistering(false);
  	}
    if (!email || !password || (isRegistering!==false && (!name || (type === 'student' && (!course || !percentile)))) || (isRegistering && (!name || (type === 'college' && (!college))))) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isRegistering) {
      let formData = {};
      formData.name = name;
      formData.email= email;
      formData.password = password;
      formData.type= type;
      if (college) {
        formData.college= college;
      }
      if (course) {
        formData.course = course;
      }
      if (percentile) {
        formData.percentile = parseInt(percentile, 10);
      }
      if (marksheet) {
        formData.marksheet=marksheet;
      }
      formData.id=0;
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        //alert(JSON.stringify(formData));
        const data = await response.json();
        if (data.success) {
          alert('registered');
          navigate('/'); // Redirect to login or home page
        } else {
          alert('Registration failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please check your server logs.');
      }
    } else {
      try {
        const logindata = await loginUser({ email, password, type });

        if (logindata.success &&logindata.user.type===type) {
          localStorage.setItem('user', JSON.stringify(logindata.user)); // Store user data in localStorage
          switch (logindata.user.type) {
            case 'college':
              navigate('/college-dashboard', { replace: true });
              break;
            case 'admin':
              navigate('/admin-dashboard', { replace: true });
              break;
            default:
              navigate('/dashboard', { replace: true });
          }
        } else {
          alert('Login failed! Invalid credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please check your server logs.');
      }
    }
  };

  const loginUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  return (
    <div className="login-modal">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <LoginTypeSelector type={type} handleLoginTypeChange={handleLoginTypeChange} />
      <LoginForm
        isRegistering={isRegistering}
        email={email}
        setEmail={setEmail}
        password={password}
        type={type}
        setType = {setType}
        setPassword={setPassword}
        name={name}
        setName={setName}
        course={course}
        setCourse={setCourse}
        percentile={percentile}
        setPercentile={setPercentile}
        marksheet={marksheet}
        setMarksheet={setMarksheet}
        college={college}
        setCollege={setCollege}
        handleFormSubmit={handleFormSubmit}
      />
      {type==="admin" && isRegistering?
      <a
  href="/"
  style={{ cursor: 'pointer', color: '#070000', textDecoration: '' }} 
>
  admin registration not allowed
</a>:
      <a
  href="/"
  onClick={(e) => {
    e.preventDefault(); 
    setIsRegistering(!isRegistering); 
  }}
  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }} 
>
  {isRegistering ? 'Already have an account? Login' : 'Are you new? Register'}
</a>
}
    </div>
  );
};

export default LoginModal;
