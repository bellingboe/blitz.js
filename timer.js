function drawTimer(context,percent){
	context.find('div.timer').html('<div class="percent"></div><div id="slice"'+(percent > 50?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
	var deg = 360/100*percent;
	context.find('#slice .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	context.find('.percent').html(Math.round(percent)+'%');
}
function stopWatch(c){
	c.seconds = (c.timerFinish-(new Date().getTime()))/1000;
	if(c.seconds <= 0){
		drawTimer(c,99);
		stop_timer(c);
	}else{
		var percent = 100-((c.seconds/c.timerSeconds)*100);
		drawTimer(c,percent);
	}
}

function stop_timer(c){
	update_doc_title();
	c.attr("data-times-loaded" , parseInt(c.attr("data-times-loaded"))+1);
	clearInterval(c.timer);
}

function start_timer(c){
	c.timerSeconds = main_column_timer / 1000;
	c.timerCurrent = 0;
	c.timerFinish = new Date().getTime()+(c.timerSeconds*1000);
	c.timer = setInterval(function(){ stopWatch(c) },50);
}

function update_doc_title(){
	var count = $(".hidden-pool").length;
	if(count > 0){
		document.title = "#dashblitz ("+count+")";
	}
}