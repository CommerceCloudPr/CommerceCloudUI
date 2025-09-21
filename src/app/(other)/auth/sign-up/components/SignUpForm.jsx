import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, FormControl } from 'react-bootstrap';
const SignUpForm = () => {

  const [firstNameController, setFirstNameController] = useState();
  const [lastnameController, setLastnamesetLastnamecontroller] = useState();
  const [usernameController, setUsernameController] = useState();
  const [emailController, setEmailController] = useState();
  const [passwordController, setPasswordController] = useState();
  const session = localStorage.getItem('session_token');
  const router = useRouter();
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email) === true) setEmailController(false)
    return regex.test(email);
  }
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    sms_permission: true,
    email_permission: true
  })

  const handleSaveUser = (user) => {
    const data = {
      "firstName": user.firstname,
      "lastName": user.lastname,
      "username": user.username,
      "email": user.email,
      "password": user.password,
      "sms_permission": true,
      "email_permission": true
    }
    fetch('http://api-dev.aykutcandan.com/user/info/register',
      {
        headers: {
          'Authorization': `Bearer ${decodeURIComponent(session)}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }
    ).then((res)=> {
      if(res.status === 200){
        router.push('/')
      }
    })
  }

  return <div className='d-flex flex-column gap-3'>
    <div className='d-flex flex-column gap-1 justify-content-start'>
      <label className='fs-6'>First Name</label>
      <FormControl className={`border border-${firstNameController === undefined ? '' : (firstNameController === true ? 'danger' : firstNameController === false ? 'success' : '')}`} onChange={(e) => {
        if (e.target.value.trim() === "") {
          setFirstNameController(true)
        } else {
          setFirstNameController(false)
        }
        setUser({ ...user, firstname: e.target.value })
      }} type='text' placeholder="Enter your name" />
    </div>
    <div>
      <label className='fs-6'>Last Name</label>
      <FormControl className={`border border-${lastnameController === undefined ? '' : (lastnameController === true ? 'danger' : lastnameController === false ? 'success' : '')}`} onChange={(e) => {
        setUser({ ...user, lastname: e.target.value })
        if (e.target.value.trim() === "") {
          setLastnamesetLastnamecontroller(true);
        } else {
          setLastnamesetLastnamecontroller(false)
        }
      }} type='text' placeholder="Enter your last name" />
    </div>
    <div>
      <label className='fs-6'>Username</label>
      <FormControl className={`border border-${usernameController === undefined ? '' : (usernameController === true ? 'danger' : usernameController === false ? 'success' : '')}`} onChange={(e) => {
        setUser({ ...user, username: e.target.value })
        if (e.target.value.trim() === "") {
          setUsernameController(true)
        } else {
          setUsernameController(false)
        }
      }} type='text' placeholder="Enter your username" />
    </div>
    <div>
      <label className='fs-6'>Email Address</label>
      <FormControl className={`border border-${emailController === undefined ? '' : (emailController === true ? 'danger' : emailController === false ? 'success' : '')}`} onChange={(e) => {
        validateEmail(e.target.value)
        setUser({ ...user, email: e.target.value })
      }} type='email' placeholder="Enter your email" />
    </div>
    <div>
      <label className='fs-6'>Password</label>
      <FormControl className={`border border-${passwordController === undefined ? '' : (passwordController === true ? 'danger' : passwordController === false ? 'success' : '')}`} onChange={(e) => {
        if (e.target.value.trim() === "") {
          setPasswordController(true);
        } else {
          setPasswordController(false)
        }
        setUser({ ...user, password: e.target.value })
      }} type='password' placeholder="Enter your password" />
    </div>
    <div className="mb-1 text-center d-grid">
      <Button variant="primary" type="submit" onClick={() => {
        if (!firstNameController && !lastnameController && !usernameController && !emailController && !passwordController) {
          handleSaveUser(user)
        }
      }}>
        Sign Up
      </Button>
    </div>
  </div>;
};
export default SignUpForm;