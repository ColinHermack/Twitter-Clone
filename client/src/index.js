import React from 'react';
import ReactDOM  from 'react-dom/client';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      darkMode: true,
      userInformation: {}
    }
    this.loginPage = this.loginPage.bind(this);
    this.createAccountPage = this.createAccountPage.bind(this);
    this.signInPage = this.signInPage.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  render() {
    if (this.state.status === 0) {
      return (
        this.loginPage()
        );
    } else if (this.state.status === 1) {
      return (
        this.createAccountPage()
      );
    }
    
  }

  loginPage() {
    const renderCreateAccount = () => {
      this.setState({status: 1});
    }
    const renderSignIn = () => {
      this.setState({status: 2});
    }
    return (
      <div id='login-container'>
        <div id='logo-container'><FontAwesomeIcon icon={faFeather}/></div>
        <div id='controls-container'>
          <h1>Happening now</h1>
          <h2>Join today.</h2>
          <button id='create-account-button' onClick={renderCreateAccount}>Create account</button>
          <h3>Already have an account?</h3>
          <button id='sign-in-button' onClick={renderSignIn}>Sign in</button>
        </div>
      </div>
    );
  }

  createUser(username, password, bio, photo) {

    //Open a new POST request
    const request = new XMLHttpRequest();
    request.open("POST", "/api/create-account", true)
    request.setRequestHeader("Content-Type", "application/json");

    //Create the request body
    const body = JSON.stringify({
      username: username,
      password: password,
      bio: bio,
      photo: photo
    });

    //Set the onload function
    request.onload = () => {
      this.setState({ userInformation: JSON.parse(request.responseText)});
    }

    //Send the request
    request.send(body);
  }

  createAccountPage() {
    const validateUsername = () => {
      if (document.getElementById("username-input-box").value.length === 0) {
        document.getElementById("username-warning").innerHTML = "What's your username?";
        document.getElementById("username-input-box").style.border = "1px solid red";
      } else if (document.getElementById("username-input-box").value.includes(" ")){
        document.getElementById("username-warning").innerHTML = "Usernames cannot include spaces."
        document.getElementById("username-input-box").style.border = "1px solid red";
      } else {
        document.getElementById("username-warning").innerHTML = "";
        document.getElementById("username-input-box").style.border = "1px solid rgb(120, 120, 120)";
      }
    }

    const validatePassword = () => {
      if (document.getElementById("password-input-box").value.length === 0) {
        document.getElementById("password-warning").innerHTML = "Enter a password.";
        document.getElementById("password-input-box").style.border = "1px solid red";
      } else if (document.getElementById("password-input-box").value.includes(" ")) {
        document.getElementById("password-warning").innerHTML = "Passwords cannot include spaces.";
        document.getElementById("password-input-box").style.border = "1px solid red";
      } else {
        document.getElementById("password-warning").innerHTML = "";
        document.getElementById("password-input-box").style.border = "1px solid rgb(120, 120, 120)";
      }

      if (document.getElementById("password-confirm-box").value !== document.getElementById("password-input-box").value) {
        document.getElementById("password-confirm-warning").innerHTML = "Passwords do not match."
        document.getElementById("password-confirm-box").style.border = "1px solid red";
      } else {
        document.getElementById("password-confirm-warning").innerHTML = "";
        document.getElementById("password-confirm-box").style.border = "1px solid rgb(120, 120, 120)";
      }
    }

    const updatePhoto = () => {
      document.getElementById("profile-image-preview").src = document.getElementById("photo-input-box").value;
    }

    const createAccount = () => {
      validateUsername();
      validatePassword();
      this.createUser(
        document.getElementById('username-input-box').value,
        document.getElementById('password-input-box').value,
        document.getElementById('bio-input-box').value,
        document.getElementById('photo-input-box').value
      )
    }

    return (
      <div id='create-account-container'>
        <div id='info-container'>
          <h1>Create your account</h1>
          <label htmlFor='username-input-box' className='upper-label'>Username</label>
          <input type='username' id='username-input-box' onChange={validateUsername}/>
          <label htmlFor ='username-input-box' id='username-warning' className='warning-label'></label>
          <label htmlFor='password-input-box' className='upper-label'>Password</label>
          <input type='password' id='password-input-box' onChange={validatePassword} />
          <label htmlFor='password-input-box' id='password-warning' className='warning-label'></label>
          <label htmlFor='password-confirm-box' className='upper-label'>Confirm Password</label>
          <input type='password' id='password-confirm-box' onChange={validatePassword} />
          <label htmlFor='password-confirm-box' className='warning-label' id='password-confirm-warning'></label>
          <label htmlFor='bio-input-box' className='upper-label'>Bio</label>
          <input type='text' id='bio-input-box' />
          <label htmlFor='photo-input-box' className='upper-label' >Photo Link</label>
          <input type='text' id='photo-input-box' />
          <button id='apply-image-button' onClick={updatePhoto}>Apply</button>
          <img src="https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg" alt="The user's profile" id='profile-image-preview'></img>
          <button id='submit-create-account' onClick={createAccount}>Create Account</button>
        </div>
      </div>
    )
  }

  signInPage() {
    
  }
}

const root = ReactDOM.createRoot(document.getElementById('sign-in-root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)