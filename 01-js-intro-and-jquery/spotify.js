$(document).ready(function(){
	
	$("input").focus();

	var searchFunction = function(query){
		$.ajax({
			type: "GET",
			url: "https://api.spotify.com/v1/search",
			data: { q: query, type: 'track' },
			success: function(response){
				$("ul").empty();
				console.log(response);
				if(response.tracks.items.length){
					$.each(response.tracks.items, function(index){
						var trackname = response.tracks.items[index].name;
						var artist = response.tracks.items[index].artists[0].name;
						var duration = response.tracks.items[index].duration_ms;
						$(".songs").append("<li> Track: " +trackname+ "<br> Artist: " +artist+ "<br>Duration: " +duration+ "</li>");
					})
					$(".hidden").fadeIn("slow");
				};
			}
		});
	};
	
	$("#button").click(function(){
	$(".hidden").fadeOut("fast");
	var query = $("#input").val();
	searchFunction(query);
	});
});