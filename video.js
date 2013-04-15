$(document).ready(function () {

	setTimeout(function () {

		var visitedIds = [];

	var likedVids = [];

	var categories = ["10"];

	var choices = [];

	var centered = false;

	var playing = false;

	/*
	ID LIST:
	auto: 2
	comedy: 23
	education: 27
	entertainment: 24
	film: 1
	music: 10
	gaming: 20
	style:26
	politics:25
	activism: 29
	people/vlogs: 22
	animals: 15
	science/tech: 28
	sports: 17
	travel: 19
	*/

	$.getScript('swfobject.js', function() {

		video_id = "9bZkp7q19f0";
		cat_id = 17;
		url = null;
		API_KEY="AIzaSyBP8mopg68nZjzqaDzmfxxJuVdP8N8DYF8";

		params = { allowScriptAccess: "always" };
		//atts = { id: "ytplayer" };

		console.log(playerWidth);

		swfobject.embedSWF(
			//"http://www.youtube.com/v/" + video_id + "?version=3&enablejsapi=1&playerapiid=ytplayer", "ytplayer", "425", "365", "8", null, null, params);
			"http://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=ytplayer", "ytplayer", "80%", "85%", "9.0.0", "expressinstall.js", null, params, null);
			//swfobject.embedSWF(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj)

		console.log(ytplayer);


		ytplayer = document.getElementById("ytplayer");
		
		setInterval(checkState, 1000);

		function checkState(){
			var state = ytplayer.getPlayerState();
			if (state === 0){
				likeVid();
				nextVid();
			}

			if (state === 1){
				playing = true;
			}

			if (state === 2){
				playing = false;
			}

			/*
			if (!centered){
				$('#ytplayer').center();
			}
			*/

		}

		function nextVid(){
			console.log(categories);
			var rand = Math.floor((Math.random()*categories.length));
			cat_id = categories[rand];

			$.get(
				//"https://www.googleapis.com/youtube/v3/search?type=video&relatedToVideoId=" + video_id + "&part=snippet&key=" + API_KEY, 
				//"https://www.googleapis.com/youtube/v3/search?q=puppies&part=snippet&key=" + API_KEY,
				 
				"https://www.googleapis.com/youtube/v3/search?type=video&maxResults=" + 50 + "&videoCategoryId=" + cat_id +"&part=snippet&key=" + API_KEY,
				function(data){

					choices = [];

					for (var i = 0; i < data.items.length; i++){
						choices[choices.length] = data.items[i].id.videoId;
					}
					//TODO: get related videos to liked vids, have search get more results
					choices = choices.concat(likedVids);

					var counter = Math.floor(Math.random()*choices.length);

					while (true){
						var id = choices[counter];
						if ($.inArray(id, visitedIds) === -1){
							ytplayer.loadVideoById(id);
							video_id = id;
							visitedIds[visitedIds.length] = video_id;
							break;
						} else if (choices.length - 10 < counter){
							counter = counter - Math.floor(Math.random()*(choices.length - 10));
						} else {
							counter++;
						}
					}

					setTimeout(function() {
				
						$.get(
							//"https://gdata.youtube.com/feeds/api/videos/" + video_id + "?v=2", //{paramOne : 1, paramX : 'abc'},
							"https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status",
							function(data) {
								var title = data.items[0].snippet.title;
								if (title.length >= 60) title = title.substring(0, 60) + "...";
									$('#videotitle').html(title);
									cat_id = data.items[0].snippet.categoryId;
							}
						);
					}, 3000);

				}

			)
		}

		function resetPreferencs(newPrefs){
			categories = [];
			likedVids = [];
			categories = newPrefs;
		}

		function removeCurrentPref(){
			//var y = [1, 2, 3]
			var removeItem = cat_id;

			categories = jQuery.grep(categories, function(value) {
  				return value != removeItem;
			});
		}

		function removePref(removeItem){
			categories = jQuery.grep(categories, function(value) {
  				return value != removeItem;
			});
		}

		function likeVid(){
			$.get(
				//"https://gdata.youtube.com/feeds/api/videos/" + video_id + "?v=2", //{paramOne : 1, paramX : 'abc'},
				"https://www.googleapis.com/youtube/v3/search?type=video&relatedToVideoId=" + video_id + "&part=snippet&key=" + API_KEY,
				function(data) {
					console.log(data);
					for (var i = 0; i < 3; i++){
						likedVids[likedVids.length] = data.items[i].id.videoId;
					}
				}
			);
		}

		$("#start-watching").click(function () {
    		console.log("halp");
    		$("#banner").remove();
    		$("#ytplayer").center();
    		setTimeout(function() {
    			ytplayer.loadVideoById({videoId:video_id, startSeconds:0, suggestedQuality:"320"});
    		}, 1000);
  		});
		
		$('#load').click(function() {
			console.log("Play pressed");
			ytplayer.loadVideoById({videoId:video_id, startSeconds:0, suggestedQuality:"320"});
			//url = ytplayer.getVideoUrl();
			console.log(url);
		});

		$('#like').click(function () {
			likeVid();
		});

		$('#dislike').click(function () {
			removeCurrentPref();
		});

		$('#stop').click(function () {
			ytplayer.pauseVideo();
		});

		$('#play').click(function () {
			var state = ytplayer.getPlayerState();
			if (playing){
				ytplayer.pauseVideo();
			} else {
				ytplayer.playVideo();
			}

			//ytplayer.playVideo();
			console.log(ytplayer.getPlayerState());
		});

		$('#category-menu').click(function () {
			console.log("menu clicked");
		});

		$("#Auto").click(function () {
			//console.log($('#auto').is(':checked'));
			if ($("#auto").is(':checked')){
				categories[categories.length] = "2";
				console.log("preference added: Auto");
			} else {
				removePref("2");
				console.log("preference removed: Auto");
			}
		});

		$("#Comedy").click(function () {
			if ($("#comedy").is(':checked')){
				categories[categories.length] = "23";
				console.log("preference added");
			} else {
				removePref("23");
				console.log("preference removed");
			}
		});

		$("#Education").click(function () {
			if ($("#education").is(':checked')){
				categories[categories.length] = "27";
				console.log("preference added");
			} else {
				removePref("27");
				console.log("preference removed");
			}
		});

		$("#Entertainment").click(function () {
			if ($("#entertainment").is(':checked')){
				categories[categories.length] = "24";
				console.log("preference added");
			} else {
				removePref("24");
				console.log("preference removed");
			}
		});

		$("#Film").click(function () {
			if ($("#film").is(':checked')){
				categories[categories.length] = "1";
				console.log("preference added");
			} else {
				removePref("1");
				console.log("preference removed");
			}
		});

		$("#Music").click(function () {
			if ($("#music").is(':checked')){
				categories[categories.length] = "10";
				console.log("preference added");
			} else {
				removePref("10");
				console.log("preference removed");
			}
		});

		$("#Gaming").click(function () {
			if ($("#gaming").is(':checked')){
				categories[categories.length] = "20";
				console.log("preference added");
			} else {
				removePref("20");
				console.log("preference removed");
			}
		});

		$("#Style").click(function () {
			if ($("#style").is(':checked')){
				categories[categories.length] = "26";
				console.log("preference added");
			} else {
				removePref("26");
				console.log("preference removed");
			}
		});

		$("#Politics").click(function () {
			if ($("#politics").is(':checked')){
				categories[categories.length] = "25";
				console.log("preference added");
			} else {
				removePref("25");
				console.log("preference removed");
			}
		});

		$("#Activism").click(function () {
			if ($("#activism").is(':checked')){
				categories[categories.length] = "29";
				console.log("preference added");
			} else {
				removePref("29");
				console.log("preference removed");
			}
		});

		$("#People").click(function () {
			if ($("#people").is(':checked')){
				categories[categories.length] = "22";
				console.log("preference added");
			} else {
				removePref("22");
				console.log("preference removed");
			}
		});

		$("#Animals").click(function () {
			if ($("#animals").is(':checked')){
				categories[categories.length] = "15";
				console.log("preference added");
			} else {
				removePref("15");
				console.log("preference removed");
			}
		});

		$("#Science").click(function () {
			if ($("#science").is(':checked')){
				categories[categories.length] = "28";
				console.log("preference added");
			} else {
				removePref("28");
				console.log("preference removed");
			}
		});

		$("#Sports").click(function () {
			if ($("#sports").is(':checked')){
				categories[categories.length] = "17";
				console.log("preference added");
			} else {
				removePref("17");
				console.log("preference removed");
			}
		});

		$("#Travel").click(function () {
			if ($("#travel").is(':checked')){
				categories[categories.length] = "19";
				console.log("preference added");
			} else {
				removePref("19");
				console.log("preference removed");
			}
		});


		$('#next').click(function () {
			
			
	
			nextVid();

			setTimeout(function() {
				
			$.get(
				//"https://gdata.youtube.com/feeds/api/videos/" + video_id + "?v=2", //{paramOne : 1, paramX : 'abc'},
				"https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status",
				function(data) {
					var title = data.items[0].snippet.title;
					if (title.length >= 60) title = title.substring(0, 60) + "...";
					$('#videotitle').html(title);
					cat_id = data.items[0].snippet.categoryId;
				}
			);
		}, 1000);
			
		});

		$('#query').click(function () {

			var keywords = $('#search').val();

			$.get(//"https://www.googleapis.com/youtube/v3/search?q=" + keywords + "&part=snippet&key=" + API_KEY,
				"https://www.googleapis.com/youtube/v3/search?type=video&videoCategoryId=" + cat_id + "&part=snippet&key=" + API_KEY,
				function(data){
					console.log(data);
					var id = data.items[0].id.videoId;
					ytplayer.loadVideoById(id);
					video_id = id;
				}

			)

		});

		$('#info').click(function () {
			$.get(
				//"https://gdata.youtube.com/feeds/api/videos/" + video_id + "?v=2", //{paramOne : 1, paramX : 'abc'},
				"https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status",
				function(data) {
					console.log(data);
				}
			);
		});

		
		$("#au").click(function () {
      //console.log($('#auto').is(':checked'));
      if ($("#au").is(':checked')){
        categories[categories.length] = "2";
        console.log("preference added: Auto");
      } else {
        removePref("2");
        console.log("preference removed: Auto");
      }
    });

    $("#co").click(function () {
      if ($("#co").is(':checked')){
        categories[categories.length] = "23";
        console.log("preference added");
      } else {
        removePref("23");
        console.log("preference removed");
      }
    });

    $("#ed").click(function () {
      if ($("#ed").is(':checked')){
        categories[categories.length] = "27";
        console.log("preference added");
      } else {
        removePref("27");
        console.log("preference removed");
      }
    });

    $("#en").click(function () {
      if ($("#en").is(':checked')){
        categories[categories.length] = "24";
        console.log("preference added");
      } else {
        removePref("24");
        console.log("preference removed");
      }
    });

    $("#fi").click(function () {
      if ($("#fi").is(':checked')){
        categories[categories.length] = "1";
        console.log("preference added");
      } else {
        removePref("1");
        console.log("preference removed");
      }
    });

    $("#mu").click(function () {
      if ($("#mu").is(':checked')){
        categories[categories.length] = "10";
        console.log("preference added");
      } else {
        removePref("10");
        console.log("preference removed");
      }
    });

    $("#ga").click(function () {
      if ($("#ga").is(':checked')){
        categories[categories.length] = "20";
        console.log("preference added");
      } else {
        removePref("20");
        console.log("preference removed");
      }
    });

    $("#st").click(function () {
      if ($("#st").is(':checked')){
        categories[categories.length] = "26";
        console.log("preference added");
      } else {
        removePref("26");
        console.log("preference removed");
      }
    });

    $("#po").click(function () {
      if ($("#po").is(':checked')){
        categories[categories.length] = "25";
        console.log("preference added");
      } else {
        removePref("25");
        console.log("preference removed");
      }
    });

    $("#ac").click(function () {
      if ($("#ac").is(':checked')){
        categories[categories.length] = "29";
        console.log("preference added");
      } else {
        removePref("29");
        console.log("preference removed");
      }
    });

    $("#pe").click(function () {
      if ($("#pe").is(':checked')){
        categories[categories.length] = "22";
        console.log("preference added");
      } else {
        removePref("22");
        console.log("preference removed");
      }
    });

    $("#an").click(function () {
      if ($("#an").is(':checked')){
        categories[categories.length] = "15";
        console.log("preference added");
      } else {
        removePref("15");
        console.log("preference removed");
      }
    });

    $("#sc").click(function () {
      if ($("#sc").is(':checked')){
        categories[categories.length] = "28";
        console.log("preference added");
      } else {
        removePref("28");
        console.log("preference removed");
      }
    });

    $("#sp").click(function () {
      if ($("#sp").is(':checked')){
        categories[categories.length] = "17";
        console.log("preference added");
      } else {
        removePref("17");
        console.log("preference removed");
      }
    });

    $("#tr").click(function () {
      if ($("#tr").is(':checked')){
        categories[categories.length] = "19";
        console.log("preference added");
      } else {
        removePref("19");
        console.log("preference removed");
      }
    });
		

	});

	}, 1000);

});

	
