import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialLoginState = { username: "", password: "" };
const initialRegisterState = { username: "", password: "" };
function App() {
  const baseUrl = process.env.REACT_APP_API ? process.env.REACT_APP_API : '';
  const [token, setToken] = useState(localStorage.getItem('user_token'));
  const [lastReg, setLastReg] = useState({});
  const [login, setLogin] = useState(initialLoginState);
  const [register, setRegister] = useState(initialRegisterState);
  const [jokes, setJokes] = useState([]);
  const loginSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + '/api/auth/login', login).then(res => {
      localStorage.setItem('user_token', res.data.token);
      setToken(res.data.token);
      setLogin(initialLoginState);
    });
  }
  const loginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }
  const registerChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  }
  const registerSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + '/api/auth/register', register).then(res => {
      setLastReg(res.data);
      setRegister(initialRegisterState);
    });
  }
  const logout = () => {
    localStorage.removeItem('user_token');
    setToken("");
  }
  useEffect(() => {
    if(token) {
      axios.get(baseUrl + '/api/jokes', { headers: {'Authorization': token} }).then(jokes => {
        setJokes(jokes.data);
      });
    }
  }, [token])
  return (
    <div className="App">
      {token ? <button onClick={logout}>LOGOUT</button> : null}
      <h1>Login</h1>
      <form onSubmit={loginSubmit}>
        <input name="username" type="text" placeholder="username" value={login.username} onChange={loginChange} />
        <input name="password" type="password" placeholder="password" value={login.password} onChange={loginChange} />
        <button>Submit</button>
      </form>
      {token ? <div className="response">
        {token}<br /><br />
        {atob(token.split('.')[1])}
      </div> : null}
      <br />
      <br />
      {!token ? <>
        <h1>Register</h1>
        <form onSubmit={registerSubmit}>
          <input name="username" type="text" placeholder="username" value={register.username} onChange={registerChange}/>
          <input name="password" type="password" placeholder="password" value={register.password} onChange={registerChange}/>
          <button>Submit</button>
        </form>
        {Object.keys(lastReg).length ? <div className="response">
          {JSON.stringify(lastReg)}
        </div> : null}
      </> : <div className="jokesList">
        {jokes.map(joke => <div key={joke.id} className="joke">{joke.joke}</div>)}
      </div>}
    </div>
  );
}

export default App;
