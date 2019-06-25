import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import 'react-widgets/dist/css/react-widgets.css';
import _ from 'lodash'
import { loadAllData } from './DataLoading';
import MainVizComponent from './components/MainVizComponent/MainVizComponent';
import {Helmet} from "react-helmet";
import Switch from "react-switch";
import { Combobox } from 'react-widgets';

class App extends Component {

  constructor() {
    super()
    this.state = {
      ...this.props,
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      data: [],
      timeline: false,
      revAsCircles: true
    };
    this.handleTimeLineChange = this.handleTimeLineChange.bind(this)
    this.handleFilterYearChange = this.handleFilterYearChange.bind(this)
    this.handleRevAsCirclesChange = this.handleRevAsCirclesChange.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.getData();
    console.log('mounted')
  }

  updateDimensions() {
    this.setState({
      dimensions: {
				height: window.innerHeight, 
				width: window.innerWidth
			}
    });
  }

  handleTimeLineChange(checked) {
    this.setState({ timeline: checked });
  }

  handleRevAsCirclesChange(checked) {
    this.setState({ revAsCircles: checked });
  }
  
  handleFilterYearChange(year) {
    console.log(year);
    const filteredData = year === "All"
      ? this.state.data
      : this.state.data.filter(d => d.Date_of_sale.year() === +year)
    this.setState({ filteredData });
  }

  getData() {
    loadAllData()
      .then(data => {
        // set initial data
        var years = ["All", ..._.uniq(data.map(d => d.Date_of_sale.year()))];
        this.setState({ 
          data: data, 
          filteredData: data,
          years: years
        });
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
        <div className="application">
            <Helmet>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=1100,initial-scale=0.3,shrink-to-fit=yes" />
            </Helmet>
        </div>
        </header>

        <div className="uiWidgetContainer">
          <label>
            <span>Revenue as Circles</span>
            <br/>
            <Switch onChange={this.handleRevAsCirclesChange} checked={this.state.revAsCircles} />
          </label>
        </div>
        <div className="uiWidgetContainer">
          <label>
            <span>Timeline View</span>
            <br/>
            <Switch onChange={this.handleTimeLineChange} checked={this.state.timeline} />
          </label>
        </div>
        <div className="uiWidgetContainer">
          Filter by year:
          <Combobox
            data={this.state.years}
            defaultValue={"All"}
            onChange={this.handleFilterYearChange }
          />
        </div>
        

        <div className="vizContainer">
          <MainVizComponent
            data = {this.state.filteredData}
            width = {this.state.dimensions.width*.95}
            timeline = {this.state.timeline}
            revAsCircles = {this.state.revAsCircles}
          />
        </div>
        
      </div>
    );
  }
}

export default App;
