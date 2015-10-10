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
	String tmpPath=null;
	//如果alias不存在则跳至后台首页
	if(alias==null||alias.equals("")){
	    request.setAttribute("LeftMenuClearCach","\n,clearCach:true");
		tmpPath = "/page/manager/default/CMSBaseMgr.jsp";
	}else{
		//如果type不存在 按照缺省值 CMSMgrList.jsp
		if(type==null||type.equals("")){
			type = "list";
		}
		//拼接路径
		String path = CmsIniter.COMSPATHPRIFIX + "."+alias;
		BreezeContext tmpObjCtx = null ;
		try{
			if (alias.indexOf("cmsconfig")>=0 || "leftmenu".equals(alias) || "cmsviewtemplate".equals(alias)){
				//手动设置左边菜单栏目
				String B = this.getServletContext().getContextPath()+'/';
				String leftMenuData ="{";
				leftMenuData += ("'系统参数':{url:'page/manager/CMSMgr.jsp?alias=cmsconfig&norole=true'},");
				leftMenuData += "\"菜单配置\":{url:'page/manager/CMSMgr.jsp?alias=leftmenu&type=single&norole=true'},";
				leftMenuData += "\"视图模板\":{url:'page/manager/CMSMgr.jsp?alias=cmsviewtemplate&norole=true'}";
				leftMenuData +="}";
				request.setAttribute("LeftMenuTreeDate","\n,treeDate:"+leftMenuData);
	    	}
			if (true){
				//先根据别名得到CMSMetadate
				BreezeContext aliasContext = ContextMgr.global.getContextByPath(path) ;
				if (aliasContext != null && !aliasContext.isNull()){
					CMSMetadata cmsMd = (CMSMetadata)aliasContext.getData();
					BreezeContext cmsContext = cmsMd.getOtherChild();
					if (cmsContext!=null){
						tmpObjCtx = cmsContext.getContextByPath("cmsview." + type);
					}					
				}
	
				if (tmpObjCtx != null && !tmpObjCtx.isNull()){	
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
				}else{	
					tmpPath = "/page/manager/default/CMSBaseMgr.jsp";
				}
			}
		}catch(Exception e){	
			tmpPath = "/page/manager/default/CMSBaseMgr.jsp";
		}
	}
	//将模板信息压入到系统中
	if(request.getAttribute("Template")!=null&&request.getAttribute("Template").toString().equals("ace")){
		tmpPath = "/page/manager/default/CMSAceMgr.jsp";
	}
	request.setAttribute("PB","<base href='"+this.getServletContext().getContextPath()+tmpPath+"'>");
	//+从系统配置中获取对应的skin参数变量
	//+跳转到对应页面，如果当前访问的是这个页面
	request.getRequestDispatcher(tmpPath).forward(request,response);
	return;
%>