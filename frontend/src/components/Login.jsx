

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { NavLink, useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate=useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Single field for email or phone
  const [mobile,setMobile]=useState();
  const [identifier,setIdentifier]=useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { url, setToken } = useContext(StoreContext);

  const handleLogin = () => {
    if (!identifier || !password) {
      setError('Please enter your email or phone and password.');
      return;
    }
    setError('');
    setSuccessMessage('');
    axios.post(`${url}/users/login`, { identifier, password })
      .then(response => {
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setSuccessMessage(response.data.message || 'Login successful!');
        navigate('/')
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      });
  };

  const handleRegister = () => {
    if (!name || !email || !mobile || !password || !reEnterPassword || password !== reEnterPassword) {
      setError('Please fill in all fields correctly.');
      return;
    }
    setError('');
    setSuccessMessage('');
    const phone=mobile;
    axios.post(`${url}/users/register`, { name,email,phone, password, role })  
      .then(response => {
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setSuccessMessage(response.data.message || 'Registration successful! Please log in.');
        navigate('/')
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
      });
  };

  const handleForgotPassword = () => {
    if (!identifier) {
      setError('Please enter your email or phone number.');
      return;
    }
    setError('');
    setSuccessMessage('');
    axios.post(`${url}/users/forgotpassword`, { identifier })
      .then(response => {
        setOtpSent(true);
        setSuccessMessage(`An email was sent to "${response.data.sentTo || 'your registered email'}" with the OTP.`);
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      });
  };

  const handleVerifyOtp = () => {
    if (!otp || !newPassword || newPassword !== confirmNewPassword) {
      setError('Please enter OTP and ensure new passwords match.');
      return;
    }
    setError('');
    setSuccessMessage('');
    axios.post(`${url}/users/verifyotp`, { identifier, otp, newPassword })
      .then(response => {
        setSuccessMessage(response.data.message || 'Password reset successfully!');
      })
      .catch(error => {
        setError(error.response?.data?.message || 'OTP verification failed. Please try again.');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Login' : isForgotPassword ? 'Forgot Password' : 'Register'}
        </h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        {successMessage && <div className="text-green-600 text-sm mb-4">{successMessage}</div>}

        {!isForgotPassword && (
          <>

            {!isLogin &&(
              <>
                <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">mobile number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>
              </>
            )}
            {isLogin &&

            (
              <>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">email or mobile number</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>


              </>
            )
            }
          



            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            {!isLogin && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Re-enter Password</label>
                  <input
                    type="password"
                    value={reEnterPassword}
                    onChange={(e) => setReEnterPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full p-3 mt-1 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 mt-1 border rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>
              </>
            )}

            <div className="mb-6">
              <button
                onClick={isLogin ? handleLogin : handleRegister}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>

            <div className="text-center">
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 cursor-pointer"
              >
                {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login'}
              </span>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <span
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-500 cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
            )}
          </>
        )}

        {isForgotPassword && !otpSent && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email or Mobile</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-6">
              <button
                onClick={handleForgotPassword}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
              >
                Send OTP
              </button>
            </div>

            <div className="text-center">
              <span
                onClick={() => setIsForgotPassword(false)}
                className="text-blue-500 cursor-pointer"
              >
                Back to Login
              </span>
            </div>
          </>
        )}

        {otpSent && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Re-enter New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-6">
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
              >
                Reset Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
