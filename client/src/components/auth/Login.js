import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../layout/Alert';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Success');
  };

  return (
    <section className='container'>
      <Alert />
      {/* <div className='alert alert-danger'>Invalid Credentials</div> */}

      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into your account
      </p>
      <form onSubmit={(e) => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password'
            placeholder='Password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>

      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
