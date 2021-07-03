import React, { PureComponent } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


class Result extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        am4core.useTheme(am4themes_animated);
        // create chart
        let chart = am4core.create("chartdiv", am4charts.GaugeChart);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart.innerRadius = -25;
        let axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = 0;
        axis.max = 100;
        axis.strictMinMax = true;
        axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
        axis.renderer.grid.template.strokeOpacity = 0.3;
        let colorSet = new am4core.ColorSet();
        let range0 = axis.axisRanges.create();
        range0.value = 0;
        range0.endValue = 100;
        range0.axisFill.fillOpacity = 1;
        range0.axisFill.fill = colorSet.getIndex(0);
        range0.axisFill.zIndex = - 1;
        let hand = chart.hands.push(new am4charts.ClockHand());
        hand.value = this.props.score || "";
        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    render() {
        return (
            <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>
        );
    }
}

export default Result;