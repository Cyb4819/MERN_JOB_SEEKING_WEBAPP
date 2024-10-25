import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/JobZeelogo.png" alt="logo" />
            <h3>Create a new account</h3>
          </div>
          <form onSubmit={handleRegister}>
  <div className="inputTag">
    <label>Register As</label>
    <div>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="Employer">Employer</option>
        <option value="Job Seeker">Job Seeker</option>
      </select>
      <FaRegUser />
    </div>
  </div>
  <div className="inputTag">
    <label>Name</label>
    <div>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FaPencilAlt />
    </div>
  </div>
  <div className="inputTag">
    <label>Email Address</label>
    <div>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <MdOutlineMailOutline />
    </div>
  </div>
  <div className="inputTag">
    <label>Phone Number</label>
    <div>
      <input
        type="number"
        placeholder="Your Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <FaPhoneFlip />
    </div>
  </div>
  <div className="inputTag">
    <label>Password</label>
    <div>
      <input
        type="password"
        placeholder="Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <RiLock2Fill />
    </div>
  </div>
  <button type="submit">
    Register
  </button>
  <Link to={"/login"}>Login Now</Link>
</form>

        </div>
        <div className="banner">
          <img src="/register.png" alt="register" />
        </div>
      </section>
    </>
  );
};

export default Register;