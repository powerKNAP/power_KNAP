import React from 'react';
import PropTypes from 'prop-types';

const SearchResultsEntry = ({ searchResult, saveToPlaylist }) => (
  <div>
    <img alt="" src={searchResult.snippet.thumbnails.default.url} />
    <div>{searchResult.snippet.title}</div>
    <div>{searchResult.snippet.description}</div>
    <button id="plus" onClick={() => saveToPlaylist(searchResult)}>+</button>
  </div>
);

SearchResultsEntry.propTypes = {
  searchResult: PropTypes.node.isRequired,
  saveToPlaylist: PropTypes.func.isRequired,
};

export default SearchResultsEntry;
