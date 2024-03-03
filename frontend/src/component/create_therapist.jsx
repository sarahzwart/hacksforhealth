import styles from './styles.module.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create_therapist = () => {
 
  const [file, setFile] = useState(null);

  const handleCamera = () => {
    document.getElementById('fileInput').click();
      // Check if the file input has any selected file
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      fileInput.click();
    } else {
      // Display an error message or handle the case when no file is selected from the camera
      console.log("No file selected from the camera.");
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  
    // show a preview of the image
    let preview = document.getElementById('imagePreview');
    preview.src = URL.createObjectURL(e.target.files[0]);
  };

	const [data, setData] = useState({
		
		username: "",
    password: "",
    
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
	  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data)
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/signup/patient`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      navigate("/patient/login");
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  
  return (
    <div>
      <div className={styles.screen}>
        <div className={styles.logo_pos}>
          <img className={styles.logo} src="/HiLo Logo.png" alt="Logo"/>
        </div> 

        <div className={styles.signup_box}>
          <div className={styles.signup_text}>Create life</div>
          <div className={styles.input_contain}>
            
            <input
              type="text"
              placeholder="New Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className={styles.enter}
            />
            

            <input
           type="password"
  placeholder="password"
  name="password"
  onChange={handleChange}
  value={data.password}
  className={styles.password}
/>
            
            

            {error && <div className={styles.error_msg}>{error}</div>}
            
            <button type="submit" className={styles.signup_btn_pos} onClick={handleSubmit}>
              <div className={styles.signup_btn}>Sign Up</div>  
            </button>  
          </div>

          <button className={styles.acct_btn_pos}>
            <a className={styles.acct_btn} href="/patient/login">Go Back?</a>
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default Create_therapist;
