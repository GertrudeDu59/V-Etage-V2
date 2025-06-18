const socket = io('http://localhost:3001');

let lastVideoId = null;

function getVideoId() {
  return new URLSearchParams(window.location.search).get('v');
}

function getTitleAndChannel(maxTries = 15, interval = 300) {
  return new Promise((resolve) => {
    let tries = 0;
    function attempt() {
      const title = document.title.replace(' - YouTube', '').trim();
      const channel = document.querySelector('#text-container yt-formatted-string')?.textContent?.trim();

      if (title && title !== 'YouTube' && channel) {
        resolve({ title, channel });
      } else if (tries >= maxTries) {
        resolve({ title: title || 'Inconnu', channel: channel || 'Inconnu' });
      } else {
        tries++;
        setTimeout(attempt, interval);
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
      resolve(
        img.naturalWidth > 120 && img.naturalHeight > 90
          ? maxRes
          : fallback
      );
    };
    img.onerror = () => resolve(fallback);
    img.src = maxRes;
  });
}

async function sendVideoInfoIfNew() {
  const videoId = getVideoId();
  if (!videoId || videoId === lastVideoId) return;
  lastVideoId = videoId;


  await new Promise((r) => setTimeout(r, 1200));

  const [info, thumbnail] = await Promise.all([
    getTitleAndChannel(),
    getThumbnail(videoId),
  ]);

  socket.emit('videoInfo', { ...info, thumbnail });
}

let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    sendVideoInfoIfNew();
  }
}, 800);

setTimeout(sendVideoInfoIfNew, 2000);
