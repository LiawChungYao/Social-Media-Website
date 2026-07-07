import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const backend = import.meta.env.VITE_BACKEND_SERVER;

function Login() {
  const [show, setShow] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("web_server_login_token");
    if (token) {
        navigate("/home");
    }})


  const authenticateLoginDetails = async () => {
    console.log("Pressed");

    try {
      const res = await fetch(backend + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          keepSignedIn
        })
      });

      const data = await res.json();

      console.log(data);
      localStorage.setItem("web_server_login_token", data.token);

    } catch (err) {
      console.error(err);
    }
  };

  function showPassword() {
    setShow(!show);
  }

  return (
    <div>
      <div className="userInput">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Username</label>
      </div>

      <div className="userInput">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Password</label>

        <button type="button" onClick={showPassword}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
          />
          {" "}Keep me signed in
        </label>
      </div>

      <button onClick={authenticateLoginDetails}>
        Login
      </button>
    </div>
  );
}

export default Login;