import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
    } else {
      console.log('Success');
      //   try {
      //     console.log('Form submitted successFully', formData);
      //     const config = {
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //     };

      //     const res = await axios.post('/api/register', formData, config);
      //     console.log('res after register is>>', res.data);
      //   } catch (err) {
      //     console.log(err.message);
      //   }
    }
  };
  return (
    <section className='container'>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form onSubmit={(e) => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses gravetar , so if you want to use a profile picture
            use a gravetar email.
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password'
            placeholder='Password'
            minLength={6}
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            minLength='6'
            value={confirmPassword}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>

      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </section>
  );
};

export default Register;
