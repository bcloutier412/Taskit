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
          // Redirect user to the homepage if they go to the base url
          path: "",
          loader: () => {
            return redirect("/home")
          }
        },
        {
          path: "home",
          element: <Home />,
          // Check if the user has a JWT token in localStorage
          loader: () => {
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