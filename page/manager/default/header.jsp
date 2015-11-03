<%@page import="java.util.Set"%>
<%@page import="com.breezefw.service.cms.CmsIniter"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breezefw.service.authority.AuthIniter"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breezefw.service.cms.module.CMSMetadata"%>
<%@ page import="com.breeze.support.cfg.Cfg" %>


<%
	BreezeContext user = (BreezeContext)session.getAttribute("manager");
	if(user==null)return;
	BreezeContext roleCtx = user.getContext("role");
	String authJson = AuthIniter.getActorJson(roleCtx);
	if ("".equals(authJson)){
		authJson = "null";
	}
	//设置logo的值
	Object logo = request.getAttribute("logourl");
	if (logo != null && !"--".equals(logo)){
		request.setAttribute("logo","<img src='"+request.getAttribute("B")+logo+"' style='width:52px;height:52px;'></img>");
	}else{
		request.setAttribute("logo","<img src='../assets/default/img/logo.png' alt='' style='width:52px;height:52px;' />");
 	}
	//设置用户头像
	BreezeContext bc = (BreezeContext)session.getAttribute("manager");
	BreezeContext userImgCtx = bc.getContext("img");
	String userImg = "page/manager/assets/default/img/defalutuser.jpg";//默认头像
	if (userImgCtx != null && !userImgCtx.isNull() && !"".equals(userImgCtx.toString())){
		userImg = userImgCtx.toString();
	}
	request.setAttribute("userImg",userImg);
	request.setAttribute("userName",bc.getContext("name").toString());
	
	
	String roleStr = null;
	if (roleCtx != null){
		roleStr = roleCtx.toString();
	}
	//处理设置的问题
	String settingUrl = null;
	if (roleStr != null){
		String stUrlCtxStr = (String)request.getAttribute("settingCfg");
		if (stUrlCtxStr != null){
			BreezeContext stUrlCtx = ContextTools.getBreezeContext4Json(stUrlCtxStr);
			BreezeContext settingUrlCtx = stUrlCtx.getContext(roleStr);
			if (settingUrlCtx != null){
				settingUrl = settingUrlCtx.toString();
			}else{
				settingUrlCtx = stUrlCtx.getContext("default");
				if(settingUrlCtx!=null){
					settingUrl = settingUrlCtx.toString();
				}
			}
		}
	}
	
	//处理用户信息问题
	String userProfileUrl = null;
	if (roleStr != null){
		String upUrlCtxStr = (String)request.getAttribute("userProfileCfg");
		if (upUrlCtxStr != null){
			BreezeContext upUrlCtx = ContextTools.getBreezeContext4Json(upUrlCtxStr);
			BreezeContext profileUrlCtx = upUrlCtx.getContext(roleStr);
			if (profileUrlCtx != null){
				userProfileUrl = profileUrlCtx.toString();
			}else{
				profileUrlCtx = upUrlCtx.getContext("default");
				if(profileUrlCtx!=null){
					userProfileUrl = profileUrlCtx.toString();
				}
			}
		}
	}


	
	//处理顶部的标题颜色	
	String topBarColor = (String)request.getAttribute("headBarColor");	
	if (topBarColor == null || "".equals(topBarColor) || "--".equals(topBarColor)){
		topBarColor = "";
	}else{
		topBarColor = "background:"+topBarColor;
	}
	request.setAttribute("topBarColor",topBarColor);
	
	//头部字体颜色
	String headerFontColor = (String)request.getAttribute("headerFontColor");
	if(headerFontColor == null || "".equals(headerFontColor) || "--".equals(headerFontColor)){
		request.setAttribute("headerFontColor", "");
	}else{
		request.setAttribute("headerFontColor", "color:"+headerFontColor);
	}
	
	//右上角字体颜色
	String headBarFontColor = (String)request.getAttribute("headBarFontColor");
	if(headBarFontColor == null || "".equals(headBarFontColor) || "--".equals(headBarFontColor)){
		request.setAttribute("headBarFontColor", "");
	}else{
		request.setAttribute("headBarFontColor", "color:"+headBarFontColor);
	}
	
	//右上角颜色
	String topBarMenuColor = (String)request.getAttribute("headBarMenuColor");
	if (topBarMenuColor == null || "".equals(topBarMenuColor) || "--".equals(topBarMenuColor)){
		topBarMenuColor = "";
	}else{
		topBarMenuColor = "background:"+topBarMenuColor;
	}
	request.setAttribute("topBarMenuColor",topBarMenuColor);
	
	//2014年8月15日 19:20:14 程明剑
	//获取style信息
	BreezeContext style = ContextMgr.global.getContextByPath(CmsIniter.CMSPARAMPRIFIX+"."+"style");
	String _style = style==null || style.isNull() ?"style1":style.getData().toString();
	
	//2014年8月12日 14:26:35 程明剑 处理模版信息
	//获取alias
	String alias = request.getParameter("alias");
	//定义模版信息
	String temp = null;
	//获取模版路径
	if(alias!=null&&!alias.equals("channel")){
		String path = CmsIniter.COMSPATHPRIFIX + "." + alias;
		BreezeContext aliasContext = ContextMgr.global.getContextByPath(path) ;
		if(aliasContext!=null){
			CMSMetadata cmsMd = (CMSMetadata)aliasContext.getData();
			if(cmsMd!=null){
				BreezeContext cmsContext = cmsMd.getOtherChild();
				//获取所有该alias的模版信息
				if(cmsContext!=null){
					BreezeContext tmp = cmsContext.getContextByPath("cmsview");
					Set<String> set =  tmp.getMapSet();
					for(String name : set){
						//将json转换成breezecontext
						BreezeContext tmpparam = tmp.getContext(name).getContext("tmpparam");
						try{
							if(tmpparam!=null) tmpparam = ContextTools.getBreezeContext4Json(tmp.getContext(name).getContext("tmpparam").getData().toString());
							tmp.getContext(name).setContext("tmpparam", tmpparam);
						}catch(Exception e){
						}
					}
					temp = ContextTools.getJsonString(tmp, null);
				}
			}
		}
	}
%>
<script type="text/javascript">
	var $style = '<%=_style%>';
	//罗哥，权限的代码，放在appClass.js里面的430行，请测试		
	var authorityData = <%=authJson%>;
	//2014年8月13日 11:01:06 程明剑 模版信息
	var templateData = <%=temp%>
</script>

<nav class="navbar navbar-inverse navbar-fixed-top " style="padding-left:10px;padding-right:10px;${topBarColor}">
   <a data-original-title="Show/Hide Menu" data-placement="bottom" data-tooltip="tooltip" class="accordion-toggle btn btn-primary btn-sm visible-xs" data-toggle="collapse" href="#menu" id="menu-toggle">
       <i class="icon-align-justify"></i>
   </a>
   <!-- LOGO SECTION -->
   <header class="navbar-header">
       <a href="CMSBaseMgr.jsp" class="navbar-brand" style="${headerFontColor}">
       		${logo } ${headerTitle }
       </a>
   </header>
		
   	<div class="navbar-right" style="width:150px; min-height:50px; max-height:60px; ${topBarMenuColor} ">
	   <!-- END LOGO SECTION -->
	   <ul class="nav navbar-top-links nav-wg" style="margin:10px 0 0 0;">
	       <!--ADMIN SETTINGS SECTIONS -->

	       <li class="dropdown">
	           <a class="dropdown-toggle" data-toggle="dropdown" href="#" style="${topBarMenuColor};${headBarFontColor}">
	           	 <img alt="管理员" src="${B}page/manager/assets/default/img/defalutuser.jpg" class="img-circle" style="width:32px; height:32px;">
	            &nbsp;&nbsp;管理员 &nbsp;
	            <i class="icon-chevron-down "></i>
	           </a>

	           <ul class="dropdown-menu dropdown-user dropdown-menu-wg">
	           	  <%if (userProfileUrl != null){%>
	              <li>
	               	<%-- <a href="${B}<%=userProfileUrl%>"><i class="icon-user"></i> 用户信息 </a> --%>
	               	<a href="javascript:void(0)" onclick="alert('comming soon');"><i class="icon-user"></i> 用户信息 </a>
	              </li>
	              <%}%>
	              <%if (settingUrl != null){%>
	              <li>
	              		<%-- <a href="${B}<%=settingUrl%>"><i class="icon-gear"></i> 设置 </a> --%>
	               	<a href="${B}<%=settingUrl%>"><i class="icon-gear"></i> 设置 </a>
	              </li>
	              <%}%>
	               <li class="divider"></li>
	              <li>
	               	<a href="../../adminUserPage/logout.jsp?goto=login"><i class="icon-signout"></i> 注销 </a>
	              </li>
	           </ul>

	       </li>
	       <!--END ADMIN SETTINGS -->
	    </ul>
	    </div>

</nav>
<div id="static" ></div>

<style type="text/css">

.nav-wg .open > a, .nav-wg .open > a:hover, .nav-wg .open > a:focus {
    background-color: #444;
    border-color: #428bca;
}
.nav-wg li a {
    background-color: #444;
    padding: 2px 5px;
}
.nav-wg > li > a:hover,.nav-wg >li> a:focus {
    background-color: #444;
    padding: 2px 5px;
}


.dropdown-menu-wg li a{
	 background-color: #fff;

}
.dropdown-menu-wg li a:hover,.dropdown-menu li a:focus{
	 background-color: #f5f5f5;
}


</style>