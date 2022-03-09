import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";

//components--
import Alert from "../layout/Alert";

//Actions--
import { setAlert } from "../../store/actions/alert";
import { register } from "../../store/actions/auth";

const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      setAlert("Passwords don't match", "danger");
    } else {
      console.log("Success");
      register({ name, email, password });
    }
  };
  return (
    <section className="container">
      <Alert />
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form onSubmit={(e) => onSubmit(e)} className="form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />

          <small className="form-text">
            This site uses gravetar , so if you want to use a profile picture
            use a gravetar email.
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={6}
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            minLength="6"
            value={confirmPassword}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>

      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.prototype = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, register })(Register);
