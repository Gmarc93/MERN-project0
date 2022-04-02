import React from 'react';
import {useState} from 'react';

export default function Login() {
  // Explore refactoring local state into an object
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  function onSubmitSignupForm(e) {
    e.preventDefault();

    console.log({
      userEmail,
      userPassword,
    });

    setUserEmail('');
    setUserPassword('');
  }

  return (
    <main>
      <h2>Signup</h2>
      <form onSubmit={onSubmitSignupForm}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
        />
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
        />

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
