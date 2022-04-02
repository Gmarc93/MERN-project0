import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';

import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <h1>Hello, world!</h1>
      <Outlet />
    </>
  );
}

export default App;
