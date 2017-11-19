const path = require('path');

const DIST_DIR = path.resolve(__dirname, './client/dist');
const SRC_DIR = path.resolve(__dirname, './client/src');

module.exports = {
  resolve: { extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx'] },
  entry: `${SRC_DIR}/components/Room/RoomView.jsx`,
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'dotenv'],
        },
      },
    ],
  },
};
