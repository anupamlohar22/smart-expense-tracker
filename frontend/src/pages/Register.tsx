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

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

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
          error.response?.data?.message ||
          "Registration failed"
      );

    } finally {
      setLoading(false);
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

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-purple-600 font-medium"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
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