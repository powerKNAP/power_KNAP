import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import io from 'socket.io-client';
import VideoPlayer from './VideoPlayer';
import Playlist from './Playlist';
import Search from './Search';
import SearchResults from './SearchResults';
import sampleVideoData from '../../../../db/sampleVideoData';

const socket = io('http://localhost:8080');

class RoomView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: props.searchResults[0],
      searchResults: props.searchResults,
      query: '',
      playlist: sampleVideoData.slice(1),
    };
    this.updateQuery = this.updateQuery.bind(this);
    this.search = _.debounce(this.search.bind(this), 500);
    this.saveToPlaylist = this.saveToPlaylist.bind(this);
  }

  componentDidMount() {
    // listen for server's response to search
    // handle errors.. kinda
  }

  search() {
    // send query to server via socket connection
    socket.emit('youtubeSearch', this.state.query);
  }

  updateQuery(event) {
    const pressedEnter = event.key === 'Enter';
    Promise.resolve(this.setState({
      query: event.target.value,
    }))
      .then(() => pressedEnter ? this.search.flush() : this.search())
      .catch(err => console.error(err));
  }

  saveToPlaylist(video) {
    socket.emit('saveToPlaylist', video);
  }

  render() {
    return (
      <div className="container room">
        <div className="container navbar"><h1>fam.ly</h1></div>
        <VideoPlayer currentVideo={this.state.currentVideo} />
        <Playlist playlist={this.state.playlist} />
        <div className="container search">
          <SearchResults searchResults={this.state.searchResults} saveToPlaylist={this.saveToPlaylist} />
          <Search updateQuery={this.updateQuery} search={this.search} />
        </div>
      </div>
    );
  }
}

RoomView.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ReactDOM.render(<RoomView searchResults={sampleVideoData} />, document.getElementById('room'));
