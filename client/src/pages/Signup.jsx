import React from 'react';
import {useState} from 'react';

export default function Signup() {
  // Explore refactoring into an object
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');

  function onSubmitSignupForm(e) {
    e.preventDefault();

    console.log({
      userName,
      userEmail,
      userPassword,
      userPasswordConfirm,
    });

    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserPasswordConfirm('');
  }

  return (
    <main>
      <h2>Signup</h2>
      <form onSubmit={onSubmitSignupForm}>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
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
        <input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setUserPasswordConfirm(e.target.value)}
          value={userPasswordConfirm}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
