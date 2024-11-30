import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import Loader from './Loader'


const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { url, setToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!identifier || !password) {
      setError("Please enter your email/phone and password.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true); // Start loading
    axios
      .post(`${url}/users/login`, { identifier, password, role })
      .then((response) => {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        setSuccessMessage(response.data.message || "Login successful!");
        navigate("/");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message || "Login failed. Please try again."
        );
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleForgotPassword = () => {
    if (!identifier) {
      setError("Please enter your email or phone number.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true); // Start loading
    axios
      .post(`${url}/users/forgotpassword`, { identifier })
      .then((response) => {
        setOtpSent(true);
        setSuccessMessage(
          `An OTP was sent to "${
            response.data.sentTo || "your registered email"
          }".`
        );
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }).finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleVerifyOtp = () => {
    if (!otp || !newPassword || newPassword !== confirmNewPassword) {
      setError("Please enter OTP and ensure new passwords match.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true); // Start loadin
    axios
      .post(`${url}/users/verifyotp`, { identifier, otp, newPassword })
      .then((response) => {
        setSuccessMessage(
          response.data.message || "Password reset successfully!"
        );
        setIsForgotPassword(false);
        setOtpSent(false);
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "OTP verification failed. Please try again."
        );
      }).finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <div className="flex justify-center w-full  items-center min-h-screen bg-gray-100 p-4">
      <div className="  w-full md:w-1/2 lg:w-1/4 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isForgotPassword ? "Forgot Password" : "Login"}
        </h2>

        {error && (
          <div className="text-red-600 text-lg text-center mb-4">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-600 text-sm mb-4">{successMessage}</div>
        )}

        {!isForgotPassword && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email or Mobile
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 mt-1 border rounded-md"
              >
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-6">
              <button
                onClick={handleLogin}
                className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Loader /> : "Login"}
              </button>
            </div>

            <div className="text-center">
              <span
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                }}
                className="text-blue-500 cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
          </>
        )}

        {isForgotPassword && !otpSent && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email or Mobile
              </label>
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
                
                className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Loader /> : "Send Otp"}
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
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 mt-1 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Re-enter New Password
              </label>
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
                className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Loader /> : " Reset Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
