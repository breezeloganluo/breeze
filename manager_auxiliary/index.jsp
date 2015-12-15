<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="com.breezefw.service.cms.CmsIniter"%>
<%@page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="java.util.regex.*"%>
<%@ page import="java.util.*"%>
<%
	BreezeContext password4tools = ContextMgr.global.getContextByPath(CmsIniter.CMSPARAMPRIFIX);
	String rightkey = "1qaz@WSX";
	
	if(password4tools != null && !password4tools.isNull() && password4tools.getContext("password4tools")!=null && !password4tools.getContext("password4tools").isNull()){
		if(!password4tools.getContext("password4tools").getData().toString().equals("--")){
			rightkey = password4tools.getContext("password4tools").getData().toString();	
		}
	}

	boolean needLogin = true;
	if (session.getAttribute("login") != null) {
		needLogin = false;
	} else {
		String password = request.getParameter("password");
		if (rightkey.equals(password)) {
			session.setAttribute("login", true);
			needLogin = false;
		}else{
			session.removeAttribute("login");
		}
	}
%>
<%  if (needLogin){ %>
	<form method="post">
		请输入密码<input name="password" type="password"><br /> <input
			type="submit" value="ok">
	</form>
<%
      return;
    }
    //如果有url则直接返回
    Object backurl = session.getAttribute("backurl");
    if (backurl != null){
    	response.sendRedirect(backurl.toString());
    	session.removeAttribute("backurl");
    	return;
    }

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="./img/icon/tools.png" >
<title>辅助工具列表</title>
  <script>
              fileGlobleSetting = [
                {
                      name:"gadget编辑器",
                      exp:".js",
                      icon:"./img/icon/editgadget.png",
                      type:"file",
                      initDir: "/",
                      clickSetting: {
                          "link": "点击自身的事件",
                          'newone':"./gadgetCreator.jsp?fileUrl=[fileUrl]",
                          "编辑": "./gadgetCreator.jsp?fileUrl=[fileUrl]"
                      }
                  
                },                
                {
                    name:"页面编辑器",
                    exp:".jsp",
                    icon:"./img/icon/editpage.png",
                    type:"file",
                    initDir: "/",
                    clickSetting: {
                        "link": "点击自身的事件",
                        'newone':"./htmlCreator.jsp?fileUrl=[fileUrl]",
                        "编辑": "./htmlCreator.jsp?fileUrl=[fileUrl]"
                    }
                },
                {
                	name:"需求管理",
                    icon:"./img/icon/srsview.png",
                    exp:".jsp",
                    initDir: "/design/srs/",
                    type:"file",
                    clickSetting: {
                        "link": "点击自身的事件",
                        'newone':"./SRSCreator.jsp?fileUrl=[fileUrl]",
                        "编辑": "./SRSCreator.jsp?fileUrl=[fileUrl]"
                    }
                },
                {
                    name:"顺序管理",
                    icon:"./img/icon/sequence.png",
                    exp:".js",
                    initDir: "design/hld/sequence/",
                    type:"file",
                    clickSetting: {
                        "link": "点击自身的事件",
                        'newone':"./sequenceCreator.jsp?fileUrl=[fileUrl]",
                        "编辑": "./sequenceCreator.jsp?fileUrl=[fileUrl]"
                    }
                },
                {
                    name:"flow编辑器",
                    icon:"./img/icon/createflow.png",
                    toolsUrl:"./createflow.jsp"
                },
                {
                    name:"service调试器",
                    icon:"./img/icon/debugservice.png",
                    toolsUrl:"./debugService.jsp"
                },
                {
                    name:"service调编辑试器",
                    icon:"./img/icon/editservice.png",
                    toolsUrl:"./editservice.jsp"
                },
                {
                      name:"Service测试",
                      exp:".js",
                      initDir: "/",
                      icon:"./img/icon/editgadget.png",
                      type:"selfedit",
                      gadget:"editServiceTest"
                  
                },
                {
                    name:"日志查看",
                    icon:"./img/icon/logsview.png",
                    toolsUrl:"logsview.jsp"
                },
                {
                    name:"查阅上下文",
                    icon:"./img/icon/viewcontext.png",
                    toolsUrl:"viewContext.jsp"
                },
                {
                    name:"创建数据库",
                    icon:"./img/icon/createdb.png",
                    toolsUrl:"./createdb.jsp"
                },
                { 
                    name:"导出数据",
                    icon:"./img/icon/exportmodule.png",
                    toolsUrl:"exportModule.jsp"
                },
                {
                    name:"导入数据",
                    icon:"./img/icon/importmodule.png",
                    toolsUrl:"importModule.jsp"
                }
              ]
  </script>
</head>
<jsp:include page="./FileViewBase.jsp" />
</html>