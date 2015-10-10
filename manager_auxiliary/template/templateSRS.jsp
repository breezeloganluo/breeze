<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="/page/allhead.jsp"/>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>

		<meta name="description" content="Draggabble Widget Boxes &amp; Containers" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<!--basic styles-->

		<link href="${B}manager_auxiliary/assets/css/bootstrap.min.css" rel="stylesheet" />
		<link href="${B}manager_auxiliary/assets/css/bootstrap-responsive.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="${B}manager_auxiliary/assets/css/font-awesome.min.css" />

		<!--[if IE 7]>
		  <link rel="stylesheet" href="${B}manager_auxiliary/assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!--page specific plugin styles-->

		<!--ace styles-->

		<link rel="stylesheet" href="${B}manager_auxiliary/assets/css/ace.min.css" />
		<link rel="stylesheet" href="${B}manager_auxiliary/assets/css/ace-responsive.min.css" />
		<link rel="stylesheet" href="${B}manager_auxiliary/assets/css/ace-skins.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="${B}manager_auxiliary/assets/css/ace-ie.min.css" />
		<![endif]-->

		<!--inline styles related to this page-->
		
		
		<script src="${B}breeze/lib/js/jquery.js"></script>
		<script type="text/javascript">
			$(function(){
				var t = $($(".span12")[0]);
			
				var parserSRSObject = function(str){
					var execArray = /<!--SRS\(([^\)]+)\)([\s\S]+?)--\>/ig.exec(str);
					if (execArray == null){
						return "没有需求点";
					}
					var srsObj = eval("("+execArray[2]+")");
					var result = execArray[1]+":<br/>";
					result += "<table width='100%' border='1'>";
					for (var i=0;i<srsObj.length;i++){
						result +="<tr>";
						result +="<td width='30%'>";
						result += srsObj[i].name;
						result +="</td>";
						result +="<td width='70%'>";
						result +=srsObj[i].desc;
						result +="</td>";
						result +="</tr>";
					}
					result += "</table>";
					return result;
				}
	
				t.find("div[class^='span']>*").not("*[class='row-fluid']").mouseover(function(){
					(function(spanObj){
						var processor = function(){
							var value = parserSRSObject(spanObj.innerHTML);
							var displayContent = '<div id="pupbox" class="pupbox" style="background:#f9f9f9;border:1px solid #ccc;width:1000px;height:600px;overflow-y:auto;position:absolute;z-index:99;left:10px;top:10px;padding:10px;border-radius:3px;"><p>---c---</p></div>';
							displayContent = displayContent.replace(/---c---/i,value);
							//添加弹出内容层
							$("body").append(displayContent);
							//添加蒙版层
							$("body").append('<div id="pupbg" style="background:#000;opacity:0.7;width:100%;height:100%;position:absolute;z-index:2;left:0px;top:0px;"></div>')
							
							//设置在页面的位置为居中
							$(".pupbox").css("left",($(document).width()-$(".pupbox").width())/2);
							$(".pupbox").css("top",($(document).height()-$(".pupbox").height())/2);
	
	
							//点击弹出内容层或蒙版层隐藏内容
							$("#pupbox,#pupbg").click(function(){
								$(".pupbox,#pupbg").hide()
							})
	
												
						}
	
						var aDom = $(spanObj).find(".button_openSrs_asdfeett")[0];
						$(".button_openSrs_asdfeett").each(function(){
							if (this == aDom){
								return;
							}
							$(this).remove();
						});
						if (aDom == null){
							if (/<!--SRS\(([^\)]+)\)([\s\S]+?)--\>/i.test(spanObj.innerHTML)){
								$(spanObj).append("<a href='javascript:void(0)' class='button_openSrs_asdfeett'>查看需求</a>");
								($(spanObj).find(".button_openSrs_asdfeett"))[0].onclick=processor;
							}else{
								$(spanObj).append("<a href='javascript:void(0)' class='button_openSrs_asdfeett'>-----</a>");
							}
							($(spanObj).find("a"))[0].openStatus = true;					
						}
						
					})(this);
				})
			});

			
		</script>
	</head>

	<body>

		<div class="main-container container-fluid">
			
			

				<div class="page-content">

					<div class="row-fluid">
						<div class="span12">
				<div class="row-fluid" id="rowundefined[0]">
					<div class="span4" id="colundefined[0][0]">
									
    <div style="border-width: 1px;text-align: center;">
<!--SRS(需求点样例)[{"name":"需求标题样例","desc":"一个样例描述"}]-->

   	   需求管理功能列表：
       <ul style="text-align: left;">
           <li>每一个对象都可以打开其对象管理列表</li>
           <li>可以添加删除编辑每一个需求点</li>
       </ul>
   </div>
   
					</div>
					<div class="span4" id="colundefined[0][1]">
									
   <div style="border-width: 1px;text-align: center;">
   	   布局功能列表：
       <ul style="text-align: left;">
           <li>支持按行布局</li>
           <li>行与行间进行上下顺序调换</li>
           <li>上面的行布局，可以进入到下面行的内部，变成内部行布局</li>
           <li>内部行布局，同样可以到外面，变成对等的行</li>
       </ul>
   </div>
   
					</div>
					<div class="span4" id="colundefined[0][2]">
									
   <div style="border-width: 1px;text-align: center;">
   	   对象创建功能列表：
       <ul style="text-align: left;">
           <li>创建对象，创建对象时可以选择任何一个组件</li>
           <li>对象可以任意拖动到任意布局中</li>
           <li>对象可以进行编辑，手工编写里面的html内容和属性</li>
       </ul>
   </div>
   
					</div>
				</div><!--/row-->
				<div class="row-fluid" id="rowundefined[1]">
					<div class="span4" id="colundefined[1][0]">
									<div style="height:480px;border-color: red;border-style: solid;border-width: 1px;">
   	   左边的菜单栏
   </div>
					</div>
					<div class="span8" id="colundefined[1][1]">
									<div style="height:40px;border-color: red;border-style: solid;border-width: 1px;">
   	   面包屑，右边有两个按钮
   </div>
									<div style="height:360px;border-color: red;border-style: solid;border-width: 1px;">
   	   这是一个列表
       <ul>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
         <li>列信息1</li>
       </ul>
   </div>
					</div>
				</div><!--/row-->
			</div><!--/.span-->
					</div><!--/.row-fluid-->
				</div><!--/.page-content-->

			
			
		</div><!--/.main-container-->

		






		

		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="${B}manager_auxiliary/assets/js/bootstrap.min.js"></script>

		<!--page specific plugin scripts-->

		<script src="${B}manager_auxiliary/assets/js/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="${B}manager_auxiliary/assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="${B}manager_auxiliary/assets/js/jquery.slimscroll.min.js"></script>

		<!--ace scripts-->

		<script src="${B}manager_auxiliary/assets/js/ace-elements.min.js"></script>
		<script src="${B}manager_auxiliary/assets/js/ace.min.js"></script>

		<!--inline scripts related to this page-->

		<script type="text/javascript">
			$(function() {
				// Portlets (boxes)
			    $('.widget-container-span').sortable({
			        connectWith: '.widget-container-span',
					items:'> .widget-box',
					opacity:0.8,
					revert:true,
					forceHelperSize:true,
					placeholder: 'widget-placeholder',
					forcePlaceholderSize:true,
					tolerance:'pointer'
			    });
				$('.widget-container-span').sortable({
			        connectWith: '.widget-container-span',
					items:'> .widget-box',
					opacity:0.8,
					revert:true,
					forceHelperSize:true,
					placeholder: 'widget-placeholder',
					forcePlaceholderSize:true,
					tolerance:'pointer'
			    });
				
				$(".widget-box").mouseover(function(){
					$(this).find(".widget-header").show();
				})
				$(".widget-box").mouseout(function(){
					$(this).find(".widget-header").hide();
				})
			});
			
			
		</script>
		
		
		
	</body>
</html>
