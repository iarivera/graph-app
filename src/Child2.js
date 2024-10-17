import React, {Component} from "react";
import * as d3 from "d3";

class Child2 extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    var data = this.props.data2;
    var div = d3.select("body").selectAll(".tooltip").data([0]).join('div').attr("class", "tooltip").style("opacity", 0);
   
    // Set the dimensions and margins of the graph
    const margin = { top: 50, right: 10, bottom: 50, left: 30 },
      w = 500 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;

    //const data = this.state.data;
    //const temp_data = d3.flatRollup(data, (v) => d3.mean(v, (d) => d.y), (d) => d.x);
    //console.log(temp_data);

    const container = d3.select(".child2_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const aggregatedData = d3.flatRollup(
      data,
      (v) => d3.mean(v, (d) => +d.tip),
      (d) => d.day
    );

    // X axis: days
    const x_data = aggregatedData.map((item) => item[0]); // Use x for x-axis
    var x_scale = d3.scaleBand().domain(x_data).range([0,w]).padding(0.2)
    container.selectAll(".x_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
    .attr("transform", `translate(30, ${h})`).call(d3.axisBottom(x_scale));
    
    //Y axis: average tips
    const y_data = aggregatedData.map((item) => item[1]);
    var y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([h,0])
    container.selectAll(".y_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
    .attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y_scale));

    container.selectAll("rect").data(aggregatedData).join("rect").attr("x",d=>x_scale(d[0])).attr("width",x_scale.bandwidth()).attr("fill", "#69b3a2")
      .attr("y", d=>y_scale(d[1]))
      .attr("height", d=>h-y_scale(d[1]))
      .attr("transform", `translate(30,0)`)
      .on("mousemove", (event, d) => {
        div.transition().duration(100).style("opacity", 0.9);
        div.html(d[1]).style("left", (event.pageX) + "px").style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        div.transition().duration(100).style("opacity",0)
      });
        //alert("mouse detected"))
      
    d3.select(".child2_svg").selectAll(".child2_title")
      .data([0]).join('text').attr("class", ".child2_title")
      .attr('x', w/2 + margin.left/2).attr('y', 20)
      .text("Average Tip by Day")
      
    d3.select(".child2_svg").selectAll(".child2_x_axis")
      .data([0]).join('text').attr("class", ".child2_x_axis")
      .attr('x', w/2 + margin.left).attr('y', h + margin.bottom + margin.top/2)
      .text("Day")
    
    d3.select(".child2_svg").selectAll(".child2_y_axis")
      .data([0]).join('text').attr("class", ".child2_y_axis")
      .attr('x', margin.left/2).attr('y', h/2)
      .text("Average Tip").attr("transform", `translate(-75, ${h}) rotate(270)`)

  }

  render() {
    return (
      <svg className="child2_svg">
        <g className="g_2"></g>
      </svg>
    )
  }
}

export default Child2;