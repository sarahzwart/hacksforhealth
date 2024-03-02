import { useState } from "react";
import axios, { AxiosResponse } from "axios";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/signin/patient", {
        username: username,
        password: password
      });
      
      console.log(response.data);
      // Perform any actions after successful login, such as storing the token in local storage
    } catch (error) {
      console.error('Error when logging in', error);
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit"> submit</button>
      </form>
    </div>
  );
}

export default Login;

