import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
import Playlist from './Playlist';
import Search from './Search';
import ChatView from './ChatView';

const socket = io.connect('localhost:5000');
const roomSocket = io('/room');

class RoomView extends React.Component {
  constructor() {
    super();
    this.state = {
      currentVideo: undefined,
      playlist: [],
<<<<<<< HEAD
      startOptions: null,
      isHost: false,
=======
      message: '',
      username: '',
      date: ''
>>>>>>> Chat client updated with messages and styling
    };
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.saveToPlaylist = this.saveToPlaylist.bind(this);
    this.emitMessage = this.emitMessage.bind(this);
  }

  componentDidMount() {
    this.renderRoom();
    roomSocket.on('default', () => this.setState({ currentVideo: undefined }));
    roomSocket.on('host', () => this.setState({ isHost: true }));
    roomSocket.on('retrievePlaylist', videos => this.addToPlaylist(videos));
    roomSocket.on('playNext', (next) => {
      this.setState({
        currentVideo: this.state.playlist[next],
      });
    });
    roomSocket.on('error', err => console.error(err));
    roomSocket.on('pushingMessage', (message) => {
      this.setState({
        message: message,
      });
    });
  }

  componentWillUnmount() {
    roomSocket.disconnect();
  }

  onPlayerReady(e) {
    e.target.playVideo();
  }

  onPlayerStateChange(e) {
    // when video has ended
    if (this.state.isHost) {
      if (e.data === 0) {
        axios.patch(`/playNext/${this.state.playlist.length - 1}`);
        this.setState({
          startOptions: { playerVars: { start: 0 } },
        });
      }
    }
    // when video is unstarted
    if (e.data === -1) {
      e.target.playVideo();
    }
  }

  handleDelete(videoName) {
    roomSocket.emit('removeFromPlaylist', videoName);
  }

  addToPlaylist(videos) {
    if (videos.length === 1) {
      this.setState({
        playlist: videos,
        currentVideo: videos[0],
        startOptions: { playerVars: { start: 0 } },
      });
    } else {
      this.setState({ playlist: videos });
    }
  }

  saveToPlaylist(video) {
    roomSocket.emit('saveToPlaylist', video);
  }

  emitMessage(time, name, message) {
    roomSocket.emit('emitMessage', {
      body: message,
      userName: name,
      dateTime: time,
    });
  }

  renderRoom() {
    return axios.get('/renderRoom')
      .then(({ data }) => {
        const currentTime = Date.now();
        const timeLapsed = moment.duration(moment(currentTime).diff(data.start)).asSeconds();
        this.setState({
          playlist: data.videos,
          currentVideo: data.videos[data.index],
          startOptions: {
            playerVars: { start: Math.ceil(timeLapsed) },
          },
        });
      })
      .catch(err => console.error('Could not retrieve playlist: ', err));
  }

  render() {
    const playlistComponent = (this.state.isHost) ?
      (<Playlist
        playlist={this.state.playlist}
        removeSelected={this.handleDelete}
        isHost={this.state.isHost}
      />) :
      <Playlist playlist={this.state.playlist} />;
    return (
      <div className="room">
        <div className="container navbar">fam.ly</div>
        {playlistComponent}
        <div className="container chat">
          <ChatView
            message={this.state.message}
            date={this.state.dateTime}
            username={this.state.username}
            emitMessage={this.emitMessage}
            socketID={roomSocket.io.engine.id}
          />
        </div>
        <VideoPlayer
          currentVideo={this.state.currentVideo}
          opts={this.state.startOptions}
          onReady={this.onPlayerReady}
          onStateChange={this.onPlayerStateChange}
        />
        <Search saveToPlaylist={this.saveToPlaylist} />
      </div>
    );
  }
}

ReactDOM.render(<RoomView />, document.getElementById('room'));
