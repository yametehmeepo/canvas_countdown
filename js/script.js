var contextWidth = 1200;
var contextHeight = 768;
var marginTop = 300;
var marginLeft = 50;
var radius = 8;
var radiusMargin = 1;
var curDate = new Date();//今天
curDate.setTime(curDate.getTime() + 24*60*60*1000);//明天
var endTime;
if(new Date().getHours() < 18){//如果今天已经超过下班时间 18:00:00,将endTime置成明天的18:00:00, 否则置成今天的18:00:00
	endTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 18, 00, 00);
}else{
	endTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 18, 00, 00);
}
//endTime = new Date(2018, 9, 12, 17, 20, 20);
var thisTime = null;
var nextTime = 0;
var balls = [];
var colors = ['#e00003','#129ecb','#a5cf02','#8c4cb1','#fc8100','#f5424a','#febd33','#6f9800','#9fc000','#bc68d5'];
var timer;
var text1 = '炫丽的倒计时效果';
var text2 = 'Canvas绘图与动画基础';


window.onload = function(){
	contextWidth = document.documentElement.clientWidth;
	contextHeight = document.documentElement.clientHeight;
	radius = Math.round(contextWidth*4/5/116) - 1;
	marginLeft = contextWidth/10;
	//marginTop = document.documentElement.clientHeight/2 - (radius + radiusMargin)*13;
	marginTop = contextHeight/5;
	var canvas = document.getElementById('canvas');
	canvas.width = contextWidth;
	canvas.height = contextHeight;
	var context = canvas.getContext('2d');
	timer = setInterval(function(){ if( !document.hidden) update(context) }, 50);
}

function update(context){
	if(!thisTime){//当thisTime为0, 即倒计时结束时
		context.clearRect(0,0,context.canvas.width,context.canvas.height);
		drawText(context);
		thisTime = restTime(endTime);
		var hours = parseInt(thisTime/3600);
		var minutes = parseInt((thisTime - hours*3600)/60);
		var seconds = parseInt(thisTime%60);
		render(parseInt(hours/10), 0, context);
		render(parseInt(hours%10), 16*(radius + radiusMargin), context);
		render(10, 32*(radius + radiusMargin), context);
		render(parseInt(minutes/10), 42*(radius + radiusMargin), context);
		render(parseInt(minutes%10), 58*(radius + radiusMargin), context);
		render(10, 74*(radius + radiusMargin), context);
		render(parseInt(seconds/10), 84*(radius + radiusMargin), context);
		render(parseInt(seconds%10), 100*(radius + radiusMargin), context);
		//更新每个彩色数字内部的球的位置与速度
		renderBallsLocation();
		//删除完全跳出画布的小球以节省内存
		deleteOutCanvasBalls();
		//绘制每个彩球
		renderBalls(context);
		if(!balls.length && thisTime == 0){//当小球数组个数为0并且thisTime也为0时, 即倒计时结束并且画布内小球全部跳出画布范围, 清除计时器
			clearInterval(timer);
		}
	}else{
		/*
			每次计时器都获取一次距离截止时间有多少秒，然后转化成时分秒, 无论转化后的时间变没变都清除一次画布重新绘制.
			如果时间发生变化, 时分秒的个位和十位数分别判断6种情况, 变化的位置是哪一位, 相应添加一个该位置的变化后的数字, 
			即addBalls函数,
			最后更新数组balls中的小球的各项参数(位置, vx, vy),
			最后绘制小球
		*/
		nextTime = restTime(endTime);
		context.clearRect(0,0,context.canvas.width,context.canvas.height);
		drawText(context);
		var nextHours = parseInt(nextTime/3600);
		var nextMinutes = parseInt((nextTime - nextHours*3600)/60);
		var nextSeconds = parseInt(nextTime%60);
		var thisHours = parseInt(thisTime/3600);
		var thisMinutes = parseInt((thisTime - thisHours*3600)/60);
		var thisSeconds = parseInt(thisTime%60);
		render(parseInt(nextHours/10), 0, context);
		render(parseInt(nextHours%10), 16*(radius + radiusMargin), context);
		render(10, 32*(radius + radiusMargin), context);
		render(parseInt(nextMinutes/10), 42*(radius + radiusMargin), context);
		render(parseInt(nextMinutes%10), 58*(radius + radiusMargin), context);
		render(10, 74*(radius + radiusMargin), context);
		render(parseInt(nextSeconds/10), 84*(radius + radiusMargin), context);
		render(parseInt(nextSeconds%10), 100*(radius + radiusMargin), context);	
		if(nextTime != thisTime){
			if(parseInt(thisHours/10) != parseInt(nextHours/10)){
				//console.log('hours1变化');
				addBalls(parseInt(nextHours/10), 0);
			}
			if(parseInt(thisHours%10) != parseInt(nextHours%10)){
				//console.log('hours2变化');
				addBalls(parseInt(nextHours%10), 16*(radius + radiusMargin));
			}
			if(parseInt(thisMinutes/10) != parseInt(nextMinutes/10)){
				//console.log('minutes1变化');
				addBalls(parseInt(nextMinutes/10), 42*(radius + radiusMargin));
			}
			if(parseInt(thisMinutes%10) != parseInt(nextMinutes%10)){
				//console.log('minutes2变化');
				addBalls(parseInt(nextMinutes%10), 58*(radius + radiusMargin));
			}
			if(parseInt(thisSeconds/10) != parseInt(nextSeconds/10)){
				//console.log('seconds1变化');
				addBalls(parseInt(nextSeconds/10), 84*(radius + radiusMargin));
			}
			if(parseInt(thisSeconds%10) != parseInt(nextSeconds%10)){
				//console.log('seconds2变化');
				addBalls(parseInt(nextSeconds%10), 100*(radius + radiusMargin));
			}
			thisTime = nextTime;
		}
		//更新每个彩色数字内部的球的位置与速度
		renderBallsLocation();
		//删除完全跳出画布的小球以节省内存
		deleteOutCanvasBalls();
		//绘制每个彩球
		renderBalls(context);
	}
	//console.log(balls.length)
}

//渲染文字
function drawText(context){
	if(contextWidth < 800){
		return false
	}
	var textMarginLeft = marginLeft;//小时数字左下角位置的x坐标, 第一行文字x坐标不需要增加
	var textMarginTop = marginTop + (radius + radiusMargin)*24;//小时数字左下角位置的y坐标, 第一行文字y坐标需要增加contextWidth/70
	context.beginPath();
	context.font = '2.8vw 微软雅黑';
	context.textAlign = 'left';
	context.textBaseLine = 'middle';
	var gradient = context.createLinearGradient(textMarginLeft, 0, textMarginLeft + context.measureText(text1).width, 0);
	gradient.addColorStop(0.0, '#fc0000');
	gradient.addColorStop(0.25, '#2400fc');
	gradient.addColorStop(0.5, '#fcf300');
	gradient.addColorStop(0.75, '#00fc5f');
	gradient.addColorStop(1.0, '#fca600');
	context.fillStyle = gradient;
	context.fillText(text1, textMarginLeft, textMarginTop + contextWidth/70);

	context.beginPath();
	context.moveTo(textMarginLeft + contextWidth/20, textMarginTop + contextWidth/30);
	context.lineTo(textMarginLeft + contextWidth/10, textMarginTop + contextWidth/30);
	context.lineWidth = 3;
	//context.strokeStyle = '#2b6f86';
	context.strokeStyle = gradient;
	context.stroke();
	context.beginPath();
	context.font = '1.8vw 微软雅黑';
	context.textAlign = 'left';
	context.textBaseLine = 'middle';
	//context.fillStyle = '#2b6f86';
	context.fillStyle = gradient;
	context.fillText(text2, textMarginLeft + contextWidth/10 + 10, textMarginTop + contextWidth/26);
}

//当前时间距离截止时间的秒数
function restTime(endTime){
	var ret = parseInt((endTime.getTime() - new Date().getTime())/1000);
	return ret >= 0 ? ret : 0 ;
}

//渲染倒计时数字
function render(x, offsetLeft, context){
	for(var y = 0; y < digit[x].length; y++){
		for(var z = 0; z < digit[x][y].length; z++){
			if(digit[x][y][z] == 1){
				renderDigit(marginLeft + offsetLeft + 2*(radius + radiusMargin)*z + (radius + radiusMargin), marginTop + 2*(radius + radiusMargin)*y + (radius + radiusMargin), radius, 0, 2*Math.PI, context);
			}
		}
	}
}

//绘制倒计时数字
function renderDigit(x, y, r, start, end, context){
	context.beginPath();
	context.arc(x, y, r, start, end);
	context.closePath();
	context.fillStyle = '#065da2';
	context.fill();
}

//添加彩色数字球
function addBalls(x, offsetLeft){
	for(var y = 0; y < digit[x].length; y++){
		for(var z = 0; z < digit[x][y].length; z++){
			if(digit[x][y][z] == 1){
				var aball = {
					x: marginLeft + offsetLeft + 2*(radius + radiusMargin)*z + (radius + radiusMargin),
					y: marginTop + 2*(radius + radiusMargin)*y + (radius + radiusMargin),
					g: 1.5 + Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random()*10))*4,
					vy: -5,
					color: colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aball);
			}
		}
	}
}

//绘制彩色数字
function renderBalls(context){
	for(var i = 0; i < balls.length; i++){
		context.beginPath();
		context.arc(balls[i].x, balls[i].y, radius, 0, 2*Math.PI);
		context.closePath();
		context.fillStyle = balls[i].color;
		context.fill();
	}
		
}

//更新小球的位置与速度
function renderBallsLocation(){
	for(var i = 0; i < balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		if(balls[i].y >= contextHeight - radius){
			balls[i].y = contextHeight - radius;
			balls[i].vy = -balls[i].vy*0.7;
		}
	}
	/*=========   IE不支持ES6写法     =========*/
	/*balls.map((item, index) => {
		item.x += item.vx;
		item.y += item.vy;
		item.vy += item.g;
		if(item.y >= contextHeight - radius){
			item.y = contextHeight - radius;
			item.vy = -item.vy*0.7;
		}
	})*/
}

//删除超屏小球
function deleteOutCanvasBalls(){
	balls = balls.filter(function(i){
		return i.x < contextWidth + radius && i.x > -radius
	})
	/*=========   IE不支持ES6写法     =========*/
	//balls = balls.filter(i => i.x < contextWidth + radius && i.x > -radius);
}