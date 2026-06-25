import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaWallet } from "react-icons/fa";

type RegisterProps = {
  setShowRegister: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setLoggedIn: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

function Register({
  setShowRegister,
  setLoggedIn,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name,
          email,
          password,
        }
      );

      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        loginResponse.data.access_token
      );

      toast.success(
        "Account created successfully!"
      );

      setLoggedIn(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-600 p-4 rounded-2xl text-white mb-4">
            <FaWallet size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Start tracking smarter 🚀
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={() =>
              setShowRegister(false)
            }
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;