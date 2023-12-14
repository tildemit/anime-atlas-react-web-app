import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import { Link } from "react-router-dom";
import "./sign.css";

function Signup() {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "BASIC",
  });
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await client.signup(credentials);
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);

      setCredentials({
        username: "",
        password: "",
        role: "BASIC",
      });
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/search" className="nav-link">
          Search
        </Link>
        <Link to="/login" className="nav-link">
          Signin
        </Link>
      </div>
      <h1>Signup</h1>
      {error && <div>{error}</div>}
      <label>Username</label>
      <input
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <label>Password</label>
      <input
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <select
        value={credentials.role}
        onChange={(e) =>
          setCredentials({ ...credentials, role: e.target.value })
        }
      >
        <option value="BASIC">BASIC</option>
        <option value="PREMIUM">PREMIUM</option>
      </select>
      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Signup;
