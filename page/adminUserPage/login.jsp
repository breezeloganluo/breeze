<%@page import="java.net.URLEncoder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%request.setAttribute("_", "$");%>
<jsp:include page="../allhead.jsp"/>
<%
     Object bgImg = request.getAttribute("loginbackgroundimage");
	 if (bgImg != null && !"--".equals(bgImg)){
		request.setAttribute("bgImg"," <img src='"+request.getAttribute("B")+bgImg+"' style='width:100%;height:100%'/>");
	 }
	 
	 Object logo = request.getAttribute("logourl");
	 if (logo != null && !"--".equals(logo)){
		request.setAttribute("logo","<img src='"+request.getAttribute("B")+logo+"' id='logoimg' alt='Logo' ></img>");
	 }else{
		request.setAttribute("logo","<img src='"+request.getAttribute("B")+"page/manager/assets/default/img/logo.png' id='logoimg' alt='Logo'></img>");
	 }
	 String url = "";
	 if(session.getAttribute("saveUrl")==null){
	    url = request.getAttribute("B") + (String)request.getAttribute("managerHomePage");
	 }else{
	    url = (String)session.getAttribute("saveUrl");
	    session.setAttribute("saveUrl",null);
	 }
%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8" />
	<title>${loginTitle}</title>
	<meta name="description" content="User login page" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- cssAssets -->
	<jsp:include page="../manager/default/cssAssets.jsp"/>
	<link rel="stylesheet" href="${B}page/manager/assets/default/css/login.css" />
	<!-- /cssAssets -->

	<%--验证码样式--%>
	<style type="text/css">
		.code   
        {   
            background-image:url(code.jpg);   
            font-family:Arial;   
            font-style:italic;   
            color:Red;   
            border:0;   
            padding:2px 3px;   
            letter-spacing:3px;   
            font-weight:bolder;   
        } 
	</style>
	<%--验证码样式结束--%>
</head>
<body class="login-layout" style="background-image:">
	<div style="width:100%;height:100%;position:absolute;left:0px;top:0px;z-index:0;">
		${bgImg}
	</div>
	<div class="container" style="margin-top:50px;">
		<div class="row" >
			<div class="col-lg-8" style="padding:0; text-align:center;">
				  <img src="${B}page/manager/assets/default/img/loginAd.png"  style="width:100%;max-width:460px;padding-top:40px;"> 
			</div>
			<div class="col-lg-4" style="padding-left:0;">
				<div class="text-center">
			        ${logo} 
			    </div>
		    	<div class="tab-content" style="background: #fff;opacity: 0.9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);">
		    		<h3 class="text-center">${loginDesc }</h3>
		        	<div id="login" class="tab-pane active FWApp" >
		        		<!--@adminUserLoginInfo@
		        		{
								directShowView:'view_userLogin',
								loginServiceName:'adminLogin',
								loginServicePackage:'admin',
								loginSuccJumb:'<%=url%>'
							}
						-->
		            	<form class="form-signin" id="view_userLogin">
		                	<p class="text-muted text-center btn-block btn btn-primary btn-rect">
		                    	请输入账号密码
		                	</p>
			                <input type="text" id="adminName" placeholder="账号" class="form-control" />
			                <input type="password" id="adminPass" placeholder="密码" class="form-control" />
			                <input type="text" id="code" placeholder="验证码" maxlength=4 class="col-lg-8" style="margin-bottom:10px"/>
			                <input type="text" onClick="FireEvent.fireChangeCode();" readonly="readonly" id="checkCode" style="width: 60px;height:22px;cursor:pointer;float:right;margin-bottom:10px"  />
			                <button class="btn text-muted text-center btn-danger" type="button" onclick="FireEvent.fireLogin('adminName','adminPass','code')">登 录</button>
			            </form>
			        </div>
			        <div id="forgot" class="tab-pane">
			            <form class="form-signin">
			                <p class="text-muted text-center btn-block btn btn-primary btn-rect">请输入需要找回密码的账号</p>
			                <input id="userAccount" type="text" placeholder="用户名"  class="form-control" />
			                <br />
			                <button class="btn text-muted text-center btn-success" type="button" onclick="FireEvent('login.checkUser','userAccount')">找回密码</button>
			            </form>
			        </div>
			        <div id="signup" class="tab-pane">
			            <form action="index.html" class="form-signin">
			                <p class="text-muted text-center btn-block btn btn-primary btn-rect">Please Fill Details To Register</p>
			                 <input type="text" placeholder="First Name" class="form-control" />
			                 <input type="text" placeholder="Last Name" class="form-control" />
			                <input type="text" placeholder="Username" class="form-control" />
			                <input type="email" placeholder="Your E-mail" class="form-control" />
			                <input type="password" placeholder="password" class="form-control" />
			                <input type="password" placeholder="Re type password" class="form-control" />
			                <button class="btn text-muted text-center btn-success" type="submit">Register</button>
			            </form>
			        </div>

			      <div class="text-center">
			        <ul class="list-inline">
			            <li><a class="text-muted" href="#login" data-toggle="tab">登  录</a></li>
			            <li><a class="text-muted" href="#forgot" data-toggle="tab">找回密码</a></li>
			        </ul>
			    </div>  
		    	</div>
		    		
			</div>
		</div>
	</div>
<!--/.main-container-->

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if IE 8]>
  	<script src="${B}libs/html5shiv.js"></script>
  	<script src="${B}libs/respond.min.js"></script>
<![endif]-->
<!--[if IE 9]>
	<script src="${B}libs/html5shiv.js"></script>
  	<script src="${B}libs/respond.min.js"></script>
<![endif]-->
<!-- PAGE LEVEL SCRIPTS -->
<script src="${B}page/manager/assets/default/plugins/jquery.js"></script>
<script src="${B}page/manager/assets/default/js/login.js"></script>
<script src="${B}page/manager/assets/default/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="${B}breeze/lib/js/sea.js"></script>
<script src="${B}breeze/lib/js/seajs-text.js"></script>

<!-- wgfly breeze -->

	<script>
		seajs.config({base:"${B}"});
		seajs.use( [ '${B}privategadget/adminUserLoginInfo' ],function(a) {
					a.go("${B}breeze.brz");
					//将a全局赋值给fw  才能使用全局的事件
					window.FW = a;
				});
		document.onkeydown=function(event){ 
	        e = event ? event :(window.event ? window.event : null); 
	        if(e.keyCode==13){ 
	            //执行的方法  
	            var adminName = $("#adminName").val();
	            var adminPass = $("#adminPass").val();
	            var code = $("#code").val();
	            if(tag=="login"){
	            	FW.trigerEvent("trigerLogin",adminName,adminPass,code);	
	            }else{
	            	FireEvent('APP_login.checkUser','userAccount');
	            }
	        } 
	    }
	</script>
	<script type="text/javascript">
		function show_box(id) {
		 $('.widget-box.visible').removeClass('visible');
		 $('#'+id).addClass('visible');
		}
	</script>
</body>
</html>