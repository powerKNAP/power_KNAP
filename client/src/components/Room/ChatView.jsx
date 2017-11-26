import React from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import Messages from './Messages';

class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== '') {
      this.setState({
        messages: this.state.messages.concat({
          message: nextProps.message.body,
          username: nextProps.message.userName,
          date: nextProps.message.dateTime,
          color: nextProps.message.userColor,
        })
      });
    }
  }
  sendMessage(time, name, message) {
    this.props.emitMessage(time, name, message);
  }

  render() {
    return (
      <div className="userChat">
        <h3>User Chat</h3>
        <div className="messageContainer"> <Messages messages={this.state.messages} /></div>
        <div className="messageInput"><MessageInput socketID={this.props.socketID} sendMessage={this.sendMessage} /></div>
      </div>
    );
  }
}

ChatView.propTypes = {
  emitMessage: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ChatView;
