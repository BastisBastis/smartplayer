import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import MyErrorBoundry from "./components/ErrorBoundry"
 import Smart from "./components/Smart"

class App extends React.Component {	
  render() {
    return (
      <MyErrorBoundry>
        <Smart />
      </MyErrorBoundry>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
