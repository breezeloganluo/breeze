/** 
* @fileOverview FW配套使用的图像处理API 
* @author <a href="http://www.wgfly.com">Logan</a> 
* @version 0.01
* @version 0.02 2014-5-23 日罗光瑜修改，判断win是否存在，如果存在则在本函数中直接加载到FW中，直接用requireFW会被循环加载
*/ 

/**
* @namespace
* @author Logan 
* @name Graph
* @description  FW的核心基本扩展 
*/ 
define(function(require, exports, module) {
	//用函数自身做域名承载对象
	//这样在外部使用的时候，可以简化比如use("xx/x/xx")(FW);	
	var GG = function(fw){
		fw.use(GG);
	}
	
	GG.getDomain = function(){
		return "Graph";
	}
	
	
	FW && FW.use(GG);
	
	
	
	GG.Shapes = {
		/*
		 * 画矩形
		*@param width 宽度
		*@param height 高度
		*@param isLinearGradient 是否渐变着色
		*@param evn 事件设置格式为{"onclick":function(p){}}
		*/
		getRect:function(width,height,isLinearGradient,evn){
			var textSize = 15;
			var retResult = {
				//类型
				type:"rect",
				//绘制的点集合
				pointArray:[
					{x:0,y:0},
					{x:width,y:0},
					{x:width,y:height},
					{x:0,y:height}
				],
				//文字的设定
				text:{
					size:textSize,
					sx:function(input){
						//先求出显示长度,显示长度有点算法,中文是按照设定长度,但英文长度只算一半
						var len = 0;
						input.replace(/./ig,function(a,b,c){
							if (/^[\u0391-\uFFE5]$/i.test(a)){
								//说明是中文
								len+=2;
							}else{
								len+=1;
							}
						});
						
						textwidth = len * textSize /2;
						var result = (width - textwidth)/2;
						return result;
					},
					sy:function(input){
						return (height-textSize/2)/2
					},
					color:"black"
				},
				//设定的外部点,便于line连线使用
				point:{
					left:{
						x:0,
						y:height/2
					},
					up:{
						x:width/2,
						y:0
					},
					right:{
						x:width,
						y:height/2
					},
					down:{
						x:width/2,
						y:height
					},
					center:{
						x:width/2,
						y:height/2
					}
				}
			}
			if (isLinearGradient){
				retResult.linearGradient = {
					s:{x:-width/2,y:-height/2},
					e:{x:width*1.5,y:height*1.5}
				}
			}
			if (evn){
				retResult.evn = evn;
			}
			return retResult;
		},
		
		/*
		 * 画菱形
		*@param width 宽度
		*@param height 高度
		*@param isLinearGradient 是否渐变着色
		*@param evn 事件设置格式为{"onclick":function(p){}}
		*/
		getDiamond:function(width,height,isLinearGradient,evn){
			var textSize = 15;
			var retResult = {
				//类型
				type:"rect",
				//绘制的点集合
				pointArray:[
					{x:width/2,y:0},
					{x:width,y:height/2},
					{x:width/2,y:height},
					{x:0,y:height/2}
				],
				//文字的设定
				text:{
					size:textSize,
					sx:function(input){
						//先求出显示长度,显示长度有点算法,中文是按照设定长度,但英文长度只算一半
						var len = 0;
						input.replace(/./ig,function(a,b,c){
							if (/^[\u0391-\uFFE5]$/i.test(a)){
								//说明是中文
								len+=2;
							}else{
								len+=1;
							}
						});
						
						textwidth = len * textSize /2;
						var result = (width - textwidth)/2;
						return result;
					},
					sy:function(input){
						return (height-textSize/2)/2
					},
					color:"black"
				},
				//设定的外部点,便于line连线使用
				point:{
					left:{
						x:0,
						y:height/2
					},
					up:{
						x:width/2,
						y:0
					},
					right:{
						x:width,
						y:height/2
					},
					down:{
						x:width/2,
						y:height
					},
					center:{
						x:width/2,
						y:height/2
					}
				}
			}
			if (isLinearGradient){
				retResult.linearGradient = {
					s:{x:-width/2,y:-height/2},
					e:{x:width*1.5,y:height*1.5}
				}
			}
			if (evn){
				retResult.evn = evn;
			}
			return retResult;
		},
		
		/*
		 *画平行四边形
		*@param width 宽度
		*@param height 高度
		*@param isLinearGradient 是否渐变着色
		*@param evn 事件设置格式为{"onclick":function(p){}}
		*/
		getParallelogram:function(width,height,isLinearGradient,evn){
			var textSize = 15;
			var retResult = {
				//类型
				type:"rect",
				//绘制的点集合
				pointArray:[
					{x:width/2,y:0},
					{x:width,y:0},
					{x:width/2,y:height},
					{x:0,y:height}
				],
				//文字的设定
				text:{
					size:textSize,
					sx:function(input){
						//先求出显示长度,显示长度有点算法,中文是按照设定长度,但英文长度只算一半
						var len = 0;
						input.replace(/./ig,function(a,b,c){
							if (/^[\u0391-\uFFE5]$/i.test(a)){
								//说明是中文
								len+=2;
							}else{
								len+=1;
							}
						});
						
						textwidth = len * textSize /2;
						var result = (width - textwidth)/2;
						return result;
					},
					sy:function(input){
						return (height-textSize/2)/2
					},
					color:"black"
				},
				//设定的外部点,便于line连线使用
				point:{
					left:{
						x:width/4,
						y:height/2
					},
					up:{
						x:width/2,
						y:0
					},
					right:{
						x:width*3/4,
						y:height/2
					},
					down:{
						x:width/2,
						y:height
					},
					center:{
						x:width/2,
						y:height/2
					}
				}
			}
			if (isLinearGradient){
				retResult.linearGradient = {
					s:{x:-width/2,y:-height/2},
					e:{x:width*1.5,y:height*1.5}
				}
			}
			if (evn){
				retResult.evn = evn;
			}
			return retResult;
		},
		
		/*
		 *画六边形
		*@param width 宽度
		*@param height 高度
		*@param isLinearGradient 是否渐变着色
		*@param evn 事件设置格式为{"onclick":function(p){}}
		*/
		getHexagon:function(width,height,isLinearGradient,evn){
			var textSize = 15;
			var retResult = {
				//类型
				type:"rect",
				//绘制的点集合
				pointArray:[
					{x:width/3,y:0},
					{x:width*2/3,y:0},
					{x:width,y:height/3},
					{x:width,y:height*2/3},
					{x:width*2/3,y:height},
					{x:width/3,y:height},
					{x:0,y:height*2/3},
					{x:0,y:height/3}
				],
				//文字的设定
				text:{
					size:textSize,
					sx:function(input){
						//先求出显示长度,显示长度有点算法,中文是按照设定长度,但英文长度只算一半
						var len = 0;
						input.replace(/./ig,function(a,b,c){
							if (/^[\u0391-\uFFE5]$/i.test(a)){
								//说明是中文
								len+=2;
							}else{
								len+=1;
							}
						});
						
						textwidth = len * textSize /2;
						var result = (width - textwidth)/2;
						return result;
					},
					sy:function(input){
						return (height-textSize/2)/2
					},
					color:"black"
				},
				//设定的外部点,便于line连线使用
				point:{
					left:{
						x:0,
						y:height/2
					},
					up:{
						x:width/2,
						y:0
					},
					right:{
						x:width,
						y:height/2
					},
					down:{
						x:width/2,
						y:height
					},
					center:{
						x:width/2,
						y:height/2
					}
				}
			}
			if (isLinearGradient){
				retResult.linearGradient = {
					s:{x:-width/2,y:-height/2},
					e:{x:width*1.5,y:height*1.5}
				}
			}
			if (evn){
				retResult.evn = evn;
			}
			return retResult;
		}
	}

	GG.createGraph = function(jdom,w,h){
		//创建dom的代码要优化一下
		var canverhtml = "<canvas width=\""+w+"\" height=\""+h+"\" style=\"border:solid 0px #CCC;\"></canvas>"
		jdom.innerHTML = "";
		var canvas =document.createElement("canvas");
		canvas.width = (""+w).replace(/\D/ig,"");;
		canvas.height = (""+h).replace(/\D/ig,"");
		canvas.style.border = "solid 0px #CCC";
		jdom.appendChild(canvas);
		
		
		var ctx = canvas.getContext("2d"); 
		var graph = {};
		graph.w = (""+w).replace(/\D/ig,"");
		graph.h = (""+h).replace(/\D/ig,"");
		
		/**记录所有点的信息，便于重绘，格式为：
		 * [
		 *   'ctx.beginPath();',//直接就是可绘制的eval命令
		 * ]
		 */
		var allGraphInfo = [];
		/**
		 * @param {Object} text 要写入的文本
		 * @param {Object} shap 形状，用Shapes创建
		 * @param {Object} x 起始的x坐标
		 * @param {Object} y 起始的y坐标
		 * @param {Object} color 颜色值
		 */
		graph.createNode = function(text,shap,x,y,color){
			var fp = shap.pointArray[0];
			ctx.beginPath();
			allGraphInfo.push('ctx.beginPath();');
			ctx.moveTo(x+fp.x,y+fp.y);
			allGraphInfo.push('ctx.moveTo('+(x+fp.x)+','+(y+fp.y)+');');
			for (var i=1;i<shap.pointArray.length;i++){
				fp = shap.pointArray[i];
				ctx.lineTo(x+fp.x,y+fp.y);
				allGraphInfo.push('ctx.lineTo('+(x+fp.x)+','+(y+fp.y)+');');
			}
			ctx.closePath();
			allGraphInfo.push('ctx.closePath();');
			if (shap.linearGradient){
				var grd = ctx.createLinearGradient(x+shap.linearGradient.s.x,y+shap.linearGradient.s.y,x+shap.linearGradient.e.x,y+shap.linearGradient.e.y);
				allGraphInfo.push('var grd = ctx.createLinearGradient('+(x+shap.linearGradient.s.x)+','+(y+shap.linearGradient.s.y)+','+(x+shap.linearGradient.e.x)+','+(y+shap.linearGradient.e.y)+')');
				grd.addColorStop(0,"white");
				allGraphInfo.push("grd.addColorStop(0,'white');");
				grd.addColorStop(0.5,color);
				allGraphInfo.push("grd.addColorStop(0.5,'"+color+"')");
				grd.addColorStop(1,"black");
				allGraphInfo.push("grd.addColorStop(1,'black');");
				ctx.fillStyle = grd;
				allGraphInfo.push("ctx.fillStyle = grd");
			}else{
				ctx.fillStyle = color;
				allGraphInfo.push("ctx.fillStyle = '"+color+"'");
			}
			ctx.fill();
			allGraphInfo.push("ctx.fill()");
			//下面画文字
			if (text){
				ctx.beginPath();
				allGraphInfo.push("ctx.beginPath();");
				ctx.font= shap.text.size+"px Georgia";
				allGraphInfo.push("ctx.font= '"+shap.text.size+"px Georgia'");
				ctx.fillStyle = shap.text.color;
				allGraphInfo.push("ctx.fillStyle = '"+shap.text.color+"'");
				ctx.fillText(text,x+shap.text.sx(text),y+shap.text.sy(text));
				allGraphInfo.push("ctx.fillText('"+text.replace(/(\r\n)|(\n)/ig,"\\n")+"',"+(x+shap.text.sx(text))+","+(y+shap.text.sy(text))+")");
			}
			
			var result = {
				point:{
					left:{
						x:x+shap.point.left.x,
						y:y+shap.point.left.y
					},
					up:{
						x:x+shap.point.up.x,
						y:y+shap.point.up.y
					},
					right:{
						x:x+shap.point.right.x,
						y:y+shap.point.right.y
					},
					down:{
						x:x+shap.point.down.x,
						y:y+shap.point.down.y
					},
					center:{
						x:x+shap.point.center.x,
						y:y+shap.point.center.y
					}
				}
			}
			
			//处理事件,这里使用闭包来保持原来的点
			var isMyEvent = function(p){
				fp = shap.pointArray[0];
				ctx.beginPath();
				ctx.moveTo(x+fp.x,y+fp.y);
				for (var i=1;i<shap.pointArray.length;i++){
					fp = shap.pointArray[i];
					ctx.lineTo(x+fp.x,y+fp.y);
				}
				ctx.closePath();
				return ctx.isPointInPath(p.x,p.y);
			}
			
			if (shap.evn){
				for (var n in shap.evn){
					canvas.eventObjArray[n].push({
						goEvent:function(p){
							var isMy = isMyEvent(p) ;
							if (!isMy){
								return false;
							}
							shap.evn[n](p,result);
							return true;
						},
						isMouseIn : function(p){
							return isMyEvent(p);
						}
					});
				}
			}
			
			result.addEvent = function(ee){
				for (var n in ee){
					canvas.eventObjArray[n].push({
						goEvent:function(p){
							var isMy = isMyEvent(p) ;
							if (!isMy){
								return false;
							}
							ee[n](p,result);
							return true;
						},
						isMouseIn : function(p){
							return isMyEvent(p);
						}
						
					});
				}
			}
			
			result.isMouseIn = function(p){
				return isMyEvent(p);
			}
			return result;
		};
		/**
		 * 花边函数，用于将两个形状连成一条线
		 * @param {Object} text 线上的文本
		 * @param {Object} sNode 起始形状
		 * @param {Object} eNode 终止形状
		 * @param {Object} lineArr 中间点数组
		 * @param {Object} linetype 线类型，是否虚线，是就是徐铉
		 * @param {Object} endType  是否箭头，是就是带箭头
		 * @param {Object} color 线的颜色
		 */
		graph.createEdge = function(text,sNode,eNode,lineArr,linetype,endType,color){
			//整理一个画线折点
			var allPoint = [];
			var nextPoint = (lineArr && lineArr[0]) || eNode.point.center;
			var dx = nextPoint.x - sNode.point.center.x;
			var dy = nextPoint.y - sNode.point.center.y;
			//设定一个函数,输入是要比较的那个对象,和dx,dy,然后判断起始的那个对象,到底取哪个店,再push到allporint中
			var setPoint = function(settingNode,dx,dy){
				//判断第一个点是上下左右的哪一个
				if (dx >=0 && dy >=0){
					//右下角的
					if (dx > dy){
						//用右边
						allPoint.push(settingNode.point.right);
					}else{
						//用下面的
						allPoint.push(settingNode.point.down);
					}
				}else if (dx >= 0 && dy <= 0){
					//右上角的
					if (dx> -dy){
						allPoint.push(settingNode.point.right);
					}else{
						allPoint.push(settingNode.point.up);
					}
				}else if (dx <= 0 && dy <= 0){
					//左上角的
					if (-dx > -dy){
						allPoint.push(settingNode.point.left);
					}else{
						allPoint.push(settingNode.point.up);
					}
				}else{
					//就在左下角了
					if (-dx >= dy){
						allPoint.push(settingNode.point.left);
					}else{
						allPoint.push(settingNode.point.down);
					}
				}
			}
			//添加内容，如果dx,dy==0就默认是自己接自己，这种情况就作为自返处理
			if (dx == dy && dx == 0  && (lineArr == null || lineArr.length == null || lineArr.length == 0)){
				//自返情况
				var tmpPoint = {
					x : sNode.point.right.x,
					y : sNode.point.right.y-10
				}
				allPoint.push(tmpPoint);
				
				tmpPoint = {
					x:sNode.point.right.x + 40,
					y:sNode.point.right.y -10
				}
				allPoint.push(tmpPoint);
				
				tmpPoint = {
					x:sNode.point.right.x + 40,
					y:sNode.point.right.y + 10
				}
				allPoint.push(tmpPoint);
				
				tmpPoint = {
					x:sNode.point.right.x ,
					y:sNode.point.right.y + 10
				}
				allPoint.push(tmpPoint);
			}else{
				//非自返情况
				setPoint(sNode,dx,dy);
				//中间的所有点
				for(var i=0;lineArr && i<lineArr.length;i++){
					allPoint.push(lineArr[i]);
				}
				//取最后一个点和终点进行比较
				var lastPoint = allPoint[allPoint.length -1];
				var dx = lastPoint.x - eNode.point.center.x;
				var dy = lastPoint.y - eNode.point.center.y;
				setPoint(eNode,dx,dy);
			}
			
			
			
			
			//点准备好了,下面依据所有的点,开始绘制折线
			ctx.beginPath();
			allGraphInfo.push("ctx.beginPath()");
			ctx.moveTo(allPoint[0].x,allPoint[0].y);
			allGraphInfo.push("ctx.moveTo("+allPoint[0].x+","+allPoint[0].y+")");
			for (var i=1;i<allPoint.length;i++){
				fp = allPoint[i];
				ctx.lineTo(fp.x,fp.y);
				allGraphInfo.push("ctx.lineTo("+fp.x+","+fp.y+")");
			}
			ctx.strokeStyle = color;
			allGraphInfo.push("ctx.strokeStyle = '"+color+"'");
			if (linetype){
				 ctx.setLineDash([5]);
				 allGraphInfo.push("ctx.setLineDash([5])");
			}
			
			ctx.stroke();
			allGraphInfo.push("ctx.stroke()");
			
			var drawArrow = function(s,e){
				//假设都是向第一象限延伸
				//整个箭头的角度
				var arc = Math.PI/3;
				var harc = arc/2;
				var arrowLen = 10;
				//计算坐上的点坐标
				var lineArc = Math.atan(Math.abs((s.y - e.y)/(e.x-s.x)));
				//箭头垂直面角度
				var tmpArc = lineArc - harc;
				//箭头斜边长度
				var arrowMLen = arrowLen / Math.cos(harc);
				//计算箭头横向x轴的长度
				var tmpw = arrowMLen * Math.cos(tmpArc);
				var tmph = arrowMLen * Math.sin(tmpArc);
				//计算坐标,数学不好,分开四个象限分别计算算了
				var tmpux,tmpuy,tmpdx,tmpdy;
				if (e.x-s.x>=0 && e.y-s.y>=0){
					tmpux = e.x - tmpw;
					tmpuy = e.y - tmph;
					
					tmpdx = e.x - tmph;
					if(e.y-s.y == 0){
						tmpdx = e.x + tmph;
					}
					tmpdy = e.y - tmpw;
				}else if (e.x-s.x>=0 && e.y-s.y<=0){
					tmpux = e.x - tmpw;
					tmpuy = e.y + tmph;
					
					tmpdx = e.x - tmph;
					tmpdy = e.y + tmpw;
				}
				else if (e.x-s.x<=0 && e.y-s.y<=0){
					tmpux = e.x + tmpw;
					tmpuy = e.y + tmph;
					
					tmpdx = e.x - tmph;
					tmpdy = e.y + tmpw;
				}else{
					tmpux = e.x + tmpw;
					tmpuy = e.y - tmph;
					
					tmpdx = e.x - tmph;
					tmpdy = e.y - tmpw;
				}
				
				
				
				//画图
				ctx.beginPath();
				allGraphInfo.push("ctx.beginPath()");
				ctx.moveTo(tmpux,tmpuy);
				allGraphInfo.push("ctx.moveTo("+tmpux+","+tmpuy+")");
				ctx.lineTo(e.x,e.y);
				allGraphInfo.push("ctx.lineTo("+e.x+","+e.y+")");
				ctx.lineTo(tmpdx,tmpdy);
				allGraphInfo.push("ctx.lineTo("+tmpdx+","+tmpdy+")");
				ctx.strokeStyle = color;
				allGraphInfo.push("ctx.strokeStyle = '"+color+"'");
				ctx.stroke();
				allGraphInfo.push("ctx.stroke()");
				
				//最后是写字
				if (text){
					var textSize = 10;
					//先求出显示长度,显示长度有点算法,中文是按照设定长度,但英文长度只算一半
					var len = 0;
					text.replace(/./ig,function(a,b,c){
						if (/^[\u0391-\uFFE5]$/i.test(a)){
							//说明是中文
							len+=2;
						}else{
							len+=1;
						}
					});
					
					var textLen = len * textSize/2;
					var x = (allPoint[0].x + allPoint[allPoint.length-1].x - textLen)/2;
					var y = (allPoint[0].y + allPoint[allPoint.length-1].y - textSize)/2;
					
					ctx.beginPath();
					allGraphInfo.push("ctx.beginPath()");
					ctx.fillStyle = "black";
					allGraphInfo.push("ctx.fillStyle = 'black'")
					ctx.font = textSize+"px Georgia";
					allGraphInfo.push("ctx.font = '"+textSize+"px Georgia'");
					ctx.fillText(text,x,y);
					allGraphInfo.push("ctx.fillText('"+text.replace(/(\r\n)|(\n)/,"\n")+"',"+x+","+y+")");
				}
			}
			endType && drawArrow(allPoint[allPoint.length-2],allPoint[allPoint.length-1]);
			
			var result = null;
			
			
			result = {
				allPoint:allPoint
			}
			
			//处理事件,这里使用闭包来保持原来的点
			var isMyEvent = function(p){
				/**
				*判断两个点是否在这个点上
				*/
				var is2PointIn=function(s,e,p){
					//线选的扩散范围值，比如是3，那么就是说，这个线向外扩张3个像素的巨型都是这个线的范围
					var ddpx=6;
					if (Math.abs(e.y-s.y)>Math.abs(e.x-s.x)){
						//说明纵向的，横向加点,y轴不变
						ctx.beginPath();
						ctx.moveTo(s.x-ddpx,s.y);
						ctx.lineTo(s.x+ddpx,s.y);
						ctx.lineTo(e.x+ddpx,e.y);
						ctx.lineTo(e.x-ddpx,e.y);
						ctx.closePath();
					}else{
						//说明横向的，纵向加点，x轴不变
						ctx.beginPath();
						ctx.moveTo(s.x,s.y-ddpx);
						ctx.lineTo(s.x,s.y+ddpx);
						ctx.lineTo(e.x,e.y+ddpx);
						ctx.lineTo(e.x,e.y-ddpx);
						ctx.closePath();
					}
					return ctx.isPointInPath(p.x,p.y);
				}
				
				for (var i=1;i<allPoint.length;i++){
					fps = allPoint[i-1];
					fpe = allPoint[i];
					var thisLine = is2PointIn(fps,fpe,p);
					if (thisLine){
						return true;
					}
				}
				return false;
			}
			
			result.addEvent = function(ee){
				for (var n in ee){
					canvas.eventObjArray[n].push({
						goEvent:function(p){
							var isMy = isMyEvent(p) ;
							if (!isMy){
								return false;
							}
							ee[n](p,result);
							return true;
						},
						isMouseIn : function(p){
							return isMyEvent(p);
						}
					});
				}
			}
			
			result.isMouseIn = function(p){
				return isMyEvent(p);
			}
			return result;
		};
		
		//处理事件
		canvas.eventObjArray={
			onmousemove:[],
			onclick:[],
			ondblclick:[],
		}
		var getEventPosition = function (ev){   
			var x, y;   
			if (ev.layerX || ev.layerX == 0) {   
				x = ev.layerX;   
				y = ev.layerY;   
			} else if (ev.offsetX || ev.offsetX == 0) { // Opera   
				x = ev.offsetX;   
				y = ev.offsetY;   
			}   
			return {x: x, y: y};   
		}
		/**
		*@param t 事件类型，和上面eventObjArray里面的类型对应
		*@param e 事件对象
		*/
		var handleEvent = function(t,e){
			var p = getEventPosition(e);
			var eObjArray = canvas.eventObjArray[t];
			for (var i=0;eObjArray && i < eObjArray.length;i++){
				if (eObjArray[i].goEvent && eObjArray[i].goEvent(p)){
					break;
				}
			}
		}
		var drapFlag = false;
		var sx = 0,sy = 0;//设置位移偏移量
		var mousedownP = {};
		
		//鼠标移动时的事件
		canvas.addEventListener('mousemove', function(e){
			//处于拖拽状态就直接退出
			if (drapFlag){
				return;
			}
			var p = getEventPosition(e);
			var mousePoint = "auto";
			for (t in canvas.eventObjArray){
				var eObjArray = canvas.eventObjArray[t];
				for (var i=0;eObjArray && i < eObjArray.length;i++){
					if (t == "onmousemove" && eObjArray[i].goEvent && eObjArray[i].goEvent(p)){
						mousePoint = "pointer";
						break;
					}else if (eObjArray[i].isMouseIn && eObjArray[i].isMouseIn(p)){
						mousePoint = "pointer";
						break;
					}
				}
			}
			canvas.style.cursor = mousePoint;
		}, false);
		
		//增加拖拽效果，鼠标放下后记录状态，然后在鼠标收起后进入另外一个状态
		canvas.addEventListener('mousedown', function(e){
			var p = getEventPosition(e);
			var mousePoint = "move";
			for (t in canvas.eventObjArray){
				var eObjArray = canvas.eventObjArray[t];
				for (var i=0;eObjArray && i < eObjArray.length;i++){
					if (eObjArray[i].isMouseIn && eObjArray[i].isMouseIn(p)){
						//表示，点入了某个图形中，不支持拖拽了
						return;
					}
				}
			}
			//设置处于拖拽状态
			canvas.style.cursor = mousePoint;
			drapFlag = true;
			mousedownP = p;
		});
		
		canvas.addEventListener('mouseup', function(e){
			//如果不是拖拽状态推出
			if (!drapFlag){
				handleEvent('onclick',e);
				return;
			}
			var p = getEventPosition(e);
			var mousePoint = "auto";
			canvas.style.cursor = mousePoint;
			drapFlag = false;
			
			//用绝对的相对位移，就是每次都移动回原点，然后再继续移动
			ctx.translate(-sx,-sy);
			ctx.clearRect(0,0,graph.w,graph.h);

			sy = sy + p.y - mousedownP.y;
			sx = sx + p.x - mousedownP.x;
			
			ctx.translate(sx,sy);			
			eval(allGraphInfo.join(";\n"));
		});
	
		return graph;
	}
	
	return GG;
});