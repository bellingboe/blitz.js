/*
	blitz.js
	
	main javascript file for all card/column funcationality.
	I'm aware I suck at documentation, sorry. xP
	
	I'm also aware of my poor JS design choices... I should've made use of objects and such, yes, I know, but this does work.
*/

/*
	q: search string
	pass in a serch string and return the twitter search api url
*/
function build_search_query(q){
	return "http://search.twitter.com/search.json?q="+encodeURIComponent(q)+"&rpp=5&include_entities=true&result_type=recent&locale=en";
}

/*
	cr: tweet object to build display for. (object from twitter result)
	ob: the parent box (.ui-dashbox) the tweet will go in
	last:the last tweet item that was pushed to "ob"
*/
function build_tweet_display(cr,ob,last){
	var $this = ob;
	var box_id = $this.attr('id');
	
	/* if this tweet is already in the box, don't show it */
	
	if( $("#"+box_id+"_tweet_id_"+cr.id_str).length>0 ){
		return 0;
	}
	
	/* get all relevent info the "cr" object (name, img, tweet text, etc) */
	
	var img = cr.profile_image_url;
	var tweet = cr.text;
	tweet = tweet.replace(/\B@([\w-]+)/gm, '<a href="http://twitter.com/$1" target="_blank">@$1</a>');
	var real_name = cr.from_user_name;
	var tname = cr.from_user;
	var created = cr.created_at;
	
	/*
		programtically build all the html
	*/
	
	var tweet_item = $("<div>");
	tweet_item.addClass("tweet-item");
	tweet_item.attr("id",box_id+"_tweet_id_"+cr.id_str);
	tweet_item.attr("data-created",created);
	
		var tweet_item_img = $("<div>");
		tweet_item_img.addClass("tweet-item-img");
			var tweet_item_img_img = $("<img>");
			tweet_item_img_img.attr("src",img).attr("alt",real_name+"on Twitter");
			tweet_item_img_img.appendTo(tweet_item_img);
			
			tweet_item_img.appendTo(tweet_item);
			
		var tweet_item_details = $("<div>");
		tweet_item_details.addClass("tweet-item-details");
			var tweet_item_details_strong = $("<strong>");
			//tweet_item_details_strong.append(real_name);
				var tweet_item_details_strong_a = $("<a>");
				tweet_item_details_strong_a.attr("href","http://twitter.com/"+tname).html("@"+tname);
				tweet_item_details_strong_a.appendTo(tweet_item_details_strong);
			tweet_item_details_strong.appendTo(tweet_item_details);
			
			var tweet_item_details_p = $("<p>");
			tweet_item_details_p.html(tweet);
			
			tweet_item_details_p.appendTo(tweet_item_details);
			
		tweet_item_details.appendTo(tweet_item);
	
	/*
		If we haven't loadded any tweets into the box
	*/
	if("undefined" == typeof $this.attr('data-last-loaded')){
		
		/*
			then append this tweet (cr) to the box
		*/
		
		tweet_item.appendTo( $this.find(".ui-dashbox-content") );
	}else{
		
		/*
			 otherwise... check if we have updated any subsequent number of times (data-times-loaded)
			 AFTER the initial page load
		*/
		
		if( parseInt($this.attr("data-times-loaded"))>0 ){
			
			/*
				 if we have, then give it a hidden class (like twitter's "Show New Tweets")
			*/
			
			tweet_item.addClass('hidden-pool');
		}
		if(last==null || last==0){
			
			/*
				if there is no previous tweet in the box (this is the first)
				then pput it at the beginning
			*/
			
			tweet_item.prependTo( $this.find(".ui-dashbox-content")  );
		}else{
			
			/*
				if there IS a previous tweet, insert it after it.
			*/
			
			tweet_item.insertAfter(last);
		}
	}
	
	/*
		return the tweet item ro use in the next build_tweet_display() call ass the "last" parameter
	*/
	
	return tweet_item;
}

/*
	d: the result object from the twitter call
	o: the current object the results are from, (ex, "#Olympics")
	box: the array of all tweet to be pushed into "obj", from all "o"s
	box_count: how many "objects" (search terms) are in this box
	curr_iteration: the "i" value of the current "object" in the box
	obj: the .ui-dashbox Dom object the call was made for
*/
function card_cb(d,o,box,box_count,curr_iteration,obj){
	var last_tweet = null;
	var resp = d;
	var $this = obj;
	if("undefined" == typeof $this.attr("data-obj-count")){
		$this.attr("data-obj-count",1);
	}else{
		$this.attr("data-obj-count", parseInt($this.attr("data-obj-count"))+1 );
	}
	if(!resp.results){
		$this.find(".ui-dashbox-content").find("p.dashbox-loading").html("There was a problem talking to Twitter =(");
	}else if(resp.results.length == 0){
		$this.find(".ui-dashbox-content").find("p.dashbox-loading").html("No Tweets to display.");
	}else{
		$this.attr("data-last-loaded",resp.results[0].id_str);
		$this.find(".ui-dashbox-content").find("p.dashbox-loading").remove();
		for(var r in d.results){
			cr = d.results[r];
			box.push(cr);
		}
		if( parseInt($this.attr("data-obj-count"))==box_count ){
			$this.removeAttr("data-obj-count");
			box.sort(function (a, b) {
				return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
			});
			box.splice(5,5);
			for(var r in box){
				var last_tweet_preserved = last_tweet;
				last_tweet = build_tweet_display( box[r] , $this , last_tweet_preserved );
			}
			start_timer($this);
			var count_hidden = $this.find("div.hidden-pool").length;
			if(count_hidden > 0){
				$this.find(".show-pool-button").html("Show "+count_hidden+" More").slideDown().css("display","block").css("clear","both");
				update_doc_title();
			}
		}
	}
}

/*
	cb: callback funciton to run, currently, "card_cb"
	co: the current object the results are from, (ex, "#Olympics")
	box: the array of all tweet to be pushed into "obj", from all "o"s
	box_count: how many "objects" (search terms) are in this box
	curr_iteration: the "i" value of the current "object" in the box
	obj: the .ui-dashbox Dom object the call was made for
*/
var build_card_entry = function(cb,co,box,box_count,curr_iteration,obj){
	the_url = build_search_query(co);
	var jsonp_url = the_url+"&callback=?";
	
	$.getJSON(jsonp_url,{},function(res){
		cb(res,co,box,box_count,curr_iteration,obj);
	}).error(function(){ obj.find(".ui-dashbox-content").find("p.dashbox-loading").html("Problem contacting Twitter..."); });
}

/*
	call this to start everything off
*/
function column_timer(){
	column_ajax();
	setInterval(function() {
		column_ajax();
	}, main_column_timer);
}

/*
	the core of column_timer() but if this is called by
	itself, it won't have any timer functionality.
*/
function column_ajax(){
	$(".ui-dashbox").each(function(){
		var $this = $(this);
		
		$this.timer;
		$this.timerCurrent;
		$this.timerFinish;
		$this.timerSeconds;
		
		$this.find(".ui-dashbox-content").css("max-height",(parseInt($(window).height())-175)+"px");
		var $objects = $this.attr("data-objects");
		var $obj_arr = $objects.split(",");
		var count = $obj_arr.length;
		var box_list = [];
		
		for (var i in $obj_arr){
			var curr_iteration = parseInt(i)+1;
			var is_search,
				is_person,
				the_url,
				method,
				cr;
			var c_o = $obj_arr[i];
			var first = c_o[0];
			if(first!=="@"){
				is_search = true;
				is_person = false;
			}else{
				is_search = false;
				is_person = true;
			}
			
			if(is_search){
				the_url = build_search_query(c_o);
				method = "get";
			}else{
				// TODO
			}
			
			if(method=="get"){
				build_card_entry(card_cb,c_o,box_list,count,curr_iteration,$this);
			}
		}
	});
}
/*
	 responsive design :D
	 called on window resize hook
	 currently 4-col is hard-coded max
*/
function column_sizer(){
	var $ww = $(window).width();
	if($ww>=1280){
		$(".ui-dashbox").removeClass("columnWidth").removeClass("fullWidth").removeClass("halfWidth").removeClass("threeColWidth").addClass("fourColWidth"); // 4 columns
	}else if($ww<1280 && $ww>=960){
		$(".ui-dashbox").removeClass("columnWidth").removeClass("fullWidth").removeClass("halfWidth").removeClass("fourColWidth").addClass("threeColWidth"); // 3 columns!
	}else if($ww<960 && $ww>=640){
		$(".ui-dashbox").removeClass("columnWidth").removeClass("fullWidth").removeClass("threeColWidth").removeClass("fourColWidth").addClass("halfWidth"); // 2 columns!
	}else if($ww<640){
		$(".ui-dashbox").removeClass("columnWidth").removeClass("halfWidth").removeClass("threeColWidth").removeClass("fourColWidth").addClass("fullWidth"); // 1 column!
	}else{
		$(".ui-dashbox").removeClass("fullWidth").removeClass("halfWidth").removeClass("threeColWidth").removeClass("fourColWidth").addClass("columnWidth"); // default
	}
	
}

function create(str){
	var id = $(".ui-dashbox").length;
	var html = '<div class="ui-dashbox" id="box_'+id+'" data-objects="'+str+'"><header><div class="timer fill"></div><span>'+str+'</span> <a href="#"><img src="images/gear.png" /></a></header><a href="#" class="show-pool-button">Show More</a><section class="ui-dashbox-content"><p class="dashbox-loading" style="padding:15px;text-align:center;">Loading...</p></section><footer><a href="#" class="uibutton">Reveal Older</a></footer></div>';
	var obj = $(html).appendTo( $("#main_dashbox") );
}