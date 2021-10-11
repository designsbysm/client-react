import "../styles/pages/login.scss";
import { apiRequest, errorHandler } from "../tools/http";
import { saveToken } from "../tools/appToken";
import React, { useState } from "react";

const Page = ({ loginCB }) => {
  const [
    email,
    setEmail,
  ] = useState({});

  const [
    password,
    setPassword,
  ] = useState({});

  return (
    <main className="contents login">
      <div className="form">
        <div className="group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            onChange={event => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className="group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button
          onClick={() => {
            apiRequest("/api/v1/session/login", {
              body: {
                email,
                password,
              },
              method: "POST",
            })
              .then(res => {
                console.log(res)
                saveToken(res.token);
                loginCB();
              })
              .catch(errorHandler);
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
};

export default Page;
