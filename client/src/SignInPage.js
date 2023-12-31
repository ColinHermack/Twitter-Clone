import React from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "default",
      darkMode: true,
    }
    this.loginPage = this.loginPage.bind(this);
    this.createAccountPage = this.createAccountPage.bind(this);
    this.signInPage = this.signInPage.bind(this);
    this.createUser = this.createUser.bind(this);
    this.signInUser = this.signInUser.bind(this);
  }

  componentDidMount() {
    //Retrieve browser cookies
    let cookieStrings = decodeURIComponent(document.cookie).split(";");
    let cookies = {};
    for (let i = 0; i < cookieStrings.length; i++) {
      cookieStrings[i] = cookieStrings[i].split("=");
      cookies[cookieStrings[i][0]] = cookieStrings[i][1];
    }

    //If a user's id is stored in the cookies then skip sign-in
    if (cookies.id !== undefined) {
      window.location.replace(`/home/${cookies.id}`);
    }

  }

  render() {
    if (this.state.status === 'default') {
      return (this.loginPage());
    } else if (this.state.status === 'create-account') {
      return (this.createAccountPage());
    } else if (this.state.status === 'sign-in') {
      return (this.signInPage());
    }
    
  }

  //The log in page for returning users
  loginPage() {
    const renderCreateAccount = () => {
      this.setState({status: "create-account"});
    }
    const renderSignIn = () => {
      this.setState({status: "sign-in"});
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

  //Makes a POST request to the API to create a new user
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
      const json = JSON.parse(request.responseText);
      console.log(json);
      if (json.error === 'Username already taken.') {
        document.getElementById('username-input-box').style.border = "1px solid red";
        document.getElementById('username-warning').innerHTML = 'Username already taken.'
      } else if (json.error === undefined) {
        document.cookie = `id=${json.id}`;
        window.location.replace(`/home/${json.id}`);
      }
    }

    //Send the request
    request.send(body);
  }

  //Makes a GET request to the API to log an existing user in
  signInUser(username, password) {
    //Open new GET request with username and password and send
    const request = new XMLHttpRequest();
    request.open("GET", `/api/signIn/${username}/${password}`);
    request.send();
    
    //Validate the user's credentials when the response is received
    request.onload = () => {
      const json = JSON.parse(request.responseText);

      //If the user's password is incorrect, outline the password box in red
      if (json.error === 'Incorrect Password.') {
        document.getElementById("password-input-box").style.border = "1px solid red";
        document.getElementById("password-warning").innerHTML = "Incorrect Password.";

      //If a user does not exist, outline the username box in red
      } else if (json.error === 'User does not exist.') {
        document.getElementById("username-input-box").style.border = "1px solid red";
        document.getElementById("username-warning").innerHTML = "Invalid Username."
      
      //Otherwise, proceed to the user's home page
      } else if (json.error === undefined) {
        window.location.replace(`/home/${json.id}`);
      }
    }
  }

  createAccountPage() {
    
    //Validates whether the username is permissible and returns a boolean value indicating this
    const validateUsername = () => {
      //Ensure that a username of 1 or more characters has been entered
      if (document.getElementById("username-input-box").value.length === 0) {
        document.getElementById("username-warning").innerHTML = "What's your username?";
        document.getElementById("username-input-box").style.border = "1px solid red";
        return false;
      
      //Ensure that the username contains no spacess
      } else if (document.getElementById("username-input-box").value.includes(" ")){
        document.getElementById("username-warning").innerHTML = "Usernames cannot include spaces."
        document.getElementById("username-input-box").style.border = "1px solid red";
        return false;

      //If the username is valid, display normally and return true
      } else {
        document.getElementById("username-warning").innerHTML = "";
        document.getElementById("username-input-box").style.border = "1px solid rgb(120, 120, 120)";
        return true;
      }
    }

    //Check whether the password that has been entered is permissible and return a boolean indicating this
    const validatePassword = () => {
      
      //Ensure that the password is 1 or more characters
      if (document.getElementById("password-input-box").value.length === 0) {
        document.getElementById("password-warning").innerHTML = "Enter a password.";
        document.getElementById("password-input-box").style.border = "1px solid red";
        return false;
      
      //Ensure that the password does not include spaces
      } else if (document.getElementById("password-input-box").value.includes(" ")) {
        document.getElementById("password-warning").innerHTML = "Passwords cannot include spaces.";
        document.getElementById("password-input-box").style.border = "1px solid red";
        return false;

      //Ensure that the passwords in the regular password box and confirm password box match  
      } else if (document.getElementById("password-confirm-box").value !== document.getElementById("password-input-box").value) {
        document.getElementById("password-confirm-warning").innerHTML = "Passwords do not match."
        document.getElementById("password-confirm-box").style.border = "1px solid red";
        return false;

      //If password is valid, display normally and return true
      } else {
        document.getElementById("password-warning").innerHTML = "";
        document.getElementById("password-input-box").style.border = "1px solid rgb(120, 120, 120)";
        return true;
      }
    }

    //Updates the displayed photo based on the link entered by the user
    const updatePhoto = () => {
      document.getElementById("profile-image-preview").src = document.getElementById("photo-input-box").value;
    }

    //Validate the username and password and then call this.createUser()
    const createAccount = () => {
      if (validateUsername() && validatePassword()) {
        this.createUser(
          document.getElementById('username-input-box').value,
          document.getElementById('password-input-box').value,
          document.getElementById('bio-input-box').value,
          document.getElementById('photo-input-box').value
        )
      }
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
          <label htmlFor='photo-input-box' className='upper-label'>Photo Link</label>
          <input type='text' id='photo-input-box' />
          <button id='apply-image-button' onClick={updatePhoto}>Apply</button>
          <img src="https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg" alt="The user's profile" id='profile-image-preview'></img>
          <button id='submit-create-account' onClick={createAccount}>Create Account</button>
        </div>
      </div>
    )
  }

  signInPage() {
    const validateUsername = () => {
      if (document.getElementById("username-input-box").value.length === 0) {
        document.getElementById("username-warning").innerHTML = "What's your username?";
        document.getElementById("username-input-box").style.border = "1px solid red";
        return false;
      } else if (document.getElementById("username-input-box").value.includes(" ")){
        document.getElementById("username-warning").innerHTML = "Usernames cannot include spaces."
        document.getElementById("username-input-box").style.border = "1px solid red";
        return false;
      } else {
        document.getElementById("username-warning").innerHTML = "";
        document.getElementById("username-input-box").style.border = "1px solid rgb(120, 120, 120)";
        return true;
      }
    }

    const validatePassword = () => {
      if (document.getElementById("password-input-box").value.length === 0) {
        document.getElementById("password-warning").innerHTML = "Enter a password.";
        document.getElementById("password-input-box").style.border = "1px solid red";
        return false;
      } else if (document.getElementById("password-input-box").value.includes(" ")) {
        document.getElementById("password-warning").innerHTML = "Passwords cannot include spaces.";
        document.getElementById("password-input-box").style.border = "1px solid red";
        return false;
      } else {
        document.getElementById("password-warning").innerHTML = "";
        document.getElementById("password-input-box").style.border = "1px solid rgb(120, 120, 120)";
        return true;
      }
    }

    const signIn = () => {
      if (validateUsername() && validatePassword()) {
        this.signInUser(
          document.getElementById("username-input-box").value,
          document.getElementById("password-input-box").value
        )
      }
    }

    return (
      <div id='sign-in-container'>
        <div id='info-container'>
          <h1>Log In</h1>
          <div id='username-input' className='input-container'>
            <label htmlFor='username-input-box' className='upper-label'>Username</label>
            <input type='username' id='username-input-box' onChange={validateUsername}/>
            <label htmlFor='username-input-box' id='username-warning' className='warning-label'></label>
          </div>
          <div id='password-input' className='input-container'>
            <label htmlFor='password-input-box' className='upper-label'>Password</label>
            <input type='password' id='password-input-box' onChange={validatePassword}/>
            <label htmlFor='password-input-box' className='warning-label' id='password-warning'></label>
          </div>
          <button id='submit-sign-in' onClick={signIn}>Log In</button>
        </div>
      </div>
    )
  }
}

export default SignInPage;