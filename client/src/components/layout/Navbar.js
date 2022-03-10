import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../store/actions/auth";

const Navbar = ({ isAuthenticated, logout }) => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i>DevBook
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/profiles">Developers</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        ) : (
          <li>
            <Link to="/register">Register</Link>
          </li>
        )}

        {isAuthenticated ? (
          <li>
            <Link to="/dashboard">
              <i class="fas fa-user"></i>
              <span class="hide-sm">Dashboard</span>{" "}
            </Link>
          </li>
        ) : null}

        {isAuthenticated ? (
          <li>
            <Link to="/login" onClick={logout}>
              <i class="fas fa-sign-out-alt"></i>
              <span class="hide-sm">Logout</span>{" "}
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

Navbar.prototype = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Navbar);
