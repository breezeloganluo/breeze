<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<jsp:include page="/page/allhead.jsp"/>
<%
request.setAttribute("S",request.getAttribute("B")+"breeze/framework/jsp/BreezeFW.jsp");
%>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
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
        
	</head>

	<body>
    	<div style="width:100%;height:40px;background:#5090c1;">
        </div>
        
        
        
		<div class="main-container" id="main-container">
			<div class="main-container-inner">

				<div class="sidebar" id="sidebar">
					
                      <div id="tree1" class="tree tree-selectable">
                       
                      </div>
				</div>

				<div class="main-content">
					<div class="breadcrumbs" id="breadcrumbs">
						

						<ul class="breadcrumb">
							<li>
								<i class="icon-home home-icon"></i>
								<a href="#">Home</a>
							</li>

							<li>
								<a href="#">UI Elements</a>
							</li>
							<li class="active">Treeview</li>
						</ul><!-- .breadcrumb -->

						
					</div>

					<div class="page-content">
						<div class="row">
							<div class="col-xs-12 FWApp" id="mainTest">
                            <!--@editServiceTest@{}-->
								<!-- PAGE CONTENT BEGINS -->

								     页面中间内容
								<!-- PAGE CONTENT ENDS -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div><!-- /.page-content -->
				</div><!-- /.main-content -->

				
			</div><!-- /.main-container-inner -->

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="icon-double-angle-up icon-only bigger-110"></i>
			</a>
		</div>
		
		
		
		
		<script src="${B}breeze/lib/js/jquery.js"></script>
        


		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets3/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="assets3/js/bootstrap.min.js"></script>
		

		<!-- page specific plugin scripts -->

		<script src="assets3/js/fuelux/data/fuelux.tree-sampledata.js"></script>
<script>
console.log(treeDataSource);
</script>



		

		<!-- ace scripts -->

		<script src="assets3/js/ace-elements.min.js"></script>
		<script src="assets3/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->

<script>
console.log($.fn.tree);
</script>
<script src="assets3/js/fuelux/fuelux.tree.min.js"></script>
<script>
console.log($.fn.tree);
</script>
        
        
        <script src="${B}breeze/lib/js/sea.js"></script>
        <script src="${B}breeze/lib/js/seajs-text.js"></script>
    
		<script >
           seajs.config({
           base: '${B}'
           });
           seajs.use(['./service/editServiceTest'], function(a) {
           window.FW = a;
           a.go('${S}');           
           });
        </script>
	</body>

</html>