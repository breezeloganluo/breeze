<div class="table-responsive">
	<div class="dataTables_wrapper form-inline" role="grid">
		<!--$var lastType = "";-->
		<!--$var isFirst = true;-->
		<!--$var _data = data;-->
		<table id="view_formObj" class="table table-striped table-bordered table-hover dataTable no-footer" aria-describedby="dataTables-example_info">
			<thead>
				<tr role="row">
					<!--$for(var i in _data.metadata){-->
						<!--$var oneMetadata = _data.metadata[i];-->
						<!--$if(oneMetadata.islist!="1"){continue;}else{-->
							${p:("getTableHeadDisplayData",oneMetadata.type,oneMetadata.title)}
						<!--$}-->
					<!--$}-->
					<!--$if(_data.listOperBtns){-->
						<th>操作</th>
					<!--$}-->
				</tr>
			</thead>
			<tbody>
				<!--$if(_data.data){-->
					<!--$for(var i=0;i<_data.data.length;i++){-->
						<tr>
							<!--$var oneData = _data.data[i];-->
							<!--$for(var j in _data.metadata){-->
								<!--$var data_value = j + "" +i;-->
								<!--$var oneMetadata = _data.metadata[j];-->
								<!--$if(oneMetadata.islist!="1"){continue;}-->
								<!--$if(oneMetadata.type=="CheckBox"||oneMetadata.type=="Hidden"||oneMetadata.type=="OuterLink"||oneMetadata.type=="List"||oneMetadata.type=="Html"||oneMetadata.type=="TextArea"||oneMetadata.type=="Pics"){-->
									<!--$continue;-->
								<!--$}-->
								<td>
									${p:("createTypeDecorateListData",data_value,oneMetadata.type,oneData&&oneData[j],oneMetadata)}
								</td>
							<!--$}-->
							<!--$if(_data.listOperBtns){-->
								<!--$listOperBtns = _data.listOperBtns;-->
								<td class="td_editbtn td_Button" colspan="${_data.listOperBtns.length}">
									<!--$for(var j=0;j<_data.listOperBtns.length;j++){-->
										<!--$var oneBtn = _data.listOperBtns[j];-->
										<!--$var btnClass = oneBtn.style;-->
										<!--$var btnSize = oneBtn.size || "btn-xs";-->
										<!--$var _id = "data"+i;-->
										<!--$if(oneBtn.oper.fun=="openMod"){-->
											<!--$if(oneBtn.authority){-->
												<a title="${oneBtn.title}" style="display:none" authority="${oneBtn.authority}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon glyphicon glyphicon-edit"></i>
												</a>
											<!--$}else if(oneBtn.actionKey){-->
												<a title="${oneBtn.title}" style="display:none" actionKey="${oneBtn.actionKey}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon glyphicon glyphicon-edit"></i>
												</a>
											<!--$}else{-->
												<a title="${oneBtn.title}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon glyphicon glyphicon-edit"></i>
												</a>
											<!--$}-->
										<!--$}else if(oneBtn.oper.fun=="deleteContent"){-->
											<!--$if(oneBtn.authority){-->
												<a title="${oneBtn.title}" style="display:none" authority="${oneBtn.authority}" class="btn ${btnSize} ${btnClass}"  href="javascript:void(0);" data-toggle="modal" data-target="#${_id}">
													<i class="ace-icon glyphicon glyphicon-trash"></i>
												</a>
											<!--$}else{-->
												<a title="${oneBtn.title}" class="btn ${btnSize} ${btnClass}"  href="javascript:void(0);" data-toggle="modal" data-target="#${_id}">
													<i class="ace-icon glyphicon glyphicon-trash"></i>
												</a>
											<!--$}-->
											<div class="col-lg-12">
												<div class="modal fade" id="${_id}" tabindex="-1" role="dialog"  aria-labelledby="myModalLabel" aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="H1">删除操作</h4>
															</div>
															<div class="modal-body">
																删除后不可恢复，您确定要删除吗？
															</div>
															<div class="modal-footer">
														    		<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
														    		<button type="button" class="btn btn-primary" onclick="FireEvent.btnEvent(${i},${j},this)">确认删除</button>
															</div>
													    	</div>
													</div>
												</div>
											</div>
										<!--$}else{-->
											<!--$if(oneBtn.authority){-->
												<a title="${oneBtn.title}" style="display:none" authority="${oneBtn.authority}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon ${oneBtn.icon}"></i>
												</a>
											<!--$}else if(oneBtn.actionKey){-->
												<a title="${oneBtn.title}" style="display:none" actionKey="${oneBtn.actionKey}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon ${oneBtn.icon}"></i>
												</a>
											<!--$}else{-->
												<a title="${oneBtn.title}" class="btn ${btnSize} ${btnClass}"  onclick="FireEvent.btnEvent(${i},${j},this)" href="javascript:void(0);">
													<i class="ace-icon ${oneBtn.icon}"></i>
												</a>
											<!--$}-->
										<!--$}-->
									<!--$}-->
								</td>
							<!--$}-->
						</tr>
					<!--$}-->
				<!--$}else{-->
					<tr class="list-none">
						<td colspan="100" style="padding:40px; font-size:16px; color:orange; text-align:center;">暂无数据
							<input type="hidden" name="data.dataMemo"/>
						</td>
					</tr>
				<!--$}-->
			</tbody>
		</table>
		<div class="row">
			<div class="col-sm-9">
				${p:("childrenData",0)}
			</div>
		</div>
	</div>
</div>
