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
import { scaleQuantize, nice } from 'd3-scale';
import { extent } from 'd3-array';
import * as moment from 'moment';


class App extends Component {

  constructor() {
    super()
    this.state = {
      ...this.props,
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      currentFilters: [],
      data: [],
      timeline: true,
      revAsCircles: false
    };
    this.handleTimeLineChange = this.handleTimeLineChange.bind(this)
    this.handleFilterYearChange = this.handleFilterYearChange.bind(this)
    this.handleBuyerChange = this.handleBuyerChange.bind(this)
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
  
  handleFilterYearChange(year,originalData) {
    const filteredData = year === "All"
      ? originalData
      : originalData.filter(d => d.Date_of_sale.year() === +year)
    return filteredData
  }

  handleBuyerChange(buyer,originalData) {
    const filteredData = buyer === "All"
      ? originalData
      : originalData.filter(d => d.Buyer === buyer)
    return filteredData;
  }

  handleDestinationChange(destination,originalData) {
    const filteredData = destination === "All"
      ? originalData
      : originalData.filter(d => d.Destination === destination)
    return filteredData;
  }

  handlePriceChange(price,originalData) {
    const filteredData = price === "All"
      ? originalData
      : originalData.filter(d => d.priceRange === this.state.priceOptions.indexOf(price) - 1)
    return filteredData;
  }

  handleAllFilters(newFilters) {
    let filteredData = [...this.state.data];
    const replaceOldFilters = this.state.currentFilters.map(fil => 
      newFilters.filter === fil.filter 
      ? {filter: fil.filter,filterVal: newFilters.filterVal} 
      : {filter: fil.filter,filterVal: fil.filterVal} 
    );
    console.log(replaceOldFilters);
    const currentFilters = replaceOldFilters.concat(
      replaceOldFilters.map(fil => fil.filter).includes(newFilters.filter) 
        ? []
        : [newFilters]
    );
    console.log(filteredData);
    console.log(currentFilters);
    for (let i = 0; i < currentFilters.length; i++) {
      switch (currentFilters[i].filter) {
        case('year'):
          filteredData = this.handleFilterYearChange(currentFilters[i].filterVal,filteredData);
          break;
        case('buyer'):
          filteredData = this.handleBuyerChange(currentFilters[i].filterVal,filteredData);
          break;
        case('destination'):
          filteredData = this.handleDestinationChange(currentFilters[i].filterVal,filteredData);
          break;
        case('price'):
          filteredData = this.handlePriceChange(currentFilters[i].filterVal,filteredData);
          break;
        default: break;
      }
    }
    const [minDate,maxDate] = this.getDateExtent(filteredData);


    // console.log(filteredData);
    // console.log(currentFilters);
    this.setState({ filteredData });
    this.setState({ currentFilters });
    this.setState({ minDate });
    this.setState({ maxDate });
  }

  getDateExtent = (data) => data.length ? extent([...data.map(d=>d.Date_of_sale),...data.map(d=>d.Payment_receipt_date)]) : [moment(),moment()];

  getData() {
    loadAllData()
      .then(data => {
        // set initial data
        const pricesList = data.map(row => row.Price);
        const quantizePrices = scaleQuantize()
          .domain(extent(pricesList)) // pass only the extreme values to a scaleQuantize’s domain
          .range([...Array(4).keys()]);
        const quantizePricesNice = quantizePrices.copy().nice();
        
        const thresholds = quantizePricesNice.thresholds();
        const priceRanges = thresholds.map((t,i) => i > 0 
          ? "$" + thresholds[i-1] + " to $" + t
          : "$0 to $" + t )
        priceRanges.push(">$" + thresholds[thresholds.length-1]);
        priceRanges.unshift("All");
        console.log(priceRanges);

        var trimmedData = data.map(row => {
          var trimmedRow = {};
          Object.keys(row).forEach(key => trimmedRow[key] = typeof row[key] === 'string' ? row[key].trim(): row[key]);
          trimmedRow['priceRange'] = quantizePricesNice(row['Price']);
          return trimmedRow;
        })
        console.log(trimmedData);
        
        const [minDate,maxDate] = this.getDateExtent(trimmedData);

        
        var years = ["All", ..._.uniq(trimmedData.map(d => d.Date_of_sale.year()))];
        var buyers = ["All", ..._.uniq(trimmedData.map(d => d.Buyer))];
        var destinations = ["All", ..._.uniq(trimmedData.map(d => d.Destination))];
        this.setState({ 
          data: trimmedData, 
          filteredData: data,
          yearOptions: years,
          buyerOptions: buyers,
          destinationOptions: destinations,
          priceOptions: priceRanges,
          maxDate: maxDate,
          minDate: minDate
        });
      })
  }

  makeAFilterCombo = (filter) => <div className="uiWidgetContainer">
    Filter by {filter}:
    <Combobox
      data={this.state[filter+'Options']}
      defaultValue={"All"}
      onChange={value => this.handleAllFilters({filter:filter,filterVal:value}) }
    />
  </div>

  render() {
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

        {/* <div className="uiWidgetContainer">
          <label>
            <span>Revenue as Circles</span>
            <br/>
            <Switch onChange={this.handleRevAsCirclesChange} checked={this.state.revAsCircles} />
          </label>
        </div> */}
        <div className="uiWidgetContainer">
          <label>
            <span>Timeline View</span>
            <br/>
            <Switch onChange={this.handleTimeLineChange} checked={this.state.timeline} />
          </label>
        </div>
        {this.makeAFilterCombo('buyer')}
        {this.makeAFilterCombo('destination')}
        {this.makeAFilterCombo('year')}
        {this.makeAFilterCombo('price')}
        <br/>
        <br/>
        Right click on the visualisation to save as an image.
        
        

        <div className="vizContainer">
          
          <MainVizComponent
            data = {this.state.filteredData}
            width = {this.state.dimensions.width*.95 > 1200 ? this.state.dimensions.width*.95 : 1200}
            timeline = {this.state.timeline}
            revAsCircles = {this.state.revAsCircles}
            maxDate = {this.state.maxDate}
            minDate = {this.state.minDate}
          />
        </div>
        
      </div>
    );
  }
}

export default App;
