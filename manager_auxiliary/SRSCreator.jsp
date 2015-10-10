<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="./hHead.jsp"%>
<jsp:include page="../page/allhead.jsp"/>
<%
request.setAttribute("S",request.getAttribute("B")+"breeze/framework/jsp/BreezeFW.jsp");
%>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />

		<meta name="description" content="Draggabble Widget Boxes &amp; Containers" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<!--basic styles-->

		<link href="./assets/css/bootstrap.min.css" rel="stylesheet" />
		<link href="./assets/css/bootstrap-responsive.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="./assets/css/font-awesome.min.css" />

		<!--[if IE 7]>
		  <link rel="stylesheet" href="./assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!--page specific plugin styles-->

		<!--ace styles-->

		<link rel="stylesheet" href="./assets/css/ace.min.css" />
		<link rel="stylesheet" href="./assets/css/ace-responsive.min.css" />
		<link rel="stylesheet" href="./assets/css/ace-skins.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="./assets/css/ace-ie.min.css" />
		<![endif]-->

		<!--inline styles related to this page-->
		
		<style type="text/css">
			.redborder {
				border-color:red;
				border-width:1px;
				border-style:solid;
			}
			.rowControl {
				position:absolute;
				width:100%;
				border-color:blue;
				border-width:1px;
				border-style:solid;
			}
		</style>
	</head>
	<body>
		<div id="mainedit" class="FWApp">
			<!--@SRSCreator@{
			}-->
			
		</div>
		<div id="helper" >
		</div>
		<div class="ace-settings-container" id="ace-settings-container">
			<div class="btn btn-app btn-mini btn-warning ace-settings-btn" id="ace-settings-btn">
				<i class="icon-cog bigger-150"></i>
			</div>

			<div class="ace-settings-box" id="ace-settings-box">
				<div>
					<a href="#none" onclick="FireEvent('mainedit.openAddObject');">
					<label class="lbl" for="ace-settings-sidebar"> 创建对象 </label>
					</a>
				</div>
				
				<div>
					<a href="#none" onclick="FireEvent('mainedit.openAddLayout');">
					<label class="lbl" for="ace-settings-sidebar"> 创建布局 </label>
					</a>
				</div>

				<div>
					<input type="checkbox" class="ace-checkbox-2" id="displayLayout" onclick="FireEvent('mainedit.showLayout');"/>
					<label class="lbl" >显示布局</label>
				</div>
				<div>
					<input type="checkbox" class="ace-checkbox-2" id="displayRowCtr" onclick="FireEvent('mainedit.showLayout');"/>
					<label class="lbl" >显示行控制器</label>
				</div>
				<div>
					<a href="#none" onclick="FireEvent('mainedit.save2file');">
					<label class="lbl" for="ace-settings-sidebar"> 保存文件 </label>
					</a>
				</div>
				<div>
					<a href="SRSView.jsp" >
					<label class="lbl" for="ace-settings-sidebar"> 返回列表 </label>
					</a>
				</div>

	
			</div>
		</div><!--/#ace-settings-container-->
		<!--basic scripts-->
		<script src="${B}breeze/lib/js/jquery.js"></script>
		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="./assets/js/bootstrap.min.js"></script>

		<!--page specific plugin scripts-->

		<script src="./assets/js/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="./assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="./assets/js/jquery.slimscroll.min.js"></script>

		<!--ace scripts-->

		<script src="./assets/js/ace-elements.min.js"></script>
		<script src="./assets/js/ace.min.js"></script>

		<!--codemirror-->
		<script src="${B}breeze/lib/js/codemirror/codemirror.js?v=1.3"></script>
		<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/codemirror.css">
		<script src="${B}breeze/lib/js/codemirror/javascript.js?v=1.3"></script>
		
		
		<script src="${B}breeze/lib/js/sea.js"></script>
		<script src="${B}config/config.jsp"></script>
		<script>
			seajs.config({base:"${B}"});
			seajs.use( [ 'manager_auxiliary/service/SRSCreator' ],function(a) {
						a.go("${S}");
						window.FW = a;
			});
		</script>
		<div style="display:none">
			<div class="FWRES" APPID="mainedit"  RESID="layout">
				<!--$for(var i=0;i<data.length;i++){-->
				<div class="row-fluid" id="row${_}{data.baseId}[${_}{i}]">
					<!--$for (var j=0;j<data[i].length;j++){-->
					<div class="span${_}{data[i][j].spanx} widget-container-span" id="col${_}{data.baseId}[${_}{i}][${_}{j}]">
						<!--$for (var k=0;k<data[i][j].length;k++){-->
						<!--$if (data[i][j][k].type!=3){-->
						<div class="widget-box transparent" id="app${_}{data.baseId}[${_}{i}][${_}{j}][${_}{k}]">
							<div class="widget-header" style="display:none">
								<h5></h5>

								<div class="widget-toolbar">
									<a href="#" data-action="settings" onclick="FireEvent.openOneObjSRSList(this);return false;">
										<i class="icon-comment"></i>
									</a>

									<a href="#none" onclick="FireEvent.setEdit(this);">
										<i class="icon-chevron-up"></i>
									</a>

									<a href="#none" onclick="FireEvent.removeObj(this);">
										<i class="icon-remove" ></i>
									</a>
								</div>
							</div>

							<div class="widget-body">
								<div class="widget-main">
									${_}{p:("getShowObjStrt",data[i][j][k])}
								</div>
							</div>
							<div class="widget-edit-position" id="data${_}{data.baseId}[${_}{i}][${_}{j}][${_}{k}]" style="width:100%;display:none">
								<div>
									<a href="#none" onclick="FireEvent.closeEdit(this);"><span class="label label-warning">关闭</span></a>
									<a href="#none" onclick="FireEvent.saveEdit(this);"><span class="label label-warning">保存</span></a>
								</div>
							</div>
						</div>
						<!--$}else{-->
							${_}{p:("getShowObjStrt",data[i][j][k],'['+i+']'+'['+j+']'+'['+k+'].content','layout')}
						<!--$}-->
						<!--$}-->
					</div>
					<!--$}-->
					<div class="rowControl" id="rowCtr${_}{data.baseId}[${_}{i}]" style="display:none">
						<a href="#none" onclick="FireEvent.moveUpRow(this);">
							<i class="icon-chevron-up"></i>
						</a>

						<a href="#none" onclick="FireEvent.moveDownRow(this);">
							<i class="icon-chevron-down" ></i>
						</a>
						
						<a href="#none" onclick="FireEvent.openMoveInnerSelect(this);">
							<i class="icon-download-alt" ></i>
						</a>
						
						<a href="#none" onclick="FireEvent.removeObj(this);">
							<i class="icon-external-link" ></i>
						</a>
						
						<a href="#none" onclick="FireEvent.removeRow(this);">
							<i class="icon-remove" ></i>
						</a>
						&nbsp;&nbsp;&nbsp;&nbsp;
						行结构：
						<!--$for(var j=0;j<data[i].length;j++){-->
							[${_}{data[i][j].spanx}]
						<!--$}-->
						<a href="#none" onclick="FireEvent.goOurterRowCtr(this);">转外部控制器</a>
						<a href="#none" onclick="FireEvent.goInnerRowCtr(this);">转内部控制器</a>
					</div>
				</div><!--/row-->
				<!--$}-->
				<!--$if(data.baseId == ""){-->
				<div class="widget-edit" style="width:100%;display:none">
					<textarea  class="editor" ></textarea>
				</div>
				<!--$}-->
			</div>
			<div class="FWRES" APPID="mainedit"  RESID="result">
				<!--$for(var i=0;i<data.length;i++){-->
				<div class="row-fluid" id="row${_}{data.baseId}[${_}{i}]">
					<!--$for (var j=0;j<data[i].length;j++){-->
					<div class="span${_}{data[i][j].spanx}" id="col${_}{data.baseId}[${_}{i}][${_}{j}]">
						<!--$for (var k=0;k<data[i][j].length;k++){-->
						<!--$if (data[i][j][k].type!=3){-->
									${_}{p:("getShowObjStrt",data[i][j][k])}
						<!--$}else{-->
							${_}{p:("getShowObjStrt",data[i][j][k],'['+i+']'+'['+j+']'+'['+k+'].content','result')}
						<!--$}-->
						<!--$}-->
					</div>
					<!--$}-->
				</div><!--/row-->
				<!--$}-->
			</div>
			<div class="FWRES" APPID="mainedit"  RESID="newObjectSetting">
				<div style="float:right;padding-right: 10px;">
					<h5><a href="#" onclick="FireEvent.cancelMask()">X</a></h5>
				</div>
				<div style="clear: all;">
					&nbsp;
				</div>
				<div>
					&nbsp;
				</div>
				<div>
					<jsp:include page="./SRSCreator_bean.jsp"/>
				</div>
				
			</div>
			<div class="FWRES" APPID="mainedit"  RESID="newLayoutSetting">
				<div>
				请在下面的输入框中输入相应的布局设置。以+号为间隔符<br/>
				注意，总和必须为12，如：4+4+4
				</div>
				<div>
					<input type="text" id="layoutsetting"/>
				</div>
				<div>
				   <button class="btn btn-info" id="bootbox-confirm"onclick="FireEvent.addLayout();">确认</button>
				   <button class="btn" id="bootbox-regular" onclick="FireEvent.cancelMask();">取消</button>
				</div>
			</div>
			<div class="FWRES" APPID="mainedit"  RESID="moveInnerSelect">
				<div>
				请选择，移入那个布局中？<a href="#none" onclick="FireEvent.cancelMask();">[x]</a>
				</div>
				<div>
					<!--$for(var i=0;i<data.length;i++){-->
						<a href="#none" onclick="FireEvent.moveInner('${_}{data.goId}','${_}{i}')">[${_}{data[i]}]</a>
					<!--$}-->
				</div>
			</div>
			
			<div class="FWRES" APPID="mainedit"  RESID="oneObjSRSlist">
				<br />
				<div style="text-align: left">
				&nbsp;小分类:<input type="text" id="srsName" value="${_}{data.name}"/>
				</div>
				<table width="100%" border="1">
					<thead>
						<tr>
						<td align="center" width="70%">标题</td>
						<td align="center" width="30%">操作</td>
						</tr>
						
					</thead>
					<tbody>
						
					
						<!--$for (var i=0;data.SRS && data.SRS.length && i<data.SRS.length;i++){-->
							<tr>
								<td align="center">${_}{data.SRS[i].name}</td>
								<td align="center">
									<a href="#" onclick="FireEvent.openOneObjSRSSingle('${_}{i}');">详细</a> &nbsp;<a href="#" onclick="FireEvent.delOneObjsrs('${_}{i}')">删除</a>
								</td>
							</tr>
						<!--$}-->
					
					</tbody>
				</table>
				<div>
				<br />
					<button onclick="FireEvent.saveOneObjSrsObj('srsName');">保存小分类</button>&nbsp;<button onclick="FireEvent.openOneObjSRSSingle();">添加新需求</button>&nbsp;<button onclick="FireEvent.cancelMask();">关闭</button>
				</div>
			</div>
			
			<div class="FWRES" APPID="mainedit"  RESID="srsSingleForm">
				<br />
				标题:<input id="srsObjName" name="name" type="text" value="${_}{data.name}"/><br />
				描述:<textarea id="srsObjDesc" name="desc">${_}{data.desc}</textarea><br />
				<button onclick="FireEvent.addOneObjSRS('srsObjName,srsObjDesc','${_}{data.srsIdx}');">确定</button>&nbsp;<button onclick="FireEvent.backList();">取消</button>
			</div>
			
		</div>
	</body>
</html>