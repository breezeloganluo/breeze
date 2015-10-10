<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="./hHead.jsp"%>
<%
request.setAttribute("B",this.getServletContext().getContextPath()+'/');
request.setAttribute("_","$");
%>

<%
	String testDir = request.getParameter("testDir");
	if (testDir != null){
%>
<html>
<head>

</head>
<body>
	<script src="${B}/breeze/lib/js/jquery.js"></script>
	<script src="${B}/breeze/lib/js/sea.js"></script>	
	<!--page specific plugin scripts-->
	<script>
	seajs.config({base:"${B}"});
	seajs.use( ['<%=testDir%>'],function(a) {
				a.runTest();
			});
	</script>
</body>
</html>
<%
    return;
	}
    
    String fileUrl = request.getParameter("fileUrl");
    if (fileUrl != null){
      fileUrl = java.net.URLEncoder.encode(fileUrl.replaceAll("^[/\\.]+testgadget","testgadget"),"utf-8");
    }
%>

<!doctype html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/xml; charset=UTF-8">
	<link rel="shortcut icon" href="./img/icon/editgadget.jpg">
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
	<title></title>
</head>
<body class="skin-1" style="">
    <div id="breadcrumbs" class="breadcrumbs textctrclose">
		<ul class="breadcrumb">
			<li> 
                <i class="icon-home home-icon"></i>
				<a href="index.jsp">返回菜单</a>
                测试<%=testDir%><span class="divider"><i class="icon-angle-right arrow-icon"></i></span>
			</li>
			<li class="active"></li>
		</ul>
        <div id="appMainWithSearch" class="FWApp nav-search" style="display: block;">
			<div id="baseSearchView">
				<form id="detailSearch" class="form-search" onsubmit="var args=['order_cumstomer_search'];var app = FW.getAPP('appMainWithSearch');app.FireEvent.search.apply(app,args);return false;" style="display: none;">
					<span class="input-icon">
						<input type="text" autocomplete="off" id="order_cumstomer_search" class="input-small nav-search-input" placeholder="Search ..."><i class="icon-search nav-search-icon"></i>
					</span>
				</form>
			</div>
		</div>		
	</div>                  
    <div class="page-header position-relative textctrclose">
		<h1 id="pageH1">
			<div class="pull-right" id="btnAction">
				<!--按钮部分，注释掉-->
				<div class="btn-toolbar">
					<div class="btn-group">
						<button class="btn btn-success dropdown-toggle" data-toggle="dropdown" >
							<i class="icon-cogs"></i>操作
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu dropdown-primary pull-right">
							<li>
								<a href="./gadgetTestCreator.jsp?testDir=<%=fileUrl%>"><i class="icon-edit"></i>运行</a>
							</li>
						</ul>
					</div>		
				</div>
				<!--按钮部分结束 -->
			</div>
			<span id="aliasTitle">文件编辑</span>
			<!--small>
				<i class="icon-double-angle-right"></i>
				<span id="actionName"></span>
			</small-->
		</h1>
	</div>                              
  	<div class="FWApp" id="uniterstmain">
  		<!--@editGadgetTest@{}-->
  	</div>
    <div class="page-content clearfix">
    	<div id="menuTarget_uniterstmain">
    	</div>
    	<div id="listTarget_uniterstmain" style="width: 80%; float: left;">
    	</div>
    </div>
	<div style="display:none">
    	<div class="FWRES" APPID="uniterstmain"  RESID="case">
        	<div class="accordion-group">
            	<div class="accordion-heading">
            		<a href="#newTestCase" data-toggle="collapse" class="accordion-toggle collapsed">
            		新增测试用例
            		</a>
            	</div>
            	<div class="accordion-body collapse" id="newTestCase" style="height: 0px;">
            		<div class="accordion-inner">
            			<form>
            				<fieldset>
                            	<label class="span2">测试名称</label>
                                <input name="name" class="span2" value="">
                                <br>
            					<label class="span2">测试标题</label>
                                <input name="title" class="span2" value="">
                                <br>
                                <label class="span2">测试描述</label>
                                <textarea name="desc" class="span2"></textarea>
                                <br>
                                <label class="span2">模拟描述</label>
                                <textarea name="simulation" class="span2"></textarea>
                                <br>
                                <label class="span2">输入项描述</label>
                                <textarea name="input" class="span2"></textarea>
                                <br>
                                <label class="span2">校验内容描述</label>
                                <textarea name="assert" class="span2"></textarea>
                                <br>
                                <button type="button" onclick="FireEvent.addNewCase(this);" class="btn btn-small">保存</button>
            				</fieldset>
            			</form>
            		</div>
            	</div>
            </div>
		</div>
    	<div class="FWRES" APPID="uniterstmain"  RESID="menu">
        	<div class="textctrclose" id="leftMenu" style="width: 20%;">
            	<div class="nodetree clearfix" id="fileMemberTree">
                	<div id="viewNodeTree">
                    	<div class="well">
                        	<h4 class="blue">方法列表</h4>
                            <div id="nodeTree" class="tree tree-selectable">
                                <!--$for(var i=0;i<data.length;i++){-->
                                    <!--$for(var j in data[i]){-->
                                        <div onclick="FireEvent.menuSelect(this,'${_}{i}','${_}{j}');" class="tree-item tree-item-item" style="display: block;">
                                        	<i class="icon-remove~"></i>				
                                            <div class="tree-item-name" cid="base">${_}{j}</div>			
                                        </div>	
                                    <!--$}-->
                                <!--$}-->
                            </div>	
                        </div>
                	</div>
            	</div>
        	</div>
		</div>
        <div class="FWRES" APPID="uniterstmain"  RESID="code">
        	<div id="infoForm" class="form-horizontal clearfix">
            </div>
            <div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
            	<a href="javascript:void(0)" onclick="FireEvent.saveCode();" class="btn btn-info">
            		<i class="icon-ok bigger-110"></i>
            		保存
               	</a>
            </div>
		</div>
        <div class="FWRES" APPID="uniterstmain"  RESID="list">
       		<div id="accordion2" class="accordion">
                <!--$if(data.length>0){-->
                	<!--$for(var i=0;i<data.length;i++){-->
                    	<!--$for(var j in data[i]){-->
                        	<div class="accordion-group">
                                <div class="accordion-heading">
                                    <a href="#${_}{j}${_}{i}" data-toggle="collapse" class="accordion-toggle collapsed">
                                        ${_}{j}
                                        <i onclick="FireEvent.deleteCase('${_}{j}');" class="icon-trash pull-right" style="margin-right: 10px"></i>
                                    </a>
                                </div>
                                <div class="accordion-body collapse" id="${_}{j}${_}{i}" style="height: 0px;">
                                    <div class="accordion-inner">
                                        <form>
                                        	<fieldset>
                                                <label class="span2">测试名称</label>
                                                <input class="span2" name="name" value="${_}{j}" readonly></input>
                                                <br>
	                                        	<label class="span2">测试标题</label>
                                                <input class="span2" name="title" value="${_}{data[i][j].title}"></input>
                                                <br>
                                                <label class="span2">测试描述</label>
                                                <textarea class="span2" name="desc">${_}{data[i][j].desc}</textarea>
                                                <br>
                                                <label class="span2">模拟描述</label>
                                                <textarea class="span2" name="simulation">${_}{data[i][j].simulation}</textarea>
                                                <br>
                                                <label class="span2">输入项描述</label>
                                                <textarea class="span2" name="input">${_}{data[i][j].input}</textarea>
                                                <br>
                                                <label class="span2">校验内容描述</label>
                                                <textarea class="span2" name="assert">${_}{data[i][j].assert}</textarea>
                                                <br>
                                                <button type="button" onclick="FireEvent.updateCase(this);" class="btn btn-small">保存</button>
                                                <button type="button" onclick="FireEvent.showCode('${_}{j}','${_}{i}');" class="btn btn-small">查看代码</button>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        <!--$}-->
                    <!--$}-->
                <!--$}-->
                <div class="accordion-group">
                    <div class="accordion-heading">
                        <a href="#newTestCase" data-toggle="collapse" class="accordion-toggle collapsed">
                        新增测试用例
                        </a>
                    </div>
                    <div class="accordion-body collapse" id="newTestCase" style="height: 0px;">
                        <div class="accordion-inner">
                            <form>
                                <fieldset>
                                	<label class="span2">测试名称</label>
                                    <input name="name" class="span2" value="">
                                    <br>
                                    <label class="span2">测试标题</label>
                                    <input name="title" class="span2" value="">
                                    <br>
                                    <label class="span2">测试描述</label>
                                    <textarea name="desc" class="span2"></textarea>
                                    <br>
                                    <label class="span2">模拟描述</label>
                                    <textarea name="simulation" class="span2"></textarea>
                                    <br>
                                    <label class="span2">输入项描述</label>
                                    <textarea name="input" class="span2"></textarea>
                                    <br>
                                    <label class="span2">校验内容描述</label>
                                    <textarea name="assert" class="span2"></textarea>
                                    <br>
                                    <button type="button" onclick="FireEvent.addNewCase(this);" class="btn btn-small">保存</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
    		</div>
		</div>
    </div>
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
    <script src="${B}breeze/lib/js/codemirror/javascript.js?v=1.3"></script>
    <script src="${B}breeze/swfupload/swfupload.js"></script>
    <script src="${B}breeze/swfupload/handlers.js"></script>

    <script>
        seajs.config({base:"${B}"});
        seajs.use(['manager_auxiliary/service/editGadgetTest'],
            function(a) {
                a.go("${B}breeze/framework/jsp/BreezeFW.jsp");
                window.FW = a;
            }
        );
    </script>
</body>
</html>