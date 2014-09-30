var alive = [];
var started = false;
var drawActivated = false;

//each cell in the grid is 20x20 pixels
var gridScale = 20;

//declare interval at which to call checkCells
var INTERVAL;

//using the same representation of coordinates as in phase 1
var Coord = function (x, y) {
	return {x:x, y:y};
	};

//When the page loads, initialize settings
initialize_display();

//check whether a coordinate is alive
function isAlive(coord){
	for(var a=0; a < alive.length; a++){
		if(alive[a].x == coord.x && alive[a].y == coord.y){
			return true;
		}
	}
	return false;
}

//what the display and various handlers default to on load (default show TOAD)
function initialize_display(){
	set_display(1);

	$("#canvas_container")
	.mousedown(function(){
		drawActivated = true;
	})
	//if there is dragging inside the canvas, add those points to the alive array
	.mousemove(function(e){
		var divPosition = $("#canvas_container").position();
		if(drawActivated){
			//shift the drawing pad's coordinate to start at the top left corner with (0,0)
			var draw_x=e.pageX-divPosition.left-gridScale;
			var draw_y=e.pageY-divPosition.top;
			//subtract mod 20 from each coordinate to get the discrete grid that the mouse is hovering over
			alive.push(Coord(draw_x-(draw_x%gridScale),draw_y-(draw_y%gridScale)));
			activateAlive();
		}
	});
	$(window).mouseup(function(){
		drawActivated = false;
	});

	$("#startButton").click(function(){
		start_game();
	});
	$("#stopButton").click(function(){
		pause_game();
	});
	$("#toad").click(function(){
		set_display(1);
	});
	$("#glider").click(function(){
		set_display(2);
	});
	$("#spaceship").click(function(){
		set_display(3);
	});
	$("#blinker").click(function(){
		set_display(4);
	});
	$("#custom").click(function(){
		set_display(5);
	});

}

//Life Simulation

//activates, or brings to life, all coordinates that are currently in the alive array
function activateAlive(){
	$("#canvas_container").empty();
	//run as long as there are alive cells 
	if(alive.length!=0){
		for(var a=0; a < alive.length; a++){
			drawAlive(alive[a]);
		}
	}
}

//create a div (circle) everytime drawAlive is called on an alive cell
function drawAlive(coord){
	var activeDiv = $("<div>").addClass("active");
	activeDiv.css({"top":coord.y, "left":coord.x});
	$("#canvas_container").append(activeDiv);
}

function set_display(whichOption){
	alive=[];

	if(whichOption==1){
		//hard coded TOAD
		for(var i=100; i<180; i+=gridScale){
			for(var j=100; j<180; j+=gridScale){
				if(j==120 && i!=100){
					alive.push(Coord(i,j));
				}else if(j==140 && i!=160){
					alive.push(Coord(i,j));
				}
			}
		}

	}else if(whichOption==2){
		//hard coded GLIDER	
		alive.push(Coord(60,80));
		alive.push(Coord(80,100));
		alive.push(Coord(100,60));
		alive.push(Coord(100,80));
		alive.push(Coord(100,100));

	}else if(whichOption==3){
		//hard coded SPACESHIP	
		alive.push(Coord(40,100));
		alive.push(Coord(40,140));
		alive.push(Coord(60,160));
		alive.push(Coord(80,160));
		alive.push(Coord(100,100));
		alive.push(Coord(100,160));
		alive.push(Coord(120,120));
		alive.push(Coord(120,140));
		alive.push(Coord(120,160));
	}else if(whichOption==4){
		//hard coded BLINKER	
		alive.push(Coord(60,100));
		alive.push(Coord(60,120));
		alive.push(Coord(80,100));
		alive.push(Coord(80,120));
		alive.push(Coord(100,140));
		alive.push(Coord(100,160));
		alive.push(Coord(120,140));
		alive.push(Coord(120,160));
	}
	activateAlive();
}

function pause_game(){
	clearInterval(INTERVAL);
}

function start_game(){
	clearInterval(INTERVAL);

	function checkCells(){
		var nextGenAlive = [];
		//check neighbors of every cell and change formation
		for(var i=0; i<400; i+=gridScale){
			for(var j=0; j<400; j+=gridScale){
				//for every cell check if alive/dead
				var cell = Coord(i,j);
				if(isAlive(cell)){
					if(determineFate('alive', cell)=='alive'){
						nextGenAlive.push(cell);
					}
				}else{
					if(determineFate('dead', cell)=='alive'){
						nextGenAlive.push(cell);
					}
				}
			}
		}
		alive = nextGenAlive;
		activateAlive();
	}

	function determineFate(state, coord){
		//state: alive or dead, coord = Coord Object

		var neighbors = [];

		//Find All 8 Neighbors and add to neighbors array
		for(var xinc=-20; xinc<=20; xinc+=20){
			for(var yinc=-20; yinc<=20; yinc+=20){
				var neighbor = Coord(coord.x+xinc, coord.y+yinc);
				if((xinc!=0 || yinc!=0) && isAlive(neighbor)){
					neighbors.push(neighbor);
				}
			}
		}

		//Check the Game of Life Rules
		if(state=='alive'){
			if(neighbors.length<2 || neighbors.length>3){
				return 'dead';	
			}else{
				return 'alive';
			}

		}else if(state=='dead'){
			if(neighbors.length==3){
				return 'alive';
			}else{
				return 'dead';
			}
		}
	}
	activateAlive();
	INTERVAL = setInterval(checkCells, 100); 

	//for testing
	window.determineFate = determineFate;
}

