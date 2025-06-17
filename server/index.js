const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;
const HOST = '0.0.0.0';

app.use(cors({
  origin: '*'
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.handshake.address);
  
  socket.on('videoInfo', (data) => {
    console.log('Reçu depuis extension Chrome:', data);
    io.emit('videoInfo', data); 
  });
  
  socket.on('newLink', async (url) => {
    console.log('Lien reçu:', url);

    if (!url || !url.includes('youtube.com/watch')) {
      socket.emit('errorMessage', 'URL YouTube invalide');
      return;
    }

    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      let title = $('title').text().replace(' - YouTube', '').trim();

      let thumbnail =
        $('link[rel="image_src"]').attr('href') ||
        $('meta[itemprop="thumbnailUrl"]').attr('content');

      if (!thumbnail) {
        const videoIdMatch = url.match(/v=([^&]+)/);
        if (videoIdMatch) {
          const videoId = videoIdMatch[1];
          thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }

      let channel =
        $('meta[itemprop="author"]').attr('content') ||
        $('link[itemprop="name"]').attr('content') ||
        $('a.yt-simple-endpoint.style-scope.yt-formatted-string').first().text().trim();

      const videoInfo = { title, thumbnail, channel };

      io.emit('videoInfo', videoInfo);
    } catch (error) {
      console.error('Erreur pendant fetch/parsing:', error);
      socket.emit('errorMessage', 'Erreur lors de la récupération des infos');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT} les bobobosss`);
});
