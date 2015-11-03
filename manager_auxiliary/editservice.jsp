
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breezefw.shell.ServiceDescTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="com.breeze.framwork.netserver.process.ServerProcessManager"%>
<%@ page import="com.breeze.framwork.netserver.process.ServerProcess"%>
<%@ page import="com.breeze.framwork.netserver.workflow.WorkFlowUnit"%>
<%@ page import="com.breeze.framwork.servicerg.TemplateItemParserAbs"%>
<%@ page import="com.breeze.framwork.servicerg.AllServiceTemplate"%>
<%@ page import="java.util.*"%>

<%@include file="./hHead.jsp"%>

<jsp:include page="../page/allhead.jsp"/>
<!doctype html>
<html lang="en">
<head>
	<link rel="shortcut icon" href="./img/icon/editservice.png" >
<meta http-equiv="Content-Type" content="text/xml; charset=UTF-8">
<title>Service编辑器</title>


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


<%
		//获取所有流程
		request.setAttribute("_","$");
		BreezeContext root = new BreezeContext();
		for (ServerProcess sp :ServerProcessManager.INSTANCE.getServiceProcesses()){
			String name = sp.getProcessName();
			BreezeContext oneFlowContent = new BreezeContext();
		
			for(int i=0; i<sp.getAllWorkFlowUnit().length;i++)
			{
				WorkFlowUnit wu=sp.getAllWorkFlowUnit()[i].action;
				TemplateItemParserAbs[] ps = wu.getProcessParser();
				
				if (ps==null){
					continue;
				}
				//备份  林浩旋  7-3 
				for(int i1=0;i1<ps.length;i1++)
				{
					//System.out.println("ps.getItempClass------->"+ps[i1].getItempClass());
					BreezeContext x = ServiceDescTools.parserItemDesc(ps[i1].getItempClass());
					//System.out.println("BreezeContext------->"+x);
					oneFlowContent.combindContext(x);
				}
			}
			//System.out.println("oneFlowContent------------------>"+oneFlowContent);
 			root.setContext(name,oneFlowContent);
 			//System.out.println("name----------------->"+name);			
		}
		//System.out.println("root--------->"+root);
		String flowContent = ContextTools.getJsonString(root, null);

		///////////////////////////////////////////////////////////////////////
		//获取所有已注册的业务
		Set<String> sSet = AllServiceTemplate.INSTANCE.getTempleNameSet();
		//System.out.println("sSet:----->"+sSet);
		StringBuilder arrayStr = new StringBuilder();
		boolean isFirst = true;
		arrayStr.append("[");
		for (String s:sSet){
			if (isFirst){
				isFirst = false;
			}else{
				arrayStr.append(',');
			}
			arrayStr.append("'").append(s).append("'");
		}
		arrayStr.append("]");
		String serviceFullNameList = arrayStr.toString();
 %>
<script>

    var flows = <%=flowContent%>;
    var serviceFullNameList = <%=serviceFullNameList%>;
    //整理serviceFullNameList将package和name分开
    var serviceNames = {};
    for (var i=0;i<serviceFullNameList.length;i++){
    	var sn = serviceFullNameList[i];
    	var lidx = sn.lastIndexOf(".");
    	var pk = "";
    	var name = sn;
    	if (lidx != -1){
    		pk = sn.substring(0,lidx);
    		name = sn.substring(lidx+1);
    	}
    	var nameList = serviceNames[pk];
    	if (!nameList){
    		serviceNames[pk] = [];
    		nameList = serviceNames[pk];
    	}
    	nameList.push({full:sn,name:name});
    };
  	//2014-10-17罗光瑜 排序
    for (var n in serviceNames){
    	var nameList = serviceNames[n];
    	nameList.sort(function(a,b){
    		return a.name < b.name ?-1:1;
    	});
		
    }
	seajs.config({});
	seajs.use([ '${B}manager_auxiliary/service/service'], function(a) {
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
		<div id="app_create" class="left FWApp">
		<!--@cservice@
		{
			
		}
		-->
			<div id="view_selectFlow">
				<a class="btn btn-info btn-mini" href="#none" onclick="FireEvent.go2Edit();"><i class="icon-edit"></i> Edit service</a>
				<br><br>
				<select id="v_flows">
					<!--$for(var i=0;i<data.length;i++){-->
						<option value="<%="$"%>{data[i]}"><%="$"%>{data[i]}</option>
					<!--$}-->
				</select>
				<br>
				<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
					<a href="javascript:void(0)" onclick="FireEvent.showCfg(0)" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						确认提交
					</a>
				</div>
			</div>
			
			<div id="view_selectPackage">
				<a class="btn btn-info btn-mini" href="editservice.jsp"><i class="icon-plus"></i> Add service</a>
				<br><br>
				<select id="v_package" onchange="FireEvent.changePackage()">
					<!--$for(var name in data.sall){-->
						<option value="${_}{name}">${_}{name}</option>
					<!--$}-->
				</select>
				<select id="v_name">
					<!--$for(var i=0;data.nameList && i<data.nameList.length;i++){-->
						<option value="${_}{data.nameList[i].full}">${_}{data.nameList[i].name}</option>
					<!--$}-->
				</select>
				<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
					<a href="javascript:void(0)" onclick="FireEvent.showCfg(1)" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						确认提交
					</a>
				</div>
			</div>
			<div id="view_mainform">
				<form class="form-horizontal clearfix">
					<div class="control-group c_Text">
						<label class="control-label" for="data.bao">所在包：</label>
						<div class="controls">
							<input type="text" value="${_}{data}" class="inp_text" id="package">
						</div>
					</div>
					<div id="myform"></div>
				
				</form>
				<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
					<a href="javascript:void(0)" onclick="FireEvent.showResult()" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						确认提交
					</a>
				</div>		
			</div>
			<form  action='S_setServiceText.jsp' method='post' id="view_result">
				<textarea id="textshow" name='data' rows="35" cols="140">${_}{data.data}</textarea><br/>
				<input type='hidden' name='serviceName' id="serviceName" value='${_}{data.serviceName}'/>
				<input type="hidden" name="package" id="package" value="${_}{data.package}"/>
				<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
					<a href="javascript:void(0)" onclick="FireEvent.submit()" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						确认提交
					</a>
				</div>
			</form>
		</div>
		<div class="right"></div>
	</div>
</body>
</html>