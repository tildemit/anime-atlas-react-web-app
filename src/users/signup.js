import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";

function Signup() {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "BASIC", // Set a default role, e.g., BASIC
  });
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await client.signup(credentials);
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);

      // Reset the text fields on error
      setCredentials({
        username: "",
        password: "",
        role: "BASIC", // Reset role to the default value
      });
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      {error && <div>{error}</div>}
      <input
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        placeholder="Username"
      />
      <input
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        type="password"
        placeholder="Password"
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
