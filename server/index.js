const http = require('http');
const express = require('express');
const youtubeApi = require('./youtubeService');
const db = require('../database/postgres');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const roomSpace = io.of('/room');
const lobbySpace = io.of('/lobby');
let roomHost;


server.listen(port, () => console.log(`listening on port ${port}`));

app.use(express.static(`${__dirname}./../client`));

app.get('/renderRoom', (req, res) => {
  const roomProperties = {};

  db.findVideos()
    .then((videos) => { roomProperties.videos = videos; })
    .then(() => db.getRoomProperties())
    .then(({ indexKey, startTime }) => {
      roomProperties.index = indexKey;
      roomProperties.start = startTime;
    })
    .then(() => res.json(roomProperties))
    .catch(() => res.sendStatus(404));
});

app.get('/search', (req, res) => {
  youtubeApi.grabVideos(req.query.query)
    .then(searchResults => res.json(searchResults))
    .catch(() => res.sendStatus(404));
});

const sendIndex = ({ indexKey }) => {
  roomSpace.emit('playNext', indexKey);
};

app.patch('/playNext/:length', (req, res) => {
  const roomPlaylistLength = Number(req.params.length);
  db.getIndex()
    .then((currentSongIndex) => {
      if (roomPlaylistLength === currentSongIndex) {
        db.resetRoomIndex()
          .then(room => sendIndex(room.dataValues));
      } else {
        db.incrementIndex()
          .then(room => sendIndex(room.dataValues));
      }
    })
    .then(() => db.setStartTime())
    .then(() => res.end())
    .catch(err => res.send(err));
});

const giveHostStatus = (host) => {
  roomSpace.to(host).emit('host');
};

roomSpace.on('connection', (socket) => {
  console.log(`connected to ${Object.keys(socket.nsp.sockets).length} socket(s)`);


  if (Object.keys(socket.nsp.sockets).length === 2) {
    roomHost = socket.id;
    giveHostStatus(roomHost);
  }

  const sendPlaylist = () => (
    db.findVideos()
      .then((videos) => {
        if (videos.length === 1) {
          db.setStartTime();
        }
        roomSpace.emit('retrievePlaylist', videos);
      })
      .catch(err => roomSpace.emit('Could not save YT data: ', err))
  );

  socket.on('saveToPlaylist', (video) => {
    const videoData = {
      title: video.snippet.title,
      creator: video.snippet.channelTitle,
      url: video.id.videoId,
      description: video.snippet.description,
    };
    return db.storeVideoInDatabase(videoData)
      .then(() => sendPlaylist());
  });

  socket.on('removeFromPlaylist', (video) => {
    console.log(video);
  });

  socket.on('disconnect', () => {
    if (Object.keys(socket.nsp.sockets).length > 1) {
      const newHost = Object.keys(socket.nsp.sockets)[1];
      const socketIdandRoom = socket.id.split('#'); // [roomName, socketId];
      console.log(`A user has disconnected from ${socketIdandRoom[0]}`);
      return (newHost === roomHost) ? null : giveHostStatus(newHost);
    } else {
      console.log(`${roomSpace.name} is now empty`);
    }
  });
});
