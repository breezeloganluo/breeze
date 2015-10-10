define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	require("./classMod");
	var Q = require("breeze/framework/js/tools/Graph");
	FW.register({
		name: "graphyFunMod",
		param:{
			mainView:"mainView",
			canvas:"canvas"
		},
		onCreate:function(){
		},
		public: {
			setClassMod : function(c){
				this.MY.classMod = c;
			},
			setCanvas : function(canvas){
				this.MY.canvas = canvas;
			},
			showFun:function(funObj,editCallback){
				var _this = this;
				if (this.MY.classMod == null){
					alert("classMod is null!");
					return;
				}
				if (/string/i.test(typeof(funObj))){
					funObj =  this.MY.classMod.getMod().functionFragment[funObj];
				}				
				if (funObj == null){
					alert("function "+ funName + " not found!");
				}
				if (!this.MY.canvas){
					this.API.show(this.param.mainView);
					this.MY.canvas = this.API.find("#"+this.param.canvas);
				}
				
				//创建并初始化，设置屏幕为中心坐标
				var canvas = this.MY.canvas[0];
				
				//graph.moveToCenter();
				//计算顶部第一个位置坐标值，并设置每个递进节点的长度
				var cwidth = canvas.clientWidth;
				var cheight = canvas.clientHeight;
				var graph = this.MY.graph = FW.use("Graph").createGraph(canvas,cwidth,cheight);
				
				var oneBaseH = 60;
				var oneBaseW = 180;
				var stepW = 30;
				var oneStep = oneBaseH + 20;

				var startX = cwidth/2-oneBaseW;
				var startY = oneStep;
				/*原来的
				var GRADIENT = new Q.Gradient(Q.Consts.GRADIENT_TYPE_RADIAL, [Q.toColor(0xAAFFFFFF), Q.toColor(0x11FFFFFF)], [0.1, 0.9]);
				GRADIENT.position = Q.Position.RIGHT_TOP;
				GRADIENT.tx = -10;
				//*/
				
				var nodeEvent = {
					onclick:function(p,obj){
						if (obj.fragment.isClose){
							obj.fragment.isClose = false;
							_this.showFun(funObj,editCallback);
						}else{
							editCallback && editCallback(obj.fragment,obj.parentFragment);
						}
					}
				}
				
				var NORMAL = FW.use("Graph").Shapes.getRect(oneBaseW, oneBaseH, true,nodeEvent);
				var BRANCH = FW.use("Graph").Shapes.getDiamond(oneBaseW,oneBaseH/2,true,nodeEvent);
				var BRANCHLIST = FW.use("Graph").Shapes.getHexagon(oneBaseW, oneBaseH/2, true,nodeEvent);
				var CYCLE = FW.use("Graph").Shapes.getParallelogram(oneBaseW, oneBaseH,true,nodeEvent);
				var CYCLEEND = FW.use("Graph").Shapes.getParallelogram(oneBaseW, oneBaseH,true,nodeEvent);
				var BLOCK = FW.use("Graph").Shapes.getHexagon(oneBaseW, oneBaseH,false,nodeEvent);

				var BLUE = "#5555bb";
				var YELLOW = "#bbbb11";
				var RED = "#bb5555";
				var GRAY = "#555";
				var BLACK = "#000000";
				//block(自定函数){创建一个普通的节点
				var drawNode = function(txt,cx,cy,shapes,clolor){
					var inColor = clolor || BLUE;
					var node = graph.createNode(txt,shapes, cx, cy,inColor);
				    return node;
				}
				//}
				//block(自定函数){画线
				var drawLine = function(f,e,txt,lineArr){
					
					var drawTxt = (txt)?txt:"";
					var edge = graph.createEdge(drawTxt, f, e,lineArr,null,null,"black");
				    return edge;
					
				}
				//}
				//block(函数){计算节点的总宽度，包括子节点的
				var getFunFragmentWidth = function(funFragment){
					//计算自己的宽度
					var selfWidth = oneBaseW + stepW*2;
					//if(normal情况){直接返回自己的宽度为最终结果
					if (funFragment.type == "normal"){
						return selfWidth;
					}
					//}
					//else if(分支情况){循环自己的儿子，递归调用每个儿子的宽度加在一起
					else if (funFragment.type == "branchList"){
						if (!funFragment.subList || funFragment.isClose == true){
							return selfWidth;
						}
						var total = 0;
						for (var i=0;funFragment.subList && i<funFragment.subList.length;i++){
							total+=getFunFragmentWidth(funFragment.subList[i]);
						}
						return total;
					}
					//}
					//else{递归调用直接返回儿子中最大的那个
					else{
						var max = selfWidth;
						for (var i=0;!funFragment.isClose && funFragment.subList && i<funFragment.subList.length;i++){
							var CW = getFunFragmentWidth(funFragment.subList[i]);
							if (CW>max){
								max = CW;
							}							
						}
						return max;
					}
					//}
				}
				//}
				//block(函数){创建一个能自动截取长度的函数
				var pText = function(t){
					if (t == null){
						return "";
					}
					var oneLine = oneBaseW / 14;
					var tt = t.replace(/(\)\s*)\{/,function(a,b){
						return b+"``";
					});
					var array = tt.split("``");
					var dvStr = function(tt){
						var result = [];
						var s = 0;
						while(true){
							result.push(tt.substr(s,oneLine));
							if (s+oneLine >= tt.length){
								break;
							}
							s+=oneLine;
						}
						return result;
					}
					var result = "";
					for (var i =0;i<array.length;i++){
						if (i>0){
							result+="\n";
						}
						result = result + (dvStr(array[i]).join('\n'));
					}
					return result;
				}				
				//}
				//block(drawNormal){设定普通节点的画图函数,idx是函数片段序号，cx,cy是画图中心坐标，lastNode是上一个坐标，有连线时画
				//--返回值：是一个对象{idx:xxx,level:xxx,node:obj,left:lll}left 是计算最左边的坐标
				var drawNormal = function(fArr,idx,cx,cy,lastNode,left,isSon){
					//获取基本的函数片段信息
					var fragment = fArr[idx];
					//创建矩阵节点
					var hasTodo = false;
					if (fragment.code == "" || fragment.code == null){
						hasTodo = true;
					}else{
						for(var i=0;fragment.subCommand && i<fragment.subCommand.length;i++){
							if (fragment.subCommand[i].type == "++"){
								hasTodo = true;
							}
						}
					}
					var node = (!hasTodo)?drawNode(pText(fragment.command),cx,cy,NORMAL):drawNode(pText(fragment.command),cx,cy,NORMAL,YELLOW);
					node.fragment = fragment;
					if (lastNode == null){
						node.parentFragment = null;
					}else if (isSon){
						node.parentFragment = lastNode.fragment;
					}else{
						node.parentFragment = lastNode.parentFragment;
					}
					//if(有lastNode){画连线
					if (lastNode){
						drawLine(lastNode,node);
					}
					//}
					//调用drawAny，画出下一个图
					var nextLeft = (cx-stepW);
					nextLeft = (nextLeft<left)?nextLeft:left;
					return drawAny(fArr,idx+1,cx,cy+oneStep,node,nextLeft);
				}
				//}
				
				//block(drawBranch){设定分支节点的画图函数
				//--函数原节点增加一个isClose的记录，标识这个节点是否关闭，关闭和不关闭有不同的画法
				var drawBranch = function(fArr,idx,cx,cy,lastNode,left,isSon){
					//获取基本的函数片段信息
					var fragment = fArr[idx];
					//创建矩阵节点
					var node = null;
					//创建矩阵节点
					/*分支头部，不存在todo问题
					var hasTodo = false;
					if (fragment.code == "" || fragment.code == null){
						hasTodo = true;
					}else{
						for(var i=0;fragment.subCommand && i<fragment.subCommand.length;i++){
							if (fragment.subCommand[i].type == "++"){
								hasTodo = true;
							}
						}
					}
					//*/
					
					var firstNode = null;
					if(!fragment.isClose){
						firstNode = node = drawNode(pText(fragment.command),cx,cy,BRANCH);
					}else{
						firstNode = node = drawNode("",cx,cy,BRANCH,RED);
					}
					
					
					if (lastNode == null){
						node.parentFragment = null;
					}else if (isSon){
						node.parentFragment = lastNode.fragment;
					}else{
						node.parentFragment = lastNode.parentFragment;
					}
					node.fragment = fragment;
					
					//if(有lastNode){画连线
					if (lastNode){
						drawLine(lastNode,node);
					}
					//block(画分支){
					var branchList = fragment.subList || [];
					//block(计算每个的中心点){
					var totalWidth = getFunFragmentWidth(fragment);
					var startCx = cx - totalWidth/2 + (oneBaseW+stepW)/2;
					
					var oneWidth = oneBaseW + stepW*2;
					var totalLen = oneWidth*branchList.length;
					var firstX = cx - totalLen/2 + (oneWidth/2);
					var lastLevel = cy;
					var resultObjArr = [];
					var cLeft = startCx;
					//}
					for (var i = 0;!fragment.isClose && i<branchList.length;i++){
						var oneWidth = getFunFragmentWidth(branchList[i]);
						var dx = startCx + oneWidth/2 - (oneBaseW + stepW)/2;
						startCx += oneWidth;
						
						//计算是否要toDo黄色展开
						var hasTodo = false;
						if (branchList[i].code == "" || branchList[i].code == null){
							hasTodo = true;
						}else{
							for(var ii=0;branchList[i].subCommand && ii<branchList[i].subCommand.length;ii++){
								if (branchList[ii].subCommand[ii].type == "++"){
									hasTodo = true;
								}
							}
						}
						
						var tmpNode = !hasTodo?drawNode(branchList[i].command.replace(/\{/,"\n"),dx,cy+oneStep,BRANCHLIST):
						drawNode(branchList[i].command.replace(/\{/,"\n"),dx,cy+oneStep,BRANCHLIST,YELLOW);

						var line = drawLine(node,tmpNode,"",[{x:cx+oneBaseW/2,y:cy+oneStep/2},{x:dx+oneBaseW/2,y:cy+oneStep/2}]);					
						
						tmpNode.fragment = branchList[i];
						tmpNode.parentFragment = fragment;
						//递归画儿子
						var r = drawAny(branchList[i].subList,0,dx,cy+oneStep*2,tmpNode,cLeft,true);
						//将记录所有分支里面，层次最深的那个
						if (r.level>lastLevel){
							lastLevel = r.level;
						}
						if (cLeft > r.left-4){
							cLeft = r.left-4;
						}
						resultObjArr.push(r.node);
					}
					//block(画分支结束){
					if (!fragment.isClose){
						node = drawNode(fragment.command,cx,lastLevel+oneStep,BRANCH,BLACK);
						node.fragment = firstNode.fragment;
						node.parentFragment = firstNode.parentFragment;
						for (var i=0;i<resultObjArr.length;i++){
							var p1 = resultObjArr[i].point.down;
							var p2 = node.point.up;
							drawLine(resultObjArr[i],node,null,[{x:p1.x,y:p2.y-10},{x:p2.x,y:p2.y-10}]);
						}
						var line = drawLine(firstNode,node,null,[{x:cLeft,y:cy+oneBaseH/4},{x:cLeft,y:lastLevel+oneStep+oneBaseH/4}]);
						line.addEvent({
							onclick:function(){
								firstNode.fragment.isClose = true;
								_this.showFun(funObj,editCallback);
							}
						});
					}
					//}
					//}
					//递归画下一个
					if (!fragment.isClose){
						return drawAny(fArr,idx+1,cx,lastLevel+oneStep*2,node,cLeft);
					}else{
						return drawAny(fArr,idx+1,cx,cy+oneStep,node,cLeft);
					}					
				}
				//}
				//block(drawCycle){设定block节点的画图函数
				var drawCycle = function(fArr,idx,cx,cy,lastNode,left,isSon){
					//获取基本的函数片段信息
					var fragment = fArr[idx];
					//确定是否代完成状态
					var hasTodo = false;
					if (fragment.code == "" || fragment.code == null){
						hasTodo = true;
					}else{
						for(var i=0;fragment.subCommand && i<fragment.subCommand.length;i++){
							if (fragment.subCommand[i].type == "++"){
								hasTodo = true;
							}
						}
					}
					//创建矩阵节点
					var firstNode = node = null;
					if(!fragment.isClose){
						firstNode = node = (!hasTodo)?drawNode(pText(fragment.command),cx,cy,CYCLE):drawNode(pText(fragment.command),cx,cy,CYCLE,YELLOW);
					}else{
						firstNode = node = drawNode("",cx,cy,CYCLE,RED);
					}
					
					
					if (lastNode == null){
						node.parentFragment = null;
					}else if (isSon){
						node.parentFragment = lastNode.fragment;
					}else{
						node.parentFragment = lastNode.parentFragment;
					}
					node.fragment = fragment;
					//if(有lastNode){画连线
					if (lastNode){
						drawLine(lastNode,node);
					}
					//block(画循环体){
					var branchList = fArr[idx].subList || [];					
					var lastLevel = 0;					
					var lastNode = null;
					
					var dx = cx;
					
					var nextLeft = (cx-stepW);
					
					
					//递归画儿子
					if (!fragment.isClose){
						var r = drawAny(branchList,0,dx,cy+oneStep,node,null,true);
						//将记录所有分支里面，层次最深的那个						
						lastLevel = r.level;
						lastNode = r.node;
					
						if (r.left-4 < nextLeft){
							nextLeft = r.left-4 ;
						}
						
						//block(画分支结束){
						node = drawNode("",cx,lastLevel+oneStep,CYCLEEND,BLACK);
						node.fragment = firstNode.fragment;
						node.parentFragment - firstNode.parentFragment;
						drawLine(lastNode,node);
						
						var line = drawLine(firstNode,node,null,[{x:nextLeft,y:cy+oneBaseH/2},{x:nextLeft,y:lastLevel+oneStep+oneBaseH/2}]);
						line.addEvent({
							onclick:function(){
								firstNode.fragment.isClose = true;
								_this.showFun(funObj,editCallback);
							}
						});
					}
					//}
					//}
					//递归画下一个
					nextLeft = (nextLeft<left)?nextLeft:left;
					if (!fragment.isClose){
						return drawAny(fArr,idx+1,cx,lastLevel+oneStep*2,node,nextLeft);
					}else{
						return drawAny(fArr,idx+1,cx,cy+oneStep,node,nextLeft);
					}
				}
				//}
				//block(drawBlock){设定block节点的画图函数
				var drawBlock = function(fArr,idx,cx,cy,lastNode,left,isSon){
					//获取基本的函数片段信息
					var fragment = fArr[idx];
					
					var hasTodo = false;
					
					for(var i=0;fragment.subCommand && i<fragment.subCommand.length;i++){
						if (fragment.subCommand[i].type == "++"){
							hasTodo = true;
						}
					}
				
					
					//创建矩阵节点
					var node = null;
					var firstNode = node = null;
					if (fragment.isClose){
						firstNode = node = drawNode(pText(fragment.command),cx,cy,BLOCK,RED)
					}else{
						firstNode = node = (hasTodo)?drawNode(pText(fragment.command),cx,cy,BLOCK,YELLOW):drawNode(pText(fragment.command),cx,cy,BLOCK);
					}
					
					
					if (lastNode == null){
						node.parentFragment = null;
					}else if (isSon){
						node.parentFragment = lastNode.fragment;
					}else{
						node.parentFragment = lastNode.parentFragment;
					}
					node.fragment = fragment;
					
					//if(有lastNode){画连线
					if (lastNode){
						drawLine(lastNode,node);
					}
					//block(画循环体){
					var branchList = fArr[idx].subList || [];					
					var lastLevel = 0;					
					var lastNode = null;
					
					var dx = cx;
					
					//我自己的最左坐标
					var myLeft = (cx-stepW);
					
					
					
					//递归画儿子
					if (!fragment.isClose){
						//画自己，应该用自己的最左坐标
						var r = drawAny(branchList,0,dx,cy+oneStep,node,null,true);
						//将记录所有分支里面，层次最深的那个						
						lastLevel = r.level;
						lastNode = r.node;
						
						if (r.left-4 < myLeft){
							myLeft = r.left-4;
						}
						
						//block(画分支结束){
						node = drawNode("",cx,lastLevel+oneStep,BLOCK,BLACK);
						node.fragment = firstNode.fragment;
						node.parentFragment = firstNode.parentFragment;
						drawLine(lastNode,node);
						
						var line = drawLine(firstNode,node,null,[{x:myLeft,y:cy + oneBaseH/2},{x:myLeft,y:lastLevel+oneStep + oneBaseH/2}]);
						line.addEvent({
							onclick:function(){
								firstNode.fragment.isClose = true;
								_this.showFun(funObj,editCallback);
							}
						});
					}
					//}
					//}
					//递归画下一个
					//总体上的最左坐标
					var nextLeft = (myLeft<left)?myLeft:left;
					if (!fragment.isClose){
						return drawAny(fArr,idx+1,cx,lastLevel+oneStep*2,node,nextLeft);
					}else{
						return drawAny(fArr,idx+1,cx,cy+oneStep,node,nextLeft);
					}
				}
				//}
				//block(drawAny){设定总控选择节点的函数
				var drawAny = function(fArr,idx,cx,cy,lastNode,left,isSon){
					if (left == null){
						left = 100000;
					}
					if (idx >= fArr.length){
						return {
							idx : idx -1,
							level:cy - oneStep,
							node:lastNode,
							left:left
						}
					}
					var fragment = fArr[idx];
					var result = null;
					if (fragment.type == "normal"){
						result = drawNormal(fArr,idx,cx,cy,lastNode,left,isSon);
						result.left = result.left > left ? left:result.left;
					}else if (fragment.type == "branchList"){
						result =  drawBranch(fArr,idx,cx,cy,lastNode,left,isSon);
						result.left = result.left > left ? left:result.left;
					}else if (fragment.type == "cycle"){
						result =  drawCycle(fArr,idx,cx,cy,lastNode,left,isSon);
						result.left = result.left > left ? left:result.left;
					}else if (fragment.type == "block"){
						result =  drawBlock(fArr,idx,cx,cy,lastNode,left,isSon);
						result.left = result.left > left ? left:result.left;
					}
					return result;
				}
				//}

				//调用内部总控节点函数drawAny，画出所有图形
				drawAny(funObj.fragments,0,startX,startY,null);
				
				//最后创建事件
				
				/*
				graph.addCustomInteraction(
				{
					onclick: function(evt, graph){
						var ui = graph.getUIByMouseEvent(evt);
						if (!ui || !ui.data.fragment){
							return;
						}
						if(ui && ui.data.fragment.type == "branchList" || ui.data.fragment.type == "cycle" || ui.data.fragment.type == "block"){
							ui.data.fragment.isClose = !ui.data.fragment.isClose;
							graph.clear();
							graph.destroy();
							_this.showFun(funObj,editCallback);
						}
					},
					ondblclick:function(evt,graph){
						var ui = graph.getUIByMouseEvent(evt);
						if (!ui || !ui.data.fragment){
							return;
						}
						editCallback && editCallback(ui.data.fragment,ui.data.parentFragment);
					}
				}
				);
				*/
			},
			destroy:function(){
				/*
				if (this.MY.graph){
					this.MY.graph.clear();
					this.MY.graph.destroy();
					this.MY.graph == null;
				}
				*/
				this.MY.canvas = null;
			
			}
		}
	});
	return FW;
});