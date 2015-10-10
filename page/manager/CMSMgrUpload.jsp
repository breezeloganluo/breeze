<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>大文件上传</title>
</head>
<style type="text/css">
	div.flash {
		width: 200px;
		margin: 10px 5px;
		border-color: #D9E4FF;
	}
	div.progressBarInProgress {
		height: 5px;
		background-color: red;
	}
	div.progressWrapper{
		width: 200px;
	}
</style>
<jsp:include page="cssAssets.jsp"/>
<jsp:include page="../allhead.jsp"/>
<jsp:include page="./cmsallhead.jsp"/>
<jsp:include page="bgPower.jsp"/>
<body>
	<div class="FWApp" id="cmsMgrUploadApp">
		<!--@CMSMgrUpload@
			{
				
			}
		-->
		<div id="cmsMgrUploadView">
			<!--$if(data.result == "failed"){-->
				${_}{data.reason}
			<!--$}else{-->
			<div class="flash" id="fsUploadProgress"></div>
				<div style="width: 200px" class="btn btn-info">
					<span id="spanButtonPlaceholder"></span>
				</div>
			<!--$}-->
		</div>
	</div>
</body>
<jsp:include page="footer.jsp"/>
<script>
	seajs.config({base:"${B}"});
	seajs.use([	
			'gadget/CMSMgrUpload'
		],
		function(a) {
			a.go("${S}");
			window.FW = a;
		}
	);
</script>
</html>
