/* copyright 2014 Samara Soucy All Rights Reserved samarasoucy@gmail.com */

/*******************
* global variables *
*******************/

$('body').disableSelection();

var main = new Array();

var costPerTier = [0, 5];
var tierTotal = [0, 0];
var nextTier = 2;
var costOfNextTier = 20;

var toggleHTML = '<div class = "betweenToggle"></div><div class = "toggle"></div>'

/*******************
* container object *
*******************/

var containerPrototype = {
//variables
	tier: 0,
	container: 0,
	cost: 0,
	perSecond: 0,
	totalDrips: [0,0],
	isDouble: false,
	name: ".tier0.container0",
	maxColor: [[0,0,0],[0,0,0]],
	colorRatio: [0,0,0],
	drippers: [".container0.drip0 .dripper",".container1.drip0 .dripper",".container2.drip0 .dripper"],
	
//functions
	clickFunc: function() {this.perSecond++;},
	runningFunc: backgroundSingle,
	backgroundFunc: backgroundSingle
}

function NewContainer (tier, position) {
	this.tier = tier;
	this.container = position;
	this.isDouble = false;
	this.name = ".tier" + this.tier + ".container" + this.container;
	//this.drippers = [];
}

NewContainer.prototype = containerPrototype;

function containerPrototypeContinued (container, newMaxColor, newColorRatio, clickFunction, runningFunction, backgroundFunction) {
	container.totalDrips = [0,0];
	container.maxColor = newMaxColor;
	container.colorRatio = newColorRatio;
	container.clickFunc = clickFunction;
	container.runningFunc = runningFunction;
	container.backgroundFunc = backgroundFunction;
	container.perSecond = 0;
	container.cost = costPerTier[container.tier];
}

/*******************************
* create the beginning objects *
*******************************/


//tier 0
main.push ([new NewContainer(0,0,[[255,255,255],[255,255,255]],[255,255,255])]);
	main[0][0].runningFunc = tierOneRunning;
	$(main[0][0].name).on("click", $.proxy(main[0][0].clickFunc, main[0][0]));
	setInterval($.proxy(main[0][0].runningFunc, main[0][0]),1000);
		
//tier 1
main.push( 
	[new NewContainer(1,0),
	new NewContainer(1,1),
	new NewContainer(1,2)])
	
containerPrototypeContinued(main[1][0],[[255,0,0],[255,0,0]],[255,0,0], singleClick, leftTwo, backgroundSingle);
	main[1][0].drippers = [".container0.drip1 .dripper", ".container1.drip1 .dripper"];
	main[1][0].backgroundFunc();
containerPrototypeContinued(main[1][1],[[0,255,0],[0,255,0]],[0,255,0], singleClick, distributeThree, backgroundSingle);
	main[1][1].drippers = [".container2.drip1 .dripper", ".container3.drip1 .dripper", ".container4.drip1 .dripper"];
	main[1][1].backgroundFunc();
containerPrototypeContinued(main[1][2],[[0,0,255],[0,0,255]],[0,0,255], singleClick, rightTwo, backgroundSingle);
	main[1][2].drippers = [".container5.drip1 .dripper", ".container6.drip1 .dripper"];
	main[1][2].backgroundFunc();
  
setInterval($.proxy(main[1][0].backgroundFunc, main[1][0]),1000);
setInterval($.proxy(main[1][1].backgroundFunc, main[1][1]),1000);
setInterval($.proxy(main[1][2].backgroundFunc, main[1][2]),1000);

//tier total check	
setInterval($.proxy(checkTierTotal, main[1]),5000);
	
//new tier button
$("#theButton").hide();
setInterval(checkButton,5000);
$("#theButton").on("click", addTier);
$("#toNext").text(costOfNextTier - tierTotal[tierTotal.length-1]).show();
	
/*************************
**************************
**  Container Functions **
**************************
*************************/

/**************************************
* special function for the first tier *
**************************************/

//updated	
function tierOneRunning(){
  if (this.perSecond > 0){
	var rTree = [0,0,0,0];
    rThree = randomThree(this); 
	  if (rThree[3] === 1){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[0];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[1];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[2];
		  
		  dripDrop(this.drippers[0]);
		}
		else if (rThree[3] === 2){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[1];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[2];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[0];

		  dripDrop(this.drippers[1]);
		}
		else if (rThree[3] === 3){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[2];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[0];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[1];
		  
		  dripDrop(this.drippers[2]);
		}
	tierTotal[0]++;
	
	if (this.perSecond > 5 && this.perSecond <= 100){
		$("#primaryTier0 p").text("Keep Going!");
	}
	else if (this.perSecond > 100){
		$("#primaryTier0 p").text("Now We're Rocking!");
	}
  }
}

/********************
* animate the drips *
********************/

//updated
function dripDrop (dripper){
  var rand1 = Math.floor(Math.random() * 400);
  var rand2 = Math.floor((Math.random() * 500)+500);
  $(dripper).css("visibility", "visible")
  $(dripper).delay(rand1).animate({'margin-top': "50px"}, rand2, function(){
    $(dripper).css("visibility", "hidden");
    $(dripper).css("margin-top", "0px");
  });
}

/****************************************
* add or remove border from a container *
****************************************/

function fullContainer (container){
  $(container).css("border", "1px solid black");
}

function clickedContainer (container){
  $(container).css("border", "1px solid transparent");
}

/******************
* click functions *
******************/

//updated
function singleClick (){
    if (this.totalDrips[0] >= this.cost){
      this.perSecond++;
      this.totalDrips[0] = this.totalDrips[0] - this.cost;
      this.cost = (this.cost * 2);
      
      clickedContainer(this.name);
    }
}

//updated
function doubleClick(clickie) {
  if (this.totalDrips[0] >= this.cost && this.totalDrips[1] >= this.cost){
    this.perSecond++;
    this.totalDrips[0] = this.totalDrips[0] - this.cost;
    this.totalDrips[1] = this.totalDrips[1] - this.cost;
    this.cost = (this.cost * 2);
    
    clickedContainer(this.name);
  } 
}

/******************************************************
* functions to add per second totals to the next tier *
******************************************************/

//updated
function randomThree(theCont){
    var rand1 = Math.floor((Math.random() * 50) + 1);
    var rand2 = Math.floor((Math.random() * 50) + 1);
    var rand3 = Math.floor((Math.random() * 3) + 1);

    var this1 = Math.round((rand1/100)*theCont.perSecond);
    var this2 = Math.round((rand2/100)*theCont.perSecond);
    var this3 = theCont.perSecond - (this1 + this2);
  
  var returnable = [this1, this2, this3, rand3];
  return returnable;
}

//updated
function distributeThree(){
	if(this.perSecond > 0){
	  var rThree = randomThree(this);
	  var start = ((this.container * 2) -1);
	  var drippie = main[this.tier +1];
		if (rThree[3] === 1){
		  drippie[start].totalDrips[1] = drippie[start].totalDrips[1] + rThree[0];
		  drippie[start + 1].totalDrips[0] = drippie[start + 1].totalDrips[0] + rThree[1];
		  drippie[start + 2].totalDrips[0] = drippie[start + 2].totalDrips[0] + rThree[2];

		  dripDrop(this.drippers[0]);  
		}
		else if (rThree[3] === 2){
		  drippie[start].totalDrips[1] = drippie[start].totalDrips[1] + rThree[1];
		  drippie[start + 1].totalDrips[0] = drippie[start + 1].totalDrips[0] + rThree[2];
		  drippie[start + 2].totalDrips[0] = drippie[start + 2].totalDrips[0] + rThree[0];

		  dripDrop(this.drippers[1]);   
		}
		else{
		  drippie[start].totalDrips[1] = drippie[start].totalDrips[1] + rThree[2];
		  drippie[start + 1].totalDrips[0] = drippie[start + 1].totalDrips[0] + rThree[0];
		  drippie[start + 2].totalDrips[0] = drippie[start + 2].totalDrips[0] + rThree[1];

		  dripDrop(this.drippers[2]);
		}
	}
}

//updated
function leftTwo(){
	if(this.perSecond > 0){
	  var rand1 = Math.floor((Math.random() * 100) + 1);
	  
	  var this1 = Math.round((rand1/100)*this.perSecond);
	  var this2 = this.perSecond - (this1);
	  
	  var drippie = main[this.tier +1];
	  
	  drippie[0].totalDrips[0] = drippie[0].totalDrips[0] + this1;
	  drippie[1].totalDrips[0] = drippie[1].totalDrips[0] + this2;
	  
	  if (rand1 > 50){
			dripDrop(this.drippers[0]);
		  }else{
			dripDrop(this.drippers[1]);
		  }
	}
}

//updated
function rightTwo(){
	if(this.perSecond > 0){
	  var rand1 = Math.floor((Math.random() * 100) + 1);
	  
	  var this1 = Math.round((rand1/100)*this.perSecond);
	  var this2 = this.perSecond - (this1);
	  
	  var drippie = main[this.tier +1];
	  var start = (this.container * 2) -1;
	  
	  drippie[start].totalDrips[1] = drippie[start].totalDrips[1] + this1;
	  drippie[start+1].totalDrips[0] = drippie[start+1].totalDrips[0] + this2;
	  
	  if (rand1 > 50){
			dripDrop(this.drippers[0]);
		  }else{
			dripDrop(this.drippers[1]);
		  }
	}
}

/*****************************************
* Update Background Color of a Container *
*****************************************/

//updated
function backgroundSingle(){
  var fullProp = this.totalDrips[0]/this.cost;
  var fullRed = Math.round(this.colorRatio[0] * fullProp);
  var fullGreen = Math.round(this.colorRatio[1] * fullProp);
  var fullBlue = Math.round(this.colorRatio[2] * fullProp);
  
  if(this.colorRatio[0] > 0){
    if(fullRed > this.colorRatio[0]){var red = this.colorRatio[0];}
    else{var red = fullRed;}
  }else{var red = 0;}
  if(this.colorRatio[1] > 0){
    if(fullGreen > this.colorRatio[1]){var green = this.colorRatio[1];}
    else{var green = fullGreen;}
  } else {var green = 0;}
  if(this.colorRatio[2] > 0){
    if(fullBlue > this.colorRatio[2]){var blue = this.colorRatio[2];}
    else{var blue = fullBlue;}
  } else {var blue = 0;}
  $(this.name).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
  
  //check if container is full
  if (this.totalDrips[0] >= this.cost){fullContainer(this.name);} else{clickedContainer(this.name);}

}

//updated
function backgroundDouble(){
  var full1Prop = this.totalDrips[0]/this.cost;
  var fullRed1 = Math.round(this.maxColor[0][0] * full1Prop);
  var fullGreen1 = Math.round(this.maxColor[0][1] * full1Prop);
  var fullBlue1 = Math.round(this.maxColor[0][2] * full1Prop);
  if(this.maxColor[0][0] >0){
    if(fullRed1>this.maxColor[0][0]){var red1 = this.maxColor[0][0];}
    else{var red1 = fullRed1;}
  }else{var red1 = 0;}
  if(this.maxColor[0][1] > 0){
    if(fullGreen1>this.maxColor[0][1]){var green1 = this.maxColor[0][1];}
    else{var green1 = fullGreen1;}
  } else {var green1 = 0;}
  if(this.maxColor[0][2] > 0){
    if(fullBlue1>this.maxColor[0][2]){var blue1 = this.maxColor[0][2];}
    else{var blue1 = fullBlue1;}
  } else {var blue1 = 0;}
  
  var full2Prop = this.totalDrips[1]/this.cost;
  var fullRed2 = Math.round(this.maxColor[1][0] * full2Prop);
  var fullGreen2 = Math.round(this.maxColor[1][1] * full2Prop);
  var fullBlue2 = Math.round(this.maxColor[1][2] * full2Prop);
  if(this.maxColor[1][0] > 0){
    if(fullRed2>this.maxColor[1][0]){var red2 = this.maxColor[1][0];}
    else{var red2 = fullRed2;}
  }else{var red2 = 0;}
  if(this.maxColor[1][1] > 0){
    if(fullGreen2>this.maxColor[1][1]){var green2 = this.maxColor[1][1];}
    else{var green2 = fullGreen2;}
  } else {var green2 = 0;}
  if(this.maxColor[1][2] > 0){
    if(fullBlue2>this.maxColor[1][2]){var blue2 = this.maxColor[1][2];}
    else{var blue2 = fullBlue2;}
  } else {var blue2 = 0;}
  
  var red = red1 + red2;
  var green = green1 + green2;
  var blue = blue1 + blue2;
  $(this.name).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
  
  if (this.totalDrips[0] >= this.cost && this.totalDrips[1] >= this.cost){fullContainer(this.name);} else{clickedContainer(this.name);}
}

/********************
*********************
** Tier Functions  **
*********************
********************/

function checkTierTotal (){
	var tempTotal = this[0].totalDrips[0];
	this.forEach(function(entry){
		if(entry.totalDrips[0] < tempTotal){tempTotal = entry.totalDrips[0];}
		if(entry.isDouble){
			if(entry.totalDrips[1] < tempTotal){tempTotal = entry.totalDrips[1];}
		}
	});
	
	tierTotal[this[0].tier] = tempTotal;
	//console.log(tierTotal[this[0].tier]);
}


/***************
****************
** Add a tier **
****************
***************/

function checkButton(){
	if (tierTotal[tierTotal.length-1] >= costOfNextTier){
		$("#theButton").attr("disabled", false);
		$("#theButton").show();
		$("#toNext").hide();
	} else {
		$("#theButton").attr("disabled", true);
		$("#theButton").hide();
		$("#toNext").text(costOfNextTier - tierTotal[tierTotal.length-1]).show();
	}
	console.log
}

function addTier() {
//hide the button while function is working
	$("#theButton").attr("disabled", true);
	$("#theButton").hide();
	
//add tier cost and total

costPerTier.push(costPerTier[costPerTier.length -1] *5);
tierTotal.push(0);

//charge each container for the cost
	main[nextTier -1].forEach(function(entry){
		entry.totalDrips[0] = entry.totalDrips[0]-costOfNextTier;
		if (entry.isDouble){
			entry.totalDrips[1] = entry.totalDrips[1]-costOfNextTier;
		}
	})
	
//create the container objects and add functions
	main[nextTier] = new Array();
	main[nextTier].length = (main[nextTier-1].length * 2) - 1;
	
	var dripperWidth = 99 / (main[nextTier].length * 3) - 2;

	for(i = 0; i < main[nextTier].length; i++){
		main[nextTier][i] = new NewContainer(nextTier, i);
	// first container
		if(i === 0){
			containerPrototypeContinued(main[nextTier][i],[[255,0,0],[255,0,0]],[255,0,0], singleClick, leftTwo, backgroundSingle);
			//console.log(main[nextTier][i].cost);
			main[nextTier][i].drippers = [".drip" + nextTier + ".container0 .dripper", ".drip" + nextTier + ".container1 .dripper"];
		}
	//last container
		else if(i === main[nextTier].length - 1){
			containerPrototypeContinued(main[nextTier][i],[[0,0,255],[0,0,255]],[0,0,255], singleClick, rightTwo, backgroundSingle);
			
			var dripStart = (main[nextTier].length * 3) -4;
			main[nextTier][i].drippers = [".drip" + nextTier + ".container" + dripStart + " .dripper", ".drip" + nextTier + ".container" + (dripStart+1) +" .dripper"];
		}
	//middle containers
		else{
		//even entries
			if(isEven(i)){
			//set colors
				var parent = i/2;
				var thisColor = main[nextTier-1][parent].colorRatio;
				containerPrototypeContinued(main[nextTier][i],[thisColor,thisColor],thisColor, singleClick, distributeThree, backgroundSingle);
				var dripStart = (i*3)-1;
				main[nextTier][i].drippers = [".drip" + nextTier + ".container" + dripStart + " .dripper", ".drip" + nextTier + ".container" + (dripStart+1) +" .dripper", ".drip" + nextTier + ".container" + (dripStart+2) +" .dripper"];
			}
		//odd entries
			else{
			//set colors
				var parentColor1 = main[nextTier-1][(i-1)/2].colorRatio;
				var parentColor2 = main[nextTier-1][((i-1)/2)+1].colorRatio;
				
				var childColor1 = [parentColor1[0]/2,parentColor1[1]/2,parentColor1[2]/2];
				var childColor2 = [parentColor2[0]/2,parentColor2[1]/2,parentColor2[2]/2];
				var childRatio = [childColor1[0] + childColor2[0], childColor1[1] + childColor2[1], childColor1[2] + childColor2[2]];
				var x = 255/Math.max.apply(Math, childRatio);
				
				var childColorFinal1 = [Math.round(childColor1[0]*x),Math.round(childColor1[1]*x),Math.round(childColor1[2]*x)];
				var childColorFinal2 = [Math.round(childColor2[0]*x),Math.round(childColor2[1]*x),Math.round(childColor2[2]*x)];
				var childRatioFinal = [childColorFinal1[0] + childColorFinal2[0], childColorFinal1[1] + childColorFinal2[1], childColorFinal1[2] + childColorFinal2[2]];
				
				containerPrototypeContinued(main[nextTier][i],[childColorFinal1,childColorFinal2],childRatioFinal, doubleClick, distributeThree, backgroundDouble);
				
				var dripStart = (i*3)-1;
				main[nextTier][i].drippers = [".drip" + nextTier + ".container" + dripStart + " .dripper", ".drip" + nextTier + ".container" + (dripStart+1) +" .dripper", ".drip" + nextTier + ".container" + (dripStart+2) +" .dripper"];
			
			//other stuff
				main[nextTier][i].isDouble = true;
			}
		}
	}

	var eachWidth = 99 / (main[nextTier].length);
	var dripperWidth = 99 / ((main[nextTier].length * 3)-2);
	
//create the containers in html
	var primaryTier = "#primaryTier" + nextTier;
	$("#theButton").before(function(){return '<div id="primaryTier' + nextTier + '"></div>';});
	$(primaryTier).addClass("container");
	
	for(i = 0; i < main[nextTier].length; i++){
	// first container
		if(i === 0){
			$(primaryTier).append(function(){
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"></div>';
			});
		}
	//last container
		else if(i === main[nextTier].length - 1){
			$(primaryTier).append(function(){
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"></div>';
			});
		}
	//middle containers
		else{
			$(primaryTier).append(function(){
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"></div>';
			});
		}
	}
//create the drippers in html
	var primaryDrip = "#primaryDrip" + nextTier;
	$("#theButton").before(function(){return '<div id="primaryDrip' + nextTier + '"></div>';});
	$(primaryDrip).addClass("container");
	
	for(i = 0; i < main[nextTier].length; i++){
	var thisRatio = main[nextTier][i].colorRatio;
	// first container
		if(i === 0){
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container0 drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container1 drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
		}
	//last container
		else if(i === main[nextTier].length - 1){
			var dripStart = (main[nextTier].length * 3) -4;
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container' + dripStart + ' drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container' + (dripStart +1) + ' drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
		}
	//middle containers
		else{
			var dripStart = (i*3)-1;
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container' + dripStart + ' drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container' + (dripStart+1) + ' drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
			$(primaryDrip).append(function(){
				return '<div class = "drip' + nextTier + ' container' + (dripStart+2) + ' drip" style = "width: '+dripperWidth+'%;"><div class = "dripper" style = "background-color: rgb('+thisRatio[0]+','+thisRatio[1]+','+thisRatio[2]+');"></div></div>';
			});
		}
	}

//start functions on the containers
	main[nextTier].forEach(function(entry){
		setInterval($.proxy(entry.backgroundFunc, entry),1000);
	});
	main[nextTier-1].forEach(function(entry){
		$(entry.name).on("click", $.proxy(entry.clickFunc, entry));
		setInterval($.proxy(entry.runningFunc, entry),1000);
	});
	
//add the toggles

	$("#theToggles").append(toggleHTML);
	
//update tier variables
	$.proxy(checkTierTotal, main[nextTier - 1]);
	costOfNextTier = costOfNextTier * 5;
	checkButton();
	setInterval($.proxy(checkTierTotal, main[nextTier]),5000);
	
	var newWidth = main[nextTier].length * 100;
	var newWidthStr = newWidth.toString()+"px"
	$("#theGame").css("min-width", newWidthStr);
	$(".gameWrapper").css("min-width", newWidthStr);
	
	nextTier++;
}

/************************
*************************
**  Utility Functions  **
*************************
************************/

function isEven(n) 
{
	return (n % 2 == 0);
}

