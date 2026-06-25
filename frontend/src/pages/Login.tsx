import { toast } from "react-toastify";

import { useState } from "react";
import axios from "axios";
import { FaWallet } from "react-icons/fa";

type LoginProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

function Login({
  setLoggedIn,
  setShowRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setLoggedIn(true);
    } catch (error: any) {
      toast.error(
  error.response?.data?.detail ||
  "Invalid email or password"
);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl text-white mb-4">
            <FaWallet size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Smart Expense Tracker
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back 👋
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>
        </div>

        <p className="text-center text-slate-500 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => setShowRegister(true)}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;