import React, { createContext, useContext, useState } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [playingSongUrl1, setPlayingSongUrl1] = useState('');

  const value = {
    setIsPlaying1,
    setPlayingSongUrl1
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};