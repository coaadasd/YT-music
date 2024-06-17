import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Burger from "./burgerBar";
import styles from "../component/indexComponent.module.css";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMore } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {getCookie, removeCookie, setCookie} from '../utils/cookie'
import { IoIosAddCircleOutline } from "react-icons/io";

const IndexComponent = ({ children }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const [songDetailsPosition, setSongDetailsPosition] = useState({ x: 0, y: 0 });
  const [topData, setTopData] = useState(null);
  const firstData = results.length > 0 ? results[0] : null;
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSongUrl, setPlayingSongUrl] = useState('');
  

  const modalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const buttonContainerRef = useRef(null);

  useEffect(() => {
    const token = getCookie("name");
    axios.get('https://ytmusic.minisang.xyz/api/playlist', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => setPlaylists(res.data))
      .catch(error => console.error(error));
      console.log(playlists)
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleShowAll = () => {
    setShowAll(true);
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://ytmusic.minisang.xyz/api/music/search/${keyword}`);
      const data = response.data;
      setTopData(response.data);
      setResults(data);
      setSearched(true);
      setShowAll(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  const formatViews = (views) => {
    if (views < 1000) {
      return views;
    } else if (views < 10000) {
      return `${Math.floor(views / 1000)}천`;
    } else if (views < 100000000) {
      return `${Math.floor(views / 10000)}만`;
    } else {
      return `${Math.floor(views / 100000000)}억`;
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSongClick = (event, song) => {
    const x = event.clientX;
    const y = event.clientY;
    setSongDetailsPosition({ x, y });
    setSelectedSong(song);
  };

  const handlePlaylistClick = async (playlistId, playlistName) => {
    const token = getCookie("name");
    const musicId = selectedSong.id;
  
    try {
      const response = await axios.post(`https://ytmusic.minisang.xyz/api/playlist/${playlistId}/add/${musicId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setShowPlaylist(false);
        setSelectedSong(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("이미 추가되어있습니다.");
        setShowPlaylist(false);
        setSelectedSong(null);
      } else {
        console.error("Error adding song to playlist", error);
      }
    }
  };


  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (event) => {
    if (buttonContainerRef.current && buttonContainerRef.current.contains(event.target)) {
      return;
    }
    setIsButtonVisible(false);
  };
  const handleModal = () => {
    if (isOpen === true) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      }
  };

  const handleSongClick1 = (songId) => {
    console.log(`재생 클릭한 곡의 ID: ${songId}`);
    setPlayingSongUrl(`https://ytmusic.minisang.xyz/api/music/get/${songId}`)
    setIsPlaying(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.indexContainer}>
        <div className={styles.searchContainer}>
          <IoIosSearch className={styles.icon} />
          <input type="search" className={styles.search} placeholder="노래, 앨범, 아티스트 검색" value={keyword} onChange={handleChange} onKeyPress={handleKeyPress} />
        </div>
      <ul className={styles.text}>
        {searched && (
          <div>
          <div className={styles.firstSearch}>상위 검색결과</div>
              <div className={styles.firstContainer}>
                <div className={styles.firstImg}></div>
                {firstData && (
                  <div className={styles.firstBox}>
                    <p className={styles.firstBoxTitle}>{firstData.title.length > 20 ? firstData.title.substring(0, 20) + '...' : firstData.title}</p>
                    <p className={styles.firstBoxArtist}>노래 • {firstData.channelName}</p>
                  </div>
                )}
                <button className={styles.firstButton} onClick={() => handleSongClick1(firstData.id)}><FaPlay></FaPlay>재생</button>
              </div>
          <div className={styles.songs}>노래</div>
            {results.length > 0 ? (
              showAll ? (
                results.map((song, index) => (
                  <li key={song.id} className={styles.listLi}>
                    <div className={styles.img} style={{backgroundImage: `url(${song.thumbnailUrl})`}}></div>
                    {song.title} <br></br> {song.channelName} / 조회수: {formatViews(song.viewCount)} / 길이: {song.duration}
                    <AiOutlineMore className={styles.jIcon} onClick={(e) => handleSongClick(e, song)} />
                  </li>
                ))
              ) : (
                results.slice(0, 4).map((song, index) => (
                  <li key={song.id} className={styles.listLi}>
                    <div className={styles.img} style={{backgroundImage: `url(${song.thumbnailUrl})`}}></div>
                    {song.title} <br></br> {song.channelName} / 조회수: {formatViews(song.viewCount)} / 길이: {song.duration}
                    <AiOutlineMore className={styles.jIcon} onClick={(e) => handleSongClick(e, song)} />
                  </li>
                ))
                )
              ) : (
                <li>검색 결과가 없습니다.</li>
              )}
            </div>
          )}
        </ul>
          {searched && results.length > 4 && !showAll && (
            <button onClick={handleShowAll} className={styles.button}>모두 표시</button>
          )}
        </div>

      {selectedSong && (
        <div 
          className={styles.songDetails}
          style={{ top: songDetailsPosition.y, left: songDetailsPosition.x }}>        
            <div ref={buttonContainerRef}>
              <button onClick={() => setShowPlaylist(!showPlaylist)} className={styles.addToPlaylistButton} id='layer-popup'>
                {showPlaylist ? '재생목록 숨기기' : '재생목록에 추가'}
              </button>
            </div>
          {showPlaylist && (
            <>
            <div className={styles.overlay}></div>
            <div className={styles.addContainer}>
            <div className={styles.addTitle}>재생목록</div>
              <div className={styles.PlayList}>
              {playlists.map(playlist => (
                <div 
                  className={styles.mapContainer} 
                  onMouseEnter={() => setIsHovered(playlist.id)} 
                  onMouseLeave={() => setIsHovered(null)}
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id, playlist.name)}
                >
                  <div className={styles.list}>
                    {playlist.name.length > 7 ? playlist.name.substring(0, 7) + '...' : playlist.name}
                    {isHovered === playlist.id && <div className={styles.icons}><IoIosAddCircleOutline /></div>}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </>
          )}
        </div>
      )}
      {isPlaying && (
        <AudioPlayer
          autoPlay
          src={playingSongUrl}
          playing={isPlaying}
          className={styles.reactplayer1}
        />
      )}
    </div>
  );
}

export default IndexComponent;
