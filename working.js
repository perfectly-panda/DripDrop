var containerPrototype = {
	tier: 0;
	position: 0;
	cost: 0;
	perSecond: 0;
	total: [0,0];
	name: ".tier0.container0";
	maxColor: [[0,0,0],[0,0,0]];
	colorRatio: [0,0,0]
	drippers: [".tier0.drip0",".tier0.drip1",".tier0.drip2"];
}

NewContainer (tier, position, maxColor, colorRatio, drippers) {
	this.tier = tier;
	this.position = position;
	this.cost = costPerTier[this.tier];
	this.name = ".tier" + this.tier + ".container" + this.position;
	this.maxColor = maxColor;
	this.colorRatio = colorRatio;
	this.drippers = drippers;
}

NewContainer.prototype = containerPrototype;
