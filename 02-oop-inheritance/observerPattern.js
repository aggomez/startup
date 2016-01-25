//Inherit function
var inherit = function inherit(child, parent){
  var copyOfParent = Object.create(parent.prototype);
  copyOfParent.constructor = child;
 	child.prototype = copyOfParent;	
};

//Augment function
function augment(receivingClass, givingClass, methods) {
  if (arguments[2]) {
    for(var i = 0, length = methods.length; i < length; i++ ) {
      receivingClass.prototype[methods[i]] = givingClass.prototype[methods[i]];
    }
  } else {
    for (var methodName in givingClass.prototype ) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
};

//Observer class
var Observer = function Observer(events){
	this.events = events || [];
};

//Observable class
var Observable = function Observable(){
	this.observersList = [];
};

Observable.prototype = {
	addObserver: function(observer){
		this.observersList.push(observer);
	},
	notify: function(event,param){
		for (var i = 0; i < this.observersList.length; i++) {
			for (var j = 0; j < this.observersList[i].events.length; j++) {
				if (this.observersList[i].events[j].action === event){
					this.observersList[i].events[j].callback(this,param);
				};
			};
		};
	}
}

//Track class
var Track = function Track (title, artist, duration){
	Observable.call(this);
	this.title = title;
	this.artist = artist;
	this.duration = duration;
};

inherit(Track,Observable);

Track.prototype.get = function(attr) {
	return this[attr];
};

Track.prototype.set = function(attr, value) {
	this[attr] = value;
};

Track.prototype.play = function() {
	this.notify("play");
};

Track.prototype.stop = function() {
	this.notify("stop");
};

//TrackObserver class
var TrackObserver = function TrackObserver(){
	this.events = [
    {
		action: "play", 
		callback: function(track){
		 	console.log("Now playing " + track.title); 
		}
	},
	{
		action: "stop", 
		callback: function(track){
		 	console.log(track.title + " has stopped playing"); 
		}
	},
	//Adding download for Donloadable Track
	{
		action: "download",
		callback: function(track){
		 	console.log("Now downloading " + track.title); 
		}
	},
	//Adding share and like for Social
	{
		action: "share",
		callback: function(track,friendName){
		 	console.log("Sharing " + track.title + " with " + friendName); 
		}
	},
	{
		action: "like",
		callback: function(track,friendName){
		 	console.log(friendName + " has liked your track " + track.title); 
		}
	}
];
};

inherit(TrackObserver,Observer);

//Downloadable Track class

var DownloadableTrack = function DownloadableTrack(){
	Track.call(this,title,artist,duration);
}

inherit(DownloadableTrack,Track);

DownloadableTrack.prototype.download = function(){
	this.notify("download");
}

//Social mixin class
var Social = function Social(){};

Social.prototype = {
	share: function(friendName){
		this.notify("share",friendName);
	},
	like: function(friendName){
		this.notify("like",friendName);
	}
};

//Adding Social methods to Track 
augment(Track, Social, ["share", "like"]);

