import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import ErrorPage from "./error-page";
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"

const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          loader: () => {
            return redirect("/home")
          }
        },
        {
          path: "home",
          element: <Home />,
          loader: () => {
            localStorage.setItem("currentUser", JSON.stringify({JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpbm8xYyIsImlkIjoiNjQyMjE4ZTQyMTllMGQyNzZkZjE1MThhIiwiaWF0IjoxNjgwMTI2MzEzLCJleHAiOjE2ODAxMjY5MTN9.P438WFUT7kuAWTu-LRfVqTmZVG7vgJf5mVwjpmekSOM"}))
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) {
              return redirect("/login")
            }
            return currentUser
          }
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        }
      ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);