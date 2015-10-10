<%@page import="java.util.regex.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<%

	request.setAttribute("_", "$");
	String filterKey = request.getParameter("filterKey");
	if (filterKey == null) {
%>
<!doctype html>
<html lang="en">
<head>
	<link rel="shortcut icon" href="./img/icon/logsview.jpg" >
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>日志查看器</title>
</head>
<body>
	<form method="get">
		过滤标识:<input name="filterKey" type="text" /> <input type="submit"
			value="ok">
	</form>
</body>
</html>
<%
	return;	
	}
	StringBuilder one = new StringBuilder();
	HashMap<String,ArrayList<StringBuilder>> logMap = new HashMap<String,ArrayList<StringBuilder>>();
	ArrayList<StringBuilder> oneServiceLog = new ArrayList<StringBuilder>();
	logMap.put("noServer", oneServiceLog);
	BufferedReader read = new BufferedReader(new InputStreamReader(new FileInputStream(Log4jInit.logDir),"UTF-8"));
	boolean lastIsInFilter = false;	
	while(true){
		String text = read.readLine();
		if (text == null){
	break;
		}
		Pattern p = Pattern.compile("[\\d-]{10}\\s[\\d:]{8}\\s\\[[\\w\\.]+\\]-\\[\\w+\\](.+)");
		Matcher m = p.matcher(text);
		if (m.matches()){
	//表示是新的一行日志
	String logContent = m.group(1);
	p = Pattern.compile("\\{\\[(.+?)\\]\\}(.+)");
	m = p.matcher(logContent);
	if (m.matches()){
		String sig = m.group(1);
		if (!sig.equals(filterKey)){
			//不相等就直接过滤
			lastIsInFilter = false;
			continue;
		}
		//下面找新的service
		String content = m.group(2);
		p = Pattern.compile("begin\\sservce\\[(.+?)\\]");
		m = p.matcher(content);
		if (m.find()){
			String serviceName = m.group(1);
			oneServiceLog = logMap.get(serviceName);
			if (oneServiceLog == null){
				oneServiceLog = new ArrayList<StringBuilder>();
				logMap.put(serviceName, oneServiceLog);
			}
			//新服务要加入长横线间隔
			StringBuilder oneLog = new StringBuilder();
			oneLog.append("--------------------------------");
			oneServiceLog.add(oneLog);
			continue;
		}
		
		p = Pattern.compile("begin\\sone\\srequest.get\\sparam\\sdata\\sis.*");
		m = p.matcher(content);
		if (m.find()){
			String serviceName = "noServer";
			oneServiceLog = logMap.get(serviceName);
			if (oneServiceLog == null){
				oneServiceLog = new ArrayList<StringBuilder>();
				logMap.put(serviceName, oneServiceLog);
			}
			//新服务要加入长横线间隔
			StringBuilder oneLog = new StringBuilder();
			oneLog.append("--------------------------------");
			oneServiceLog.add(oneLog);			
		}
		
		//记录一条新的记录
		StringBuilder oneLog = new StringBuilder();
		oneLog.append(text);
		oneServiceLog.add(oneLog);
		lastIsInFilter = true;
	}else{
		//被过滤了
		lastIsInFilter = false;
		continue;
	}
		}else{
	//表示是上一行日志，如果上一个记录是被过滤掉的就不记录了
	if (lastIsInFilter){
		//记录到上一条记录中进行append
		StringBuilder oneLog = oneServiceLog.get(oneServiceLog.size()-1);
		oneLog.append("<br/>").append(text);
	}
		}		
	}
	read.close();
%>
<!doctype html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>日志查看器</title>
<script>
	var show = function(id) {
		var nowStr = document.getElementById(id).style.display;
		if (nowStr == 'none') {
			document.getElementById(id).style.display = '';
		} else {
			document.getElementById(id).style.display = 'none';
		}
	}
</script>
</head>
<body>
	<%
		for (String key : logMap.keySet()) {
			ArrayList<StringBuilder> ll = logMap.get(key);
	%>
	<a href="#" onclick="show('<%=key%>')"><%=key%>:</a>
	<div id='<%=key%>'>
		<%
			for (StringBuilder sb : ll) {
		%>----<%=sb%><br />
		<br />
		<%
			}
		%>
	</div>
	<br />
	<%
		}
	%>
</body>
</html>