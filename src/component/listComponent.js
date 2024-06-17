import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../component/listComponent.module.css';
import { FaCirclePlay } from "react-icons/fa6";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getCookie } from '../utils/cookie';
import { IoIosAddCircle } from "react-icons/io";

const PlaylistPage = () => {
  const { id, name } = useParams();
  const [title, setTitle] = useState('');
  const [isHovered, setIsHovered] = useState(null);
  const [listdelete, setListDelete] = useState(false);
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSongUrl, setPlayingSongUrl] = useState('');
  const navigate = useNavigate();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isDivVisible, setDivVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const token = getCookie("name");
    axios.get(`https://ytmusic.minisang.xyz/api/playlist/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setSongs(res.data);
      setTitle(res.data);
    }).catch(error => {
      console.error(error);
    });
  }, [id]);

  useEffect(() => {
    const token = getCookie("name");
    axios.get(`https://ytmusic.minisang.xyz/api/playlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setTitle(res.data);
    }).catch(error => {
      console.error('Error fetching playlist:', error);
    });
  }, [id]);

  const handleSongClick = (index) => {
    setCurrentSongIndex(index);
    setPlayingSongUrl(`https://ytmusic.minisang.xyz/api/music/get/${songs[index].id}`);
    setIsPlaying(true);
  }

  useEffect(() => {
    if (songs.length > 0 && isPlaying) {
      setPlayingSongUrl(`https://ytmusic.minisang.xyz/api/music/get/${songs[currentSongIndex].id}`);
    }
  }, [currentSongIndex, isPlaying, songs]);

  const handleNextSong = () => {
    setCurrentSongIndex((currentSongIndex + 1) % songs.length);
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

  const listDelete = () => {
    const token = getCookie("name");
    axios.delete(`https://ytmusic.minisang.xyz/api/playlist/${id}/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    navigate('/');
    setListDelete(false);
  }

  const deleteBoxTrue = () => {
    setListDelete(true);
  }

  const deleteBoxTrue1 = () => {
    setListDelete(false);
  }

  const deleteSong = (e, musicId) => {
    e.stopPropagation();
    const token = getCookie("name");
    axios.delete(`https://ytmusic.minisang.xyz/api/playlist/${id}/delete/${musicId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const updatedSongs = songs.filter(song => song.id !== musicId);
    setSongs(updatedSongs);
  }

  const update = () => {
    const token = getCookie("name");
    console.log(inputValue);
    axios.patch(`https://ytmusic.minisang.xyz/api/playlist/${id}/${inputValue}`,{}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    navigate("/")
  }

  const handleConfirmClick = () => {
    setDivVisible(true)
  }

  return (
    <>
      <div className={styles.AllContainer}>
        {listdelete && (
          <div className={styles.overlay}>
            <div className={styles.deleteBox}>
              <div className={styles.deleteText}>
                <div className={styles.deleteListText}>재생목록 삭제</div>
                <div className={styles.deleteListText2}>재생목록을 삭제하시겠습니까?</div>
              </div>
              <button className={styles.deleteButton} onClick={() => { listDelete() }}>삭제</button>
              <button className={styles.deleteButton} onClick={() => { deleteBoxTrue1() }}>취소</button>
            </div>
          </div>
        )}
        <div className={styles.container}>
          <div className={styles.imgContainer}>대충 사진</div>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.subTitle}>공개 <span dir="auto" className="style-scope yt-formatted-string"> • Premium</span></div>
            <div className={styles.subTitle}>성훈뮤직 <span dir="auto" className="style-scope yt-formatted-string"></span></div>
            <button className={styles.button} onClick={() => {handleConfirmClick()}}>수정</button>
            <span dir="auto" className="style-scope yt-formatted-string"> • </span>
            <button className={styles.button} onClick={() => { deleteBoxTrue() }}>삭제</button>
          </div>
        </div>
        <div className={styles.container2}>
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={styles.mapContainer}
              onMouseEnter={() => setIsHovered(song.id)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => handleSongClick(index)}>
              <div className={styles.list}>
                <div className={styles.iconContainer}>{isHovered === song.id && <div className={styles.icon}><FaCirclePlay /></div>}</div>
                <div className={styles.Stitle}>{song.title.length > 25 ? `${song.title.slice(0, 25)}...` : song.title}</div>
                <div className={styles.Sartist}>{song.channelName}</div>
                <div className={styles.Sviews}>{formatViews(song.viewCount)}회</div>
                <div className={styles.Sduration}>{song.duration}</div>
                <button className={styles.delete} onClick={(e) => { deleteSong(e, song.id) }}>삭제</button>
              </div>
            </div>
          ))}
        </div>
        {isDivVisible && (
          <>
            <div className={styles.overlay}></div>
            <div className={styles.addContainer}>
              <div className={styles.text2}>제목 수정</div>
              <input
                className={styles.input}
                type="text"
                name="playlistTitle"
                placeholder="제목"
                value={inputValue}
                onChange={handleInputChange}
            />
              <button onClick={() => update()} className={styles.addButton}>수정</button>
              <button onClick={() => setDivVisible(false)} className={styles.addButton}>취소</button>
            </div>
          </>
        )}
      </div>
      {isPlaying && (
        <AudioPlayer
          autoPlay
          src={playingSongUrl}
          playing={isPlaying}
          className={styles.reactplayer}
          onEnded={handleNextSong}
        />
      )}
    </>
  );
};

export default PlaylistPage;
