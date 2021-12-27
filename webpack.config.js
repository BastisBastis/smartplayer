const path = require('path');

module.exports = {
  mode:'development',
  //mode: "production",
  entry: {
    app: [
      './src/app.js'
    ]
  },
  module: {
    rules: [
      {
        test: (m) => { return /\.(js|jsx)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true
          }
        }
      ],
      include: /\.module\.css$/
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ],
      exclude: /\.module\.css$/
    },
      {
        test: (m) => { return /\.(png|jp(e*)g|svg|gif)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
        use: [{
          loader: 'url-loader',
          options: { 
            limit: -1,
            name: 'images/[hash]-[name].[ext]'
          } 
        }]
      },
      {
      test: /\.webm|mov|mp4$/,
      use: [
          {
            loader: "file-loader",
            options: {
                name: "[name].[ext]",
                outputPath: "video"
            }
        }
    ]
}
    ]
  },
  plugins: [],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  }
};
