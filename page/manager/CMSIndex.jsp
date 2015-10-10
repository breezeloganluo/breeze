<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.HashSet"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<jsp:include page="../allhead.jsp"/>
<jsp:include page="./cmsallhead.jsp"/>
<jsp:include page="bgPower.jsp"/>
<%
	BreezeContext user = (BreezeContext)session.getAttribute("manager");
	if(user==null)return;
	BreezeContext roleCtx = user.getContext("role");
	String role = (String)roleCtx.getData();
	
	String mangerStr = (String) request.getAttribute("managerHomePageSeting");

    //获取角色，根据角色名称去获取managerHomePageSeting对应的设置
    //如果设置不存在，再取defalut
	BreezeContext mangerCtx = ContextTools.getBreezeContext4Json(mangerStr);
    
	BreezeContext settingCtx = null;
    
	settingCtx = mangerCtx.getContext(role);
    
	if(settingCtx == null){
		settingCtx = mangerCtx.getContext("default");//list
	}
	String B = (String)request.getAttribute("B");
	//获取html的设置
	BreezeContext htmlCtx = settingCtx.getContext("html");
	String html = "";
	if (htmlCtx!=null && !htmlCtx.isNull()){		
		html = htmlCtx.toString().replaceAll("\\$\\{B\\}",B);
	}
	//获取include的设置
	BreezeContext includeCtx = settingCtx.getContext("include");
	String includePage = null;
	if (includeCtx!=null && !includeCtx.isNull()){
		includePage = "/" + includeCtx.toString().trim();
	}
	
	//2015年4月15日15:27:22 FrankCheng 获取最小高度
	if(request.getAttribute("contentHigh")!=null){
		String contentHigh = request.getAttribute("contentHigh").toString();
		if(contentHigh.equals("--")){
			contentHigh = "";
		}else if(contentHigh.equals("default")){
			contentHigh = "style='min-height:700px;'";
		}else{
			contentHigh = "style='min-height:" + contentHigh + "px;'";
		}
		request.setAttribute("contentHigh", contentHigh);
	}

	//获取widget的设置
	BreezeContext widgetCtx = settingCtx.getContext("widgets");	
	//如果initMenuStatus为menu-min则收起面包屑breadcrumber
	//同时取消pendding的空隙
	String initMenuStatus = (String)request.getAttribute("initMenuStatus");
	String contentStyle ="";	
	if ("menu-min".equals(initMenuStatus)){
		contentStyle ="style='padding:0px 0px 0px;margin:0;'";
	}
	
	Object indexBackgroudImage = request.getAttribute("IndexBackgroudImage");
	if (indexBackgroudImage != null && !"--".equals(indexBackgroudImage)){
		request.setAttribute("indexBackgroudImage"," <img src='"+request.getAttribute("B")+indexBackgroudImage+"' style='width:100%;height:100%'/>");
	}
	Object footFont = request.getAttribute("footFont");
	Object headerJSP = request.getAttribute("headerJSP");
	Object leftMenuColor = request.getAttribute("leftMenuColor");
	
	Object footFontColor = request.getAttribute("footFontColor");
	if (footFontColor != null && !"--".equals(footFontColor.toString())){
		request.setAttribute("footFontColor", "style='color:"+footFontColor+"'");
	}
	
	Object footBackgroud = request.getAttribute("footBackgroud");
	if (footBackgroud != null && !"--".equals(footBackgroud.toString())){
		request.setAttribute("footBackgroud", "style='background-color:"+footBackgroud+"'");
	}
	String gadgetImport = "";
	HashSet<String> gadgetSet = new HashSet<String>();
%>
<!doctype html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" xmlns="http://www.w3.org/1999/xhtml"> <!--<![endif]-->
<head>
	<meta charset="UTF-8" />
	<title>${title}</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<meta content="" name="description" />
	<meta content="" name="author" />
	<!--[if IE]>
    	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <![endif]-->
	<!-- cssAssets -->
	<jsp:include page="cssAssets.jsp"/>
	<!-- /cssAssets -->
</head>

<%--新模板 并不支持多套样式 --%>
<%--<body class="skin-${managerstyle}">--%>

<body class="padTop53">
	<div id="wrap" style="background-color:${leftMenuColor }">
		<div id="top">
			<%if(headerJSP != null && !"--".equals(headerJSP.toString())){ %>
				<%String url="../customized/" + headerJSP.toString(); %>
				<jsp:include page="<%=url %>"/>
			<%}else{ %>
				<jsp:include page="header.jsp"/>
			<%} %>	
		</div>
		<div id="left">
			<jsp:include page="leftMenu.jsp"/>
		</div>
		<div id="content">
			<div class="inner" ${contentHigh}>
				<div style="width:100%;height:100%;position:absolute;left:0px;top:0px;z-index:0;">
					${indexBackgroudImage}
				</div>
                <div class="row">
                    <div class="col-lg-12">
                        <h2>首页</h2>
                    </div>
                </div>
                <hr />
                <div class="row">
                	<div class="page-content clearfix" <%=contentStyle%>>
						<%=html%>
						<%if(includePage !=null){ 
							out.flush();
							request.getRequestDispatcher(includePage).include(request, response);
						}%>
				   		<%if(widgetCtx != null){ %>
						<%		int len = 0;                                                                   %>
						<%		                                                                               %>
						<%		//先判断widgetCtx的类型（getType获取到的0，map 1，数组，2，是data）                              %>
						<%		//如果是data的话，直接把html标签贴进去                                                       				    %>
						<%		for (int i = 0; i < widgetCtx.getArraySize(); i++) {                          %>
						<%			//第i行                                                              								        %>
						<%			BreezeContext row = widgetCtx.getContext(i);                              %>
						<%			len = row.getArraySize();                                                  %>
						<%			for (int j = 0; j < row.getArraySize(); j++) {                             %> 
						<%				//第 i 列                                                    							            %>
						<%				BreezeContext col = row.getContext(j);                                 %>
						<%				for (int k = 0; k < col.getArraySize(); k++) {                         %>
						<%					//first widget                                                     %>
						<%					BreezeContext widget = col.getContext(k);                          %>
						<%                                                                                     %>
						<%					//gadgets                                                          %>
						<%					BreezeContext gadgetsd = widget.getContext("gadgetsd");//list      %>
						<%                                                                                     %>
						<%					for (int l = 0; l < gadgetsd.getArraySize(); l++) {                %>
						<%						BreezeContext widgetInfo = gadgetsd.getContext(l);             %>
						<%						                                                               %>
						<%
												String gadgetUrl = (String)widgetInfo.getContext("url").getData();
												if (!gadgetSet.contains(gadgetUrl)){
													gadgetSet.add(gadgetUrl);
													gadgetImport += ",'"+gadgetUrl+"'";
												}
																											   %>
						<%						                                                               %>
						<%					}                                                                  %>
						<%				}                                                                      %>
						<%			}                                                                          %>
						<%		}                                                                              %>
						<%		                                                                               %>
						<%		int[] spans = new int[len];                                                    %>
						<%		int span = 12/len;                                                             %>
						<%		                                                                               %>
						<%		if(span*len < 12){                                                             %>
						<%			for(int i=0;i<len;i++){                                                    %>
						<%				if(i<12-span*len){                                                     %>
						<%					spans[i] = span + 1;                                               %>
						<%				}else{                                                                 %>
						<%					spans[i] = span;                                                   %>
						<%				}                                                                      %>
						<%			}                                                                          %>
						<%		}else{                                                                         %>
						<%			for(int i=0;i<len;i++){                                                    %>
						<%				spans[i] = span;                                                       %>
						<%			}                                                                          %>
						<%		}                                                                              %>
						<%		                                                                               %>
					  	<div class="row-fluid">
						   	<div class="col-lg-12">
								<%for (int i = 0; i < widgetCtx.getArraySize(); i++) {%>
								<%BreezeContext row = widgetCtx.getContext(i);%>
									<div class="row-fluid">
										<%for (int j = 0; j < row.getArraySize(); j++) {%>
											<%BreezeContext col = row.getContext(j);%>
											<div class="col-lg-<%=spans[j] %>">
												<%for (int k = 0; k < col.getArraySize(); k++) {%>
													<%BreezeContext widget = col.getContext(k);%>
													<%BreezeContext gadgetsd = widget.getContext("gadgetsd");%>
													<div class="chat-panel panel panel-primary">
														<div class="panel-heading">
															<%=widget.getContextByPath("setting.title")%>
														</div>
														<div class="panel-body" style="height:100px">
															<div>
																<%int eachWidth=99/gadgetsd.getArraySize();%>
																<%for (int l = 0; l < gadgetsd.getArraySize(); l++) {%>
																	<%BreezeContext widgetInfo = gadgetsd.getContext(l);%>
																	<%BreezeContext param = widgetInfo.getContext("param");
																		BreezeContext style = widgetInfo.getContext("style");%>
																	<div class="FWApp" id="<%=widgetInfo.getContext("app")%>" style="display:inline-block;width:<%=eachWidth%>%;float:left;">
																	<!--@<%=widgetInfo.getContext("gadget")%>@
																			{
																				icon:"<%=(String) param.getContext("icon").getData()%>",
																				servervice:"<%=(String) param.getContext("servervice").getData()%>",
																				color:"<%=(String) param.getContext("color").getData()%>",
																				up:"<%=(String) param.getContext("up").getData()%>"
																			}
																	-->
																	</div>
																<%}%>
															</div>
														</div>
													</div>
												<%}%>
											</div>
										<%}%>
									</div>
								<%}%>
							</div>
					  	</div>
						<%} %>
					</div>
                </div>
            </div>
		</div>
	</div>
	<div ${footBackgroud } id="footer">
		<p ${footFontColor }>${footFont }</p>
	</div>
	<jsp:include page="footer.jsp"></jsp:include>
	<script>
		seajs.config({base:"${B}"});
		seajs.use( ['gadget/CMSTreeBase'<%=gadgetImport%>],function(a) {			
			a.go("${S}");
			window.FW = a;		
		});
	</script>
</body>
</html>