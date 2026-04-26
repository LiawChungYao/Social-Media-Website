import { useState } from "react";

const backend = import.meta.env.VITE_BACKEND_SERVER;
function SignUp() {
    const [show, setShow] = useState(false);
    const registerAccount = async () =>{
        {/* 
        console.log("Pressed");
        console.log(document.getElementById("username").value);
        console.log(document.getElementById("password").value);
        console.log(document.getElementById("confirmPassword").value);
        console.log(document.getElementById("email").value);*/}

        var username =document.getElementById("signupUsername").value;
        var password = document.getElementById("signupPassword").value;
        var confirmPassword = document.getElementById("signupConfirmPassword").value;
        var email = document.getElementById("signupEmail").value;

        if (password !== confirmPassword){
            console.log("Incorrect Password Detected");
            console.log("Implement incorrect confirmation password");
            return;
        }

        const res = await fetch(backend + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password,
                email
            })
        });

        console.log(res);
    }

    function showPassword(){
        setShow(!show);
    }

    return (
        <div>
            <div className="userInput">
                <input id="signupUsername" required/>
                <label>Username</label>
            </div>
            <div className="userInput">
                <input type={show ? "text" : "password"} id="signupPassword" required />
                <label>Password</label>
                <button onClick={showPassword}>{show ? "Hide" : "Show"}</button>
            </div>
            
            <div className="userInput">
                <input type="password" id="signupConfirmPassword" required/>
                <label>Confirm Password</label>
            </div>
            <div className="userInput">
                <input id="signupEmail" required/>
                <label>Email</label>
            </div>

            
            <button onClick={registerAccount}>Sign Up</button>
        </div>
    );
}

        
export default SignUp;