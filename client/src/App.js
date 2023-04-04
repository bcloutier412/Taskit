import { Outlet } from "react-router-dom";
import React from "react";
// import { useState } from 'react'
import "./App.css";

function App() {
    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    );
}

export default App;
