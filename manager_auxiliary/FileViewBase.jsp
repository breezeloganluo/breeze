<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<% /* * 这是一个基本的文件处理类，外部文件通过include方式转入到这个页面中。 *这个页面只包含body部分，其他是外部的文件包含。外部文件必须设置一个全局的js变量： * fileGlobleSetting={ initDir:页面的初始化文件目录 clickSetting:{ default: "点击自身的事件", "编辑": "url" } *} */ %>
		<jsp:include page="../page/allhead.jsp" />
<%
request.setAttribute("S",request.getAttribute("B")+"breeze/framework/jsp/BreezeFW.jsp");
%>
		<body>
        <!--@config@{
			"./":"xxxx"
		}        	
        -->
			<table width="100%" border="1">
				<tr>
					<td width="40%" valign="top">
						<div id="maintree" class="FWApp">
							<!--@treeFileSelect@{
								viewid:"view_treemain",
								listApp:"mainlist",
								operType:"dir"
							}-->

						</div>
					</td>
					<td width="60%" valign="top">
						<div>
							[<span id="currDir"></span>]&nbsp;<a href="#" onclick="FireEvent('maintree.openAddSubDir')">添加子节点</a>|
							<a href="#" onclick="FireEvent('mainlist.openAddFile')">添加新文件</a>|
							<a href="#" onclick="FireEvent('mainlist.filePaste')">粘贴</a>
							<div id="mainlist" class="FWApp">
								<!--@treeFileSelect@{
								listViewId:"view_fileList",
								operType:"file"
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
				seajs.use(['manager_auxiliary/service/treeFileSelect'], function(a) {
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
					请输入子节点的路径名称
					<br />
					<input id="mask_openSubDir" type="text"></input>
					<br/>
					<input type="button" value="确定" onclick="FireEvent.addSubDir('mask_openSubDir')"></input>
					<input type="button" value="取消" onclick="FW.unblockUI();" />
				</div>

				<div class="FWRES" APPID="mainlist" RESID="view_fileList">
					<!--$for (var i = 0 ;i<data.length;i++){-->
					<div><a href="${B}${_}{data.dir}/${_}{data[i]}" target="_blank">${_}{p:("changeDisplayName",data[i])}</a> 
						<!--$for(var n in fileGlobleSetting.clickSetting){-->
							<!--$if(n == 'link' || n == 'newone'){continue;}-->
							&nbsp;&nbsp;<a href="#" onclick="FireEvent.editSRS('${_}{data[i]}','${_}{n}')">${_}{n}</a>
						<!--$}-->
						&nbsp;<a href="#" onclick="FireEvent.deleteFile('${_}{data[i]}');">删除</a>
						&nbsp;<a href="#" onclick="FireEvent.openRename('${_}{data[i]}');">重命名</a>
						&nbsp;<a href="#" onclick="FireEvent.fileCopyCut('${_}{data[i]}','copy');">复制</a>
						&nbsp;<a href="#" onclick="FireEvent.fileCopyCut('${_}{data[i]}','cut');">剪切</a>
					</div>
					<!--$}-->
				</div>
				<div class="FWRES" APPID="mainlist" RESID="mask_openFile">
					请输入原型名称名称
					<br />
					<input id="mask_fileSRS" type="text"></input>
					<br/>
					<input type="button" value="确定" onclick="FireEvent.addFile('mask_fileSRS')"></input>
					<input type="button" value="取消" onclick="FW.unblockUI();" />
				</div>
				
				<div class="FWRES" APPID="mainlist" RESID="mask_rnFile">
					请重新输入名字
					<br />
					<input id="mask_newName" type="text"></input>
					<input id="mask_oldName" type="hidden" value="${_}{data}"></input>
					<br/>
					<input type="button" value="确定" onclick="FireEvent.reName()"></input>
					<input type="button" value="取消" onclick="FW.unblockUI();" />
				</div>
				
			</div>
		</body>