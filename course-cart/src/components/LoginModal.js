import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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
  </div>
);

const LoginForm = ({ isRegistering, email, setEmail, password, setPassword, handleFormSubmit }) => (
  <div className="login-form">
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
  const navigate = useNavigate();

  const handleLoginTypeChange = (e) => setLoginType(e.target.value);

  const handleFormSubmit = async () => {
    const userData = { email, password, loginType };

    if (isRegistering) {
      await registerUser(userData);
    }

    const logindata = await loginUser(userData);
    if (logindata.success) {
    if(logindata.user.type===loginType){
      if (logindata.user.type==="college") {
        navigate("/college-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      }
      else{
      	alert('Login failed!');
      }
    } else {
      alert('Login failed!');
    }
  };

  const registerUser = async (userData) => {
    await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  };

  const loginUser = async (userData) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
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
        handleFormSubmit={handleFormSubmit}
      />
      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : 'No account? Register'}
      </p>
    </div>
  );
};

export default LoginModal;

