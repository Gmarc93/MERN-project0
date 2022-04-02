import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <h2>Navbar</h2>
      <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link> |{' '}
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
