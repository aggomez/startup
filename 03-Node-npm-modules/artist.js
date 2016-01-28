var Artist = function (name, awards) {
	this.name = name;
	this.awards = awards || [];
}

Artist.prototype.get = function (attr) {
	return this[attr];
};

Artist.prototype.set = function (attr, value) {
	this[attr] = value;
};

Artist.prototype.addAward = function (award) {
	this.awards.push(award);
};

Artist.prototype.recognise = function () {
	var awardlist = "";
	for (var i = 0; i < this.awards.length; i++) {
			awardlist += this.awards[i] + " - ";
	};
	awardlist = this.name + " has the following awards: " + awardlist;
	console.log(awardlist);
	return awardlist;
};

module.exports = Artist;