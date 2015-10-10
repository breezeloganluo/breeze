<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.breezefw.service.cms.CmsIniter"%>
<%@ page import="com.breeze.framwork.databus.BreezeContext"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breezefw.service.cms.module.CMSMetadata"%>
<%@ page import="com.breeze.framwork.databus.ContextTools"%>
<%
//从参数中获取alias和tmptype
String alias = request.getParameter("alias");
String type = request.getParameter("type");
//+根据alias把对应模板路径获取到，注意，如果没有就用alias拼一个默认的出来
//拼接路径
String path = CmsIniter.COMSPATHPRIFIX + "."+alias;

BreezeContext tmpObjCtx = null ;

//先根据别名得到CMSMetadate
BreezeContext aliasContext = ContextMgr.global.getContextByPath(path) ;
if (aliasContext != null && !aliasContext.isNull()){
	CMSMetadata cmsMd = (CMSMetadata)aliasContext.getData();
	BreezeContext cmsContext = cmsMd.getOtherChild();
	tmpObjCtx = cmsContext.getContextByPath("cmsview." + type);
}

String tmpPath=null;

//if (对象存在){
if (tmpObjCtx != null && !tmpObjCtx.isNull()){
////获取模板位置
	tmpPath = tmpObjCtx.getContext("tmpname").getData().toString();
	BreezeContext orgParamCtx = tmpObjCtx.getContext("tmpparam");
	if (orgParamCtx!=null && !orgParamCtx.isNull()){
		String paramStr = orgParamCtx.toString();
		BreezeContext paramCtx = ContextTools.getBreezeContext4Json(paramStr);
		if (paramCtx!=null && !paramCtx.isNull()){
			for (String key:paramCtx.getMapSet()){
				request.setAttribute(key,paramCtx.getContext(key).getData());
			}
		}
	}
//}else{
}else{
////使用默认模板
    tmpPath = "/page/"+alias+"/"+type+".jsp";
//}
}
//将模板信息压入到系统中
request.setAttribute("PB","<base href='"+this.getServletContext().getContextPath()+tmpPath+"'>");
//+从系统配置中获取对应的skin参数变量
//+跳转到对应页面，如果当前访问的是这个页面
request.getRequestDispatcher(tmpPath).forward(request,response);
%>