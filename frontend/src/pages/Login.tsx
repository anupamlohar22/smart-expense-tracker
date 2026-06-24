import React, { useState } from "react";

import axios from "axios";

type LoginProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Login({ setLoggedIn }: LoginProps) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password,
        }
      );
      
      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setLoggedIn(true);;
    } catch (error) {
      alert("Login Failed");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Expense Tracker Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;