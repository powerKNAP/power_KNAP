import React from 'react';
import PropTypes from 'prop-types';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.setMessage = this.setMessage.bind(this);
    this.enterMessage = this.enterMessage.bind(this);
  }

  setMessage(event) {
    const pressedEnter = event.key === 'Enter';
    if (pressedEnter) {
      this.props.sendMessage(this.state.message);
      this.clear();
    }
  }

  enterMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  clear() {
    this.setState({
      message: '',
    });
  }
  render() {
    return (
      <input type="text" className="messageText" placeholder="Enter message"onKeyUp={this.setMessage} onChange={this.enterMessage} value={this.state.message} />
    );
  }
}

MessageInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};

export default MessageInput;
