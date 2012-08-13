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
	var index = c.index();
	timer_bag[index].seconds = (timer_bag[index].timerFinish-(new Date().getTime()))/1000;
	if( timer_bag[index].seconds <= 0){
		drawTimer(c,99);
		stop_timer(c);
		single_card_run(c);
	}else{
		var percent = 100-((timer_bag[index].seconds/timer_bag[index].timerSeconds)*100);
		drawTimer(c,percent);
	}
}

function stop_timer(c){
	update_doc_title();
	c.attr("data-times-loaded" , parseInt(c.attr("data-times-loaded"))+1);
	clear_timer(c);
}

function clear_timer(c){
	var index = c.index();
	clear_timer_by_index(index);
}

function clear_timer_by_index(i){
	var t_o = timer_bag[i];
	var $obj = $( t_o.obj );
	clearInterval( t_o.timer );
	drawTimer($obj,0);
}

function start_timer(c){
	var index = c.index();
	timer_bag[index].timerSeconds = main_column_timer / 1000;
	timer_bag[index].timerCurrent = 0;
	timer_bag[index].timerFinish = new Date().getTime()+(timer_bag[index].timerSeconds*1000);
	timer_bag[index].timer = setInterval(function(){ stopWatch(c) },50);
}

function stop_all_timers(){
	$(".ui-dashbox").each(function(){
		var $t = $(this);
		drawTimer($t,0);
		clear_timer($t);
	});
}