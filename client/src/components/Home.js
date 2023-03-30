import { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const currentUser = useLoaderData();
    const [todos, setTodos] = useState(null);
    let navigate = useNavigate();

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
    }, []);
    return (
        <div>
            {todos
                ? todos.map((todo) => <div key={todo.id}>{todo.title}</div>)
                : null}
        </div>
    );
};

export default Home;
