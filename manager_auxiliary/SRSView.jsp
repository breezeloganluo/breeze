<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="../page/allhead.jsp"/>
<%
request.setAttribute("S",request.getAttribute("B")+"breeze/framework/jsp/BreezeFW.jsp");
%>
		<html>

		<head>
			<meta charset="utf-8" />
			<style>
				a {
					text-decoration: none;
				}
			</style>
		</head>

		<body>
			<table width="100%" border="1">
				<tr>
					<td width="40%" valign="top">
						<div id="maintree" class="FWApp">
							<!--@treeFileSelect@{
								viewid:"view_treemain",
								initDir:"/srs",
								listApp:"mainlist"
							}-->

						</div>
					</td>
					<td width="60%" valign="top">
						<div >
							[<span id="currDir"></span>]&nbsp;<a href="#" onclick="FireEvent('maintree.openAddSubDir')">添加子节点</a>|<a href="#" onclick="FireEvent('mainlist.openAddSRS')">添加新原型</a>
							<div id="mainlist" class="FWApp">
							<!--@SRSCreator@{
								listViewId:"view_fileList"
							}-->

						</div>
						</div>
					</td>
				</tr>
			</table>

			<script src="${B}breeze/lib/js/jquery.js"></script>
			<script src="${B}breeze/lib/js/sea.js"></script>
			<script src="${B}config/config.jsp"></script>
			<script>
				seajs.config({
					base: "${B}"
				});
				seajs.use(['manager_auxiliary/service/treeFileSelect','manager_auxiliary/service/SRSCreator'], function(a) {
					a.go("${S}");
					window.FW = a;
				});
			</script>
			<div style="display:none">
				<div class="FWRES" APPID="maintree" RESID="view_treemain">
					<!--$for (var i = 0 ;i<data.length;i++){-->

					<span><a href="#" onclick="FireEvent.clickSub('${_}{data.dir}/${_}{data[i]}',this)">+</a></span><span><a href="#" onclick="FireEvent.clickDir('${_}{data.dir}/${_}{data[i]}')">${_}{p:("changeDisplayName",data[i])}</a></span>
					<br/>
					<div style="display: none;" id="container_${_}{p:('changeLetter',[data.dir,'/',data[i]])}">
						<div style="margin-left: 30px;" id="${_}{p:('changeLetter',[data.dir,'/',data[i]])}"></div>
					</div>
					<!--$}-->
				</div>
				<div class="FWRES" APPID="maintree" RESID="mask_openSubDir">
					请输入子节点的路径名称<br />
					<input id="mask_openSubDir" type="text"></input><br/>
					<input type="button" value="确定" onclick="FireEvent.addSubDir('mask_openSubDir')"></input><input type="button" value="取消" onclick="FW.unblockUI();"/>
				</div>
				
				<div class="FWRES" APPID="mainlist" RESID="view_fileList">
					<!--$for (var i = 0 ;i<data.length;i++){-->
					<div><a href="${B}${_}{data.dir}/${_}{data[i]}" target="_blank">${_}{p:("changeDisplayName",data[i])}</a> &nbsp;&nbsp;<a href="#" onclick="FireEvent.editSRS('${_}{data[i]}')">编辑</a></div>
					<!--$}-->
				</div>
				<div class="FWRES" APPID="mainlist" RESID="mask_openSRS">
					请输入原型名称名称<br />
					<input id="mask_openSRS" type="text"></input><br/>
					<input type="button" value="确定" onclick="FireEvent.addSRS('mask_openSRS')"></input><input type="button" value="取消" onclick="FW.unblockUI();"/>
				</div>
			</div>
		</body>

		</html>