import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styles from '../component/listComponent.module.css';
import { FaCirclePlay } from "react-icons/fa6";
import ReactPlayer from 'react-player'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {getCookie, removeCookie, setCookie} from '../utils/cookie'

const PlaylistPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const [listdelete, setListDelete] = useState(false);
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSongUrl, setPlayingSongUrl] = useState('');
  const navigate = useNavigate();
  


  useEffect(() => {
    const token = getCookie("name");
    console.log(token)
    axios.get(`https://ytmusic.minisang.xyz/api/playlist/${id}`, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
    }).then(res => {
        setSongs(res.data)
        setTitle(res.data)
        console.log(res.data)
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  const handleSongClick = (songId) => {
    console.log(`재생 클릭한 곡의 ID: ${songId}`);
    setPlayingSongUrl(`https://ytmusic.minisang.xyz/api/music/get/${songId}`)
    setIsPlaying(true);
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
    const token = getCookie("name");
    axios.delete(`https://ytmusic.minisang.xyz/api/playlist/${id}/delete/${musicId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const updatedSongs = songs.filter(song => song.id !== musicId);
    setSongs(updatedSongs);
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
            <h1 className={styles.title}>요아소비</h1>
            <div className={styles.subTitle}>공개 <span dir="auto" className="style-scope yt-formatted-string"> • Premium</span></div>
            <div className={styles.subTitle}>성훈뮤직 <span dir="auto" className="style-scope yt-formatted-string"></span></div>
            <button className={styles.button}>수정</button>
            <span dir="auto" className="style-scope yt-formatted-string"> • </span>
            <button className={styles.button} onClick={() => { deleteBoxTrue() }}>삭제</button>
          </div>
        </div>
        <div className={styles.container2}>
          {songs.map(song => (
            <div
              key={song.id}
              className={styles.mapContainer}
              onMouseEnter={() => setIsHovered(song.id)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => handleSongClick(song.id)}>
              <div className={styles.list}>
                <div className={styles.iconContainer}>{isHovered === song.id && <div className={styles.icon}><FaCirclePlay /></div>}</div>
                <div className={styles.Stitle}>{song.title}</div>
                <div className={styles.Sartist}>{song.channelName}</div>
                <div className={styles.Sviews}>{formatViews(song.viewCount)}회</div>
                <div className={styles.Sduration}>{song.duration}</div>
                <button className={styles.delete} onClick={(e) => {deleteSong(e, song.id)}}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isPlaying && (
        <AudioPlayer
          autoPlay
          src={playingSongUrl}
          playing={isPlaying}
          className={styles.reactplayer}
        />
      )}
    </>
  );
};

export default PlaylistPage;
