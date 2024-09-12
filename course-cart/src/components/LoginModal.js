import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginTypeSelector = ({ loginType, handleLoginTypeChange }) => (
  <div className="login-type">
    <label>
      <input
        type="radio"
        value="student"
        checked={loginType === 'student'}
        onChange={handleLoginTypeChange}
      />
      Student
    </label>
    <label>
      <input
        type="radio"
        value="college"
        checked={loginType === 'college'}
        onChange={handleLoginTypeChange}
      />
      College
    </label>
    <label>
      <input
        type="radio"
        value="admin"
        checked={loginType === 'admin'}
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
  setPassword,
  name,
  setName,
  course,
  setCourse,
  percentile,
  setPercentile,
  marksheet,
  setMarksheet,
  handleFormSubmit,
  loginType
}) => (
  <div className="login-form">
    {isRegistering && (
      <>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {loginType === 'student' && (
          <>
            <input
              type="text"
              placeholder="Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <input
              type="number"
              placeholder="Percentile"
              value={percentile}
              onChange={(e) => setPercentile(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={(e) => setMarksheet(e.target.files[0])}
            />
          </>
        )}
      </>
    )}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={handleFormSubmit}>
      {isRegistering ? 'Register' : 'Login'}
    </button>
  </div>
);

const LoginModal = () => {
  const [loginType, setLoginType] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [percentile, setPercentile] = useState('');
  const [marksheet, setMarksheet] = useState(null);
  const navigate = useNavigate();

  const handleLoginTypeChange = (e) => setLoginType(e.target.value);

  const handleFormSubmit = async () => {
    if (!email || !password || (isRegistering && (!name || (loginType === 'student' && (!course || !percentile))))) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isRegistering) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('loginType', loginType);
      formData.append('course', course);
      formData.append('percentile', parseInt(percentile, 10));

      if (marksheet) {
        formData.append('marksheet', marksheet);
      }

      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          alert('Registration successful!');
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
        const logindata = await loginUser({ email, password, loginType });

        if (logindata.success) {
          localStorage.setItem('user', JSON.stringify(logindata.user)); // Store user data in localStorage
          switch (logindata.user.loginType) {
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
      <LoginTypeSelector loginType={loginType} handleLoginTypeChange={handleLoginTypeChange} />
      <LoginForm
        isRegistering={isRegistering}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        course={course}
        setCourse={setCourse}
        percentile={percentile}
        setPercentile={setPercentile}
        marksheet={marksheet}
        setMarksheet={setMarksheet}
        handleFormSubmit={handleFormSubmit}
        loginType={loginType}
      />
      <a
  href="#"
  onClick={(e) => {
    e.preventDefault(); 
    setIsRegistering(!isRegistering); 
  }}
  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }} 
>
  {isRegistering ? 'Already have an account? Login' : 'Are you new? Register'}
</a>

    </div>
  );
};

export default LoginModal;
