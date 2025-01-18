import React from "react";
import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from "./pages/Landing";
import './index.css';

function App() {
    return ( 
        <div className="h-screen max-h-screen flex flex-col justify-between bg-[#c4f5ce]">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Landing />}/>
                </Routes>
            </HashRouter>
            <footer className="flex flex-col text-center items-center p-4 text-sm">
                <a className="text-green-800 hover:underline" href="https://www.youtube.com/@niminightmare">
                    Nimi Nightmare
                </a>
                <small>Not affiliated with Nimi Nightmare</small>
                <a className="hover:underline" href="https://x.com/braindoko">
                    <small>Created by @braindoko</small>
                </a>
            </footer>
        </div>
    );
}

export default App;