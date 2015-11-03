<div class="page-header">
	<h1>
		<a href="CMSAceMgr.jsp">
			首页
		</a>
		<small>
			<i class="ace-icon fa fa-angle-double-right"></i>
			${data.titleData}
			<div class="pull-right" id="btnAction">
				<div class="btn-toolbar">							
					<div class="btn-group">
						<!--$if(data.btnData&&data.btnData.length){-->
							<!--$var _data = data.btnData;-->
							<button data-toggle="dropdown" class="btn btn-info btn-sm dropdown-toggle" aria-expanded="false">
								操作
								<span class="ace-icon fa fa-caret-down icon-on-right"></span>
							</button>
								<ul class="dropdown-menu dropdown-info dropdown-menu-right">
									<!--$__data = _data;-->
									<!--$for(var i=0;i<_data.length;i++){-->
										<!--$var oneMenuCtx = _data[i];-->
										
										<li>
											<!--$if(oneMenuCtx.authority){-->
												<a style="display:none" authority="${oneMenuCtx.authority}" href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}','${__data[i].type}')">${oneMenuCtx.name}</a>
											<!--$}else if(oneMenuCtx.actionKey){-->
												<a style="display:none" actionKey="${oneMenuCtx.actionKey}" href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}','${__data[i].type}')">${oneMenuCtx.name}</a>
											<!--$}else{-->
												<a href="javascript:void(0);" onclick="FireEvent.clickEvn('${__data[i].onclick}','${__data[i].type}')">${oneMenuCtx.name}</a>
											<!--$}-->
										</li> 
									<!--$}-->
								</ul>
							</li>
						<!--$}else{-->
							<button class="btn btn-info btn-sm" onclick="FW.trigerEvent('goBack');" type="button">
								返回
								<span class="ace-icon fa fa-caret-down icon-on-right"></span>
							</button>
						<!--$}-->
					</div>
				</div>
			</div>
		</small>
	</h1>
</div>