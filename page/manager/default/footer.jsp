<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
   String cmsBaseUrl = (String)request.getAttribute("managerHomePage");
   session.setAttribute("CMSMgr",cmsBaseUrl);
%>

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if IE 8]>
  	<script src="${B}libs/html5shiv.js"></script>
  	<script src="${B}libs/respond.min.js"></script>
<![endif]-->
<!--[if IE 9]>
	<script src="${B}libs/html5shiv.js"></script>
  	<script src="${B}libs/respond.min.js"></script>
<![endif]-->

<script src="${B}page/manager/assets/default/plugins/jquery.js"></script>
<script src="${B}page/manager/assets/default/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="${B}page/manager/assets/default/plugins/modernizr-2.6.2-respond-1.1.0.min.js"></script>
<script src="${B}page/manager/assets/default/js/jquery.ztree.core-3.5.min.js"></script>

<script src="${B}page/manager/assets/default/plugins/daterangepicker/daterangepicker.js"></script>
<script src="${B}page/manager/assets/default/plugins/daterangepicker/moment.js"></script>
<script src="${B}page/manager/assets/default/plugins/uniform/jquery.uniform.min.js"></script>
<script src="${B}page/manager/assets/default/plugins/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.min.js"></script>
<script src="${B}page/manager/assets/default/plugins/bootstrap-datetimepicker-master/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="${B}page/manager/assets/default/plugins/datepicker/js/bootstrap-datepicker.js"></script>
<script src="${B}page/manager/assets/default/plugins/timepicker/js/bootstrap-timepicker.min.js"></script>
<script src="${B}page/manager/assets/default/plugins/gritter/js/jquery.gritter.min.js"></script>
<script src="${B}page/manager/assets/default/plugins/jquery-steps-master/lib/jquery.cookie-1.3.1.js"></script>
<script src="${B}page/manager/assets/default/plugins/jquery-steps-master/build/jquery.steps.js"></script>   
<%--2015年3月24日11:01:33 FrankCheng 加入图片控件 --%>
<script src="${B}page/manager/assets/default/plugins/foxibox/script/jquery-foxibox-0.2.js"></script>

<script src="${B}breeze/lib/js/sea.js"></script>
<script src="${B}breeze/lib/js/seajs-text.js"></script>
<script src="${B}config/config.jsp"></script>


<!-- 图片上传 -->
<script src="${B}breeze/lib/js/ajaxfileupload.js"></script>

<!-- Jquery UI -->
<script type="text/javascript"> if("ontouchend" in document) document.write("<script src='${B}page/manager/assets/default/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
</script>

<!-- 多图上传函数 -->
<script src="${B}breeze/swfupload/swfupload.js"></script>
<script src="${B}breeze/swfupload/handlers.js"></script>

<!-- html编辑器 -->
<script src="${B}breeze/xheditor/jquery-migrate-1.1.0.min.js"></script>
<script src="${B}breeze/xheditor/xheditor-1.2.1.min.js"></script>
<script src="${B}breeze/xheditor/xheditor_lang/zh-cn.js"></script>

<!-- 菜单高亮展开 -->
<script type="text/javascript">
	$(function(){
		  
		//判断是否有菜单操作权限，显示该用户拥有权限的菜单
		$("[actionName]").each(function(){
		 	//获取页面权限的severname
		 	var actionName = $(this).attr("actionName");
		 	//格式是actionName@ServiceName.
		 	actionInfoArry = actionName.split("@");
		 	if(actionInfoArry.length !=2) return true;
		 	var actionList = authorityData[actionInfoArry[1]] || null;
		 	if(!actionList) return true;
		 	//遍历权限数组，寻找对应alias和servename
		 	for (var i = 0; i < actionList.length; i++){
		 		if(actionList[i].actionName == actionInfoArry[0]){
		 			$(this).show();
		 			break;
		 		}
		 	}
		});
		
		//高亮展开显示当前菜单
		var paramUrl = document.location.href.split("/")[document.location.href.split("/").length-1];
		$("#sidebar").find("li a").each(function(){
			if($(this).attr("href") == paramUrl){
				$(this).parent().addClass("open");
				$(this).parents("li").addClass("active");
			}
		});
	})
</script>
<div id="maskwaitingdiv" class="modal-backdrop  in" style="display:none">      
</div>