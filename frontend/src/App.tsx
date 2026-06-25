import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] =
    useState(false);

  if (loggedIn) {
    return <Dashboard />;
  }

  return showRegister ? (
  <Register
  setShowRegister={setShowRegister}
  setLoggedIn={setLoggedIn}
  />
) : (
  <Login
    setLoggedIn={setLoggedIn}
    setShowRegister={setShowRegister}
  />
);
}

export default App;