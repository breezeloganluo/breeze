<%@page import="java.net.URL"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="com.breezefw.shell.JSP"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.util.regex.Matcher"%>
<%@page import="java.util.regex.Pattern"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	Long excelName = System.currentTimeMillis();
	response.setHeader("Content-disposition","attachment; filename="+excelName+".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>CMSMgrExportExcel Beta</title>
</head>
<style type="text/css">
	table.gridtable {
		font-family: verdana,arial,sans-serif;
		font-size:11px;
		color:#333333;
		border-width: 1px;
		border-color: #666666;
		border-collapse: collapse;
	}
	table.gridtable th {
		border-width: 1px;
		padding: 8px;
		border-style: solid;
		border-color: #666666;
		background-color: #dedede;
	}
	table.gridtable td {
		border-width: 1px;
		padding: 8px;
		border-style: solid;
		border-color: #666666;
		background-color: #ffffff;
	}
</style>
<body>
	<%
		//获取所有参数
		String query = request.getQueryString();
		//利用正则进行拆分		
		Pattern pat = Pattern.compile("(\\w+)=(\\w+-\\w+|\\w+)");
		Matcher math = pat.matcher(query);
		Map<String,String> map = new HashMap<String,String>();
		while(math.find()){
			map.put(math.group(1), URLDecoder.decode(math.group(2)));				
		}
		//定义关键参数
		
		//解析参数
		Set<Map.Entry<String,String>> set = map.entrySet();
		BreezeContext param = new BreezeContext();
		for(Iterator<Map.Entry<String,String>> it = set.iterator();it.hasNext();){
			Map.Entry<String,String> entry = it.next();
			if(entry.getKey().equals("id")){
				request.setAttribute("cid", entry.getValue());
			}else if(entry.getKey().equals("alias")){
				request.setAttribute("alias", entry.getValue());
			}else if(entry.getKey().equals("threadSignal")){
				continue;
			}else{
				if(entry.getValue().indexOf("-") != -1){
					String[] args = entry.getValue().split("-");
					BreezeContext data = new BreezeContext();
					for(String arg : args){
						data.pushContext(new BreezeContext(arg));
					}		
					param.setContext(entry.getKey(), data);
				}else{
					param.setContext(entry.getKey(), new BreezeContext(entry.getValue()));
				}
			}
		}
		request.setAttribute("param", param);
		
		JSP jspTools = new JSP(request,response);
		//执行查询
		BreezeContext bc = jspTools.call("cms.queryContent", "bc");
		BreezeContext cmsdata = bc.getContextByPath("data.cmsdata");
		BreezeContext cmsmetadata = bc.getContextByPath("data.cmsmetadata");
	%>
	<table class="gridtable" border="1px">
		<tr>
			<%
				BreezeContext dataDesc = ContextTools.getBreezeContext4Json(cmsmetadata.getContext("dataDesc").getData().toString());
				List<String> showTitle = new ArrayList<String>();
				for(String key : dataDesc.getMapSet()){
					if(!dataDesc.getContext(key).getContext("islist").getData().toString().equals("1")){
						continue;
					}
					if(dataDesc.getContext(key).getContext("type").getData().toString().equals("Pics")){
						continue;
					}
					String _title = dataDesc.getContext(key).getContext("title").toString();
					showTitle.add(key);
					%>
						<th>
							<%=_title %>
						</th>
					<%
				}
			%>
		</tr>
		<%for(int i=0;i<cmsdata.getArraySize();i++){ %>
			<tr>
				<%
					BreezeContext oneData = cmsdata.getContext(i);
					for(String key : showTitle){
						%>
							<td>
								<%
									if(oneData.getContext(key).isNull()||oneData.getContext(key).isEmpty()){
										out.println("");
									}else if(dataDesc.getContext(key).getContext("type").getData().toString().equals("DateTimePicker")){
										SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
										out.println(sdf.format(new Date(Long.parseLong(oneData.getContext(key).toString()))));
									}else if(dataDesc.getContext(key).getContext("type").getData().toString().equals("DatePicker")){
										SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
										out.println(sdf.format(new Date(Long.parseLong(oneData.getContext(key).toString()))));
									}else if(dataDesc.getContext(key).getContext("type").getData().toString().equals("Select")){
										BreezeContext valueRange = dataDesc.getContext(key).getContext("valueRange").getContext(0);
										for(String _key : valueRange.getMapSet()){
											if(valueRange.getContext(_key).toString().equals(oneData.getContext(key).toString())){
												out.println(_key);	
											}
										}
									}else{
										out.println(oneData.getContext(key));
									}
								%>
							</td>
						<%
					}
				%>
			</tr>
		<%}%>
	</table>
</body>
</html>