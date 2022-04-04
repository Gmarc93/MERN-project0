import React from 'react';
import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {signup, reset} from '../features/auth/authSlice';

export default function Signup() {
  // Explore refactoring local state into an object
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  function onSubmitSignupForm(e) {
    e.preventDefault();

    const userData = {
      userName,
      userEmail,
      userPassword,
      userPasswordConfirm,
    };
    console.log(userData);

    dispatch(signup(userData));

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
