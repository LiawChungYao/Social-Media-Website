import { useEffect, useState } from "react";
import Upload from "./Upload";
import Login from "./Login";
import SignUp from "./SignUp";
import './App.css'
const backend = import.meta.env.VITE_BACKEND_SERVER;
function App() {
  const [message, setMessage] = useState("Unable to connect to backend");

  useEffect(() => {
    fetch(backend)
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Frontend</h1>
      <p>{message}</p>      
      <SignUp />
      <Login />
    </div>
  );
}

export default App;