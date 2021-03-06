const express = require('express');
const webpack = require('webpack');
const path = require('path')
const webpackMiddleware = require('webpack-dev-middleware');

// Setup
const app = express();
const port = process.env['REACT_APP_PORT'] || 3001;

const mode="dev"

if (mode==="dev") {
  const config = require('./webpack.config.js');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: false,
    watchOptions: {
      // Due to iOS devices memory constraints
      // disabling file watching is recommended 
      //ignored: /.*/
    }
  });
  app.use(middleware);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
}
  
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});


// Launch app
app.listen(port, () => {
  console.log(
    'Launching app... http://localhost:' + port + '\n'
  );
});

// Register app and middleware. Required for better
// performance when running from play.js
try { pjs.register(app, middleware); } catch (error) { }
