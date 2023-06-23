import '../styles/pages/login.scss';
import { apiRequest, errorHandler } from '../tools/http';
import { saveToken } from '../tools/appToken';
import React, { useState } from 'react';

const Page = ({ loginCB }) => {
  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  return (
    <main className="contents login">
      <div className="form">
        <div className="group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={event => {
              setEmail(event.target.value);
            }}
            type="text"
          />
        </div>
        <div className="group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={event => {
              setPassword(event.target.value);
            }}
            type="password"
          />
        </div>
        <button
          onClick={() => {
            apiRequest('/api/v1/session/login', {
              body: {
                email,
                password,
              },
              method: 'POST',
            })
              .then(res => {
                if (!res?.token) {
                  throw res;
                }

                saveToken(res.token);
                loginCB();
              })
              .catch(errorHandler);
          }}>
          Login
        </button>
      </div>
    </main>
  );
};
// Page.propTypes = {

export default Page;
