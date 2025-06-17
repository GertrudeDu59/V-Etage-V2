// Ip de gev
const socket = io('http://localhost:3001');

let lastVideoId = null;

function getVideoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('v');
}

function getTitleAndChannel(maxTries = 10, interval = 100) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    function attempt() {
      const title = document.title.replace(' - YouTube', '').trim();
      const channelElem = document.querySelector('#text-container yt-formatted-string');
      const channel = channelElem?.textContent?.trim();

      if (title && title !== 'YouTube' && channel) {
        resolve({ title, channel });
      } else {
        tries++;
        if (tries >= maxTries) {
          resolve({ title: title || 'Inconnu', channel: channel || 'Inconnu' });
        } else {
          setTimeout(attempt, interval);
        }
      }
    }
    attempt();
  });
}

function getThumbnail(videoId) {
  return new Promise((resolve) => {
    const maxRes = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 120 && img.naturalHeight > 90) {
        resolve(maxRes);
      } else {
        resolve(fallback);
      }
    };
    img.onerror = () => {
      resolve(fallback);
    };
    img.src = maxRes;
  });
}

async function sendVideoInfoIfNew() {
  const videoId = getVideoId();
  if (!videoId || videoId === lastVideoId) return;

  lastVideoId = videoId;

  const [info, thumbnail] = await Promise.all([
    getTitleAndChannel(),
    getThumbnail(videoId)
  ]);
  
  socket.emit('videoInfo', { ...info, thumbnail });
}

let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    sendVideoInfoIfNew();
  }
}, 1000);

setTimeout(sendVideoInfoIfNew, 2000);
