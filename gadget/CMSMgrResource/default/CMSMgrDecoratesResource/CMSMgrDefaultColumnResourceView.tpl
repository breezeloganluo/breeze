<div class="row">
	<div class="col-lg-12">
    		<div class="box">
    			<header>
        			<a href="CMSBaseMgr.jsp">
        				<div class="icons">
        					<i class="icon-home" style="font-size:22px;"></i>
        				</div>
        			</a>
            			<h5 id="aliasTitle">${data.titleData}</h5>
				<div class="toolbar">
					<ul class="nav">
						<!--$if(data.btnData&&data.btnData.length){-->
							<!--$var _data = data.btnData;-->
							<li class="dropdown">
								<a data-toggle="dropdown" class="dropdown-toggle" style="color:black" href="#">操作<b class="caret"></b></a>
								<ul class="dropdown-menu">
									<!--$__data = _data;-->
									<!--$for(var i=0;i<_data.length;i++){-->
										<!--$var oneMenuCtx = _data[i];-->
										
										<li>
											<!--$if(oneMenuCtx.authority){-->
												<a style="display:none" authority="${oneMenuCtx.authority}" href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}')">${oneMenuCtx.name}</a>
											<!--$}else if(oneMenuCtx.actionKey){-->
												<a style="display:none" actionKey="${oneMenuCtx.actionKey}" href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}')">${oneMenuCtx.name}</a>
											<!--$}else{-->
												<a href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}')">${oneMenuCtx.name}</a>
											<!--$}-->
										</li> 
									<!--$}-->
								</ul>
							</li>
						<!--$}else{-->
							<li>
								<a onclick="FW.trigerEvent('goBack');" href="javascript:void(0)"; style="color:black">返回
									<i class="icon-chevron-left"></i>
								</a>
							</li>
						<!--$}-->
					</ul>
				</div>
			</header>
		</div>
	</div>
</div>
<hr/>
<div class="row">
	${p:("childrenData",0)}
</div>
