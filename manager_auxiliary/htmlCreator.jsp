<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
		<jsp:include page="../page/allhead.jsp" />
        
		<% request.setAttribute( "S",request.getAttribute( "B")+ "breeze/framework/jsp/BreezeFW.jsp"); %>
			<html>

			<head>
				<meta charset="utf-8" />
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
            <!--@config@{"manager_auxiliary":"/manager_auxiliary","../":"/"}-->
			</head>

			<body>
				<div>
					

					<div id="breadcrumbs" class="breadcrumbs textctrclose">
						<ul class="breadcrumb">
							<li> <i class="icon-home home-icon"></i>
								<a href="index.jsp">返回菜单</a>
								<span class="divider"> <i class="icon-angle-right arrow-icon"></i>
					</span>
							</li>
							<li class="active">

							</li>
						</ul>
						
						<div id="appMainWithSearch" class="FWApp nav-search" style="display: block;">
							<div id="baseSearchView">
								<form id="detailSearch" class="form-search" onsubmit="var args=['order_cumstomer_search'];var app = FW.getAPP('appMainWithSearch');app.FireEvent.search.apply(app,args);return false;" style="display: none;">
									<span class="input-icon">
							<input type="text" autocomplete="off" id="order_cumstomer_search" class="input-small nav-search-input" placeholder="Search ...">
							<i class="icon-search nav-search-icon"></i>
						</span>
								</form>
							</div>
						</div>
						
					</div>
				
					
					
					<div class="page-content clearfix">						
						<div class="page-header position-relative textctrclose">
							<h1 id="pageH1">
					<div class="pull-right" id="btnAction">
						<!--按钮部分，注释掉-->
						<div class="btn-toolbar">
							<div class="btn-group">
								<button class="btn btn-success dropdown-toggle" data-toggle="dropdown" >
									<i class="icon-cogs"></i>
									操作
									<span class="caret"></span>
								</button>
								<ul class="dropdown-menu dropdown-primary pull-right">
									<li>
										<a href="javascript:void(0)" onclick="FireEvent('htmledit.preview')"><i class="icon-edit"></i>预览</a>
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
						<div class="sidebar-shortcuts-large FWApp" id="htmledit" reserve="true">
							<!--@editHtml@
								{
								
								}
							-->
							<div class="textctrclose" style="width: 240px;text-align: right;height: 0px;">
							 <a href="#" onclick="FireEvent('htmledit.hideCtr');">&lt;&lt;</a>
							</div>
							<div class="textctropen" style="width: 240px;text-align: left;height: 20px;display:none">
							 <a href="#" onclick="FireEvent('htmledit.showCtr')">&gt;&gt;</a>
							</div>
							
							<div class="textctrclose" id="leftMenu" style="width: 20%;">
								
							</div>

							<div id="mainedit" style="width:80%;float:left">
							这里是内容哈
							</div>
						</div>

					</div>
					<!-- ====================== -->
					<!--PAGE CONTENT ENDS HERE-->

				</div>
				<!--/.main-container-->

				<!--resource begin-->
				<div style="display:none">
					<div class="FWRES" APPID="htmledit"  RESID="menuContent">
						<div class="nodetree clearfix" id="fileMemberTree">
							<div id="viewNodeTree">
								<div class="well">
									<h4 class="blue">相关资源</h4>
									<div id="nodeTree" class="tree"></div>
								</div>
							</div>
						</div>
						<div style=";border:1px solid #F00;background:#FFF; color:000#;position:fixed;left:290px;top:5px;width:60%;height:auto !important;z-index:100">
							标签内容：按照提示可以选择，按tab键补全<br/>
							<div id="tips"></div>
							
						</div>
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="tipsContent">
						<!--$for(var i=0;i<data.length;i++){-->
							${_}{data[i]}&nbsp;
						<!--$}-->
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="textEdit">
						<div id="infoForm" class="form-horizontal clearfix">
						</div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveHTML();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确认
							</a>
						</div>
						
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="otherEdit">
						<iframe id="otherFrame" src="${_}{data}" style="width: 100%;height: 100%; " frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes">
							
						</iframe>
					</div>
					<div class="FWRES" APPID="htmledit"  RESID="cfgEdit">
						<p>以下是所有配置信息</p>
						<div style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;" id="cfgForm">
							<table>
								<!--$for(var n in data){-->
								<tr>
									<td width="40%" align="center"><input name="name" value="${_}{n}"/>:</td>
									<td width="60%" align="left">
										<input name="value" value="${_}{data[n]}"/>
										<a href="#" onclick="FireEvent.delCfg('${_}{n}')">删除</a>
									</td>
								</tr>
								<!--$}-->
							</table>
						</div>
                        <div>
                        <p>注意：[img]表示是图片路径，编辑了图片路径信息，左边菜单会出现图片编辑菜单入口;</p>
                        <p>注意：所有配置信息编辑后，记得回到基本信息中点保存文件</p>
                        </div>
						<div id="submitBtn" style="padding:20px 0 0 180px; border-top:1px solid #E2E2E2;">
							<a href="javascript:void(0)" onclick="FireEvent.saveCfg();" class="btn btn-info">
								<i class="icon-ok bigger-110"></i>
								确定
							</a>
							
							<a href="javascript:void(0)" onclick="FireEvent.addCfg();" class="btn btn-warning">
								<i class="icon-ok bigger-110"></i>
								添加
							</a>
						</div>
					</div>
                    <div class="FWRES row-fluid" APPID="htmledit" RESID="imgEdit">
                    	<div class="form-group">
                            <div class="span10 picsUpload">
                                <textarea class="form-control" style="display:none"></textarea>
                                <div style="margin-top:5px;" class="btn btn-mini btn-info" href="javascript:void(0);">
                                    <i class="icon-search bigger-120"></i>
                                    <span id="spanButtonPlaceholder"></span>
                                </div>
                                <div id="divFileProgressContainer" class="ProgressContainer"></div>
                                <div id="PicsField" class="PicsClass">
                                    <!--$if(typeof data != "undefined" && data.length > 0){-->
                                        <!--$for(var i=0;i<data.length;i++){-->
                                            <div class='PicItem'>
                                                <div class='picsThumb'>
                                                    <img src="${B}${_}{data[i].picUrl}"/>
                                                </div>
                                                <input style="width:106px;" type="text" value="${_}{data[i].alt}" placeholder="图片描述" />
                                            </div>					
                                        <!--$}-->
                                    <!--$}-->
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
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
				<script src="${B}breeze/lib/js/codemirror/javascript.js?v=1.3"></script>
                <script src="${B}breeze/swfupload/swfupload.js"></script>
                <script src="${B}breeze/swfupload/handlers.js"></script>
				<script src="${B}config/config.jsp"></script>
				<script>
					//一下这段代码是从fuelux.tree.min.js中抄录过来，因为这段封装的不好，其中包含了
					//--关于菜单树点击后的事件处理，这个处理没有封装出去，而原先这个函数
					//--仅仅是针对原来伟光管理端的做法，trigerEvent到一个指定地方，这样做非常不灵活，因此
					//--这里移植过来再做调整
					var initMenu = function(a, c) {
						var b = function(e, d) {
							this.$element = a(e);
							this.options = a.extend({},
							a.fn.tree.defaults, d);
							this.$element.on("click", ".tree-item", a.proxy(function(f) {
								if(!$(f.currentTarget).hasClass("tree-selected")){
									this.selectItem(f.currentTarget);
									//--------------这就是写死的代码
									FireEvent('htmledit.menuSelect',$(f.currentTarget).find("div[cid]").attr("cid"),$(f.currentTarget).find("div[cid]").attr("ctalias"));
								}
							},
							this));
							// this.$element.on("click", ".tree-folder-name", a.proxy(function(f) {
							// 	$(f.currentTarget).parent().addClass("tree-selected");
							// },
							// this));
							this.$element.on("click", ".tree-folder-header>i", a.proxy(function(f) {
								this.selectFolder($(f.currentTarget).parent()[0]);
								// alert();
							},
							this));
							this.render()
						};
						b.prototype = {
							constructor: b,
							render: function() {
								this.populate(this.$element)
							},
							populate: function(f) {
								var e = this;
								var d = f.parent().find(".tree-loader:eq(0)");
								d.show();
								this.options.dataSource.data(f.data(),
								function(g) {
									d.hide();
									a.each(g.data,
									function(h, j) {
										var i;
										if (j.type === "folder") {
											i = e.$element.find(".tree-folder:eq(0)").clone().show();
											i.find(".tree-folder-name").attr("cid",h).attr("ctalias",j.ctalias).html(j.name);
											i.find(".tree-loader").html(e.options.loadingHTML);
											var k = i.find(".tree-folder-header");
											k.data(j);
											if ("icon-class" in j) {
												k.find('[class*="icon-"]').addClass(j["icon-class"])
											}
										} else {
											if (j.type === "item") {
												i = e.$element.find(".tree-item-item:eq(0)").clone().show();
												i.find(".tree-item-name").attr("cid",h).attr("ctalias",j.ctalias).html(j.name);
												i.data(j)
											}
										}
										if (f.hasClass("tree-folder-header")) {
											f.parent().find(".tree-folder-content:eq(0)").append(i)
										} else {
											f.append(i)
										}
									});
									e.$element.trigger("loaded")
								})
							},
							selectItem: function(e) {
								if (this.options.selectable == false) {
									return
								}
								var d = a(e);
								var g = this.$element.find(".tree-selected");
								var f = [];
								if (this.options.multiSelect) {
									a.each(g,
									function(i, j) {
										var h = a(j);
										if (h[0] !== d[0]) {
											f.push(a(j).data())
										}
									})
								} else {
									if (g[0] !== d[0]) {
										g.removeClass("tree-selected").find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"]);
										f.push(d.data())
									}
								}
								if (d.hasClass("tree-selected")) {
									d.removeClass("tree-selected");
									d.find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"])
								} else {
									d.addClass("tree-selected");
									d.find("i").removeClass(this.options["unselected-icon"]).addClass(this.options["selected-icon"]);
									if (this.options.multiSelect) {
										f.push(d.data())
									}
								}
								if (f.length) {
									this.$element.trigger("selected", {
										info: f
									})
								}
							},
							selectFolder: function(e) {
								var d = a(e);
								var f = d.parent();
								if (d.find("." + this.options["close-icon"]).length) {
									if (f.find(".tree-folder-content").children().length) {
										f.find(".tree-folder-content:eq(0)").show()
									} else {
										this.populate(d)
									}
									f.find("." + this.options["close-icon"] + ":eq(0)").removeClass(this.options["close-icon"]).addClass(this.options["open-icon"]);
									this.$element.trigger("opened", d.data())
								} else {
									if (this.options.cacheItems) {
										f.find(".tree-folder-content:eq(0)").hide()
									} else {
										f.find(".tree-folder-content:eq(0)").empty()
									}
									f.find("." + this.options["open-icon"] + ":eq(0)").removeClass(this.options["open-icon"]).addClass(this.options["close-icon"]);
									this.$element.trigger("closed", d.data())
								}
							},
							selectedItems: function() {
								var e = this.$element.find(".tree-selected");
								var d = [];
								a.each(e,
								function(f, g) {
									d.push(a(g).data())
								});
								return d
							}
						};
						a.fn.tree = function(e, g) {
							var f;
							var d = this.each(function() {
								var j = a(this);
								var i = j.data("tree");
								var h = typeof e === "object" && e;
								if (!i) {
									j.data("tree", (i = new b(this, h)))
								}
								if (typeof e === "string") {
									f = i[e](g)
								}
							});
							return (f === c) ? d: f
						};
						a.fn.tree.defaults = {
							multiSelect: false,
							loadingHTML: "<div>Loading...</div>",
							cacheItems: true
						};
						a.fn.tree.Constructor = b
					};
					//(window.jQuery);
				</script>

				<script>
					seajs.config({
						base: "${B}"
					});
					seajs.use(['manager_auxiliary/service/editHtml'], function(a) {
						a.go("${S}");
						window.FW = a;
					});
				</script>

			</body>

			</html>