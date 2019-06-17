import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash'
import { loadAllData } from './DataLoading';
import MainVizComponent from './components/MainVizComponent/MainVizComponent';

class App extends Component {

  state = {
    ...this.props,
    data: []
  }

  componentDidMount() {
    console.log('mounted')
    this.getData();
  }
  
  getData() {
    loadAllData()
      .then(data => {
        // set initial data
        this.setState({ data });
      })
  }


  render() {
    console.log(this.state.data)
    const isLoading = !!(_.isEmpty(this.state.data)) ? true : false;

    return (
      !!isLoading
      ? null
      : <div className="App">
        <header>
        </header>
        <div className="vizContainer">
          <MainVizComponent
            data = {this.state.data}
          />
        </div>
        
      </div>
    );
  }
}

export default App;
