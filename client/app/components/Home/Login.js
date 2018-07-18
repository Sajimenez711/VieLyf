import React, { Component } from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom';
var vista = ('');
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      loginError: '',
      loginEmail: '',
      loginPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: ''
    };

    this.onLogin = this.onLogin.bind(this);
    this.onEditProfile = this.onEditProfile.bind(this);
    this.logout = this.logout.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      console.log(token)
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
            const obj1 = getFromStorage('email')
            const {token1} = obj1;
            fetch('/api/account/isnutriologist?token='+token1)
            .then(res => res.json())
            .then(json1 => {
              console.log(json1.success)
              if(json1.success){
                window.location=('/vistanutriologo');
              } else {
                window.location=('/vistacliente');
              }
              
              console.log(json1);
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onLogin() {

    const {
      loginEmail,
      loginPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    fetch('/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({        
        Email: loginEmail,
        Password: loginPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          setInStorage('email', { token1: json.Email });
          this.setState({
            loginError: json.message,
            isLoading: false,
            loginPassword: '',
            loginEmail: '',
            token: json.token,
          });
          fetch('/api/account/isnutriologist?token='+loginEmail)
            .then(res => res.json())
            .then(json1 => {
              console.log(json1.success)
              if(json1.success){
                window.location=('/vistanutriologo');
              } else {
                window.location=('/vistacliente');
              }
              
              console.log(json1)
            });    
        } else {
          this.setState({
            loginError: json.message,
            isLoading: false,
          });
          console.log(loginPassword);
        }
      });
  }

  onEditProfile() {
    const {signUpEmail, signUpFirstName, signUpLastName, signUpPassword} = this.state;
      fetch('/api/account/editprofile?token='+signUpEmail+'&token2='+signUpFirstName+'&token3='+signUpLastName+'&token4='+signUpPassword+'')
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
}
  
  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      loginError,
      loginEmail,
      loginPassword
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>
          <div>
            {
              (loginError) ? (
                <p>{loginError}</p>
              ) : (null)
            }
            <h1>Log In</h1>
            <input
              name="loginEmail"
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={this.handleInputChange}
            />
            <br />
            <input
              type="password"
              name="loginPassword"
              placeholder="Password"
              value={loginPassword}
              onChange={this.handleInputChange}
            />
            <br />
            <button type="button" className="btn btn-dark" onClick={this.onLogin}>Log In</button>
          </div>
        </div>
      );
    }

    return (
      <div>
      </div>
        
    );
  }
}

export default Login;