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
        event.preventDefault();
        try {
            const data = {
                username: inputs["username"],
                password: inputs["password"],
            };

            const headers = {
                "Content-Type": "application/json",
            };

            // Requesting server for JWT with login info
            const response = await axios.post(
                "http://localhost:3001/api/user/login",
                data,
                { headers }
            );

            // Storing JWT in localStorage
            localStorage.setItem("currentUser", JSON.stringify(response.data));

            // Navigating to Home
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-[#063970] to-blue-200">
            <div
                className="grid place-items-center mx-2 my-20 sm:my-auto"
                x-data="{ showPass: true }"
            >
                <h1 className="text-white text-4xl mb-5 tracking-widest">Taskit</h1>
                <div
                    class="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12
                px-6 py-10 sm:px-10 sm:py-6
                bg-white rounded-lg shadow-md lg:shadow-lg"
                >
                    <div class="text-center mb-4">
                        <h6 class="font-semibold text-[#063970] text-xl">
                            Login
                        </h6>
                    </div>
                    <form class="space-y-5" onSubmit={onSubmit}>
                        <div>
                            <input
                                type="text"
                                value={inputs["username"]}
                                placeholder="Username"
                                name="username"
                                onChange={handleChange}
                                className="block w-full py-3 px-3 mt-2
                            text-gray-800 appearance-none
                            border-2 border-gray-100
                            focus:text-gray-500 focus:outline-none focus:border-gray-200 rounded-md"
                            />
                        </div>

                        <div class="relative w-full">
                            <input
                                type="password"
                                value={inputs["password"]}
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                className="block w-full py-3 px-3 mt-2 mb-4
                            text-gray-800 appearance-none
                            border-2 border-gray-100
                            focus:text-gray-500 focus:outline-none focus:border-gray-200 rounded-md"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 mt-10 bg-[#063970] rounded-md
                        font-medium text-white uppercase
                        focus:outline-none hover:shadow-none"
                        >
                            Login
                        </button>
                    </form>
                    <p className="my-3 hover:text-cyan-600 hover:cursor-pointer" onClick={() => navigate("/register")}>Need an account?</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
