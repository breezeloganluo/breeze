<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.servicerg.AllServiceTemplate"%>
<%@ page import="java.util.*"%>
<%@include file="./hHead.jsp"%>
<%	
	request.setAttribute("_", "$");
	String target = "/breeze.brz";
	if ("true".equals(request.getParameter("isTest"))){
		target = "/manager_auxiliary/server/SimulateService.jsp";
	}
	String testData = request.getParameter("testData");
	if (testData == null){
		testData = "testdata.js";
	}
	
	Set<String> sSet = AllServiceTemplate.INSTANCE.getTempleNameSet();
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
<!doctype html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!--强制使用浏览器模式-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--强制使用文本模式-->
<title>doServer调试工具</title>


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
	var tmp = (new Date()).getTime();
	var testDataUrl = "./data/<%=testData%>?rnd="+tmp;
	var testDataObj=$.ajax({url:testDataUrl,async:false});
	var testData = eval("("+testDataObj.responseText+")");

	var serviceFullNameList = <%=serviceFullNameList%>;
	//整理serviceFullNameList将package和name分开
	for (var i=0;i<serviceFullNameList.length;i++){
		var sn = serviceFullNameList[i];
		var lidx = sn.lastIndexOf(".");
		var pk = "";
		var name = sn;
		if (lidx != -1){
			pk = sn.substring(0,lidx);
			name = sn.substring(lidx+1);
		}
		var pkObj = testData[pk];
		if (pkObj == null){
			pkObj = {};
			testData[pk] = pkObj;
		}
		var nameObj = pkObj[name];
		if (nameObj == null){
			nameObj = {};
			pkObj[name] = nameObj;
		}
	};
	
    
    
	
	seajs.config({
	});
	
	seajs.use(['<%=this.getServletContext().getContextPath()%>/manager_auxiliary/service/test' ],
					function(a) {
						a.go("<%=this.getServletContext().getContextPath()%><%=target%>");
						window.FW = a;
						
						


						//N级联动设置 Alec  20130713
						//支持多级联动

						
						// alert(FW.use().toJSONString(testData));

						function linkage(objdata,selectDom){  //联动函数，change时候给下级赋值
							var curTr = selectDom.parent().parent();
							var sn = curTr.find("select").index(selectDom);
							if(sn == curTr.find("select").length-1){
								curTr.find("textarea").text(objdata["param"]);
							}else{
								curTr.find("select").eq(sn+1).empty();
								for(var prop in objdata){
									curTr.find("select").eq(sn+1).append("<option value='"+prop+"'>"+prop+"</option>");
								}
								curTr.find("select").eq(sn+1).change();
							}
						}
						//绑定包select的change事件
						$(".table-list").delegate("select","change",function(){
							var curTr = $(this).parent().parent();
							var sn = curTr.find("select").index($(this));
							var curData = testData;
							for(var i=0; i<sn+1; i++){
								curData = curData[curTr.find("select").eq(i).val()];
							}
						   	var curSelectDom = $(this);
							linkage(curData,curSelectDom);
						});

						//给包名初始值
						var _selectDom = $(".list-tr-hidden select:eq(0)");
						for(var prop in testData){
							_selectDom.append("<option value='"+prop+"'>"+prop+"</option>");
						}
						_selectDom.change();

					});
					
	var go = function(){
		var data = $("#form")[0].getData();
		//({d:[{package:"aaa", name:"yyy", param:{aa:"aa"}}, {package:"ww", name:"wwname", param:{ww:"ww"}}]})
		var objData = data.d;
		for(var i=0;i<objData.length;i++)
		{
			objData[i].param=eval("("+objData[i].param+")");
		}
		var submitStr = FW.use().toJSONString(objData);
		
		alert(submitStr);
		$("#data").val(submitStr);
		$("#subForm").submit();
	}
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
						<a href="testserver.jsp" class="btn btn-pink">
							<i class="icon-eye-close"></i>
							Debug调试
						</a>
					</div><!--/btn-group-->
				</div>
			</div>
			<span id="aliasTitle">伟光科技框架工具</span>
		</h1>
	</div>
	<div id="app_testMail" class="left FWApp">
		<!--@test@
		{
			objdesc:{
							d : {
								title : "数据项目",
								type : "List",
								valueRange : [ {
									package : {
										title : "包名",
										type : "Select",
										desc : "包名",
										valueRange :[],
										width : '200px'
									},
									name : {
										title : "action名",
										type : "Select",
										desc : "action名",
										valueRange :[],
										width : '200px'
									},
									paramName : {
										title : "参数记录名",
										type : "Select",
										desc : "参数记录名",
										valueRange :[],
										width : '300px'
									},
									param : {
										title : "Json参数",
										type : "TextArea",
										desc : "Json参数",
										width : '300px'
									}
								} ]
							}
						}
		}
		-->
		<div id="view_main" >
			<form id="form" class="form-horizontal clearfix"></form>
			<div style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
				<a href="javascript:void(0)" onclick="FireEvent.submitData()" class="btn btn-info">
					<i class="icon-ok bigger-110"></i>
					确认提交
				</a>&emsp;&emsp;
				<a href="javascript:void(0)" onclick="FireEvent.selectMode()" class="btn btn-danger">
					<i class="icon-bookmark bigger-110"></i>
					${_}{data}
				</a>&emsp;&emsp;
				<select id="data_select" onchange="FireEvent.changeMode(this)">
				<option value="testdata.js">请选择</option>
					<option value="testdata.js">testdata.js</option>
					<option value="testdata_b.js">testdata_b.js</option>
					<option value="testdata_f.js">testdata_f.js</option>
				</select>
			</div>
		</div>
		<div id="view_result">
			<!--$for(var i=0;i<data.length;i++){ -->
			<div>
			<form method="post" action="server/SaveTestData.jsp?testData=${_}{data[i].testData}">
				<input name="package" style="width:40px" type="text" value="${_}{data[i].package}"></input>
				<input name="name" style="width:150px" type="text" value="${_}{data[i].name}"></input>
				<input name="paramName" style="width:150px" type="text" value="${_}{data[i].paramName}"></input>
				<textarea name="param">${_}{data[i].param}</textarea>result:
				<input name="code" style="width:20px" type="text" value="${_}{data[i].code}"></input>			
				<textarea name="data" >${_}{data[i].data}</textarea>
				<div style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
					<button type="submit" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						保存
					</button>
				</div>
			</form>
			</div>
			<!--$} -->
		</div>
	</div>
</div>
</body>
</html>