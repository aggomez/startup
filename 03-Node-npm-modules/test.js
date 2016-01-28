var Artist = require("./artist.js");
var Track = require("./track.js");
var $ = require("jquery");

var droid = new Track();
var jordanSuckley = new Artist("Jordan Suckley");
jordanSuckley.set("awards", ["DJ Mag Top 100 Clubs: 2013, 2014, 2015", "Nightclub & Bar Top 100 Clubs: 2014", "Best Security: DLIST Seattle Nightlife Awards 2013"]);
droid.set("artist", jordanSuckley);
droid.get("artist").recognise();

$(document).ready(function () {
	$("div").append(droid.get("artist").recognise());
});