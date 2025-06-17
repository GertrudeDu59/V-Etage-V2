import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './sass/home.scss';
// jsp si c'est utile mais ip de gev quand meme
const socket = io('http://localhost:3001');

const Home = () => {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!url.trim()) {
      setMessage("T'as pas mis de lien bouffon");
      return;
    }
    socket.emit('newLink', url);
  };

  useEffect(() => {
    socket.on('errorMessage', (msg) => setMessage(msg));
    socket.on('videoInfo', (info) => {
      setMessage(`Lien envoyé : ${info.title} (${info.channel})`);
      setTimeout(() => setMessage(''), 3000);
    });

    return () => {
      socket.off('errorMessage');
      socket.off('videoInfo');
    };
  }, []);

  return (
    <div className="home-form">
      <div className="container-form">
        <div className="form-top">
          <input
            className="input-form"
            type="text"
            placeholder="Lien YouTube"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <button className="form-button" onClick={handleSend}>Envoyer</button>
        </div>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
};

export default Home;
