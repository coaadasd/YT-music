  import axios from 'axios';
  import React, { useEffect, useState, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useParams } from 'react-router-dom';
  import styles from '../component/listUpdate.module.css';
  import { FaCirclePlay } from "react-icons/fa6";

  const ListUpdate = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [isHovered, setIsHovered] = useState(null);
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();
    const audioUrl = `${window.location.origin}/audio/군대 기상나팔.mp3`;

    const audioRef = useRef(null);

    useEffect(() => {
      axios.get(`http://localhost:8000/playlists`)
        .then(res => setPlaylists(res.data))
        .catch(error => console.error(error));
    }, []);


    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audio.play();
      audioRef.current = audio;
    };

    const handleSongClick = (songId) => {
      console.log(`재생 클릭한 곡의 ID: ${songId}`);
      playAudio();
    }

    useEffect(() => {
      axios.get(`https://ytmusic.minisang.xyz/api/playlist/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setSongs(res.data.songs);
        })
        .catch(error => {
          console.error(error);
        });
    }, [id]);

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


    return (
      <div className={styles.AllContainer}>
        <div className={styles.container}>
          <div className={styles.imgContainer}>대충 사진</div>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.subTitle}>공개 <span dir="auto" className="style-scope yt-formatted-string"> • Premium</span></div>
            <div className={styles.subTitle}>성훈뮤직 <span dir="auto" className="style-scope yt-formatted-string"></span></div>
            <button className={styles.button}>수정</button>
            <span dir="auto" className="style-scope yt-formatted-string"> • </span>
            <button className={styles.button}>삭제</button>
          </div>
        </div>
        <div className={styles.container2}>
          {songs.map(song => (
            <div
              key={song.id}
              className={styles.mapContainer}
              onMouseEnter={() => setIsHovered(song.id)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => handleSongClick(song.id)}
            >
              <div className={styles.list}>
                <div className={styles.iconContainer}>{isHovered === song.id && <div className={styles.icon}><FaCirclePlay /></div>}</div>
                <div className={styles.Stitle}>{song.title}</div>
                <div className={styles.Sartist}>{song.artist}</div>
                <div className={styles.Sviews}>{formatViews(song.views)}회</div>
                <div className={styles.Sduration}>{song.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default ListUpdate;