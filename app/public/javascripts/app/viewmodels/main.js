define(['knockout', 'durandal/app', 'socket.io', 'kosortable', 'd3'], function (ko, app, io, kos, d3) {
    //Main user interface for MobSense
    //Updated June 8 2016
    //Michael Kabatek
    //stream^N, Inc (c) 2015



	function plotNewData(){
		
		$.get("/plotdata", function (data) {

						
			updateax(data);
			updateay(data);
			updateaz(data);
				

        });
		
		
	}

	function updateax(data){
		
		var datasetax = [];
		var dataArray = data.data;
		var dataLength = data.data.length;
		
		//attached function to run after page/DOM has been generated
		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;
		
		// Set the ranges
		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var valueline = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		
		for(var i = 0; i < dataLength; i++){
			
			datasetax[i] = {x: i, y: dataArray[i].ax}
			//console.log(dataArray[i].ax);
			
		}
		
		datasetax.forEach(function(d) {
			d.x = d.x;
			d.y = +d.y;
		});
		


		// Scale the range of the data
		x.domain(d3.extent(datasetax, function(d) { return d.x; }));
		y.domain([d3.min(datasetax, function(d) { return d.y; }), d3.max(datasetax, function(d) { return d.y; })]);

		var svg = d3.select("div#chartax").transition();

		// Make the changes
			svg.select(".line")   // change the line
				.duration(0)
				.attr("d", valueline(datasetax));
			svg.select(".x.axis") // change the x axis
				.duration(0)
				.call(xAxis);
			svg.select(".y.axis") // change the y axis
				.duration(0)
				.call(yAxis);
		
	}

	function updateay(data){
		
		var datasetay = [];
		var dataArray = data.data;
		var dataLength = data.data.length;
		
		//attached function to run after page/DOM has been generated
		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;
		
		// Set the ranges
		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var valueline = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		
		for(var i = 0; i < dataLength; i++){
			
			datasetay[i] = {x: i, y: dataArray[i].ay}
			//console.log(dataArray[i].ax);
			
		}
		
		datasetay.forEach(function(d) {
			d.x = d.x;
			d.y = +d.y;
		});
		


		// Scale the range of the data
		x.domain(d3.extent(datasetay, function(d) { return d.x; }));
		y.domain([d3.min(datasetay, function(d) { return d.y; }), d3.max(datasetay, function(d) { return d.y; })]);

		var svg = d3.select("div#chartay").transition();

		// Make the changes
			svg.select(".line")   // change the line
				.duration(0)
				.attr("d", valueline(datasetay));
			svg.select(".x.axis") // change the x axis
				.duration(0)
				.call(xAxis);
			svg.select(".y.axis") // change the y axis
				.duration(0)
				.call(yAxis);
		
	}

	function updateaz(data){
		
		var datasetaz = [];
		var dataArray = data.data;
		var dataLength = data.data.length;
		
		//attached function to run after page/DOM has been generated
		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;
		
		// Set the ranges
		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var valueline = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		
		for(var i = 0; i < dataLength; i++){
			
			datasetaz[i] = {x: i, y: dataArray[i].az}
			//console.log(dataArray[i].ax);
			
		}
		
		datasetaz.forEach(function(d) {
			d.x = d.x;
			d.y = +d.y;
		});
		


		// Scale the range of the data
		x.domain(d3.extent(datasetaz, function(d) { return d.x; }));
		y.domain([d3.min(datasetaz, function(d) { return d.y; }), d3.max(datasetaz, function(d) { return d.y; })]);

		var svg = d3.select("div#chartaz").transition();

		// Make the changes
			svg.select(".line")   // change the line
				.duration(0)
				.attr("d", valueline(datasetaz));
			svg.select(".x.axis") // change the x axis
				.duration(0)
				.call(xAxis);
			svg.select(".y.axis") // change the y axis
				.duration(0)
				.call(yAxis);
		
	}

	function setupax(){
		
			var datasetax = [];
				
			//attached function to run after page/DOM has been generated
			// Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 20, bottom: 30, left: 50},
				width = 600 - margin.left - margin.right,
				height = 270 - margin.top - margin.bottom;

			// Parse the date / time
			//var parseDate = d3.time.format("%d-%b-%y").parse;

			// Set the ranges
			var x = d3.scale.linear().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			// Define the axes
			var xAxis = d3.svg.axis().scale(x)
				.orient("bottom").ticks(5);

			var yAxis = d3.svg.axis().scale(y)
				.orient("left").ticks(5);

			// Define the line
			var valueline = d3.svg.line()
				.x(function(d) { return x(d.x); })
				.y(function(d) { return y(d.y); });
				
			// Adds the svg canvas
			var svg = d3.select("div#chartax")
				.classed("svg-container", true) //container class to make it responsive
				.append("svg")
				//responsive SVG needs these 2 attributes and no width and height attr
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "-32 -32 640 320")
				//class to make it responsive
				.classed("svg-content-responsive", true); 
			
			
			datasetax.forEach(function(d) {
				d.x = d.x;
				d.y = +d.y;
			});
			
			// Add the valueline path.
			svg.append("path")
				.attr("class", "line")
				.attr("d", valueline(datasetax));

			// Add the X Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
				
			// Add x-axis label	
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.attr("x", width)
				.attr("y", height - 6)
				.text("sample");
				
			// add y-axis label	
			svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("y", 6)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")
				.text("x-acceleration");		
		
		
	}

	function setupay(){
		
			var datasetay = [];
				
			//attached function to run after page/DOM has been generated
			// Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 20, bottom: 30, left: 50},
				width = 600 - margin.left - margin.right,
				height = 270 - margin.top - margin.bottom;

			// Parse the date / time
			//var parseDate = d3.time.format("%d-%b-%y").parse;

			// Set the ranges
			var x = d3.scale.linear().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			// Define the axes
			var xAxis = d3.svg.axis().scale(x)
				.orient("bottom").ticks(5);

			var yAxis = d3.svg.axis().scale(y)
				.orient("left").ticks(5);

			// Define the line
			var valueline = d3.svg.line()
				.x(function(d) { return x(d.x); })
				.y(function(d) { return y(d.y); });
				
			// Adds the svg canvas
			var svg = d3.select("div#chartay")
				.classed("svg-container", true) //container class to make it responsive
				.append("svg")
				//responsive SVG needs these 2 attributes and no width and height attr
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "-32 -32 640 320")
				//class to make it responsive
				.classed("svg-content-responsive", true); 
			
			
			datasetay.forEach(function(d) {
				d.x = d.x;
				d.y = +d.y;
			});
			
			// Add the valueline path.
			svg.append("path")
				.attr("class", "line")
				.attr("d", valueline(datasetay));

			// Add the X Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
				
			// Add x-axis label	
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.attr("x", width)
				.attr("y", height - 6)
				.text("sample");
				
			// add y-axis label	
			svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("y", 6)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")
				.text("y-acceleration");				
		
		
	}

	function setupaz(){
		
			var datasetaz = [];
				
			//attached function to run after page/DOM has been generated
			// Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 20, bottom: 30, left: 50},
				width = 600 - margin.left - margin.right,
				height = 270 - margin.top - margin.bottom;

			// Parse the date / time
			//var parseDate = d3.time.format("%d-%b-%y").parse;

			// Set the ranges
			var x = d3.scale.linear().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			// Define the axes
			var xAxis = d3.svg.axis().scale(x)
				.orient("bottom").ticks(5);

			var yAxis = d3.svg.axis().scale(y)
				.orient("left").ticks(5);

			// Define the line
			var valueline = d3.svg.line()
				.x(function(d) { return x(d.x); })
				.y(function(d) { return y(d.y); });
				
			// Adds the svg canvas
			var svg = d3.select("div#chartaz")
				.classed("svg-container", true) //container class to make it responsive
				.append("svg")
				//responsive SVG needs these 2 attributes and no width and height attr
				.attr("preserveAspectRatio", "xMinYMin meet")
				.attr("viewBox", "-32 -32 640 320")
				//class to make it responsive
				.classed("svg-content-responsive", true); 
			
			
			datasetaz.forEach(function(d) {
				d.x = d.x;
				d.y = +d.y;
			});
			
			// Add the valueline path.
			svg.append("path")
				.attr("class", "line")
				.attr("d", valueline(datasetaz));

			// Add the X Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
				
			// Add x-axis label	
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.attr("x", width)
				.attr("y", height - 6)
				.text("sample");
				
			// add y-axis label	
			svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("y", 6)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")
				.text("z-acceleration");				
		
		
	}	
	
    var str2obj = function (str) {
        str = str.split('; ');
        var result = {};
        for (var i = 0; i < str.length; i++) {
            var cur = str[i].split('=');
            result[cur[0]] = cur[1];
        }
        return result;
    }

    function startIntro(viewModel) {
        var intro = introJs();
        var queueCounter = 0;
        intro.onafterchange(function (targetElement) {
            console.log(targetElement.id);
        });
        intro.oncomplete(function () {
            //console.log('intro completed');
        });
        intro.onexit(function () {
            //console.log("exit of introduction");
        });
        intro.onchange(function (targetElement) {
            //console.log("new step " + targetElement.id);
            if (targetElement.id == 'playlist') {
                console.log(viewModel.playlist())
                if (queueCounter < 2) {
                    viewModel.enqueueItem(viewModel.playlist()[0]);
                }
                queueCounter++;
            }
            if (targetElement.id == 'enqueue') {
                console.log(viewModel.playlist())
                if (queueCounter < 2) {
                    viewModel.enqueueItem(viewModel.playlist()[1]);
                }
                queueCounter++;
            }


        });

        intro.setOptions({
            steps: [{
                    intro: "Welcome to stream<sup>N</sup>" + "<br><br>" + "This tutorial will guide you through the process of creating " + "and managing your cloud media player." + "<br>"
                }, {
                    element: document.querySelector('#playlist-container'),
                    intro: "Manage playlists" + "<br><br>" + "Manage your playlists here. Your playlists are collections of links to media on the web. You can save as many playlists as you like!" + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#add-playlist'),
                    intro: "Create new playlist" + "<br><br>" + "Click here to add a new playlist." + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#playlists'),
                    intro: "Select/rename/delete playlist" + "<br><br>" + "<ul>" + "<li>Click a playlist to select it.</li>" + "<li>Double click a playlist to rename.</li>" + "<li>Remove a playlist by deleting its name.</li>" + "<li>Click away from the edit box to deselect.</li>" + "</ul>" + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#playlist-group'),
                    intro: "Build playlist" + "<br><br>" + "Build your playlists here. Add, remove, enqueue, or arrange media in the selected playlist." + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#add-to-playlist'),
                    intro: "Add links to selected playlist" + "<br><br>" + "Build your playlist with links from Soundcloud, Youtube, Dropbox, or an arbitrary media url on the web." + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('.glyphicon-play'),
                    intro: "Enqueue single link/create stream" + "<br><br>" + "Add an individual song from your playlist to your queue. Your stream will automatically start once a track is in your queue." + "<br>",
                    position: 'right'
                }, {
                    element: document.querySelector('#playlist'),
                    intro: "Enqueue entire playlist" + "<br><br>" + "Click here to add the entire playlist to your queue." + "<br>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#streamGroup'),
                    intro: "Tune in and manage your queue" + "<br><br>" + "Tune into your stream, share, listen with your friends in real time." + "<br>",
                    position: 'top'
                }, {
                    element: document.querySelector('#twitter'),
                    intro: "Share and listen with friends" + "<br><br>" + "Share your stream on your favorite social network, stream and have fun!" + "<br>",
                    position: 'bottom'
                }

            ],
            showStepNumbers: false,
            showBullets: false
        });

        intro.start();



    }

    var Task = function (name) {
        this.name = ko.observable(name);
    }

    var viewModel = {
        tutorial: function () {
            startIntro(viewModel);
        },
        activate: function () {
            //activate function to run first when page loads


        },
        attached: function (view, parent) {
			
			var socket = io.connect('https://' + document.domain);
            var mySocket = socket;
            if (socket == undefined || socket == null) {

                socket.socket.connect();
            } else {
                socket.socket.connect();
            }
			
			
			socket.on('data', function (data) {
                //When new data is RX plot new data
                plotNewData();
            });
			
			setupax();
			setupay();
			setupaz();
			
			plotNewData();
			

        },
		clear:    function () {
			
			console.log("clear clicked")
			
			$.get("/clear", function (data) {
					
				console.log(data);
				plotNewData();

			});
            

        },
        download: function () {
            console.log("download clicked")
            $.get("/download", function (data) {
				
				console.log(data);
				window.open('/download', '_self');

			});

        }

    };


    return viewModel
});
