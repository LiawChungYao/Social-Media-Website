import { useState } from "react";

const backend = import.meta.env.VITE_BACKEND_SERVER;
function Login() {

    const [show, setShow] = useState(false);
    const authenticateLoginDetails = async () =>{
        console.log("Pressed");

        
        var username =document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;

        const res = await fetch(backend + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password,
            })
        });
        
        console.log(await res.json());
    }
    

    function showPassword(){
        setShow(!show);
    }
    return (
            <div>
            <div className="userInput">
                <input id="loginUsername" required/>
                <label>Username</label>
            </div>
            <div className="userInput">
                <input type={show ? "text" : "password"} id="loginPassword" required />
                <label>Password</label>
                <button onClick={showPassword}>{show ? "Hide" : "Show"}</button>
            </div>
            
            <button onClick={authenticateLoginDetails}>Login</button>
        </div>
    );
}

export default Login;