<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	Object l = request.getAttribute("initMenuStatus");
	String arr = "";
	if (!"".equals(l.toString())){
		arr = "icon-double-angle-right";
	}
	Object leftMenuFontColor = request.getAttribute("leftMenuFontColor");
	if(leftMenuFontColor!=null&&!"--".equals(leftMenuFontColor)){
		request.setAttribute("fontColor", "color:"+leftMenuFontColor+";");
	}
	
	Object leftMenuColor = request.getAttribute("leftMenuColor");
	Object customizedLeftMenu = request.getAttribute("customizedLeftMenu");
%>
<div id="leftMenu" class="FWApp" style="display:none">
	<!--@CMSTreeLeftMenu@
		{
		  'none':''
		  ${LeftMenuAlias}
		  ${LeftMenuClearCach}
		  ${LeftMenuTreeDate}
		}
	-->
	<%if(customizedLeftMenu!=null && !customizedLeftMenu.toString().equals("--")){ %>
		
	<%}else{ %>
		<ul id="menu" class="collapse">
			<!--$for(var n in data){-->
				<!--$if(!data[n].url||data[n].url.indexOf("/")>0){-->
					<li style="background-color:${leftMenuColor }">
				<!--$}else{-->
					<li class="panel" alias="${_}{data[n].url}" authority2="queryNode" style="background-color:${leftMenuColor }">
					<!--$data[n].url="page/manager/CMSMgr.jsp?alias="+data[n].url+"&type=list";-->
				<!--$}-->
				<!--$if(data[n].type=="item"){-->
						<a href="javascript:void(0);" onClick="FireEvent.go2selector('${_}{data[n].url}');"  style="${fontColor}">
				            <i class="icon-table"></i> ${_}{data[n].name}
				        </a>
			        </li>
				<!--$}else if(data[n].type!="item"){-->
					<!--$var _id=data[n].cid.replace(" ","");-->
						<a href="#" data-parent="#menu" data-toggle="collapse" class="accordion-toggle" data-target="#${_}{_id}" style="${fontColor}">
				            <i class="icon-table"></i> ${_}{data[n].name}
				            <span class="pull-right">
				                <i class="icon-angle-left"></i>
				            </span>
				            <!--$var len=0;for(var j in data[n].additionalParameters.children){len++};-->
				            <span class="label label-info">${_}{len}</span>
				        </a>
				        <ul class="collapse" id="${_}{_id}">
				        	<!--$var children= data[n].additionalParameters.children;-->
				        	<!--$for(var j in children){-->
				        		<!--$if(!children[j].url||children[j].url.indexOf("/")>=0){-->
				        		<li>
				        		<!--$}else{-->
				        		<li alias="${_}{children[j].url}" authority2="queryNode">
				        		<!--$children[j].url="page/manager/CMSMgr.jsp?alias="+children[j].url+"&type=list";-->
				        		<!--$}-->
				        		<a href="javascript:void(0);" onClick="FireEvent.go2selector('${_}{children[j].url}');" style="${fontColor}"><i class="icon-angle-right"></i> ${_}{children[j].name} </a></li>
				        	<!--$}-->
				        </ul>
			        </li>
				<!--$}-->
			<!--$}-->
		</ul>
	<%} %>
</div>
<style>
	#menu:after, .mini-sidebar #menu:after {
		-webkit-box-shadow:0px 0px 0px 0px rgba(0,0,0,0.6);
		box-shadow:0px 0px 0px 0px rgba(0,0,0,0.6);
	}
	#menu:after, .mini-sidebar #menu:after {
		-webkit-box-shadow:0px 0px 0px 0px rgba(0,0,0,0.6);
		box-shadow:0px 0px 0px 0px rgba(0,0,0,0.6);
	}
</style>