import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './MainVizComponent.scss'
import _ from 'lodash'
import { select } from 'd3-selection'
import { scaleBand,scaleLinear,scaleQuantile,scaleSequential } from 'd3-scale'
import { interpolateReds } from 'd3-scale-chromatic'
import { axisBottom, axisLeft } from 'd3-axis'
import { format } from 'd3-format'
import { default as tip } from 'd3-tip'
import { min, max } from 'd3-array'
import { makeTooltip } from '../../VizHelpers'


class MainVizComponent extends Component {
	constructor(props) {
		super(props)
		this.createChart = this.createChart.bind(this)
	}
	componentDidMount() {
		this.createChart()
	}
	
	componentDidUpdate() {
		this.createChart()
	}

	createChart() {
		let data = this.props.data ? this.props.data : [];
		var margin = {top: 150, right: 5, bottom: 5, left: 450},
		width = 1000 - margin.left - margin.right,
		height = 4000 - margin.top - margin.bottom,
		node = select(this.node);

		console.log(data);

		// const barHeight = 5;

		// var durationFormat = format(".1f");
		var y1 = scaleLinear()
    	.range([height, 0]);

		var config = {
      xOffset: 0,
      yOffset: 0,
      width: 150,
      height: height,
      labelPositioning: {
        alpha: 0.5,
        spacing: 18
      },
      leftTitle: "Lifting",
      rightTitle: "Customer & Destination",
      leftSubTitle: "Date of Sale",
      rightSubTitle: "Payment Receipt Date",
      labelGroupOffset: 5,
      labelKeyOffset: 50,
			radius: 6,
			subTitleYShift: 20,
      // Reduce this to turn on detail-on-hover version
      unfocusOpacity: 0.3
		}
		
		var smallConfig = {
			maxwidth: 40,
			height: 10,
			color: '#00cc66',
			highlightColor: '#f48320',
			border: '#eee',
			volWidth: 3,
			maxRevWidth: 400,
			volTitle: "Volume (barrels)",
			priceTitle: "Price (US$)",
			revTitle: "Revenue (US$)",
		}

		let tooltip = tip()
			.attr('class', 'd3-tip')
			.offset([0, 20])
			.direction(d => 'se')
			.html((d) => {
				return makeTooltip(
					d.year,
					[
						{label:"Lifting", value:d.Lifting},
						{label:"Date of Sale", value:d.Date_of_sale.format("D MMM YYYY")},
						{label:"Payment Receipt Date", value:d.Payment_receipt_date.format("D MMM YYYY")},
						{label:"Price", value:d.Price},
						{label:"Volume", value:d.Volume},
						{label:"Revenue", value:d.Revenue},
						{label:"Buyer", value:d.Buyer},
						{label:"Destination", value:d.Destination}
					]
				)
			})

		node.selectAll("g").remove();
		// set the ranges
		// var x = scaleBand()
		//   .range([0, width])
		//   .domain([2013,2014,2015,2016,2017,2018])
		//   .padding(0.1);
		var x = scaleLinear()
			.range([0, width])
			// .domain([0,_.max(this.props.maxDuration)]);
			// .domain([0,_.max(durations)]); 
			.domain([0,3600*24.0]); 

		var colorScale = scaleSequential(interpolateReds)
		// .domain([0,_.max(cpues)])
		.domain([0,10])
		// .domain([0,5,10,15,20,25,30,35,40])
		// .range(schemeBlues);

		var getColor = function(cpue) {
			if (cpue) {
				return colorScale(cpue);
			} else return "#ccc";
		}

			 
		// Calculate y domain for ratios
		y1.domain([new Date(2018, 3, 30), new Date(2015, 0, 1)]);
		
		var yScale = y1;
				
		var borderLines = node.append("g")
				.attr("class", "border-lines")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		borderLines.append("line")
			.attr("x1", 0).attr("y1", 0)
			.attr("x2", 0).attr("y2", config.height);
		borderLines.append("line")
			.attr("x1", config.width ).attr("y1", 0)
			.attr("x2", config.width ).attr("y2", config.height);
		
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
			.attr("y1", function(d) {
				console.log(d);
				return y1(d.sellDate);
			})
			.attr("x2", config.width)
			.attr("y2", function(d) {
				return y1(d.paymentDate);
			});
		
		var leftSlopeCircle = slopeGroups.append("circle")
			.attr("r", config.radius)
			.attr("cy", d => y1(d.sellDate));
		
		var leftSlopeLabels = slopeGroups.append("g")
			.attr("class", "slope-label-left")
			.each(function(d) {
				d.xLeftPosition = -config.labelGroupOffset;
				d.yLeftPosition = y1(d.sellDate);
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
			.attr("r", config.radius)
			.attr("cx", config.width)
			.attr("cy", d => y1(d.paymentDate));
		
		var rightSlopeLabels = slopeGroups.append("g")
			.attr("class", "slope-label-right")
			.each(function(d) {
				d.xRightPosition = config.width + config.labelGroupOffset;
				d.yRightPosition = y1(d.paymentDate);
			});
		
		rightSlopeLabels.append("text")
			.attr("class", "label-figure-small")
			.attr("x", d => d.xRightPosition)
			.attr("y", d => d.yRightPosition)
			.attr("dx", 10)
			.attr("dy", config.subTitleYShift)
			.attr("text-anchor", "start")
			.text(d => (d.Payment_receipt_date.format("D MMM YYYY")));
		
		rightSlopeLabels.append("text")
			.attr("class", "label-figure")
			.attr("x", d => d.xRightPosition)
			.attr("y", d => d.yRightPosition)
			.attr("dx", 10)
			.attr("dy", 3)
			.attr("text-anchor", "start")
			.text(d => d.Buyer +", " +d.Destination);
      
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
			.attr("x", margin.left + config.width)
			.attr("dx", 10)
			.attr("dy", -margin.top / 4)
			.text(config.rightTitle);
		titles.append("text")
			.attr("class", "label-figure-small")
			.attr("x", margin.left + config.width)
			.attr("dx", 10)
			.attr("dy", -margin.top / 4 + config.subTitleYShift)
			.text(config.rightSubTitle);



		var priceBars = node.append("g")
			.attr("transform", "translate(" + (margin.left + config.width) + "," + margin.top + ")")
			.attr("class", "price");

		var smallX = scaleLinear()
			.range([0, smallConfig.maxwidth])
			.domain([0,70]); 

		priceBars.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return config.width*2; })
      .attr("width", function(d) { return smallX(+d.Price) })
      .attr("y", function(d,i) { return d.yRightPosition - smallConfig.height/2; })
      .attr("fill", function(d) { return smallConfig.color; })
      .attr("stroke", function(d) { return smallConfig.border; })
			.attr("height", function(d) { return smallConfig.height; })
			.on('mouseover', function(d) {
        tooltip.show(d,this);
        select(this)
          .attr("fill", smallConfig.highlightColor);
			})
			.on('mouseout', function(d) {
        tooltip.hide();
        select(this)
          .attr("fill", smallConfig.color);
      })
			
		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", margin.left + config.width*3)
			.attr("dx", -10)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.priceTitle);

		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", 0)
			.attr("dx", 0)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.volTitle);

		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", margin.left + config.width*4)
			.attr("dx", 0)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.revTitle);

		var volData = data.map(function(d) {
			return _.range(0,Math.round(d.Volume/10000))
		})


		console.log(volData);

		var volBars = [];
		var revBars = [];

		data.forEach(function(currentBatch,i) {
			volBars.push(node.append("g")
				.attr("transform", "translate(" + 10 + "," + margin.top + ")")
				.attr("class", "volume"));

			revBars.push(node.append("g")
				.attr("transform", "translate(" + (margin.left + config.width*4) + "," + margin.top + ")")
				.attr("class", "volume"));

			// console.log(volBars);

			volBars[i].selectAll(".bar")
				.data(volData[i])
			.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d,j) { return smallConfig.volWidth*j; })
				.attr("width", function(d) { return smallConfig.volWidth })
				.attr("y", function(d,j) { return currentBatch.yLeftPosition - smallConfig.height/2; })
				.attr("fill", function(d) { return smallConfig.color; })
				.attr("stroke", function(d) { return smallConfig.border; })
				.attr("height", function(d) { return smallConfig.height; })
				.on('mouseover', function(d) {
					tooltip.show(currentBatch,this);
					select(this)
						.attr("fill", smallConfig.highlightColor);
				})
				.on('mouseout', function(d) {
					tooltip.hide();
					select(this)
						.attr("fill", smallConfig.color);
				})

			revBars[i].selectAll(".bar")
				.data(volData[i])
			.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d,j) { 
					var boxWidth = smallX(+currentBatch.Price)
					var boxesPerRow = Math.floor(smallConfig.maxRevWidth/boxWidth);
					var index = j % boxesPerRow;
					return index*boxWidth;
				})
				.attr("width", function(d) { return smallX(+currentBatch.Price) })
				.attr("y", function(d,j) { 
					var boxWidth = smallX(+currentBatch.Price)
					var boxesPerRow = Math.floor(smallConfig.maxRevWidth/boxWidth);
					var row = Math.floor(j/boxesPerRow);
					return currentBatch.yRightPosition - smallConfig.height/2 + (smallConfig.height*row); 
				})
				.attr("fill", function(d) { return smallConfig.color; })
				.attr("stroke", function(d) { return smallConfig.border; })
				.attr("height", function(d) { return smallConfig.height; })
				.on('mouseover', function(d) {
					tooltip.show(currentBatch,this);
					select(this)
						.attr("fill", smallConfig.highlightColor);
				})
				.on('mouseout', function(d) {
					tooltip.hide();
					select(this)
						.attr("fill", smallConfig.color);
				})
		})


		node.call(tooltip);

	}
	
	
	render() {
		let data = this.props.data ? this.props.data : [];

		return (
			<div className="MainVizComponent">
				<svg className="MainChart" ref={node => this.node = node}
          width={1500} height={data.length*200}>
        </svg>
			</div>
		);
	}
}

MainVizComponent.propTypes = {}

MainVizComponent.defaultProps = {}

export default MainVizComponent
