import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './MainVizComponent.scss'
import _ from 'lodash'
import { select, selectAll } from 'd3-selection'
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

		data = _.sortBy(data,"Date_of_sale")
		// const barHeight = 5;

		// var durationFormat = format(".1f");
		var numFormat = format(',.2f');

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
      rightTitle: "Buyer & Destination",
      leftSubTitle: "Date of Sale",
      rightSubTitle: "Payment Due Date",
      labelGroupOffset: 5,
      labelKeyOffset: 50,
			radius: 6,
			subTitleYShift: 20,
      // Reduce this to turn on detail-on-hover version
			unfocusOpacity: 0.3,
			revWidthMultiple: 3.5,
			priceWidthMultiple: 1.5
		}
		
		var smallConfig = {
			maxwidth: 50,
			height: 10,
			// color: '#c59800',
			color: '#ecb600',
			highlightColor: '#CE1126',
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
						{label:"Price", value:"US$ "+numFormat(d.Price)+" per barrel"},
						{label:"Volume", value:numFormat(d.Volume)+" barrels"},
						{label:"Revenue", value:"US$ "+numFormat(d.Revenue)},
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

		function makeClass(d) {
			return d.Lifting.split(" ").join("").toLowerCase();
		} 

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
			
		titles.append("text")
			.attr("text-anchor", "start")
			.attr("x", margin.left + config.width*(config.priceWidthMultiple+1))
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
			.attr("x", margin.left + config.width*config.revWidthMultiple)
			.attr("dx", 0)
			.attr("dy", -margin.top / 4)
			.text(smallConfig.revTitle);

		var volData = data.map(function(d) {
			return _.range(0,Math.round(d.Volume/10000))
		})


		console.log(volData);

		var volBars = [];
		var revBars = [];
		var annotations = [];

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

			revBars[i].selectAll(".bar")
				.data(volData[i])
			.enter().append("rect")
				.attr("class", function(d) { return "bar rev " + makeClass(currentBatch);})
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

					var returnVal = currentBatch.yRightPosition - smallConfig.height/2 + (smallConfig.height*row);
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
				.attr("x", margin.left + config.width*(config.revWidthMultiple+.5))
				.attr("dx", 0)
				// .attr("y", currentBatch.yRightPosition - 10)
				.attr("y", function(d) { 
					data[i].yRevTop = currentBatch.yRightPosition - 10;
					return currentBatch.yRightPosition-10;
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
        console.log(data[i].Lifting,
          data[i].yRevTop,
          data[i-1].Lifting,
          data[i-1].yRevBottom,
          data[i].yRevTop-data[i-1].yRevBottom);
        
        vCumulativeDelta =  data[i-1].yRevBottom > data[i].yRevTop
          ? (data[i-1].yRevBottom-data[i].yRevTop)
          : 0;

        if (vCumulativeDelta > 0) {
          selectAll(".rev." + makeClass(data[i-1]))
          .attr("transform", "translate(" + 0 + "," + (-vCumulativeDelta) + ")")
          // .attr("dy", vCumulativeDelta);
          
          data[i-1].yRevBottom -= vCumulativeDelta;
          data[i-1].yRevTop -= vCumulativeDelta;
          break;
        }
			}
		}

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
