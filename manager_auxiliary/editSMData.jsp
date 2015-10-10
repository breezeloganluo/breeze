<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="./hHead.jsp"%>
<%
request.setAttribute("B",this.getServletContext().getContextPath()+'/');
request.setAttribute("_","$");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>编辑模拟数据</title>
</head>
<body>
	<%--这一段声明了初始的环境设置，基本路径，文件名 --%>
	<div id="app_fileSelect" class="FWApp">
		<!--@fileselect@
			{
				view:"view_fileSelect"
			}
		-->
		<%--只有一个视图：就是显示路径和文件名，路径是输入框，手动输入的，文件名是选择的 --%>
		<div id="view_fileSelect">
			请输入文件名路径：<input id="dirInput" type="text" value="${_}{data.dir}" />
			<input type="button" onclick="FireEvent.selectDir('dirInput')" value="ok"/>
			<br/>
			<!--$if(data.fileList){-->
				请选择要编辑的文件:
				<select id="fileInput" onchange="FireEvent.selectFile('fileInput')">
					<!--$for(var i in data.fileList){-->
						<!--$if(i == data.selectedFile){-->
						<option value="${_}{i}" selected="true">[${_}{data.fileList[i].type}]${_}{i}</option>
						<!--$}else{-->
						<option value="${_}{i}">[${_}{data.fileList[i].type}]${_}{i}</option>
						<!--$}-->
					<!--$}-->
				</select>
				<input type="button" onclick="FireEvent.selectFile('fileInput')" value="ok"/>
			<!--$}-->
		</div>
	</div>
	
	<%--这一段声明的是实际的模拟数据，包括：包名，servicename，参数，data，结果码 --%>
	<div class="FWApp" id="appEditSMData">
		<!--@editSMData@
			{
	
			}
		-->
		<%--有两个视图，一个是列表，一个编辑详情 ，下面是列表--%>
		<div id="view_selectService">
			请选择包：
			<select onblur="FireEvent.selectPackage(this)">
				<!--$for(var i=0;i<data.package.length;i++){-->
					<!--$if(data.package[i].selected){-->
						<option selected>${_}{data.package[i].name}</option>
					<!--$}else{-->
						<option>${_}{data.package[i].name}</option>
					<!--$}-->
				<!--$}-->
			</select>
			</br>
			<!--$if(data.service&&data.service.length){-->
			请选择service
			<select onblur="FireEvent.selectService(this)">
				<!--$for(var i=0;i<data.service.length;i++){-->
					<!--$if(data.service[i].selected){-->
						<option selected>${_}{data.service[i].name}</option>
					<!--$}else{-->
						<option>${_}{data.service[i].name}</option>
					<!--$}-->
				<!--$}-->
			</select>
			</br>
			<!--$}-->
			<!--$if(data.smList&&data.smList.length){-->
			请选择对应的服务
			<select onblur="FireEvent.selectParam(this)">
				<!--$for(var i=0;i<data.smList.length;i++){-->
					<!--$if(data.smList[i].selected){-->
						<option selected>${_}{data.smList[i].name}</option>
					<!--$}else{-->
						<option>${_}{data.smList[i].name}</option>
					<!--$}-->
				<!--$}-->
			</select>
			<!--$}-->
		</div>
		<%--第二个视图是编辑视图--%>
		<div id="view_editService">
			<!--$if(data){-->
				名称：<input type="text" id="name" value="${_}{data.name}"/><br/>
				参数：<textarea id="param">${_}{data.param}</textarea><br/>
				结果：<input type="text" id="code" value="${_}{data.code}"/><br/>
				数据：<textarea id="data">${_}{data.data}</textarea>
				<button onclick="FireEvent.submitEdit()">保存修改</button>
			<!--$}-->
		</div>
	</div>
	<script src="${B}breeze/lib/js/jquery.js"></script>
	<script src="${B}breeze/lib/js/sea.js"></script>
	<script src="${B}config/config.jsp"></script>
	<script>
		//完成基本breeze的声明
		seajs.config({base:"${B}"});
		seajs.use( [ 'manager_auxiliary/service/fileselect','manager_auxiliary/service/editSMData'],function(a) {
			a.go("${B}breeze/framework/jsp/BreezeFW.jsp",null,function(){

			});
			window.FW = a;
		});
	</script>
</body>
</html>