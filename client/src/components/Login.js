import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const handleChange = (event) => {
        const value = event.target.value;
        setInputs({
            ...inputs,
            [event.target.name]: value,
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const data = {
                username: inputs["username"],
                password: inputs["password"],
            };
    
            const headers = {
                "Content-Type": "application/json",
            };
    
            // Requesting server for JWT with login info
            const response = await axios.post("http://localhost:3001/api/user/login", data, { headers })

            // Storing JWT in localStorage
            localStorage.setItem("currentUser", JSON.stringify(response.data));

            // Navigating to Home
            navigate("/home");
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <form onSubmit={onSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    value={inputs["username"]}
                    name={"username"}
                    onChange={handleChange}
                ></input>
            </label>
            <label>
                Password:
                <input
                    type="text"
                    value={inputs["password"]}
                    name={"password"}
                    onChange={handleChange}
                ></input>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default Login;
