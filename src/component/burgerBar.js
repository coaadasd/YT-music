import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../component/burgerBar.module.css";
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { FaCirclePlay } from "react-icons/fa6";
import { getCookie, removeCookie, setCookie } from '../utils/cookie';

const Burger = ({ children }) => {
  const [isDivVisible, setDivVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  const [signin, setSignin] = useState(false);
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("name");
    axios.get('https://ytmusic.minisang.xyz/api/auth/email/verification-status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 200) {
        // 이메일 인증이 완료된 경우
      } else {
        console.error("Unexpected response status: ", response.status);
        removeCookie("name");
        alert("메일 인증을 진행하고 다시 로그인해주세요.");
      }
    })
    .catch(error => {
      console.error("Error occurred:", error);
      removeCookie("name");
      if (token) {
        alert("메일 인증을 진행하고 다시 로그인해주세요.");
        window.location.reload();
      }
    });
  }, []);

  useEffect(() => {
    const token = getCookie("name");
    
    if (token) {
      axios.get('https://ytmusic.minisang.xyz/api/playlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => setPlaylists(res.data))
        .catch(error => console.error(error));
      
      setLoggedIn(true);
    }
  }, []);

  const handleAddClick = () => {
    setDivVisible(true);
  }

  const handleConfirmClick = () => {
    const title = document.querySelector('input[name="playlistTitle"]').value;
    const newPlaylist = {
      name: title,
      songs: []
    };
    const token = getCookie("name");
  
    if (!token) {
      alert("로그인이 필요합니다. 로그인을 진행해주세요.");
      return;
    }
  
    axios.post(`https://ytmusic.minisang.xyz/api/playlist/${title}/create`, newPlaylist, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res);
      console.log(res.data);
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
    })
    .catch(error => {
      console.error('오류 발생:', error);
    });
    
    setDivVisible(false);
  };

  const SignUpClick = () => {
    setSignUp(prevState => !prevState);
  }

  const SignIn = () => {
    setSignin(true);
    setSignUp(false);
  }

  const Register = () => {
    setSignin(false);
    setRegister(true);
  }
  
  const Login = () => {
    setRegister(false);
    setSignin(true);
  }
  
  const handleLogin = () => {
    const LoginUser = {
      id: userId,
      password: userPassword,
      keepLogin: true
    };
  
    axios.post('https://ytmusic.minisang.xyz/api/auth/login', LoginUser)
      .then(response => {
        console.log(response.data);
        setCookie("name", response.data, { path: '/' });
        setLoggedIn(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        navigate("/");
        window.location.reload();
      })
      .catch(error => {
        console.error('로그인 오류:', error);
        alert("정확히 입력하셨는지 확인 해주세요.");
      });
  };
  
  const handleRegister = () => {
    const newUser = {
      id: username,
      nickname: nickname,
      password: password,
      email: email
    };

    axios.post('https://ytmusic.minisang.xyz/api/auth/register', newUser)
      .then(response => {
        console.log(response.data);
        navigate("/");
        window.location.reload();
      })
      .catch(error => {
        console.error('회원가입 오류:', error);
        alert("아이디나 이메일이 중복되거나 이메일 형식이 맞지 않습니다.");
      });
    navigate("/");
  };

  const handlePlaylistClick = (id, name) => {
    navigate(`/playlist/${id}/${name}`);
  }

  const handleTitleClick = () => {
    navigate('/');
    window.location.reload();
  }

  const handleLogout = () => {
    removeCookie("name"); 
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className={styles.flexContainer}>
      <div className={styles.burgerContainer}>

          <div className={styles.text1} onClick={handleTitleClick}>성훈뮤직</div>
          <div className={styles.add} onClick={handleAddClick}><FaPlus /> &nbsp; 새 재생목록</div>
          <div className={styles.map}>
            {playlists.map(playlist => (
              <div
                key={playlist.id}
                className={styles.mapContainer}
                onMouseEnter={() => setIsHovered(playlist.id)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => handlePlaylistClick(playlist.id, playlist.name)}
              >
                <div className={styles.list}>
                  {playlist.name.length > 7 ? playlist.name.substring(0, 7) + '...' : playlist.name}
                  {isHovered === playlist.id && <div className={styles.icon}><FaCirclePlay /></div>}
                </div>
              </div>
            ))}
          </div>
          
        {isDivVisible && (
          <>
            <div className={styles.overlay}></div>
            <div className={styles.addContainer}>
              <div className={styles.text2}>새 재생목록</div>
              <input className={styles.input} type="text" name="playlistTitle" placeholder='제목' />
              <button onClick={handleConfirmClick} className={styles.addButton}>만들기</button>
              <button onClick={() => setDivVisible(false)} className={styles.addButton}>취소</button>
            </div>
          </>
        )}
      </div>

      {children}
      <div className={styles.signUp} onClick={SignUpClick}></div>
      
      {signUp && (
        <div>
        {loggedIn ? (
          <div className={styles.login} onClick={handleLogout}>로그아웃</div>
        ) : (
          <div className={styles.login} onClick={SignIn}>로그인</div>
        )}
        </div>
      )}  
      {signin && (
        <div className={styles.overlay}>
          <div className={styles.SignIn}>
            <div className={styles.SignText}>ACCOUNT LOGIN</div>
            <div className={styles.userName}>
              username<br></br>
              <input type='text' className={styles.userText} value={userId} onChange={(e) => { setUserId(e.target.value) }}></input>
            </div>
            <div className={styles.userName}>
              <br></br>
              password<br></br>
              <input type='password' className={styles.userText} value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }}></input>
            </div>
            <br>
            </br>
            <br></br>
            <div className={styles.passwdForgot}>비밀번호 찾기</div>
            <button className={styles.Login} onClick={handleLogin}>로그인</button>
            <div className={styles.register} onClick={Register}>계정이 없으신가요?</div>
          </div>
        </div>
      )}
      {register && (
        <div className={styles.overlay}>
          <div className={styles.Register}>
            <div className={styles.RegisterText}>REGISTER</div>
            <div className={styles.userDetails}>
              id<br></br>
              <input type='text' className={styles.userInput} value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className={styles.userDetails}>
              nickname<br></br>
              <input type='text' className={styles.userInput} value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <div className={styles.userDetails}>
              password<br></br>
              <input type='password' className={styles.userInput} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles.userDetails}>
              Confirm password<br></br>
              <input type='password' className={styles.userInput} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className={styles.userDetails}>
              email<br></br>
              <input type='email' className={styles.userInput} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <br></br>
            <br></br>
            <button className={styles.RegisterButton} onClick={handleRegister}>가입하기</button>
            <div className={styles.signin} onClick={Login}>이미 계정이 있으신가요?</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Burger;
