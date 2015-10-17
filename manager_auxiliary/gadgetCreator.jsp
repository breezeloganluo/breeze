<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="com.breeze.support.cfg.Cfg"%>
<%@include file="./hHead.jsp"%>
<%
String baseUrl = this.getServletContext().getContextPath();
String configUrlPrefix = Cfg.getCfg().getString("siteprefix");
if (configUrlPrefix !=null && !configUrlPrefix.equals("--")){
	baseUrl = configUrlPrefix;
}
if ("/".equals(baseUrl)){
	baseUrl = "";
}
request.setAttribute("B",baseUrl+'/');
request.setAttribute("_","$");
%>

<!doctype html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/xml; charset=UTF-8">
<title></title>
	<!--basic styles-->
	<link href="./assets/css/bootstrap.min.css" rel="stylesheet" />
	<link href="./assets/css/bootstrap-responsive.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="./assets/css/font-awesome.min.css" />

	<!--[if IE 7]>
	  <link rel="stylesheet" href="./assets/css/font-awesome-ie7.min.css" />
	<![endif]-->

	<!--page specific plugin styles-->
	<link rel="stylesheet" href="./assets/css/jquery-ui-1.10.3.custom.min.css" />
	<link rel="stylesheet" href="./assets/css/chosen.css" />


	<!--ace styles-->
	<link rel="stylesheet" href="./assets/css/ace.min.css" />
	<link rel="stylesheet" href="./assets/css/ace-responsive.min.css" />
	<link rel="stylesheet" href="./assets/css/ace-skins.min.css" />
	
	<!--[if lt IE 9]>
	  <link rel="stylesheet" href="./assets/css/ace-ie.min.css" />
	<![endif]-->



</head>
<body class="skin-1" style="">


<div class="main-container container-fluid">
	<!--PAGE CONTENT BEGINS HERE-->
	<!-- ====================== -->
	<div >
		<div id="breadcrumbs" class="breadcrumbs">
			<ul class="breadcrumb">
				<li> <i class="icon-home home-icon"></i>
					<a href="CMSBaseMgr.jsp">返回菜单</a>
					<span class="divider"> <i class="icon-angle-right arrow-icon"></i>
					</span>
				</li>
				<li class="active">
					
				</li>
			</ul>
			<!--.breadcrumb-->
			<div id="appMainWithSearch" class="FWApp nav-search" style="display: block;"><div id="baseSearchView">
                	<form id="detailSearch" class="form-search" onsubmit="var args=['order_cumstomer_search'];var app = FW.getAPP('appMainWithSearch');app.FireEvent.search.apply(app,args);return false;" style="display: none;">
						<span class="input-icon">
							<input type="text" autocomplete="off" id="order_cumstomer_search" class="input-small nav-search-input" placeholder="Search ...">
							<i class="icon-search nav-search-icon"></i>
						</span>
					</form>			                    
                </div></div>
			<!--#nav-search-->
		</div>
		
		<div class="page-content clearfix">
			<div class="page-header position-relative">
				<h1 id="pageH1">
					<div class="pull-right" id="btnAction">
						<div class="btn-toolbar">
							<div class="btn-group">
								<button class="btn btn-success dropdown-toggle" data-toggle="dropdown" >
									<i class="icon-cogs"></i>
									文件
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-primary pull-right">
									<li>
										<a href="javascript:void(0)" onclick="FW.getAPP('editGadget').showFileSelecte();"><i class="icon-edit"></i> 打开</a>
									</li>
									<li>
										<a href="javascript:void(0)" onclick="FW.getAPP('editGadget').showFileSave();"><i class="icon-plus"></i> 保存</a>
									</li>
								</ul>
							</div>
							<div class="btn-group">
								<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
									<i class="icon-cogs"></i>
									新建
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-primary pull-right">
									<li >
										<a href="javascript:void(0)" onclick="FW.getAPP('editGadget').newGadget();"><i class="icon-edit"></i> Gadget</a>
									</li>
									<li >
										<a href="javascript:void(0)" onclick="FW.getAPP('editGadget').newAttribute();"><i class="icon-plus"></i> 属性</a>
									</li>
									<li >
										<a href="javascript:void(0)" onclick="FW.getAPP('editGadget').newFun();"><i class="icon-plus"></i> 方法</a>
									</li>
								</ul>
							</div>
							<div class="btn-group">
								<button class="btn btn-warning dropdown-toggle" data-toggle="dropdown">
									<i class="icon-cogs"></i>
									工具
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-primary pull-right">
									<li >
										<a href="javascript:void(0)" onclick="FireEvent('editGadget.go2Test')"><i class="icon-edit"></i> 去测试</a>
									</li>
									<li >
										<a href="javascript:void(0)" onclick="FireEvent('editGadget.goSimulatePage')"><i class="icon-edit"></i> 模拟数据</a>
									</li>
									<li>
										<a href="javascript:void(0);" onclick="FireEvent('editGadget.go2changeTheme');">
											<i class="icon-gift"></i>
											主题选择
										</a>
									</li>
								</ul>
							</div>	
							<!--/btn-group-->
						</div>
						<!-- //================================ -->
					</div>
					<span id="aliasTitle">文件编辑</span>
					<small>
						<i class="icon-double-angle-right"></i>
						<span id="actionName"></span>
					</small>
				</h1>
			</div>
			<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">

			<div class="nodetree clearfix FWApp" id="fileMemberTree" style="width: 20%;">
			<!--@treeMod@
				{
				}
			-->

				<div id="viewNodeTree">
					<div class="well">
						<h4 class="blue">Gadget信息</h4>
						<div id="nodeTree" class="tree"></div>
					</div>
				</div>
			</div>

			<div id="editGadget" class="FWApp" style="width:80%;float:left" >
			<!--@editGadget@
			{
			}
			-->
				<div id="appViewFileSelect" class="FWApp">
				<!--@fileselect@
				{
				}
				-->
					<form id="view_fileSelect" onsubmit="FireEvent.selectDir('dirInput');return false;">
						请输入文件名路径：<input id="dirInput" type="text" value="${_}{data.dir}" />
						<input type="button" onclick="FireEvent.selectDir('dirInput')" value="ok"/>
						<br/>
						<!--$if(data.fileList){-->
							请选择要编辑的文件:
							<select id="fileInput" onchange="FireEvent.selectFile('fileInput')">
								<!--$for(var i in data.fileList){-->
									<!--$if(i == data.selectedFile){-->
									<option value="${_}{i}" selected="true">[${_}{data.fileList[i].type}]${_}{i}</option>
									<!--$}else{-->
									<option value="${_}{i}">[${_}{data.fileList[i].type}]${_}{i}</option>
									<!--$}-->
								<!--$}-->
							</select>
							<input type="button" onclick="FireEvent.selectFile('fileInput')" value="ok"/>
						<!--$}-->
					</form>
				</div>
				<div id="view_fileSave" >
						<div id="infoForm" class="form-horizontal clearfix">
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveFile();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确认
							</a>
						</div>
				</div>
				<div id="baseInfo" >
						<div id="infoForm" class="form-horizontal clearfix">
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveBase();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确认
							</a>
						</div>
				</div>
				<div id="attInfo" >
						<div id="infoForm" class="form-horizontal clearfix">
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveAttribute();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确认
							</a>
							
							<a href="javascript:void(0)" onclick="FireEvent.newAttribute();" class="btn btn-success">
								<i class="icon-ok bigger-110"></i>
								新建属性
							</a>
							
							<a href="javascript:void(0)" onclick="FireEvent.delAttribute();" class="btn btn-danger">
								<i class="icon-ok bigger-110"></i>
								删除该属性
							</a>
						</div>
				</div>
				<div id="funBaseInfo">
					<div style="margin-bottom: 30px; display: block;">
						<ul id="tagView" class="nav nav-tabs " style="height:33px;">
							<li class="active">
								<a href="javascrpt:void(0)" data-toggle="tab">基本信息</a>
							</li>
							<li>
								<a href="javascript:void(0)" data-toggle="tab" onclick="FireEvent.showFunGraphy()">流程图</a>
							</li>
							<li>
								<a href="javascript:void(0)" data-toggle="tab" onclick="FireEvent.showFunEditor()">代码</a>
							</li>
						</ul>
					</div>
					<div id="infoForm" class="form-horizontal clearfix">
					</div>
					<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
						<a href="javascript:void(0)" onclick="FireEvent.saveFunBase();" class="btn btn-info">
							<i class="icon-ok bigger-110"></i>
							确认
						</a>
						
						<a href="javascript:void(0)" onclick="FireEvent.newFun();" class="btn btn-success">
							<i class="icon-ok bigger-110"></i>
							新建方法
						</a>
						
						<a href="javascript:void(0)" onclick="FireEvent.delFun();" class="btn btn-danger">
							<i class="icon-ok bigger-110"></i>
							删除该方法
						</a>
					</div>
					
				</div>
				<div id="funGraphy" class="FWApp">
					<!--@graphyFunMod@
					{
						canvas:"infoForm"
					}
					-->
					<div id="mainView" >
						<div style="margin-bottom: 30px; display: block;">
							<ul id="tagView" class="nav nav-tabs" style="height:33px;">
								<li >
									<a href="javascrpt:void(0)" data-toggle="tab" onclick="var args=[];var app = FW.getAPP('editGadget');app.FireEvent.showFunBase.apply(app,args)">基本信息</a>
								</li>
								<li class="active">
									<a href="javascript:void(0)" data-toggle="tab">流程图</a>
								</li>
								<li >
									<a href="javascript:void(0)" data-toggle="tab" onclick="var args=[];var app = FW.getAPP('editGadget');app.FireEvent.showFunEditor.apply(app,args)">代码</a>
								</li>
							</ul>
						</div>
						<div id="infoForm" style="border:1px solid #ccc; width=100%;height:1400px;">
						</div>
					</div>
				</div>
				<div id="funEditor">
					<div id="tips" style=";border:1px solid #F00;background:#FFF; color:000#;position:fixed;left:290px;top:5px;width:60%;height:auto !important;z-index:100">
						名称：${_}{data.n}<br/>
						参数: ${_}{data.p}<br/>
						内部: ${_}{data.m}<br/>
						全局: ${_}{data.g}<br/>
					</div>
					<div style="margin-bottom: 30px; display: block;">
						<ul id="tagView" class="nav nav-tabs" style="height:33px;">
							<li >
								<a href="javascrpt:void(0)" data-toggle="tab" onclick="FireEvent.showFunBase()">基本信息</a>
							</li>
							<li>
								<a href="javascript:void(0)" data-toggle="tab" onclick="FireEvent.showFunGraphy()">流程图</a>
							</li >
							<li class="active">
								<a href="javascript:void(0)" data-toggle="tab">代码</a>
							</li>
						</ul>
					</div>
					<!--<pre contenteditable="true" onchange="onCodeChange(event);" class="prettyprint language-javascript" id="code_panel"></pre>-->
					<textarea id="infoForm" ></textarea>
					
					<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
						
						<a id="btnSaveFun" href="javascript:void(0)" onclick="FireEvent.saveFunStr();" class="btn btn-info">
							<i class="icon-ok bigger-110"></i>
							保存修改
						</a>
					</div>
				</div>

				<div id="FunFragment" >
					<div style="margin-bottom: 30px; display: block;">
						<ul id="tagView" class="nav nav-tabs" style="height:33px;">
							<li class="active">
								<a href="javascript:void(0)" data-toggle="tab">基本信息</a>
							</li>
							<li >
								<a href="javascrpt:void(0)" data-toggle="tab" onclick="FireEvent.showFunFragmentCode()">代码片段</a>
							</li>							
						</ul>
					</div>
					<div id="infoForm" class="form-horizontal clearfix">
					</div>
					<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
						<a href="javascript:void(0)" onclick="FireEvent.saveFunFragment();" class="btn btn-info">
							<i class="icon-ok bigger-110"></i>
							确认修改
						</a>
						
						<a href="javascript:void(0)" onclick="FireEvent.newFunFragmentBefore();" class="btn btn-success">
							<i class="icon-ok bigger-110"></i>
							前插新值
						</a>

						<a href="javascript:void(0)" onclick="FireEvent.newFunFragmentAfter();" class="btn btn-success">
							<i class="icon-ok bigger-110"></i>
							后插新值
						</a>
						
						<a href="javascript:void(0)" onclick="FireEvent.newFunFragmentChild();" class="btn btn-success">
							<i class="icon-ok bigger-110"></i>
							追加儿子
						</a>

						<a href="javascript:void(0)" onclick="FireEvent.delFunFragment();" class="btn btn-danger">
							<i class="icon-ok bigger-110"></i>
							删除片段
						</a>
						<a href="javascript:void(0)" onclick="FireEvent.back2Graphy();" class="btn btn-warning">
							<i class="icon-ok bigger-110"></i>
							返回图形
						</a>
					</div>
				</div>
				<div id="FunFragmentCode" >
					<div id="tips" style=";border:1px solid #F00;background:#FFF; color:000#;position:fixed;left:290px;top:5px;width:60%;height:auto !important;z-index:100">
						名称：${_}{data.n}<br/>
						参数: ${_}{data.p}<br/>
						内部: ${_}{data.m}<br/>
						全局: ${_}{data.g}<br/>
					</div>
					<div style="margin-bottom: 30px; display: block;">
						<ul id="tagView" class="nav nav-tabs" style="height:33px;">
							<li >
								<a href="javascrpt:void(0)" data-toggle="tab" onclick="FireEvent.showFunFragment();">基本信息</a>
							</li>
							<li class="active">
								<a href="javascript:void(0)" data-toggle="tab">代码片段</a>
							</li>
						</ul>
					</div>
					<textarea id="infoForm" ></textarea>
					<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
						<a id="btnSaveFun" href="javascript:void(0)" onclick="FireEvent.saveFunFragmentCode();" class="btn btn-info">
							<i class="icon-ok bigger-110"></i>
							确认修改
						</a>
						
						<a href="javascript:void(0)" onclick="FireEvent.showFunGraphy();" class="btn btn-success">
							<i class="icon-ok bigger-110"></i>
							返回图形
						</a>
					</div>
				</div>
				<div id="changeTheme">
					<p>主题选择: 
						<select id="select">
						    <option selected="">default</option>
						    <option>3024-day</option>
						    <option>3024-night</option>
						    <option>ambiance</option>
						    <option>base16-dark</option>
						    <option>base16-light</option>
						    <option>blackboard</option>
						    <option>cobalt</option>
						    <option>colorforth</option>
						    <option>dracula</option>
						    <option>eclipse</option>
						    <option>elegant</option>
						    <option>erlang-dark</option>
						    <option>icecoder</option>
						    <option>lesser-dark</option>
						    <option>liquibyte</option>
						    <option>material</option>
						    <option>mbo</option>
						    <option>mdn-like</option>
						    <option>midnight</option>
						    <option>monokai</option>
						    <option>neat</option>
						    <option>neo</option>
						    <option>night</option>
						    <option>paraiso-dark</option>
						    <option>paraiso-light</option>
						    <option>pastel-on-dark</option>
						    <option>rubyblue</option>
						    <option>seti</option>
						    <option>solarized dark</option>
						    <option>solarized light</option>
						    <option>the-matrix</option>
						    <option>tomorrow-night-bright</option>
						    <option>tomorrow-night-eighties</option>
						    <option>ttcn</option>
						    <option>twilight</option>
						    <option>vibrant-ink</option>
						    <option>xq-dark</option>
						    <option>xq-light</option>
						    <option>yeti</option>
						    <option>zenburn</option>
						</select>
					</p>
					<textarea id="infoFormTheme" readonly></textarea>
				</div>
			</div>
		</div>

	</div>
	<!-- ====================== -->
	<!--PAGE CONTENT ENDS HERE-->

</div>
<!--/.main-container-->

<!-- footer -->

<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-small btn-inverse">
<i class="icon-double-angle-up icon-only bigger-110"></i>
</a>


<!-- //脚本 -->
<script src="../breeze/lib/js/jquery.js"></script>
<script src="../breeze/lib/js/sea.js"></script>

<!-- //前端框架JS -->
<script src="./assets/js/bootstrap.min.js"></script>



<!--page specific plugin scripts-->
<script src="./assets/js/bootbox.min.js"></script>

<!--ace scripts-->
<script src="./assets/js/ace-elements.min.js"></script>
<script src="./assets/js/ace.min.js"></script>
<!--codemirror-->
<script src="${B}breeze/lib/js/codemirror/codemirror.js?v=1.3"></script>
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/codemirror.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/3024-day.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/3024-night.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/ambiance.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/base16-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/base16-light.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/blackboard.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/cobalt.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/colorforth.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/dracula.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/eclipse.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/elegant.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/erlang-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/icecoder.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/lesser-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/liquibyte.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/material.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/mbo.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/mdn-like.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/midnight.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/monokai.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/neat.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/neo.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/night.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/paraiso-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/paraiso-light.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/pastel-on-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/rubyblue.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/seti.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/solarized.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/the-matrix.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/tomorrow-night-bright.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/tomorrow-night-eighties.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/ttcn.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/twilight.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/vibrant-ink.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/xq-dark.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/xq-light.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/yeti.css">
<link rel="stylesheet" href="${B}breeze/lib/js/codemirror/theme/zenburn.css">
<script src="${B}breeze/lib/js/codemirror/javascript.js?v=1.3"></script>

<script>
	seajs.config({base:"${B}"});
	seajs.use([
			'manager_auxiliary/service/treeMod',
			'manager_auxiliary/service/editGadget',
			'manager_auxiliary/service/fileselect',
			'manager_auxiliary/service/graphyFunMod'
		],
		function(a) {
			a.go("${B}breeze/framework/jsp/BreezeFW.jsp");
			window.FW = a;
		}
	);
</script>
</body>
</html>