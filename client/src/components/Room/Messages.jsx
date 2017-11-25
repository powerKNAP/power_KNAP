import React from 'react';
import PropTypes from 'prop-types';

const Messages = ({ messages }) => (
  messages.map(message => {
  	return <div>{message}</div>;
  })
);

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Messages;
