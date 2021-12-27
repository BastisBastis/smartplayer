import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
 import AnimTest from "./components/AnimTest"
 import SmartPlayer from "./components/SmartPlayer"

class App extends React.Component {	
  render() {
    return (
      <div>
      <SmartPlayer />
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
