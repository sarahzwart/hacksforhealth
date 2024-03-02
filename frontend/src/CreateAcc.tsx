import { useState } from "react";
import axios from "axios";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate= async () => {
    setLoading(true); // Set loading state to true
    
    try {
      // Make a POST request to your backend server to authenticate the user
      const response = await axios.post("http://localhost:5000/signup/patient", {
        username: username,
        pass: password
      });
      
      // Assuming your backend returns a token upon successful authentication
      console.log(response.data);
      
      
      // Perform any actions after successful login, such as storing the token in local storage
      
    } catch (error) {
      console.error('Error sign up', error);
      throw error;
    }
    
    setLoading(false); // Set loading state back to false
    };

  return (
    <div>
      <form onSubmit={handleCreate}>
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

export default CreateAccount;
