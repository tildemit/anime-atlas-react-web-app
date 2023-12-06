import React from 'react';
import './App.css';
import Home from './home/Home';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
