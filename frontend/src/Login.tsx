import { useState } from "react";
import axios, { AxiosResponse } from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/signin/patient",
        {
          username: username,
          password: password,
        }
      );

      console.log(response.data);
      // Perform any actions after successful login, such as storing the token in local storage
    } catch (error) {
      console.error("Error when logging in", error);
      console.log(error);
    }
  };

  return (
    <div style={{ fontFamily: "Sacramento", fontSize: "16px" }}>
      <form onSubmit={handleLogin}>
        <h1
          style={{
            fontFamily: "Amatic SC",
            fontSize: "24px",
            fontWeight: "bold",
          }}>
          Login
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ fontFamily: "Indie Flower, cursive", fontSize: "16px" }}
          required
        />
        <h1
          style={{
            fontFamily: "Amatic SC",
            fontSize: "24px",
            fontWeight: "bold",
          }}>
          Password
        </h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontFamily: "Indie Flower, cursive", fontSize: "16px" }}
          required
        />
        <h1></h1>
        <button
          type="submit"
          style={{
            fontFamily: "Amatic SC",
            fontSize: "16px",
            fontWeight: "bold",
            color: "grey",
            backgroundColor: '#A4DCEB',
            borderColor: "black"
          }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
