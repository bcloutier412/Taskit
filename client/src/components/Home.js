import { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import axios from "axios";

const Home = () => {
    // Getting user data from local storage processed in the loader function
    const currentUser = useLoaderData();

    const [todos, setTodos] = useState(null);
    let navigate = useNavigate();

    // Fetching the todos from the database
    useEffect(() => {
        const getTodos = async () => {
            try {
                const data = await axios.get(
                    "http://localhost:3001/api/todo/todos",
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                        },
                    }
                );
                console.log(data.data);
                setTodos(data.data);
            } catch (error) {
                localStorage.clear();
                navigate("/login");
            }
        };
        getTodos();
    }, [currentUser.token, navigate]);
    // {todos
    //     ? todos.map((todo) => <div key={todo.id}>{todo.title}</div>)
    //     : null}
    return (
        <div>
            <header>{todos
                    ? todos.map((todo) => <div key={todo.id}>{todo.title}</div>)
                    : null}</header>
        </div>
    );
};

export default Home;
