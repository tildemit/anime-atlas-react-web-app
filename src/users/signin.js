import * as client from "./client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signin = async () => {
    try {
      const response = await client.signin(credentials);
      if (!response) {
        setError("Invalid username or password. Please try again.");
      } else {
        // Successful login, you can perform additional actions if needed
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Signin</h1>
      <input
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button onClick={signin}>Signin</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Signin;
