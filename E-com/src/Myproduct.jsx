import React, { useState } from "react";
import axios from "axios";

const MyProduct = () => {
  const [user, setUser] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/add-user",
        user
      );
      alert(res.data.message);

      setUser({
        fullName: "",
        phoneNumber: "",
        email: "",
      });
    } catch (error) {
      alert("Error saving data");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>User Details</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={user.fullName}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#66a6ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

export default MyProduct;
