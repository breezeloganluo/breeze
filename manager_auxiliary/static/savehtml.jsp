<%@page import="java.nio.charset.Charset"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breezefw.CMSMetadata"%>
<%@ page import="com.breeze.support.cfg.Cfg" %>
<%@page import="com.breezefw.CmsIniter"%>
<%@page import="java.util.Set"%>
<%@page import="java.io.*" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>静态生成页面</title>
</head>
<%
	request.setCharacterEncoding("UTF-8");
	String $html = request.getParameter("param");
	String $alias = request.getParameter("alias");
	BreezeContext data = ContextTools.getBreezeContext4Json(request.getParameter("data"));
	String url = null;
	String path = CmsIniter.COMSPATHPRIFIX +"."+$alias;
	BreezeContext aliasContext = ContextMgr.global.getContextByPath(path) ;
	try{
		
		//获取文件信息
		if(aliasContext!=null){
			CMSMetadata cmsMd = (CMSMetadata)aliasContext.getData();
			if(cmsMd!=null){
				BreezeContext cmsContext = cmsMd.getOtherChild();
				//获取所有该alias的模版信息
				if(cmsContext!=null){
					BreezeContext tmp = cmsContext.getContextByPath("cmsview");
					Set<String> set =  tmp.getMapSet();
					for(String name : set){
						url =  Cfg.getCfg().getRootDir() +"html/" + $alias;
						//创建文件夹
						File file = new File(url);
						file.mkdirs();
						//将json转换成breezecontext
						if(tmp.getContext(name).getContext("tmpparam")==null)continue;
						BreezeContext tmpparam = tmp.getContext(name).getContext("tmpparam");
						if(tmpparam.getContext("isStatic")!=null&&tmpparam.getContext("isStatic").getData().toString().equals("true")){
							String type = tmp.getContext(name).getContext("keyname").getData().toString();
							url+="/"+type;
							//关键值========================
							Set<String> _set = tmpparam.getMapSet();
							for(String _name : _set){
								if(_name.equals("isStatic")) continue;
								url+="-"+_name+"_"+data.getContext(_name).getData().toString();
							}
							url+=".html";
						}
						//设置文件编码
						File file1 = new File(url);
						FileOutputStream fop = new FileOutputStream(file1);
						fop.write($html.toString().getBytes("utf-8"));
						fop.close();					   	
						System.out.println("保存成功 路径为:"+url);
						out.print("success");
					}
				}
			}
		}
	}catch(Exception e){
		e.printStackTrace();
	}
	
	
%>
</html>
