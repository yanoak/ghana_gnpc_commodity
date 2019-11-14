import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './MainVizComponent.scss'
import _ from 'lodash'
import { select, selectAll } from 'd3-selection'
import { scaleBand,scaleLinear,scaleQuantile,scaleSequential } from 'd3-scale'
import { interpolateReds } from 'd3-scale-chromatic'
import { axisBottom, axisLeft, axisRight } from 'd3-axis'
import { format } from 'd3-format'
import { default as tip } from 'd3-tip'
import { min, max } from 'd3-array'
import { timeMonth } from 'd3-time'
import { makeTooltip } from '../../VizHelpers'
import {downloadable} from 'd3-downloadable'
import { timeFormat, timeParse} from 'd3-time-format'
import * as moment from 'moment'



class MainVizComponent extends Component {
	constructor(props) {
		super(props)
	this.createChart = this.createChart.bind(this)
		this.state = {
			height: 4000
		}
	}

	componentDidMount() {
		console.log(this.props);

		this.setState({
			height: this.props.timeline 
				? this.setHeightFromDateExtant(this.props.minDate,this.props.maxDate)
				: this.setHeight(this.props.data.length),
      months: this.props.timeline ? this.props.maxDate.diff(this.props.minDate,'months') : 0
    })
		this.createChart()
	}
	
	componentDidUpdate() {
		this.createChart()
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.props.data || nextProps.timeline !== this.props.timeline) {

			this.setState({
				height: nextProps.timeline 
					? this.setHeightFromDateExtant(nextProps.minDate,nextProps.maxDate)
          : this.setHeight(nextProps.data.length),
        months: nextProps.timeline ? nextProps.maxDate.diff(nextProps.minDate,'months') : 0
      })
      
		}
	}
	
	setHeightFromDateExtant = (minDate,maxDate) => this.setHeight(maxDate.diff(minDate,'months'));
	setHeight = (length) => length * 180 + 500;

	createChart() {
		let data = this.props.data ? this.props.data : [];
	// let timeline = this.props.timeline;
		let {revAsCircles, timeline} = this.props;
		var margin = {top: 150, right: 5, bottom: 5, left: this.props.width/3 },
		width = this.props.width - margin.left - margin.right,
		height = this.state.height - margin.top - margin.bottom,
		node = select(this.node);

		console.log(data);
		console.log(revAsCircles);

		data = _.sortBy(data,"Date_of_sale")
	// const barHeight = 5;
		data.forEach(d => {
			d.yRevBottom = 0;
			d.yRevTop = 0;
		})
  
    // var durationFormat = format(".1f");
    var numFormat = format(',.2f');

    var yTimeLine = scaleLinear()
      .range([height, 0]);
      
    var yIndex = scaleLinear()
      .range([height, 0]);

		var config = {
      xOffset: 0,
      yOffset: 0,
      // width: 150,
      width: width/8,
      height: height,
      labelPositioning: {
      alpha: 0.5,
      spacing: 18
      },
      leftTitle: "Lifting",
      rightTitle1: "Buyer",
      rightTitle2: "& Destination",
      leftSubTitle: "Date of Sale",
      rightSubTitle: "Payment Due Date",
      labelGroupOffset: 5,
      labelKeyOffset: 50,
        radius: 6,
        subTitleYShift: 20,
      // Reduce this to turn on detail-on-hover version
        unfocusOpacity: 0.3,
        revWidthMultiple: 3.5,
      priceWidthMultiple: 1.5,
      timelineWidthMultiple: 0.6
		}
		
		var smallConfig = {
			maxwidth: width/15 > 20 ? width/15 : 20,
			height: 10,
			// color: '#c59800',
			color: '#ecb600',
			highlightColor: '#CE1126',
			border: '#eee',
      volWidth: 2.5,
      revBoxesPerCol: 10,
			maxRevWidth: 400,
			volTitle: "Volume (barrels)",
			priceTitle1: "Price",
			priceTitle2: "(US$)",
			revTitle1: "Revenue",
			revTitle2: "(US$)",
		}

		let tooltip = tip()
			.attr('class', 'd3-tip')
			.offset([0, 20])
			.direction(d => revAsCircles ? 'e':'se')
			.html((d) => {
				return makeTooltip(
					d.year,
					[
						{label:"Lifting", value:d.Lifting},
						{label:"Date of Sale", value:d.Date_of_sale.format("D MMM YYYY")},
						{label:"Payment Receipt Date", value:d.Payment_receipt_date.format("D MMM YYYY")},
						{label:"Price", value:"US$ "+numFormat(d.Price)+" per barrel"},
						{label:"Volume", value:numFormat(d.Volume)+" barrels"},
						{label:"Revenue", value:"US$ "+numFormat(d.Revenue)},
						{label:"Buyer", value:d.Buyer},
						{label:"Destination", value:d.Destination}
					]
				)
			})

		node.selectAll("g").remove();

		var colorScale = scaleSequential(interpolateReds)
      .domain([0,10])

    var parse = timeParse("%s");

    
    // gridlines in y axis function
    function make_y_gridlines(months,minDate,maxDate) {		
      console.log(minDate,maxDate)
      console.log(timeMonth.range(minDate, maxDate).map(d => +d));
      return axisLeft(yTimeLine)
          .tickValues(timeMonth.range(minDate, maxDate).map(d => +d))
          // .tickValues([1420041600000,1500000000000,1519833600000])
    }


    // 	var getColor = function(cpue) {
    // 		if (cpue) {
    // 			return colorScale(cpue);
    // 		} else return "#ccc";
    // }
    
    var getY = function(yVal,index) {
      if (timeline) {
        return yTimeLine(yVal);
      } else {
        return yIndex(index);
      }
	}

			 
	// Calculate y domain for ratios
	var maxDate = moment(moment.max(data.map(d => d.Payment_receipt_date)).toDate());
	var minDate = moment(moment.min(data.map(d => d.Date_of_sale)).toDate());

		yTimeLine.domain([timeMonth.floor(maxDate.add(2, 'months')), timeMonth.floor(minDate.subtract(1, 'months'))]);
    yIndex.domain([data.length, -1]);
    
    

    console.log(yTimeLine.domain());
    console.log(timeMonth.range(timeMonth.floor(yTimeLine.domain()[0]), timeMonth.ceil(yTimeLine.domain()[1])));

    if (timeline) {
      // add the Y gridlines
      node.append("g")			
        .attr("class", "grid")
        .attr("transform","translate(0," + margin.top + ")")
        .call(make_y_gridlines(this.state.months,yTimeLine.domain()[1],yTimeLine.domain()[0])
            .tickSize(-width*2)
            .tickFormat(function(d) {
              return timeFormat("%b %Y")(d);
            })
        )
    }

    node.selectAll('.grid text')
      .attr("dy", 20)
      .attr("dx", 10)
		
				
		var borderLines = node.append("g")
				.attr("class", "borderLines")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		borderLines.append("line")
			.attr("x1", 0).attr("y1", 0)
			.attr("x2", 0).attr("y2", config.height);
		borderLines.append("line")
			.attr("x1", config.width*config.timelineWidthMultiple ).attr("y1", 0)
			.attr("x2", config.width*config.timelineWidthMultiple ).attr("y2", config.height);
		
		var slopeGroups = node.append("g")
			.selectAll("g")
			.data(data)
			.enter().append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("class", "slope-group")
				.attr("id", function(d, i) {
					d.id = "group" + d.Lifting;
					d.sellDate = d.Date_of_sale.toDate();
					d.paymentDate = d.Payment_receipt_date.toDate();
				});
		
		var slopeLines = slopeGroups.append("line")
			.attr("class", "slope-line")
			.attr("x1", 0)
			.attr("y1", function(d,i) {
				return getY(d.sellDate,i);
			})
			.attr("x2", config.width*config.timelineWidthMultiple)
			.attr("y2", function(d,i) {
				return getY(d.paymentDate,i);
			});
		
		var leftSlopeCircle = slopeGroups.append("circle")
		.attr("class", function(d) { return "circle";})
			.attr("r", config.radius)
			.attr("cy", function(d,i) { return getY(d.sellDate,i);});
		
		var leftSlopeLabels = slopeGroups.append("g")
			.attr("class", "slope-label-left")
			.each(function(d,i) {
				d.xLeftPosition = -config.labelGroupOffset;
				d.yLeftPosition = getY(d.sellDate,i);
			});
		
		leftSlopeLabels.append("text")
			.attr("class", "label-figure-small")
			.attr("x", d => d.xLeftPosition)
			.attr("y", d => d.yLeftPosition)
			.attr("dx", -10)
			.attr("dy", config.subTitleYShift)
			.attr("text-anchor", "end")
			.text(d => (d.Date_of_sale.format("D MMM YYYY")));
		
		leftSlopeLabels.append("text")
			.attr("class", "label-figure")
			.attr("x", d => d.xLeftPosition)
			.attr("y", d => d.yLeftPosition)
			.attr("dx", -10)
			.attr("dy", 3)
			.attr("text-anchor", "end")
			.text(d => d.Lifting);
		
	var rightSlopeCircle = slopeGroups.append("circle")
		.attr("class", function(d) { return "circle";})
		.attr("r", config.radius)
			.attr("cx", config.width*config.timelineWidthMultiple)
			.attr("cy", function(d,i) { return getY(d.paymentDate,i);});
		
		var rightSlopeLabels = slopeGroups.append("g")
			.attr("class", "slope-label-right")
			.each(function(d,i) {
				d.xRightPosition = config.width*config.timelineWidthMultiple + config.labelGroupOffset;
				d.yRightPosition = getY(d.paymentDate,i);
			});
		
		rightSlopeLabels.append("text")
			.attr("class", "label-figure-small")
			.attr("x", d => d.xRightPosition)
			.attr("y", d => d.yRightPosition)
			.attr("dx", 10)
			.attr("dy", 2*config.subTitleYShift)
			.attr("text-anchor", "start")
			.text(d => (d.Payment_receipt_date.format("D MMM YYYY")));
		
		rightSlopeLabels.append("text")
			.attr("class", "label-figure")
			.attr("x", d => d.xRightPosition)
			.attr("y", d => d.yRightPosition)
			.attr("dx", 10)
			.attr("dy", 3)
			.attr("text-anchor", "start")
		.text(d => d.Buyer);
		
	rightSlopeLabels.append("text")
			.attr("class", "label-figure")
			.attr("x", d => d.xRightPosition)
			.attr("y", d => d.yRightPosition)
			.attr("dx", 10)
			.attr("dy", 3+config.subTitleYShift)
			.attr("text-anchor", "start")
			.text(d => d.Destination);
		
		var titles = node.append("g")
			.attr("transform", "translate(" + 0 + "," + margin.top + ")")
			.attr("class", "title");
		
		titles.append("text")
			.attr("text-anchor", "end")
			.attr("x", margin.left)
			.attr("dx", -10)
			.attr("dy", -margin.top / 4)
			.text(config.leftTitle);
		titles.append("text")
			.attr("text-anchor", "end")
			.attr("class", "label-figure-small")
			.attr("x", margin.left)
			.attr("dx", -10)
			.attr("dy", -margin.top / 4 + config.subTitleYShift)
			.text(config.leftSubTitle);
		
		titles.append("text")
			.attr("x", margin.left + config.width*config.timelineWidthMultiple)
			.attr("dx", 10)
			.attr("dy", -margin.top / 4)
		.text(config.rightTitle1);
	titles.append("text")
			.attr("x", margin.left + config.width*config.timelineWidthMultiple)
			.attr("dx", 10)
			.attr("dy", -margin.top / 4 + config.subTitleYShift)
			.text(config.rightTitle2);
		titles.append("text")
			.attr("class", "label-figure-small")
			.attr("x", margin.left + config.width*config.timelineWidthMultiple)
			.attr("dx", 10)
			.attr("dy", -margin.top / 4 + 2*config.subTitleYShift)
			.text(config.rightSubTitle);



		var priceBars = node.append("g")
			.attr("transform", "translate(" + (margin.left + config.width) + "," + margin.top + ")")
			.attr("class", "price");

		var smallX = scaleLinear()
			.range([0, smallConfig.maxwidth])
		.domain([0,100]); 
		
	var maxRev = max(data.map(d => d.Revenue))
	var circleX = scaleLinear()
			.range([0, config.width])
			.domain([0,Math.sqrt(maxRev)]); 

		function makeClass(d) {
			return d.Lifting.split(" ").join("").toLowerCase();
		} 

	var volBars = [];
		var revBars = [];
		var annotations = [];

		priceBars.selectAll(".bar")
		.data(data)
	.enter().append("rect")
		.attr("class", function(d) { return "bar price " + makeClass(d);})
		.attr("x", function(d) { return config.width*config.priceWidthMultiple; })
		.attr("width", function(d) { return smallX(+d.Price) })
		.attr("y", function(d,i) { return d.yRightPosition - smallConfig.height/2; })
		.attr("fill", function(d) { return smallConfig.color; })
		.attr("stroke", function(d) { return smallConfig.border; })
			.attr("height", function(d) { return smallConfig.height; })
			.on('mouseover', function(d) {
		tooltip.show(d,this);
		selectAll("."+makeClass(d))
					.attr("fill", smallConfig.highlightColor);
					
				selectAll(".annote."+ makeClass(d))
					.attr("display", "block")
			})
			.on('mouseout', function(d) {
		tooltip.hide();
		selectAll("."+makeClass(d))
					.attr("fill", smallConfig.color);
					
				selectAll(".annote."+ makeClass(d))
					.attr("display", "none")
		})

		if (revAsCircles) {
		revBars.push(node.append("g")
			.attr("transform", "translate(" + (margin.left + config.width*config.revWidthMultiple) + "," + margin.top + ")")
			.attr("class", function(d) { return "rev";}));
			
		revBars[0].selectAll(".bar")
			.data(data)
		.enter().append("circle")
			.attr("class", function(d) { return "bar rev " + makeClass(d);})
			.attr("cx", function(d) { 
			return config.width;
			})
			.attr("r", function(d) { return circleX(Math.sqrt(+d.Revenue)) })
			.attr("cy", function(d) { 

			var returnVal = d.yRightPosition;
			
			return returnVal; 
			})
			.attr("fill", function(d) { return smallConfig.color; })
			.attr("stroke", function(d) { return smallConfig.border; })
			// .attr("height", function(d) { return smallConfig.height; })
			.on('mouseover', function(d) {
			tooltip.show(d,this);
			selectAll("."+makeClass(d))
				.attr("fill", smallConfig.highlightColor);
			selectAll(".annote."+ makeClass(d))
				.attr("display", "block")
			})
			.on('mouseout', function(d) {
			tooltip.hide();
			selectAll("."+makeClass(d))
				.attr("fill", smallConfig.color);
			selectAll(".annote."+ makeClass(d))
				.attr("display", "none")
			})
		} 
			
		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", margin.left + config.width*(config.priceWidthMultiple+1))
			.attr("dx", -10)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.priceTitle1);
	titles.append("text")
			.attr("text-anchor", "start")
		.attr("x", margin.left + config.width*(config.priceWidthMultiple+1))
		.attr("dx", -10)
		.attr("dy", -margin.top / 4 + config.subTitleYShift)
		.text(smallConfig.priceTitle2);

		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", 0)
			.attr("dx", 0)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.volTitle);

		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", margin.left + config.width*config.revWidthMultiple)
			.attr("dx", 0)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.revTitle1);
	titles.append("text")
		.attr("x", margin.left + config.width*config.revWidthMultiple)
		.attr("dx", 0)
		.attr("dy", -margin.top / 4 + config.subTitleYShift)
		.text(smallConfig.revTitle2);

		var volData = data.map(function(d) {
			return _.range(0,Math.round(d.Volume/10000))
		})


		// console.log(volData);

		
		data.forEach(function(currentBatch,i) {
			volBars.push(node.append("g")
				.attr("transform", "translate(" + 10 + "," + margin.top + ")")
				.attr("class", function(d) { return "volume";}))

			revBars.push(node.append("g")
				.attr("transform", "translate(" + (margin.left + config.width*config.revWidthMultiple) + "," + margin.top + ")")
				.attr("class", function(d) { return "rev";}));

			// console.log(volBars);

			volBars[i].selectAll(".bar")
				.data(volData[i])
			.enter().append("rect")
			.attr("class", function(d) { return "bar vol " + makeClass(currentBatch);})
				.attr("x", function(d,j) { return smallConfig.volWidth*j; })
				.attr("width", function(d) { return smallConfig.volWidth })
				.attr("y", function(d,j) { return currentBatch.yLeftPosition - smallConfig.height/2; })
				.attr("fill", function(d) { return smallConfig.color; })
				.attr("stroke", function(d) { return smallConfig.border; })
				.attr("height", function(d) { return smallConfig.height; })
				.on('mouseover', function(d) {
					tooltip.show(currentBatch,this);
					selectAll("."+makeClass(currentBatch))
						.attr("fill", smallConfig.highlightColor);
					
					selectAll(".annote."+ makeClass(currentBatch))
						.attr("display", "block")
				})
				.on('mouseout', function(d) {
					tooltip.hide();
					selectAll("."+makeClass(currentBatch))
						.attr("fill", smallConfig.color);
					
					selectAll(".annote."+ makeClass(currentBatch))
						.attr("display", "none")
				})

		if (!revAsCircles) {
		revBars[i].selectAll(".bar")
			.data(volData[i])
		.enter().append("rect")
			.attr("class", function(d) { return "bar rev " + makeClass(currentBatch);})
			.attr("x", function(d,j) { 
			var boxWidth = smallX(+currentBatch.Price)
			// var boxesPerRow = Math.floor(smallConfig.maxRevWidth/boxWidth);
			var index = Math.floor(j / smallConfig.revBoxesPerCol);
			return index*boxWidth;
			

			})
			.attr("width", function(d) { return smallX(+currentBatch.Price) })
			.attr("y", function(d,j) { 
			// var boxWidth = smallX(+currentBatch.Price)
			// var boxesPerRow = Math.floor(smallConfig.maxRevWidth/boxWidth);
			// var row = Math.floor(j/boxesPerRow);

			// data[i].yRevBottom = data[i].yRevBottom > returnVal + smallConfig.height 
			// 	? data[i].yRevBottom
			// 	: returnVal + smallConfig.height;
			
			var index = j % smallConfig.revBoxesPerCol;
			var returnVal = currentBatch.yRightPosition - smallConfig.height/2 + (smallConfig.height*index);
			
			data[i].yRevBottom = data[i].yRevBottom > returnVal + smallConfig.height 
				? data[i].yRevBottom
				: returnVal + smallConfig.height;
			
			return returnVal; 
			})
			.attr("fill", function(d) { return smallConfig.color; })
			.attr("stroke", function(d) { return smallConfig.border; })
			.attr("height", function(d) { return smallConfig.height; })
			.on('mouseover', function(d) {
			tooltip.show(currentBatch,this);
			selectAll("."+makeClass(currentBatch))
				.attr("fill", smallConfig.highlightColor);
			selectAll(".annote."+ makeClass(currentBatch))
				.attr("display", "block")
			})
			.on('mouseout', function(d) {
			tooltip.hide();
			selectAll("."+makeClass(currentBatch))
				.attr("fill", smallConfig.color);
			selectAll(".annote."+ makeClass(currentBatch))
				.attr("display", "none")
			})
		}
			

			// Volume Annotation
			node.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")")
				.append("text")
				.attr("text-anchor", "left")
				.attr("class", function(d) { return "annote vol " + makeClass(currentBatch);})
				.attr("x", 10)
				.attr("dx", 0)
				.attr("y", currentBatch.yLeftPosition - 10)
				.attr("fill", smallConfig.color)
				.attr("display", "none")
				.text(numFormat(currentBatch.Volume)+" barrels")

			// Price Annotation
			node.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")")
				.append("text")
				.attr("text-anchor", "middle")
				.attr("class", function(d) { return "annote price " + makeClass(currentBatch);})
				.attr("x", margin.left + config.width*(config.priceWidthMultiple+1.25))
				.attr("dx", 0)
				.attr("y", currentBatch.yRightPosition)
				.attr("dy", -10)
				.attr("fill", smallConfig.color)
				.attr("display", "none")
				.text("US$ "+numFormat(currentBatch.Price)+" per barrel")

			// Revenue Annotation
			node.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")")
				.append("text")
				.attr("text-anchor", "left")
				.attr("class", function(d) { return "annote rev " + makeClass(currentBatch);})
				.attr("x", function() {
			var defaultX = margin.left + config.width*(config.revWidthMultiple+.5);
			return revAsCircles ? defaultX - config.width: defaultX;
		})
				.attr("dx", 0)
				// .attr("y", currentBatch.yRightPosition - 10)
				.attr("y", function(d) { 
			data[i].yRevTop = currentBatch.yRightPosition - 30;
			var defaultY = currentBatch.yRightPosition-10;
			return revAsCircles ? defaultY - config.width : defaultY;
				})
				.attr("fill", smallConfig.color)
				.attr("display", "none")
				.text("US$ "+numFormat(currentBatch.Revenue) + " in revenue ") 
					// + numFormat(data[i].yRevTop) + " " + numFormat(data[i].yRevBottom) )
			
		})

		console.log(data);

		// Adjust Rev Blocks so they don't overlap
		// Start from the bottom and keep pushing all the ones at the top up a bit untill
		// they no longer overlap
	var vCumulativeDelta = 0;

		for (var j = data.length-1; j > 0; j--) {
			for (var i = data.length-1; i > 0; i--) {
		
		vCumulativeDelta =  data[i-1].yRevBottom > data[i].yRevTop
			? (data[i-1].yRevBottom-data[i].yRevTop)
			: 0;

		if (vCumulativeDelta > 0) {
			selectAll(".rev." + makeClass(data[i-1]))
			.attr("transform", "translate(" + 0 + "," + (-vCumulativeDelta) + ")")
			
			data[i-1].yRevBottom -= vCumulativeDelta;
			data[i-1].yRevTop -= vCumulativeDelta;
			break;
		}
			}
		}

		node.call(tooltip);
		select('.MainChart')
			.call(downloadable());

	}
	
	
	render() {
		// let data = this.props.data ? this.props.data : [];

		return (
			<div className="MainVizComponent">
				<svg className="MainChart" ref={node => this.node = node}
				width={this.props.width} height={this.state.height}>
				</svg>
			</div>
		);
	}
}

MainVizComponent.propTypes = {}

MainVizComponent.defaultProps = {}

export default MainVizComponent
