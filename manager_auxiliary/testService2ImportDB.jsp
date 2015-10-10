<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<%
	
	request.setAttribute("B",this.getServletContext().getContextPath()+'/');
	request.setAttribute("S",this.getServletContext().getContextPath()+"/breeze.brz");
	request.setAttribute("_","$");
%>
<html>
<head>
<title>业务测试_导入数据</title>
</head>
<body>
<%
	String fileName = request.getParameter("fileName");
	if (fileName == null){
		File dirFiles = new File(Cfg.getCfg().getRootDir()+"manager_auxiliary/data/servicetest/");
		
%>
        <form method="post">
<%
		String sql = "select * from cmsmetadata order by alias";
		ResultSet rs = COMMDB.executeSql(sql);
		for(File f:dirFiles.listFiles()){
			if (!f.isFile()){
				continue;
			}
%>
            <input type="radio" name="fileName" value="<%=f.getName()%>"/><%=f.getName()%><br/>
<%
		}
%>
			<input type="submit" value="确定提交"/>
		</form>
		</body>
</html>
<%
		return;
	}
%>
<%
	//读入处理文件
	String file = Cfg.getCfg().getRootDir()+"manager_auxiliary/data/servicetest/"+fileName;
System.out.println("file:"+file);
	BreezeContext allData = new BreezeContext();
	String fileStr = FileTools.readFile(file, "UTF-8");
	if (fileStr!=null){
		allData = ContextTools.getBreezeContext4Json(fileStr);
	}
%>
<%
	//导入session
	BreezeContext sessionCtx = allData.getContext("session");
	if (sessionCtx != null){
		for (String sName:sessionCtx.getMapSet()){
			BreezeContext sValueCtx = sessionCtx.getContext(sName);
			if (sValueCtx != null){
				session.setAttribute(sName,sValueCtx);
			}
		}
	}
%>
<%
	//导入import数据
	BreezeContext importCtx = allData.getContext("input");
	for (String tableName:importCtx.getMapSet()){
		//先清除原来表数据
		COMMDB.executeUpdate("delete from "+tableName);
		BreezeContext impDataCtx = importCtx.getContext(tableName);
		
		for (int i=0;i<impDataCtx.getArraySize();i++){
			BreezeContext oneCtxData = impDataCtx.getContext(i);
			String impSql = "insert into "+tableName;
			boolean isFirst = true;
			String fName = "";
			String v = "";
			ArrayList valueList = new ArrayList();
			for (String ffN:oneCtxData.getMapSet()){
				if (isFirst){
					isFirst = false;
				}else{
					fName+=',';
					v+=',';
				}
				fName += ffN;
				v+='?';
				valueList.add(oneCtxData.getContext(ffN).getData());
			}
			impSql = impSql+"("+fName+")values("+v+")";
			COMMDB.executeUpdate(impSql,valueList);
		}	
	}
	//将导入数据，放到信息中
	request.setAttribute("data",allData.createMap());
%>

<h1>该用例数据导入成功,您可以开始执行测试:</h1><br/>
测试目的是：<span style="color:red">${data.purpose}</span><br/>
<span style="color:blue">(当前系统时间戳为<%=System.currentTimeMillis()%>，如有需要按此时间修改数据库数据。)</span>
	<div id="app_testMail" class="left FWApp">
		<!--@test@
		{
			objdesc:{
				d : {
					title : "测试的参数信息",
					type : "List",
					valueRange : [ {
						package : {
							title : "包名",
							type : "Text",
							desc : "",
							valueRange :[],
							width : '200px'
						},
						name : {
							title : "action名",
							type : "Text",
							desc : "",
							valueRange :[],
							width : '200px'
						},
						param : {
							title : "Json参数",
							type : "TextArea",
							desc : "",
							width : '300px'
						}
					} ]
				}
			},
			testData:{
				d:[
					{
						"name":"${data.service.serviceName}",
						"param":FW.use().toJSONString(${data.service.serviceParam})
					}
				]
			}
		}
		-->
		<div id="view_main" >
			<form id="form" class="form-horizontal clearfix"></form>
			--------------------------------------------------------------------<br/>
			<input type="button" onclick="FireEvent.submitData()" value="执行测试"/>
		</div>
		<div id="view_result">
			测试结果如下：
			<!--$for(var i=0;i<data.length;i++){ -->
			<div>
			<form method="post" action="server/SaveTestData.jsp?testData=${_}{data[i].testData}">
				<input name="package" style="width:40px" type="text" value="${_}{data[i].package}"></input>
				<input name="name" style="width:150px" type="text" value="${_}{data[i].name}"></input>
				<textarea name="param">${_}{data[i].param}</textarea>result:
				<input name="code" style="width:20px" type="text" value="${_}{data[i].code}"></input>	
				返回数据:
				<textarea name="data" >${_}{data[i].data}</textarea>
			</form>
			</div>
			<!--$} -->
			请打开数据库手动观察数据库表修改是否和逾期结果相同。
		</div>
	</div>
	<script src="../breeze/lib/js/jquery.js"></script>
	<script src="../breeze/lib/js/sea.js"></script>
	<script>
	seajs.config({base:"${B}"});
	
	seajs.use(['manager_auxiliary/service/test' ],
					function(a) {
						a.go("${S}");
						window.FW = a;
	});
	</script>
</body>
</html>