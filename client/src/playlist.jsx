import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './sass/playlist.scss'

const socket = io('http://localhost:3001');

const Playlist = () => {
  const [info, setInfo] = useState({ title: '', channel: '', thumbnail: '' });

  useEffect(() => {
    socket.on('videoInfo', (data) => {
      setInfo(data);
    });

    return () => {
      socket.off('videoInfo');
    };
  }, []);

  return (
    <div className='playlist-container'>
      <div className="playlist">
        <div className='img-container'>
          {info.thumbnail && (
            <img
              src={info.thumbnail}
              alt="Miniature"
              className="miniature"
            />
          )}
        </div>
        <div className='title-wrap'>
          <h2 className="title-top">{info.title}</h2>
          <p className="title-bottom">{info.channel}</p>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
