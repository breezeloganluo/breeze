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
		request.setAttribute("logo","<img src='"+request.getAttribute("B")+"page/manager/assets/img/logo.png' id='logoimg' alt='Logo'></img>");
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
	<jsp:include page="../manager/ace/ace-cssAssets.jsp"/>
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
	<div class="main-container">
		<div class="main-content">
			<div class="row">
				<div class="col-sm-10 col-sm-offset-1">
					<div class="login-container">
						<div class="center">
							<h1>
								<i class="ace-icon fa fa-leaf green"></i>
								<h2 class="red" id="id-text2">${loginDesc }</h2>
							</h1>
						</div>
						<div class="space-6"></div>
						<div class="position-relative">
							<div class="position-relative">
								<div id="login" class="login-box visible widget-box no-border FWApp">
									<!--@adminUserLoginInfo@{
										directShowView:'view_userLogin',
										loginServiceName:'adminLogin',
										loginServicePackage:'admin',
										loginSuccJumb:'<%=url%>'
									}
									-->
									<div id="view_userLogin" class="widget-body">
										<div class="widget-main">
											<h4 class="header blue lighter bigger">
												<i class="ace-icon fa fa-coffee green"></i>
												请输入登录信息
											</h4>
											<div class="space-6"></div>
											<form>
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input id="adminName" type="text" class="form-control" placeholder="帐号" />
															<i class="ace-icon fa fa-user"></i>
														</span>
													</label>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input id="adminPass" type="password" class="form-control" placeholder="密码" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
													</label>
													<label class="block clearfix">
														<input id="code" maxlength=4 type="text" class="col-lg-9" placeholder="验证码" />
														<input type="text" onClick="FireEvent.fireChangeCode();" readonly="readonly" class="col-lg-3" id="checkCode" style="width: 60px;height:34px;cursor:pointer;float:right;margin-bottom:10px"/>
													</label>
													<div class="space"></div>
													<div class="clearfix">
														<button type="button" class="width-35 pull-right btn btn-sm btn-primary" onclick="FireEvent.fireLogin('adminName','adminPass','code')">
															<i class="ace-icon fa fa-key"></i>
															<span class="bigger-110">登录</span>
														</button>
													</div>
													<div class="space-4"></div>
												</fieldset>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- PAGE LEVEL SCRIPTS -->
<script src="${B}page/manager/assets/ace/js/jquery.js"></script>
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