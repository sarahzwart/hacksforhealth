import { useState } from "react";
import axios, { AxiosResponse } from "axios";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true); // Set loading state to true
    
    try {
      // Make a POST request to your backend server to authenticate the user
      const response = await axios.post("http://localhost:5000/signin/patient", {
        username: username,
        password: password
      });
      
      // Assuming your backend returns a token upon successful authentication
      console.log(response.data);
      
      
      // Perform any actions after successful login, such as storing the token in local storage
      
    } catch (error) {
      console.error('Error when logging in', error);
      throw error;
    }
    
    setLoading(false); // Set loading state back to false
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
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;

