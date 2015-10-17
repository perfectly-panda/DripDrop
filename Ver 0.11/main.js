/* copyright 2014 Samara Soucy All Rights Reserved samarasoucy@gmail.com */

/* Updates in Progress
1) switch Timer functions DONE
2) create and toggle helper text DONE
3) add flexbox to CSS to clean up things a bit DONE
4) rotate the toggles
5) switch 5 sec timer functions


*/

/*******************
* global variables *
*******************/

$('body').disableSelection();

var main = new Array();

var costPerTier = [0, 5];
var tierTotal = [0, 0];
var tierPerSecond = [0, 0];
var stars = [0, 0];
var starPerSecondCost = [1, 1];
var starTierTotalCost = [25, 25];
var nextTier = 2;
var costOfNextTier = 20;
var starModifier = 1;

function toggleHTML(tier){
	return '<div class = "toggle" id="primaryToggle' + tier + '"></div>';}
	
function storeHTML(tier){

	return '<div class = "tierStore" id = "tierStore' + tier +'"></div>';
}

var storeTotal = '<h3>Tier Store</h3><div class = "storeContainer"><div style="display: inline-block;">Tier Total:</div><div class = "tierTotalText" style="display: inline-block;">0</div></div>';

var storePerSecond = '<div class = "storeContainer"><div style="display: inline-block;">Tier Per Second:</div><div class = "tierPerSecondText" style="display: inline-block;">0</div></div>';

var storeStars = '<div class = "storeContainer"><div style="display: inline-block;">Stars:</div><div class = "tierStarText" style="display: inline-block;">0</div></div>';

var storeActions = '<div class = "actionContainer"><button type="button" class = "starButton">Buy with Drips Per Second</button><button type="button" class = "starButton2">Buy with Tier Total</button></div>';
	
var toggleState = [0,0];

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
	$($.proxy(main[0][0].runningFunc, main[0][0])); //update1 DONE
		
//tier 1
main.push( 
	[new NewContainer(1,0),
	new NewContainer(1,1),
	new NewContainer(1,2)])
	
containerPrototypeContinued(main[1][0],[[255,0,0],[255,0,0]],[255,0,0], singleClick, leftTwo, backgroundSingle);
	main[1][0].drippers = [".container0.drip1 .dripper", ".container1.drip1 .dripper"];
containerPrototypeContinued(main[1][1],[[0,255,0],[0,255,0]],[0,255,0], singleClick, distributeThree, backgroundSingle);
	main[1][1].drippers = [".container2.drip1 .dripper", ".container3.drip1 .dripper", ".container4.drip1 .dripper"];
containerPrototypeContinued(main[1][2],[[0,0,255],[0,0,255]],[0,0,255], singleClick, rightTwo, backgroundSingle);
	main[1][2].drippers = [".container5.drip1 .dripper", ".container6.drip1 .dripper"];
  
setTimeout($.proxy(main[1][0].backgroundFunc, main[1][0]),newRandom(1000,0)); //update1
setTimeout($.proxy(main[1][1].backgroundFunc, main[1][1]),newRandom(1000,0));
setTimeout($.proxy(main[1][2].backgroundFunc, main[1][2]),newRandom(1000,0));
	
//new tier button
$("#theButton").on("click", addTier);
$("#theToggle").on("click", toggleText);
$("#toNext").text(costOfNextTier - tierTotal[tierTotal.length-1]).show();

//start toggles
$("#primaryToggle0").on("click", function(){toggleHandler(0);});
$("#primaryToggle1").on("click", function(){toggleHandler(1);});

//add star button
$("#tierStore0 > .actionContainer > .starButton").on("click", function(){starHandler(0);});
$("#tierStore1 > .actionContainer > .starButton").on("click", function(){starHandler(1);});
$("#tierStore0 > .actionContainer > .starButton2").on("click", function(){starHandler2(0);});
$("#tierStore1 > .actionContainer > .starButton2").on("click", function(){starHandler2(1);});

$(document).ready(sidebarTabs()).ready(checkButton).ready(function(){checkTierTotal(main[0]);}).ready(function(){checkTierTotal(main[1]);});
	
/*************************
**************************
**  Container Functions **
**************************
*************************/

/**************************************
* special function for the first tier *
**************************************/

//updated 2
function tierOneRunning(){
  if (main[0][0].perSecond > 0){
	
	//console.log("working");
	
	var rTree = [0,0,0,0];
    rThree = randomThree(main[0][0]); 
	  if (rThree[3] === 1){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[0];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[1];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[2];
		  
		  dripDrop(main[0][0].drippers[0]);
		}
		else if (rThree[3] === 2){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[1];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[2];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[0];

		  dripDrop(main[0][0].drippers[1]);
		}
		else if (rThree[3] === 3){
		  main[1][0].totalDrips[0] = main[1][0].totalDrips[0] + rThree[2];
		  main[1][1].totalDrips[0] = main[1][1].totalDrips[0] + rThree[0];
		  main[1][2].totalDrips[0] = main[1][2].totalDrips[0] + rThree[1];
		  
		  dripDrop(main[0][0].drippers[2]);
		}
	main[0][0].totalDrips[0]++;
	$("#primaryTier0 .infoText").text("Drips Per Second:");
	$(".tier0.container0 .textPerSecond").text(main[0][0].perSecond);
  }
  else{//console.log(main[0][0].perSecond.toString());
  }
  
  setTimeout(function(){tierOneRunning();},1000);
  
  // console.log(main[0][0].perSecond.toString());
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
	$(container.name).css("border", "1px solid black");
	if (nextTier === container.tier + 1){
		$(container.name + " .infoText").text("Buy Next Tier");
		$(container.name + " .textPerSecond").text("to Continue");
	} else {
		$(container.name + " .infoText").text("Ready!");
		$(container.name + " .textPerSecond").text(container.perSecond);
	}
}

function clickedContainer (container){
	$(container.name).css("border", "1px solid transparent");
	if (container.perSecond > 0){
		$(container.name + ' .infoText').text("Drips Per Second:");
	}
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
      
      clickedContainer(this);
    }
	
	//console.log("click");
}

//updated
function doubleClick(clickie) {
  if (this.totalDrips[0] >= this.cost && this.totalDrips[1] >= this.cost){
    this.perSecond++;
    this.totalDrips[0] = this.totalDrips[0] - this.cost;
    this.totalDrips[1] = this.totalDrips[1] - this.cost;
    this.cost = (this.cost * 2);
    
    clickedContainer(this);
  } 
}

/******************************************************
* functions to add per second totals to the next tier *
******************************************************/

//updated
function randomThree(theCont){
    var rand1 = newRandom(50,1);
    var rand2 = newRandom(50,1);
    var rand3 = newRandom(3,1);

    var this1 = Math.round((rand1/100)*(theCont.perSecond * (1 + (stars[theCont.tier] * starModifier))));
    var this2 = Math.round((rand2/100)*(theCont.perSecond * (1 + (stars[theCont.tier] * starModifier))));
    var this3 = (theCont.perSecond * (1 + (stars[theCont.tier] * starModifier))) - (this1 + this2);
	
	//console.log((theCont.perSecond * (1 + (stars[theCont.tier] * .1))).toString());
  
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
	
	  setTimeout($.proxy(this.runningFunc, this),1000);
}

//updated
function leftTwo(){
	if(this.perSecond > 0){
	  var rand1 = Math.floor((Math.random() * 100) + 1);
	  
	  var this1 = Math.round((rand1/100)*(this.perSecond * (1 + (stars[this.tier] * starModifier))));
	  var this2 = Math.round((this.perSecond * (1 + (stars[this.tier] * starModifier))) - (this1));
	  
	  var drippie = main[this.tier +1];
	  
	  drippie[0].totalDrips[0] = drippie[0].totalDrips[0] + this1;
	  drippie[1].totalDrips[0] = drippie[1].totalDrips[0] + this2;
	  
	  if (rand1 > 50){
			dripDrop(this.drippers[0]);
		  }else{
			dripDrop(this.drippers[1]);
		  }
	}
	
	setTimeout($.proxy(this.runningFunc, this),1000);
}

//updated
function rightTwo(){
	if(this.perSecond > 0){
	  var rand1 = Math.floor((Math.random() * 100) + 1);
	  
	  var this1 = Math.round((rand1/100)*(this.perSecond * (1 + (stars[this.tier] * starModifier))));
	  var this2 = Math.round((this.perSecond * (1 + (stars[this.tier] * starModifier))) - (this1));
	  
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
	
	setTimeout($.proxy(this.runningFunc, this),1000);
}

/*****************************************
* Update Background Color of a Container *
*****************************************/

//updated 2
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
  if (this.totalDrips[0] >= this.cost){fullContainer(this);} else{clickedContainer(this);}
  //update per Second
  if (this.perSecond > 0) {
	$(this.name + " .textPerSecond").text(this.perSecond);
	$(this.name + " .textPerSecond").text();
  }

  setTimeout($.proxy(this.backgroundFunc, this),1000);
  
  //console.log(this);
}

//updated 2
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
  
  if (this.totalDrips[0] >= this.cost && this.totalDrips[1] >= this.cost){fullContainer(this);} else{clickedContainer(this);}
  if (this.perSecond > 0) {
	$(this.name + " .textPerSecond").text(this.perSecond);
  }
  
  setTimeout($.proxy(this.backgroundFunc, this),1000);
}

/********************
*********************
** Tier Functions  **
*********************
********************/

function checkTierTotal (theCont){
	checkTierOnce(theCont);
	setTimeout(function(){checkTierTotal(theCont);}, 2500);
}

function checkTierOnce(theCont){
	var tempTotal = theCont[0].totalDrips[0];
	theCont.forEach(function(entry){
		if(entry.totalDrips[0] < tempTotal){tempTotal = entry.totalDrips[0];}
		if(entry.isDouble){
			if(entry.totalDrips[1] < tempTotal){tempTotal = entry.totalDrips[1];}
		}
	});
	
	var tempPerSecond = theCont[0].perSecond;
	theCont.forEach(function(entry){
		if(entry.perSecond < tempPerSecond){tempPerSecond = entry.perSecond;}});
	
	tierTotal[theCont[0].tier] = tempTotal;
	tierPerSecond[theCont[0].tier] = tempPerSecond;
	
	//check star button
	
	if (tierPerSecond[theCont[0].tier] >= starPerSecondCost[theCont[0].tier]){
		$("#tierStore" + theCont[0].tier + " > .actionContainer > .starButton").show();
	}else {
		$("#tierStore" + theCont[0].tier + " > .actionContainer > .starButton").hide();
	}
	
	if (tierTotal[theCont[0].tier] >= starTierTotalCost[theCont[0].tier]){
		$("#tierStore" + theCont[0].tier + " > .actionContainer > .starButton2").show();
	}else {
		$("#tierStore" + theCont[0].tier + " > .actionContainer > .starButton2").hide();
	}
	
	//console.log(tierTotal[this[0].tier]);
	$("#tierStore" + theCont[0].tier + " > .storeContainer > .tierTotalText").text(tierTotal[theCont[0].tier].toString());
	$("#tierStore" + theCont[0].tier + " > .storeContainer > .tierPerSecondText").text(tierPerSecond[theCont[0].tier].toString());
	$("#tierStore" + theCont[0].tier + " > .storeContainer > .tierStarText").text(stars[theCont[0].tier].toString());
}

function starHandler (tier){
	$("#tierStore" + tier + " > .actionContainer > .starButton").hide();
	if(tierPerSecond[tier] >= starPerSecondCost[tier]){
		main[tier].forEach(function(entry){
			entry.perSecond = entry.perSecond - starPerSecondCost[tier]
		});
	
		stars[tier] = stars[tier]+1;
		starPerSecondCost[tier] = starPerSecondCost[tier] * 3;
		
		checkTierOnce(main[tier]);
	}
}

function starHandler2 (tier){
	$("#tierStore" + tier + " > .actionContainer > .starButton2").hide();
	if(tierTotal[tier] >= starTierTotalCost[tier]){
		main[tier].forEach(function(entry){
			entry.totalDrips[0] = entry.totalDrips[0]-starTierTotalCost[tier];
			if (entry.isDouble){
				entry.totalDrips[1] = entry.totalDrips[1]-starTierTotalCost[tier];
			}
		})
	
		stars[tier] = stars[tier]+1;
		starTierTotalCost[tier] = starTierTotalCost[tier] * 7;
		
		checkTierOnce(main[tier]);
	}
}

/***************
****************
** Add a tier **
****************
***************/

function checkButton(){
	if (tierTotal[tierTotal.length-1] >= costOfNextTier){
		$("#theButton").show();
		$("#toNextText").hide();
		$("#toNext").hide();
	} else {
		$("#theButton").hide();
		$("#toNextText").show();
		$("#toNext").text(costOfNextTier - tierTotal[tierTotal.length-1]).show();
	}
	
	setTimeout(checkButton, 5000);
}

function addTier() {
//hide the button while function is working
	$("#theButton").hide();
	
//add tier cost and total

costPerTier.push(costPerTier[costPerTier.length -1] *5);
tierTotal.push(0);
tierPerSecond.push(0);
stars.push(0);
starPerSecondCost.push(1);
starTierTotalCost.push(25);

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
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"><div class = "infoText"></div><div class = "textPerSecond"></div></div>';
			});
		}
	//last container
		else if(i === main[nextTier].length - 1){
			$(primaryTier).append(function(){
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"><div class = "infoText"></div><div class = "textPerSecond"></div></div>';
			});
		}
	//middle containers
		else{
			$(primaryTier).append(function(){
				return '<div class = "tier' + main[nextTier][i].tier + ' container' + main[nextTier][i].container + ' pool" style = "width:' + eachWidth + '%; background-color:black;"><div class = "infoText"></div><div class = "textPerSecond"></div></div>';
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
		setTimeout($.proxy(entry.backgroundFunc, entry), newRandom(1000,0));
	});
	main[nextTier-1].forEach(function(entry){
		$(entry.name).on("click", $.proxy(entry.clickFunc, entry));
		setTimeout($.proxy(entry.runningFunc, entry), newRandom(1000,0));
	});
	
//add the toggles

	$("#theToggles").append(toggleHTML(nextTier));
	toggleState.push(0);
	var toggleTier = nextTier;
	$("#primaryToggle" + toggleTier).on("click", function(){toggleHandler(toggleTier);});
	//console.log("#primaryToggle" + nextTier);
	
//add the store
	$("#primaryDrip" + nextTier).after(storeHTML(nextTier));
	$("#tierStore" + nextTier).append(storeTotal);
	$("#tierStore" + nextTier).append(storePerSecond);
	$("#tierStore" + nextTier).append(storeStars);
	$("#tierStore" + nextTier).append(storeActions);
	
	$("#tierStore" + nextTier + " > .actionContainer > .starButton").on("click", function(){starHandler(toggleTier);});
	$("#tierStore" + nextTier + " > .actionContainer > .starButton2").on("click", function(){starHandler2(toggleTier);});


//update tier variables
	checkTierTotal(main[toggleTier]);
	costOfNextTier = costOfNextTier * 5;
	checkButton();
	
	var newWidth = main[nextTier].length * 100;
	var newWidthStr = newWidth.toString()+"px"
	$("#theGame").css("min-width", newWidthStr);
	$(".gameWrapper").css("min-width", newWidthStr);
	
	nextTier++;
}

/**********************
***********************
** Sidebar Functions **
***********************
**********************/

function toggleText(){
	//console.log("toggle");
	$(".infoText").toggle();
	$(".textPerSecond").toggle();
}

function sidebarTabs(){
		$("#options").hide();
		$("#updates").show();
		$("#starStore").hide();
		
	$("#optionsName").on("click", function(){
		$("#options").show();
		$("#updates").hide();
		$("#starStore").hide();
	});
	$("#updatesName").on("click", function(){
		$("#options").hide();
		$("#updates").show();
		$("#starStore").hide();
	});
	$("#starStoreName").on("click", function(){
		$("#options").hide();
		$("#updates").hide();
		$("#starStore").show();
	});
}

function toggleHandler(tier){
	switch(toggleState[tier]){

		case 1:
			//console.log("1");
			$("#primaryDrip" + tier).hide();
			$("#primaryTier" + tier).hide();
			$("#tierStore" + tier).hide();
			toggleState[tier] = 2;
			$("#primaryToggle" + tier).css({
				borderTop: "25px solid transparent",
				borderBottom: "25px solid transparent",
				borderLeft: "0px solid transparent",
				borderRight: "25px solid black",
				marginTop: "0px",
				marginBottom: "50px",
				marginLeft: "0px",
				marginRight: "13px"
			});
			break;
		case 2:
			//console.log("2");
			$("#primaryDrip" + tier).hide();
			$("#primaryTier" + tier).show();
			$("#tierStore" + tier).hide();
			toggleState[tier] = 3;
			$("#primaryToggle" + tier).css({
				borderBottom: "25px solid black",
				borderTop: "0px solid transparent",
				borderLeft: "25px solid transparent",
				borderRight: "25px solid transparent",
				marginTop: "12px",
				marginBottom: "63px",
				marginLeft: "0px",
				marginRight: "0px"
			});
			break;
		case 3:
			//console.log("3");
			$("#primaryDrip" + tier).show();
			$("#primaryTier" + tier).show();
			$("#tierStore" + tier).hide();
			toggleState[tier] = 0;
			$("#primaryToggle" + tier).css({
				borderTop: "25px solid transparent",
				borderBottom: "25px solid transparent",
				borderRight: "0px solid transparent",
				borderLeft: "25px solid black",
				marginTop: "0px",
				marginBottom: "50px",
				marginRight: "0px",
				marginLeft: "13px"
			});
			break;
		default:
			//console.log("default");
			$("#primaryDrip" + tier).hide();
			$("#primaryTier" + tier).hide();
			$("#tierStore" + tier).show();
			toggleState[tier] = 1;
			$("#primaryToggle" + tier).css({
				borderTop: "25px solid black",
				borderBottom: "0px solid transparent",
				borderLeft: "25px solid transparent",
				borderRight: "25px solid transparent",
				marginTop: "13px",
				marginBottom: "62px",
				marginLeft: "0px",
				marginRight: "0px"
			});
			break;
	}
	
	//console.log(tier);
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

function newRandom (range, start) {
return Math.floor((Math.random() * range) + start);
}
