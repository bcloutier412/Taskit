import { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loading-icons";

const Home = () => {
    // Getting user data from local storage processed in the loader function
    const currentUser = useLoaderData();

    const [showAddTask, setShowAddTask] = useState(false);
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

    return (
        <div className="wrapper w-full h-full flex justify-center">
            <div className="container max-w-2xl">
                <nav className="flex justify-between px-10 py-5 border-b">
                    <header className="text-2xl font-semibold">Tasks</header>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        className="bi bi-plus-circle-fill hover:cursor-pointer fill-blue-500 active:fill-blue-800"
                        viewBox="0 0 16 16"
                        onClick={() => {
                            setShowAddTask(true);
                        }}
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                </nav>
                <div className="px-10 py-5">
                    {todos
                        ? todos.map((todo) => (
                              <div key={todo.id}>{todo.title}</div>
                          ))
                        : null}
                </div>
            </div>
            {showAddTask && (
                <NewTask
                    setShowAddTask={setShowAddTask}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

const NewTask = ({ setShowAddTask, currentUser }) => {
    const [inputs, setInputs] = useState({ taskname: "", description: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const value = event.target.value;
        setInputs({
            ...inputs,
            [event.target.name]: value,
        });
    };

    const onSubmit = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            const data = await axios.post(
                "http://localhost:3001/api/todo/todo",
                {
                    todo: {
                        title: inputs["taskname"],
                        description: inputs["description"],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            console.log(data);
        } catch (error) {}
        // make api call to add the new note to the database
        // wait for response
        // when response comes add todo to todo list
        // close show task container
        // setShowAddTask(false);
    };

    return (
        <div className="absolute h-full w-full flex justify-center bg-slate-500/50">
            <div className="w-full max-w-lg bg-white sm:rounded-lg rounded-none border h-min p-5 text-center mt-12">
                <h1 className="font-semibold">New Task</h1>
                <form
                    className="flex flex-col"
                    onSubmit={(event) => onSubmit(event)}
                >
                    <input
                        type="text"
                        name="taskname"
                        placeholder="Task name"
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1"
                        onChange={handleChange}
                        value={inputs["taskname"]}
                    />
                    <textarea
                        id="w3review"
                        name="description"
                        rows="4"
                        cols="50"
                        placeholder="Description..."
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1"
                        value={inputs["description"]}
                        onChange={handleChange}
                    ></textarea>
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
                            "Add task"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Home;
