import * as client from "./client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./sign.css";

function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signin = async () => {
    try {
      const response = await client.signin(credentials);
      if (!response) {
        setError("Invalid username or password. Please try again.");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An unexpected error occurred. Please try again later.");
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
        <Link to="/signup" className="nav-link">
          Signup
        </Link>
      </div>
      <h1>Signin</h1>
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
      <button onClick={signin}>Signin</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Signin;
