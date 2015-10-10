<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.netserver.workflow.*"%>
<%@ page import="java.util.*"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breezefw.shell.ServiceDescTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>

<%@ page import="com.breeze.framwork.netserver.process.ServerProcessManager"%>
<%@ page import="com.breeze.framwork.netserver.process.ServerProcess"%>
<%@ page import="com.breeze.framwork.servicerg.TemplateItemParserAbs"%>
<%@include file="./hHead.jsp"%>
<%	
   request.setAttribute("_","$");
   
   StringBuilder arrayStr = new StringBuilder();
   boolean isFirst = true;
   arrayStr.append("[{");
	
   for (String s :WorkFlowUnitMgr.INSTANCE.getAllUnitKey()){
	   if (isFirst){
			isFirst = false;
		}else{
			arrayStr.append(',');
		}
		arrayStr.append(s).append(":'").append(s).append("'");
   }
   arrayStr.append("}]");

   //获取所有流程
	request.setAttribute("_","$");
	BreezeContext root = new BreezeContext();
	for (ServerProcess sp :ServerProcessManager.INSTANCE.getServiceProcesses()){
		String name = sp.getProcessName();
		root.pushContext(new BreezeContext(name));
	}
	String flowContent = ContextTools.getJsonString(root, null);
%>
<jsp:include page="../page/allhead.jsp"/>
<!doctype html>
<html lang="en">
<head>
	<link rel="shortcut icon" href="./img/icon/createflow.jpg" >
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Flow编辑器</title>

	<!-- //脚本 -->
	<script src="../breeze/lib/js/jquery.js"></script>
	<script src="../breeze/lib/js/sea.js"></script>

	<!-- //前端框架JS -->
	<script src="./assets/js/bootstrap.min.js"></script>
	<script src="../breeze/xheditor/jquery-migrate-1.1.0.min.js"></script>

	<!--basic styles-->
	<link href="./assets/css/bootstrap.min.css" rel="stylesheet" />
	<link href="./assets/css/bootstrap-responsive.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="./assets/css/font-awesome.min.css" />

	<!--[if IE 7]>
	  <link rel="stylesheet" href="./assets/css/font-awesome-ie7.min.css" />
	<![endif]-->

	<!--page specific plugin styles-->
	<link rel="stylesheet" href="./assets/css/jquery-ui-1.10.3.custom.min.css" />
	<link rel="stylesheet" href="./assets/css/chosen.css" />


	<!--ace styles-->
	<link rel="stylesheet" href="./assets/css/ace.min.css" />
	<link rel="stylesheet" href="./assets/css/ace-responsive.min.css" />
	<link rel="stylesheet" href="./assets/css/ace-skins.min.css" />
	
	<!--[if lt IE 9]>
	  <link rel="stylesheet" href="./assets/css/ace-ie.min.css" />
	<![endif]-->

<script>
	var flows = <%=flowContent%>;
	seajs.config({});
	seajs.use([ '${B}manager_auxiliary/service/flow'], function(a) {
				a.go("../breeze/framework/jsp/BreezeFW.jsp");
				window.FW = a;
			});
			

</script>
</head>
<body>
<div class="page-content clearfix">
	<div class="page-header position-relative">
		<h1 id="pageH1">
			<div class="pull-right" id="btnAction">
				<div class="btn-toolbar">
					<div class="btn-group">
						<a href="editservice.jsp" class="btn btn-primary">
							<i class="icon-exchange"></i>
							Service管理
						</a>
					</div><!--/btn-group-->

					<div class="btn-group">
						<a href="createflow.jsp" class="btn btn-success">
							<i class="icon-refresh"></i>
							Flow 管理
						</a>
					</div><!--/btn-group-->

					<div class="btn-group">
						<a href="debugService.jsp" class="btn btn-pink">
							<i class="icon-eye-close"></i>
							Debug调试
						</a>
					</div><!--/btn-group-->
				</div>
			</div>
			<span id="aliasTitle">伟光科技框架工具</span>
		</h1>
	</div>
	<div id="create" class="left FWApp">
	<!--@cprocess@
	{
		def:{
			name:{
				title: "processName",
				type: "Text",
				valueRange: [{
								checkers:[
									/\w+/
								],
								failTips:'请输入正确名称'
							}],
				desc: "processName"
			},
			statusList:{
				title: "processList",
				type: "List",
				valueRange: [
					{
						status:{
							title: "当前状态",
							type: "Text",
							valueRange: [{
								checkers:[
									/\d+/
								],
								failTips:'状态必须是数字'
							}],
							desc: "当前状态"
						},
						unitName:{
							title: "单元名称",
							type: "Select",
							valueRange: <%=arrayStr.toString()%>,
							desc: "单元名称"
						},
						actionResult:{
							title: "操作结果码",
							type: "Text",
							valueRange: [{
								checkers:[
									/\d+/
								],
								failTips:'结果码必须是数字'
							}],
							desc: "操作结果码"
						},
						nextStatus:{
							title: "转向的状态",
							type: "Text",
							valueRange: [{
								checkers:[
									/\d+/
								],
								failTips:'转向状态必须是数字'
							}],
							desc: "转向的状态"
						}
					}
				]
			}
		}
	}
	-->
		<div id="view_mainform">
			<select id="flowSelector" onchange="FireEvent.selectFlow()">
				<option value='none'>新创建</option>
				<!--$for(var i=0;i<flows.length;i++){-->
				<option value='${_}{flows[i]}'>${_}{flows[i]}</option>
				<!--$}-->
			</select>
			<form id="myform" class="form-horizontal clearfix"></form>
			<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
				<a href="javascript:void(0)" onclick="FireEvent.showResult()" class="btn btn-info">
					<i class="icon-ok bigger-110"></i>
					确认提交
				</a>
			</div>			
		</div>
		<div id="view_result">
			<form action="createflow.jsp" class="form-horizontal clearfix"  method="post">
			<input type="text" id="flowName" value="${_}{data.flowName}"></input><br/>
			<textarea id="flowData" rows="35" cols="140" name="saveData" >${_}{data.data}</textarea>
			<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
				<input type="button" class="btn btn-info" onclick="FireEvent.submit()">
					<i class="icon-ok bigger-110"></i>
					提交
				</input>
			</div>
			</form>
		</div>
	</div>
	<div class="right"></div>
</div>
</body>
</html>