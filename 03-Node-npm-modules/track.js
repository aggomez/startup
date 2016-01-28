var Artist = require("./artist.js");

var Track = function (title, artist, duration) {
	this.title = title;
	this.artist = artist;
	this.duration = duration;
};

Track.prototype.get = function (attr) {
	return this[attr];
};

Track.prototype.set = function (attr, value) {
	this[attr] = value;
};

module.exports = Track; 