<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<jsp:include page="../allhead.jsp"/>
<jsp:include page="./cmsallhead.jsp"/>
<jsp:include page="bgPower.jsp"/>
<jsp:include page="lang.jsp"/>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>${title}</title>
	<meta name="description" content="User login page" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- cssAssets -->
	<jsp:include page="cssAssets.jsp"/>
	<!-- /cssAssets -->
	<style type="text/css">
		._tablename_inp{
			text-transform:lowercase;
		}
	</style>
</head>
<body class="skin-1">

<!-- header -->
<jsp:include page="header.jsp"/>
<!-- /header -->

<div class="main-container container-fluid">
	<!-- leftMenu -->
	<jsp:include page="leftMenu.jsp"/>
	<!-- /leftMenu -->

	<!--PAGE CONTENT BEGINS HERE-->
	<!-- ====================== -->
	<div class="main-content">
		<div id="breadcrumbs" class="breadcrumbs">
			<ul class="breadcrumb">
				<li> <i class="icon-home home-icon"></i>
					<a href="../manager/CMSMgr.jsp">欢迎页</a>
					<span class="divider"> <i class="icon-angle-right arrow-icon"></i>
					</span>
				</li>
				<li class="active">
                    ${welcome}
				</li>
			</ul>
			<!--.breadcrumb-->

			<div id="nav-search" class="nav-search">
				<form class="form-search">
					<span class="input-icon">
						<input type="text" autocomplete="off" id="nav-search-input" class="input-small nav-search-input" placeholder="Search ...">
						<i class="icon-search nav-search-icon"></i>
					</span>
				</form>
			</div>
			<!--#nav-search-->
		</div>
		
		<div class="page-content clearfix">
			<div class="page-header position-relative">
				<h1 id="pageH1" style="display:none;">
					<div class="pull-right" id="btnAction">
						<div class="btn-toolbar">
							<div class="btn-group">
								<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
									<i class="icon-cogs"></i>
									内容管理
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-primary pull-right">
									<li authority="queryContent" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerContentList')"><i class="icon-bar-chart"></i> 模型列表</a>
									</li>
									<li authority="addContent" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerContentAdd')"><i class="icon-check"></i> 模型添加</a>
									</li>
								</ul>
							</div><!--/btn-group-->
							<div class="btn-group">
								<button class="btn btn-success dropdown-toggle" data-toggle="dropdown">
									<i class="icon-cogs"></i>
									栏目管理
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-success pull-right">
									<li authority="modifyNode" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerClassEdit')"><i class="icon-edit"></i> 栏目编辑</a>
									</li>
									<li authority="addNode" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerClassAdd','0')"><i class="icon-plus"></i> 添加顶栏目</a>
									</li>
									<li authority="addNode" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerClassAdd')"><i class="icon-plus"></i> 添加子栏目</a>
									</li>
									<li authority="deleteNode" style="display:none;">
										<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerClassDel')"><i class="icon-trash"></i> 删除栏目</a>
									</li>
								</ul>
							</div><!--/btn-group-->
						</div>
						<!-- //================================ -->

					</div>
					<span id="aliasTitle">栏目操作</span>
					<small>
						<i class="icon-double-angle-right"></i>
						<span id="actionName">内容列表</span>
					</small>
				</h1>
			</div>
			<div class="nodetree clearfix FWApp" id="cmsMgrNodeTreeGadget">
				<!--@cmsMgrNodeTreeGadget@
				{
					displayName:{
						"statusaction":"statusName"
					}
				}
				-->
				<div id="viewNodeTree">
					<div class="well">
						<h4 class="blue">栏目目录</h4>
						<div id="nodeTree" class="tree"></div>
					</div>
				</div>
			</div>
			<div class="shownodecontent">
				<div id="tabSonAlias" style="display:none; margin-bottom:30px;">
					<a id="btnPLAddSonAlias" class="pull-right btn btn-mini btn-success" href="javascript:void(0)" style="display:none; margin:10px 10px 0 0; position:relative; z-index:2">
						<i class="icon-plus"></i> 批量添加
					</a>
					<a id="btnAddSonAlias" class="pull-right btn btn-mini btn-info" href="javascript:void(0)" style="display:none; margin:10px 10px 0 0; position:relative; z-index:2">
						<i class="icon-plus"></i> 单条添加
					</a>
					<ul class="nav nav-tabs padding-18" style="height:33px;">
						<li class="active">
							<a href="javascrpt:void(0)" data-toggle="tab">基本信息</a>
						</li>
					</ul>
				</div>
				<div class="FWApp " id="channelMgrExtGadget">
					<!--@channelMgrExtGadget@
					{
					descChannelUrl:"CMSMgr.desc"
					}
					-->
					<div id="viewContentList">
						<form id="formContentList" class="form-horizontal clearfix">
						</form>
					</div>
					<div id="viewContentAdd">
						<form id="formContentAdd" class="form-horizontal clearfix">
						</form>
					</div>
					<div id="viewContentEdit">
						<form id="formContentEdit" class="form-horizontal clearfix">
						</form>
					</div>
					<div id="viewClassAdd">
						<form id="formClassAdd" class="form-horizontal clearfix">
						</form>
					</div>
					<div id="viewClassEdit">
						<form id="formClassEdit" class="form-horizontal clearfix">
						</form>
					</div>
				</div>
				<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2; display:none;">
					<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerSubmit')" class="btn btn-info">
						<i class="icon-ok bigger-110"></i>
						确认提交
					</a>
					&nbsp; &nbsp; &nbsp;
					<a href="javascript:void(0)" onClick="FW.trigerEvent('trigerGoBack')" class="btn">
						<i class="icon-undo bigger-110"></i>
						返回列表
					</a>
				</div>
			</div>
		</div>

	</div>
	<!-- ====================== -->
	<!--PAGE CONTENT ENDS HERE-->

</div>
<!--/.main-container-->

<!-- footer -->
<jsp:include page="footer.jsp"/>
<!-- /footer -->

<!-- wgfly breeze -->
<script>
	seajs.config({base:"<%=this.getServletContext().getContextPath()%>/"});
	seajs.use( ['gadget/cmsMgrNodeTreeGadget','gadget/channelMgrExtGadget'],function(a) {			
		a.go("<%=this.getServletContext().getContextPath()%>/breeze.brz");
		window.FW = a;
	});
</script>

</body>
</html>