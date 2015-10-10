<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.servicerg.AllServiceTemplate"%>
<%@ page import="java.util.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!--强制使用浏览器模式-->
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<!--强制使用文本模式-->
	<title>后台调试工具</title>
	
	<script src="../lib/js/jquery.js" ></script>
	<script src="../lib/js/jquery.json.js"></script>
	<script src="../lib/js/jquery.blockUI.js"></script>
	<script src="../lib/js/ajaxfileupload.js"></script>
	<script src="../lib/js/sea.js"></script>
	<style>
		.c_c{
			display:block;
			width:750px
		}
		.l_c_w{
			border:1px;
			border-color:red;
		}
		.l_t{
			display:inline-block			
		}
		.l_c{
			display:inline-block			
		}
		.l_c .desc{
			display:none
		}
		._d_param_tex{
			width:300px;
			height:100px;
		}
	</style>
	<script>
	seajs.config({
	});
	seajs.use(['<%=this.getServletContext().getContextPath() %>/tools/framework/js/FormOper'],function(a){
		var datadesc = {
			d: {
				title: "数据项目",
				type: "File",
				desc:'abc'
			}
		};
		window.FormOper = a;
		$(function(){
			a.createFormByObjDesc(datadesc,$("#form"));			
		})
	});

	</script>
</head>
<body>
    <div id="form" method="post" fileurl='<%=this.getServletContext().getContextPath() %>/upload.up'>		
	</div>	
	
	<a href="#none" onclick="alert($.toJSONString($('#form')[0].getData()))">view result</a>
</body>
</html>