<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
		<jsp:include page="../page/allhead.jsp" />
		<% request.setAttribute( "S",request.getAttribute( "B")+ "breeze/framework/jsp/BreezeFW.jsp"); %>
			<html>

			<head>
				<meta charset="utf-8" />
			</head>

			<body>
				<div>
					<div class="page-content clearfix">
						<div class="sidebar-shortcuts-large FWApp" id="htmledit" reserve="true">
							<!--@editJs@
								{
								
								}
							-->
							<div id="leftCtr" class="textctrclose" style="width: 240px;text-align: right;height: 0px;">
							 <a href="#" onclick="FireEvent('htmledit.hideCtr');">&lt;&lt;</a>
							</div>
							<div id="leftCtr" class="textctropen" style="width: 240px;text-align: left;height: 20px;display:none">
							 <a href="#" onclick="FireEvent('htmledit.showCtr')">&gt;&gt;</a>
							</div>
							
							<div class="textctrclose" id="leftMenu">
								
							</div>

							<div id="mainedit" style="width:1024px;float:left">
							这里是内容哈
							</div>
						</div>
					</div>
				</div>
				<!--/.main-container-->

				<!--resource begin-->
				<div style="display:none">
					<div class="FWRES" APPID="htmledit"  RESID="tipsContent">
						<!--$for(var i=0;i<data.length;i++){-->
							${_}{data[i]}&nbsp;
						<!--$}-->
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="textEdit">
						<div id="infoForm" class="form-horizontal clearfix">
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveCSS();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确认
							</a>
						</div>
						<div id="tipsContain" style=";border:1px solid #F00;background:#FFF; color:000#;position:fixed;left:290px;top:5px;width:60%;height:auto !important;z-index:100">
							标签内容：按照提示可以选择，按tab键补全<br/>
							<div id="tips"></div>
						</div>
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="cfgEdit">
						<p>以下是所有配置信息</p>
						<div style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;" id="cfgForm">
							<table>
								<!--$for(var n in data){-->
								<tr>
									<td width="40%" align="center"><input name="name" value="${_}{n}"/>:</td>
									<td width="60%" align="left">
										<input name="value" value="${_}{data[n]}"/>
										<a href="#" onclick="FireEvent.delCfg('${_}{n}')">删除</a>
									</td>
								</tr>
								<!--$}-->
							</table>
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveCfg();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确定
							</a>
							
							<a href="javascript:void(0)" onclick="FireEvent.addCfg();" class="btn btn-warning">
								<i class="icon-ok bigger-110"></i>
								添加
							</a>
						</div>
					</div>
				</div>
				<!-- footer -->


				<!-- //脚本 -->
				<script src="../breeze/lib/js/jquery.js"></script>
				<script src="../breeze/lib/js/sea.js"></script>

				
				<!--codemirror-->
				<script src="${B}breeze/lib/js/codemirror/codemirror.js?v=1.3"></script>
				<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/codemirror.css">
				<script src="${B}breeze/lib/js/codemirror/javascript.js?v=1.3"></script>

				<script>
					seajs.config({
						base: "${B}"
					});
					seajs.use(['manager_auxiliary/service/editJs'], function(a) {
						a.go("${S}");
						window.FW = a;
					});
				</script>

			</body>

			</html>