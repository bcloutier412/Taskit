import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loading-icons";

const Login = () => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const value = event.target.value;
        setInputs({
            ...inputs,
            [event.target.name]: value,
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            // Checks to make sure the user didn't only input white space
            if (!(inputs["username"].trim() && (inputs["password"].trim()))) {
                setErrorMessage("Invalid username or password");
                setLoading(false);
                return;
            }

            const data = {
                username: inputs["username"].toLowerCase(),
                password: inputs["password"],
            };

            const headers = {
                "Content-Type": "application/json",
            };

            // Requesting server for JWT with login info
            const response = await axios.post(
                "/api/user/login",
                data,
                { headers }
            );

            // Storing JWT in localStorage
            localStorage.setItem("currentUser", JSON.stringify(response.data));

            // Navigating to Home
            navigate("/home");
        } catch (error) {
            setErrorMessage(error.response.data.error);
            setLoading(false);
        }
    };

    return (
        <div className="wrapper max-w-xl h-30 mx-auto mt-32 p-5 md:p-10">
            <div className="container bg-white border rounded-lg p-5 md:p-10">
                <header className="text-center mb-5 text-2xl">Taskit</header>
                {errorMessage && (
                    <div className="text-red-500 text-center">{errorMessage}</div>
                )}
                <form className="flex flex-col" onSubmit={onSubmit}>
                    <input
                        type="text"
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1"
                        placeholder="Username"
                        name="username"
                        value={inputs["username"]}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1"
                        placeholder="Password"
                        name="password"
                        value={inputs["password"]}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white border my-1 px-2 py-1 rounded-lg  hover:cursor-pointer active:bg-blue-800"
                    >
                        {loading ? (
                            <TailSpin
                                className="h-6 w-6 mx-auto"
                                stroke="#fff"
                                speed={0.75}
                            />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                <footer className="mt-5">
                    Need an account?{" "}
                    <span
                        className="hover:cursor-pointer text-blue-500"
                        onClick={() => navigate("/register")}
                    >
                        Sign up
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default Login;
