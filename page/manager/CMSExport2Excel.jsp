<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.breeze.framwork.netserver.FunctionInvokePoint"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="org.apache.poi.hssf.usermodel.HSSFCell"%>
<%@page import="org.apache.poi.hssf.usermodel.HSSFCellStyle"%>
<%@page import="org.apache.poi.hssf.usermodel.HSSFRow"%>
<%@page import="org.apache.poi.hssf.usermodel.HSSFSheet"%>
<%@page import="org.apache.poi.hssf.usermodel.HSSFWorkbook"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.util.Set"%>
<%@ page language="java" contentType="applicationnd.ms-excel; text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8" />
</head>
<%
	response.setContentType("application/ms-excel;charset=utf-8");
	request.setCharacterEncoding("UTF-8");
	response.setCharacterEncoding("UTF-8");
	if(request.getParameter("data")==null||request.getParameter("data").equals("")){
		out.println("没有任何数据传入!");
		return;
	}
	//处理中文无法编码问题
	String ___data = new String(request.getParameter("data").getBytes("iso-8859-1"),"UTF-8");
	
	BreezeContext bc = ContextTools.getBreezeContext4Json(___data);
	String _package = bc.getContext("package").toString();
	String service = bc.getContext("service").toString();
	System.out.println(bc.getContext("param").toString());
	String name = bc.getContextByPath("param.alias").toString();
	BreezeContext data = FunctionInvokePoint.getInc().breezeInvokeUsedCtxAsParam(_package, service, bc.getContext("param"));
	if(data.getContext("code")==null||!data.getContext("code").toString().equals("0")){
		out.println("查询数据失败!");
		return;
	}
	
	BreezeContext _data = data.getContext("data");
	BreezeContext _cmsdata = _data.getContext("cmsdata");
	BreezeContext _cmsmetadata = _data.getContext("cmsmetadata");
	
	//设置表头
	if(_cmsmetadata.getContext("dataDesc")==null){
		out.println("原数据属性字段为空!");
		return;
	}
	
	BreezeContext dataDesc = ContextTools.getBreezeContext4Json(_cmsmetadata.getContext("dataDesc").getData().toString());
	Set<String> set = dataDesc.getMapSet();
	//遍历表头
	if(set.size()>0){
		ArrayList<String> arry = new ArrayList<String>();
		//封装所有是列表的数据
		for(String str : set){
			BreezeContext _bc = dataDesc.getContext(str);
			if(_bc.getContext("islist").toString().equals("1")&&!_bc.getContext("type").toString().equals("List")){
				arry.add(str);
			}
		}
		if(arry.size()>0){
			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet sheet = wb.createSheet(name+new Date());
			HSSFRow row = sheet.createRow(0);
			
			HSSFCell cell = null;
			int ii = 0;
			for(String str : arry){
				sheet.setColumnWidth(ii,8000);
				cell = row.createCell(ii++);
				cell.setCellValue(str);
			}
			//内容设置
			if(_cmsdata.getArraySize()>0){
				for(int i=0;i<_cmsdata.getArraySize();i++){
					row = sheet.createRow(i+1);
					int j =0;
					for(String _str : arry){
						//获取type
						String type = dataDesc.getContext(_str).getContext("type").toString();
						//数据
						BreezeContext __data = _cmsdata.getContext(i).getContext(_str);
						//多选格式
						if(type.equals("CheckBox")){
							String str = "";
							//获取valueRange
							BreezeContext valueRange = dataDesc.getContext(_str).getContext("valueRange");
							for(int val=0;val<valueRange.getArraySize();val++){
								Set<String> n = valueRange.getContext(val).getMapSet();
								for(String na : n){
									String _value = valueRange.getContext(val).getContext(na).toString();
									String[] strs = __data.toString().replace("[", "").replace("]", "").split(",");
									for(int _j=0;_j<strs.length;_j++){
										if(_value.equals(strs[_j])){
											str+=na;
											if(_j!=strs.length-1) str+=",";
										}
									}
								}
							}
							row.createCell( j++).setCellValue(str);
						}else
						//时间日期
						if(type.equals("DateTimePicker")){
							long date = Long.parseLong(_cmsdata.getContext(i).getContext(_str).toString());
							SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
							row.createCell( j++).setCellValue(sdf.format(new Date(date)));
						}else{
							row.createCell( j++).setCellValue(_cmsdata.getContext(i).getContext(_str).toString());
						}
					}
				}
			}
			try
			{
				response.setHeader("Content-Disposition","attachment;filename="+name+"-"+new Date().toLocaleString().replace(" ", "-")+".xls");
				ServletOutputStream fos = response.getOutputStream();
				wb.write(fos);
				fos.flush();
				fos.close();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
%>