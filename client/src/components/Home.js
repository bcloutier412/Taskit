import { useEffect, useState, useRef } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loading-icons";
import React from "react";

const Home = () => {
    // Getting user data from local storage processed in the loader function
    const currentUser = useLoaderData();

    const [showAddTask, setShowAddTask] = useState(false);
    const [todos, setTodos] = useState(null);
    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    // Fetching the todos from the database
    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await axios.get("/api/todo/todos", {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
                setTodos(response.data);
            } catch (error) {
                localStorage.clear();
                navigate("/login");
            }
        };
        getTodos();
    }, [currentUser.token, navigate]);

    return (
        <div className="wrapper w-full h-full flex justify-center">
            <div className="container max-w-2xl flex flex-col h-full">
                {/* NavBar */}
                <nav className="flex justify-between px-10 py-5 h-min">
                    <header className="text-2xl font-semibold">Taskit</header>
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

                {/* Todo list */}
                <div className="md:pl-[20px] h-full overflow-y-scroll">
                    {todos ? (
                        todos.length > 0 ? (
                            <Todos
                                currentUser={currentUser}
                                todos={todos}
                                setTodos={setTodos}
                            />
                        ) : (
                            <div className="text-center h-full text-gray-500 text-lg flex items-center justify-center">
                                Add a task
                            </div>
                        )
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <TailSpin
                                className="h-12 w-12 mx-auto"
                                stroke="#3482F6"
                                speed={0.75}
                            />
                        </div>
                    )}
                </div>

                {/* Footer with logout button */}
                <footer className="px-10 py-5 text-2xl flex border-t justify-end">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        className="bi bi-box-arrow-right hover:cursor-pointer fill-blue-500 active:fill-blue-800"
                        viewBox="0 0 16 16"
                        onClick={handleLogout}
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                    </svg>
                </footer>
            </div>

            {/* Shows the new task menu when the plus sign is clicked */}
            {showAddTask && (
                <NewTask
                    setShowAddTask={setShowAddTask}
                    currentUser={currentUser}
                    todos={todos}
                    setTodos={setTodos}
                />
            )}
        </div>
    );
};

const NewTask = ({ setShowAddTask, currentUser, todos, setTodos }) => {
    const [inputs, setInputs] = useState({
        taskname: "",
        description: "",
        date: formatDate(new Date()),
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
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
            // Checks to make sure the user didn't only input white space
            if (!inputs["taskname"].trim()) {
                setErrorMessage("Missing Required Data");
                setLoading(false);
                return;
            }
            const response = await axios.post(
                "/api/todo/todo",
                {
                    todo: {
                        title: inputs["taskname"],
                        description: inputs["description"],
                        date: inputs["date"],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            setTodos(todos.concat(response.data));
            setShowAddTask(false);
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.response.data.error);
        }
    };

    return (
        <div className="wrapper absolute h-full w-full flex justify-center bg-slate-500/50">
            <div className="relative w-full max-w-lg bg-white sm:rounded-lg rounded-none border h-min p-5 text-center mt-12">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-lg absolute top-2 right-2 hover:cursor-pointer"
                    viewBox="0 0 16 16"
                    onClick={() => setShowAddTask(false)}
                >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
                <h1 className="font-semibold">New Task</h1>
                <form
                    className="flex flex-col"
                    onSubmit={(event) => onSubmit(event)}
                >
                    {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                    )}
                    <div className="flex justify-between">
                        <input
                            type="text"
                            name="taskname"
                            placeholder="Task name"
                            className="border rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1 grow"
                            onChange={handleChange}
                            value={inputs["taskname"]}
                            required
                        />
                        <input
                            type="date"
                            className="ml-2 px-2 border rounded-lg py-1 focus:outline-none focus:border-blue-500 focus:shadow-md transition-shadow my-1 "
                            name="date"
                            value={inputs["date"]}
                            onChange={handleChange}
                            required
                        />
                    </div>
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

const Todos = ({ currentUser, todos, setTodos }) => {
    const currentDate = new Date();
    const currentDateStr = formatDate(currentDate);
    const map = new Map();

    todos.forEach((todo) => {
        if (todo.date < currentDateStr) {
            if (map.has("0000-00-00")) {
                const mapArray = map.get("0000-00-00");
                mapArray.push(todo);
            } else {
                map.set("0000-00-00", [todo]);
            }
            return;
        }

        if (map.has(todo.date)) {
            const mapArray = map.get(todo.date);
            mapArray.push(todo);
        } else {
            map.set(todo.date, [todo]);
        }
    });

    const sortedMapKeys = Array.from(map.keys()).sort();

    return (
        <React.Fragment>
            {sortedMapKeys.map((key, index) => {
                const { currentTodoGroup, dueDate } = getDateInfo(map, key);

                return (
                    <div key={key + index} className="">
                        <TodoDateGroup
                            dueDate={dueDate}
                            currentDateStr={currentDateStr}
                            currentTodoGroup={currentTodoGroup}
                            currentUser={currentUser}
                            todos={todos}
                            setTodos={setTodos}
                        />
                    </div>
                );
            })}
        </React.Fragment>
    );
};

const TodoDateGroup = ({
    dueDate,
    currentDateStr,
    currentTodoGroup,
    currentUser,
    todos,
    setTodos,
}) => {
    return (
        <React.Fragment>
            <h1>
                <TaskSeparator
                    text={
                        dueDate === currentDateStr
                            ? "Today"
                            : dueDate === "0000-00-00"
                            ? "Past Due"
                            : dueDate
                    }
                />
            </h1>
            {currentTodoGroup.map((todo) => (
                <Todo
                    key={todo.id}
                    todo={todo}
                    currentUser={currentUser}
                    todos={todos}
                    setTodos={setTodos}
                />
            ))}
        </React.Fragment>
    );
};

const TaskSeparator = ({
    text,
    bgColor = "bg-slate-200",
    textColor = "text-slate-300",
}) => {
    return (
        <div className="flex items-center">
            <div className={`h-[1px] w-[30px] ${bgColor}`}></div>
            <div className={`mx-[10px] text-sm ${textColor} font-semibold`}>
                {text}
            </div>
            <div className={`h-[1px] grow-[9.5] ${bgColor}`}></div>
        </div>
    );
};

const Todo = ({ todo, currentUser, todos, setTodos }) => {
    const [isFinished, setIsFinished] = useState(todo.finished);
    const [open, setOpen] = useState(false);
    const heightRef = useRef(null);
    const [descHeight, setDescHeight] = useState(0);

    useEffect(() => {
        const height = heightRef.current.offsetHeight;
        setDescHeight(height);
    }, []);

    const handleDelete = () => {
        axios.delete("/api/todo/todo", {
            headers: {
                Authorization: `Bearer ${currentUser.token}`,
            },
            data: {
                todoID: todo.id,
                isFinished: !isFinished,
            },
        });
        setTodos(todos.filter((element) => element.id !== todo.id));
    };
    const handleFinishedClick = () => {
        axios.put(
            "/api/todo/todo",
            { todoID: todo.id, isFinished: !isFinished },
            { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setIsFinished(!isFinished);
    };
    return (
        <div
            className="wrapper border-b border-dashed py-5 px-10 last:border-none"
            onClick={() => setOpen(!open)}
        >
            <div className="flex flex-col">
                <div className="flex ">
                    {/* Check box button */}
                    <button className="shrink-0">
                        {isFinished ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-circle fill-blue-500"
                                viewBox="0 0 16 16"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleFinishedClick();
                                }}
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-circle"
                                viewBox="0 0 16 16"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleFinishedClick();
                                }}
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            </svg>
                        )}
                    </button>

                    {/* Title of the Todo */}
                    <header
                        className={`grow truncate font-semibold text-lg pl-2 ${
                            isFinished && "line-through decoration-blue-500"
                        }`}
                    >
                        {todo.title}
                    </header>

                    {/* Accordion arrow button */}
                    <div className="flex justify-center items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className={`bi bi-chevron-up mr-[8px] ${
                                open && "rotate-180"
                            } transition-transform duration-200`}
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Description of the Todo */}
                <div
                    className={`flex justify-between items-end overflow-hidden transition-all ease-linear duration-200`}
                    style={{
                        maxHeight: `${open ? `${descHeight + 12}px` : "0px"}`,
                    }}
                >
                    <p
                        className="mt-3 grow text-ellipsis overflow-hidden min-h-[24px]"
                        ref={heightRef}
                    >
                        {todo.description}
                    </p>
                    <button
                        className="justify-self-end px-1 border border-red-600 bg-red-400 rounded-lg text-white h-min mt-3 ml-3"
                        onClick={handleDelete}
                    >
                        delete
                    </button>
                </div>
            </div>
        </div>
    );
};
const getDateInfo = (map, key) => {
    const currentTodoGroup = Array.from(map.get(key));
    const dueDate = key;

    return { currentTodoGroup, dueDate };
};
const formatDate = (date) => {
    let currentYear = date.getFullYear();
    let currentMonth;
    let currentDay;
    date.getMonth() <= 9
        ? (currentMonth = "0" + (date.getMonth() + 1))
        : (currentMonth = date.getMonth() + 1);

    date.getDate() <= 9
        ? (currentDay = "0" + date.getDate())
        : (currentDay = date.getDate());

    return `${currentYear}-${currentMonth}-${currentDay}`;
};

export default Home;
