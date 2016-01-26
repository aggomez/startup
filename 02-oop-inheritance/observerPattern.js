//Inherit function
var inherit = function (child, parent) {
  var copyOfParent = Object.create(parent.prototype);
  copyOfParent.constructor = child;
 	child.prototype = copyOfParent;	
};

//Augment function
var augment = function (receivingClass, givingClass) {
  if (arguments[2]) {
    for(var i = 2; i < arguments.length; i++) {
      receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
    }
  } else {
    for (var methodName in givingClass.prototype) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
};

//Observer class
var Observer = function (events) {
	this.events = events || [];
};

//Observable class
var Observable = function () {
	this.observersList = [];
};

Observable.prototype.addObserver = function (observer) {
	this.observersList.push(observer);
};

Observable.prototype.notify = function (event, param) {
	for (var i = 0; i < this.observersList.length; i++) {
		for (var j = 0; j < this.observersList[i].events.length; j++) {
			if (this.observersList[i].events[j].action === event) {
				this.observersList[i].events[j].callback(this,param);
			}
		}
	}
};

//Artist class
var Artist = function (name, role, band){
	this.name = name;
	this.role = role;
	this.band = band;
};

Artist.prototype.get = function (attr) {
	return this[attr];
};

Artist.prototype.set = function (attr, value) {
	this[attr] = value;
};

//Track class
var Track = function (title, artist, duration) {
	Observable.call(this);
	this.title = title;
	this.artist = artist;
	this.duration = duration;
	this.artists = [];
};

inherit(Track,Observable);

Track.prototype.get = function (attr) {
	return this[attr];
};

Track.prototype.set = function (attr, value) {
	this[attr] = value;		
};

Track.prototype.play = function () {
	this.notify("play");
};

Track.prototype.stop = function () {
	this.notify("stop");
};

Track.prototype.addArtist = function (newArtist) {
	this.artists.push(newArtist);
};

Track.prototype.getArtistByName = function (name) {
	for (var i = 0; i < this.artists.length; i++) {
		if (this.artists[i].name === name){
			return this.artists[i];
		}
	}
	return console.log("Artist not found");
};

Track.prototype.removeArtistByName = function (name) {
	for (var i = 0; i < this.artists.length; i++) {
		if (this.artists[i].name === name){
			this.artists.splice(i,1);
			return console.log(name + " removed from " + this.title)
		}
	}
	return console.log("Artist not found")
};

//TrackObserver class
var TrackObserver = function TrackObserver () {
	this.events = [
  {
		action: "play", 
		callback: function (track) {
		 	console.log("Now playing " + track.title); 
		}
	},
	{
		action: "stop", 
		callback: function (track) {
		 	console.log(track.title + " has stopped playing"); 
		}
	},
	//Adding download for Donloadable Track
	{
		action: "download",
		callback: function (track) {
		 	console.log("Now downloading " + track.title); 
		}
	},
	//Adding share and like for Social
	{
		action: "share",
		callback: function (track,friendName) {
		 	console.log("Sharing " + track.title + " with " + friendName); 
		}
	},
	{
		action: "like",
		callback: function (track,friendName) {
		 	console.log(friendName + " has liked your track " + track.title); 
		}
	}
];
};

inherit(TrackObserver,Observer);

//Downloadable Track class

var DownloadableTrack = function (title, artist, duration) {
	Track.call(this, title, artist, duration);
};

inherit(DownloadableTrack,Track);

DownloadableTrack.prototype.download = function () {
	this.notify("download");
};

//Social mixin class
var Social = function () {};

Social.prototype.share = function (friendName) {
	this.notify("share",friendName);
};

Social.prototype.like = function (friendName) {
	this.notify("like",friendName);
};

//Adding Social methods to Track 
augment(Track, Social, "share", "like");