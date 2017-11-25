import React from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import Messages from './Messages';

class ChatView extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: ['one message', 'two messages'],
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(message) {
    this.props.emitMessage(message);
  }

  render() {
    return (
      <div className="userChat">
        <h3>User Chat</h3>
        <div className="messageContainer"> Messages <Messages messages={this.state.messages} /></div>
        <div className="messageInput"><MessageInput sendMessage={this.sendMessage} /></div>
      </div>
    );
  }
}

ChatView.propTypes = {
  emitMessage: PropTypes.func.isRequired,
};

export default ChatView;
