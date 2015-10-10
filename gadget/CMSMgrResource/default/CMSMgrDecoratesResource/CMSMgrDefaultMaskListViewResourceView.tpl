<div  id="modListMask"  class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;padding-top:53px">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="table-responsive">
				<div class="dataTables_wrapper form-inline" role="grid">
					<!--$var lastType = "";-->
					<!--$var isFirst = true;-->
					<!--$var _data = data.data;-->
					<table id="view_formObj" class="table table-hover dataTable no-footer" aria-describedby="dataTables-example_info">
						<thead>
							<tr role="row">
								<th>选择</th>
								<!--$for(var i in _data.metadata){-->
									<!--$var oneMetadata = _data.metadata[i];-->
									<!--$if(oneMetadata.islist!="1" && i != "cid"){continue;}-->
									<!--$switch(oneMetadata.type){-->
										<!--$case "List":-->
										<!--$case "CheckBox":-->
										<!--$case "Html":-->
										<!--$case "TextArea":-->
										<!--$case "Pics":{-->
											<!--$break;-->
										<!--$}-->
										<!--$case "Hidden":{-->
											<th style="display:none">
												${oneMetadata.title}
											</th>
											<!--$break;-->
										<!--$}-->
										<!--$case "ReadOnly":-->
										<!--$case "DatePicker":-->
										<!--$case "TimePicker":-->
										<!--$case "Select":-->
										<!--$case "Radio":-->
										<!--$case "Text":{-->
											<th>
												${oneMetadata.title}
											</th>
											<!--$break;-->
										<!--$}-->
									<!--$}-->
								<!--$}-->
							</tr>
						</thead>
						<tbody>
							<!--$if(_data.data){-->
								<!--$for(var i=0;i<_data.data.length;i++){-->
									<tr>
										<td>
											<input name="mask" type="radio"></input>
										</td>
										<!--$var oneData = _data.data[i];-->
										<!--$for(var j in _data.metadata){-->
											<!--$var oneMetadata = _data.metadata[j];-->
											<!--$if(oneMetadata.islist!="1" && j != "cid"){continue;}-->
											<!--$switch(oneMetadata.type){-->
												<!--$case "ReadOnly":-->
												<!--$case "Text":{-->
													<td key="${j}">${oneData[j]||""}	</td><!--$break;-->
												<!--$}-->
												<!--$case "DatePicker":{-->
													<td key="${j}">${oneData[j]?FW.use("DateTime").formatTimeStamp(oneData[j],"yyyy-MM-dd"):""}</td><!--$break;-->
												<!--$}-->
												<!--$case "TimePicker":{-->
													<td key="${j}">${oneData[j]?FW.use("DateTime").formatTimeStamp(oneData[j],"hh:mm:ss"):""}</td><!--$break;-->
												<!--$}-->
												<!--$case "Radio":-->
												<!--$case "Select":{-->
													<td key="${j}">
														<!--$var chooseValue = oneMetadata.valueRange;-->
														<!--$for(var k=0;k<chooseValue.length;k++){-->
															<!--$for(var l in chooseValue[k]){-->
																<!--$if(chooseValue[k][l]==oneData[j]){-->
																	${l}
																	<!--$break;-->
																<!--$}-->
															<!--$}-->
														<!--$}-->
													</td>
													<!--$break;-->
												<!--$}-->
												<!--$case "Hidden":{-->
													<td style="display:none" key="${j}">${oneData[j]||""}</td><!--$break;-->
												<!--$}-->
												<!--$case "List":-->
												<!--$case "CheckBox":-->
												<!--$case "Html":-->
												<!--$case "TextArea":-->
												<!--$case "Pics":{-->
													<!--$break;-->
												<!--$}-->
											<!--$}-->
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
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal" onClick="FW.trigerEvent('closeMask');">关闭</button>
                			<button type="button" class="btn btn-primary" onClick="FW.trigerEvent('maskChooseData');">保存</button>
            			</div>
        		</div>
    	</div>
</div>