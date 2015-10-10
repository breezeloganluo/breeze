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
<div id="leftMenu" class="sidebar                  responsive FWApp" style="display:none">
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
		<div id="menu">
			<script type="text/javascript">
				try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
			</script>
			<ul class="nav nav-list">
				<!--$for(var n in data){-->
					<!--$if(!data[n].url||data[n].url.indexOf("/")>0){-->
						<li style="background-color:${leftMenuColor }">
					<!--$}else{-->
						<li alias="${_}{data[n].url}" authority2="queryNode" style="background-color:${leftMenuColor }">
						<!--$data[n].url="page/manager/CMSMgr.jsp?alias="+data[n].url+"&type=list";-->
					<!--$}-->
					<!--$if(data[n].type=="item"){-->
							<a href="javascript:void(0);" onClick="FireEvent.go2selector('${_}{data[n].url}');"  style="${fontColor}">
					           	<span class="menu-text">${_}{data[n].name}</span>
					        </a>
							<b class="arrow"></b>
				        </li>
					<!--$}else if(data[n].type!="item"){-->
						<!--$var _id=data[n].cid.replace(" ","");-->
							<a href="#" class="dropdown-toggle" style="${fontColor}">
					            <i class="icon-table"></i> ${_}{data[n].name}
					            <span class="pull-right">
					                <i class="icon-angle-left"></i>
					            </span>
					            <b class="arrow fa fa-angle-down"></b>
					        </a>
					        <ul class="submenu" id="${_}{_id}">
					        	<!--$var children= data[n].additionalParameters.children;-->
					        	<!--$for(var j in children){-->
					        		<!--$if(!children[j].url||children[j].url.indexOf("/")>=0){-->
					        		<li>
					        		<!--$}else{-->
					        		<li alias="${_}{children[j].url}" authority2="queryNode">
					        		<!--$children[j].url="page/manager/CMSMgr.jsp?alias="+children[j].url+"&type=list";-->
					        		<!--$}-->
					        		<a href="javascript:void(0);" onClick="FireEvent.go2selector('${_}{children[j].url}');" style="${fontColor}"><i class="icon-angle-right"></i> 
					        			<i class="menu-icon fa fa-caret-right"></i>${_}{children[j].name}
					        		</a>
					        		<b class="arrow"></b>
					        		</li>
					        	<!--$}-->
					        </ul>
					        <b class="arrow"></b>
				        </li>
					<!--$}-->
				<!--$}-->
			</ul>
			<!-- #section:basics/sidebar.layout.minimize -->
			<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
				<i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
			</div>

			<!-- /section:basics/sidebar.layout.minimize -->
			<script type="text/javascript">
				try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
			</script>
		</div>
	<%} %>
</div>