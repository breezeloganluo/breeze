<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="com.breeze.support.cfg.Cfg"%>

	<body>
		<%
		String baseUrl = this.getServletContext().getContextPath();
		String configUrlPrefix = Cfg.getCfg().getString("siteprefix");
		if (configUrlPrefix !=null && !configUrlPrefix.equals("--")){
			baseUrl = configUrlPrefix;
		}
		if ("/".equals(baseUrl)){
			request.setAttribute("B","/");
			baseUrl = "";
		}else{
			request.setAttribute("B",baseUrl+'/');
		}
		request.setAttribute("S",request.getAttribute("B")+"breeze/framework/jsp/BreezeFW.jsp");
		%>
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>
		
		<!-- basic styles -->

		<link href="assets3/css/bootstrap.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="assets3/css/font-awesome.min.css" />

		<!--[if IE 7]>
		  <link rel="stylesheet" href="assets3/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!-- page specific plugin styles -->

		<!-- fonts -->

		<link rel="stylesheet" href="assets3/css/googlefont.css" />

		<!-- ace styles -->

		<link rel="stylesheet" href="assets3/css/ace.min.css" />
		<link rel="stylesheet" href="assets3/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="assets3/css/ace-skins.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="assets3/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->

		<script src="assets3/js/ace-extra.min.js"></script>

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="assets3/js/html5shiv.js"></script>
		<script src="assets3/js/respond.min.js"></script>
        <![endif]-->
        <style>
        	.nogap{padding:0}
        </style>
		
		
		
		
		<!--头部的管理条-->
    	<div class="navbar navbar-default" id="navbar">
			<script type="text/javascript">
				try{ace.settings.check('navbar' , 'fixed')}catch(e){}
			</script>

			<div class="navbar-container" id="navbar-container">
				<div class="navbar-header pull-left" id="menuTitle_fileTree">
					<a href="#" class="navbar-brand">
						<small>
							<img src="./img/icon/all.png" width="25" height="25"></img>
							综合编辑器
						</small>
					</a><!-- /.brand -->
				</div><!-- /.navbar-header -->

				<div id="topMenu_fileTree" class="navbar-header pull-right" role="navigation" style="height:45px;" id="topMenu_fileTree">
					<!--在视图topMenu中-->
				</div><!-- /.navbar-header -->
			</div><!-- /.container -->
		</div>
        <!--头部管理条结束-->
        
        <!--下面主体部分-->
		<div class=".container-fluid" id="main-container">
        	<div class="row">
            	<div class="col-xs-4 nogap" >
                    <div style="margin-left: 30px;">
                      <div class="breadcrumbs" >
						

						<ul class="breadcrumb">
							<li>
								<i class="icon-sitemap"></i>
								<a href="#">1</a>
							</li>

							<li>
								<a href="#">2</a>
							</li>
							<li class="active">3</li>
						</ul>

						
					</div>
                      <div id="tree" class="FWApp ">
                         <!--@treeView@{
                          }-->
                      </div>
                    </div>
                </div>
                <div class="col-xs-8 nogap" >
                    <div class="breadcrumbs" id="controlTitle_fileTree" >
						

						<ul class="breadcrumb">
							<li>
								<i class="icon-align-left"></i>
								<a href="#">33</a>
							</li>

							<li>
								<a href="#">2</a>
							</li>
							<li class="active">3</li>
						</ul>

						
					</div>

					<div class="page-content">
						<div class="row">
							<div class="col-xs-12  FWApp" id="fileTree">
                            <!--@treeFileControl@{}-->
								<!-- PAGE CONTENT BEGINS -->

								     页面中间内容
								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div><!-- /.page-content -->
                </div>
            </div>			

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="icon-double-angle-up icon-only bigger-110"></i>
			</a>
		</div>
		
		<!--主体部分结束-->
		
		
		<script src="${B}breeze/lib/js/jquery.js"></script>
        


		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets3/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="assets3/js/bootstrap.min.js"></script>
		

		<!-- page specific plugin scripts -->

		

		

		<!-- ace scripts -->

		<script src="assets3/js/ace-elements.min.js"></script>
		<script src="assets3/js/ace.min.js"></script>

		
        
        
        <script src="${B}breeze/lib/js/sea.js"></script>
        <script src="${B}breeze/lib/js/seajs-text.js"></script>
		<script src="${B}config/config.jsp"></script>
    
		<script >
           seajs.config({
           base: '${B}'
           });
           seajs.use(['./service/treeFileControl','./service/editServiceTest'], function(a) {
           window.FW = a;
           a.go('${S}');           
           });
        </script>
	</body>
