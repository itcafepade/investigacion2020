var LowestLimit = 15;
const DefaultValue = 0;

$('document').ready(function () {
    //map();
    loadGraphics();
    loadTable();
});

function loadTable() {
    $('#idTabla').empty();
    for (let i = 0; i < 30; i++) {
        let randomTemp = Math.random() * (35 - 25) + 25;
        let randomHum = Math.random() * (35 - 25) + 25;
        let randomRad = Math.random() * (35 - 25) + 25;
        var date = new Date();
        var hour, time;
        if (date.getHours() > 12) {
            hour = date.getHours() % 12;
            time = 'PM';
        } else {
            hour = date.getHours() % 12;
            time = 'AM';
        }
        $('#idTabla').append(
            '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td>' + date.getDay() + '/' + date.getUTCMonth() + '/' + date.getFullYear() + ' ' + hour + ':' + date.getMinutes() + ' ' + time + '</td>' +
            '<td>' + randomTemp.toFixed(2) + '</td>' +
            '<td>' + randomHum.toFixed(2) + '</td>' +
            '<td>' + randomRad.toFixed(2) + '</td>' +
            '</tr>'

        );
    }
}

function mapSelected(dep, id) {
    $('#depSelected').text(dep);
    $('#idSelected').text('Código: ' + id);
    $('#btnModal').trigger('click');
}

function map() {
    // Theme
    am4core.useTheme(am4themes_animated);

    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    chart.language.locale = am4lang_es_ES;
    // chart.numberFormatter.language = new am4core.Language();
    // chart.numberFormatter.language.locale = am4lang_es_ES;
    // chart.dateFormatter.language = new am4core.Language();
    // chart.dateFormatter.language.locale = am4lang_es_ES;
    // Set map definition
    chart.geodata = am4geodata_elSalvadorLow;

    // Set projection
    // chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Set min/max fill color for each area
    polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3),
        logarithmic: true
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    var polygonTemplate = polygonSeries.mapPolygons.template;

    var home = chart.chartContainer.createChild(am4core.Button);
    home.label.text = "Inicio";
    home.id = 'btnInicio';
    home.align = "right";
    home.events.on("hit", function (ev) {
        chart.goHome();
        $('#tituloEst').text("Estación ENA");
        $("#descEst").text("Invernadero ubicado en ENA");
        message('ENA');
        //$('#btnInicio').trigger('click');
        //console.log("Mapa nacional");
    });

    //Create Zoom Control
    chart.zoomControl = new am4maps.ZoomControl();

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.events.on("hit", function (ev) {
        // zoom to an object
        //ev.target.series.chart.zoomToMapObject(ev.target);

        // get object info
        let dep = ev.target.dataItem.dataContext.name;
        let id = ev.target.dataItem.dataContext.id;
        //console.log(ev.target.dataItem.dataContext.name + ": " + ev.target.dataItem.dataContext.id);
        mapSelected(dep, id);
        //alert(ev.target.dataItem.dataContext.name);
        //alert(ev.target.dataItem.dataContext.name);
    });

    // // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name} {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    // // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");
}

function message(estacion) {
    Swal.fire(
        'Estación seleccionada: ' + estacion,
        'Estación ubicada en ' + estacion,
        'success'
    )
}

function loadGraphics() {
    am4core.disposeAllCharts(); //Advertencia 'Chart was not disposed'
    //map();
    graphics('graphicLineDiv', 0);
    //graphics('graphicLineDiv', LowestLimit);
    graphics('graphicLineHumDiv');
    graphics('graphicLineRadDiv');
}

$('#idSantaAna1').on('click', (ev) => {

    ev.preventDefault();
    $('#tituloEst').text("Santa Ana");
    $("#descEst").text("Santa Ana");
    //map();
    emptyDiv();
    loadGraphics();
    message('Santa Ana');
    $('#idSelect').trigger('click');
});

function emptyDiv() {
    $('#graphicLineDiv').empty();
    $('#graphicLineHumDiv').empty();
    $('#graphicLineRadDiv').empty();
}

function graphics(graphicName, limit) {

    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_material);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(graphicName, am4charts.XYChart);
        // Set input format for the dates
        chart.dateFormatter.dateFormat = "dd-MM-yyyy HH:mm:ss";

        // Add data
        var day, month, year, value, date;
        for (var i = 1; i < 30; i++) {
            value = Math.random() * (25 - 15) + 15;
            date = new Date();
            date.setDate(date.getDate() + i);

            chart.data.push({
                date: date,
                value1: value,
                value2: LowestLimit,
                date2: date
            });
        }

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value1";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.minBulletDistance = 10;
        series.tooltipText = "[bold]{date.formatDate()}:[/] {value1}\n[bold]{previousDate.formatDate()}:[/] {value2}";
        series.tooltip.pointerOrientation = "vertical";
        series.stroke = am4core.color("blue").lighten(0.5);

        // Create series
        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueY = "value2";
        series2.dataFields.dateX = "date";
        series2.strokeWidth = 2;
        series2.strokeDasharray = "3,4";
        series2.stroke = am4core.color("red");
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;

    }); // end am4core.ready()
}

$('#est1').on("click", (ev) => {
    ev.preventDefault();
    $('#tituloEst').text("Estación ENA 1");
    $("#descEst").text("Estación ENA 1");
    //map();
    emptyDiv();
    loadGraphics();
    loadTable();
    message('Estación ENA 1');
    //$('#idSelect').trigger('click');
});

$('#est2').on("click", (ev) => {
    ev.preventDefault();
    $('#tituloEst').text("Estación ENA 2");
    $("#descEst").text("Estación ENA 2");
    //map();
    emptyDiv();
    loadGraphics();
    loadTable();
    message('Estación ENA 2');
    //$('#idSelect').trigger('click');
});
