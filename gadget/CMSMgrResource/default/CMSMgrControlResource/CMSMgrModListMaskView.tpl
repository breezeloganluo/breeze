<div  id="modListMask"  class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;padding-top:53px">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onClick="FW.trigerEvent('closeModMask');">×</button>
				<h4 class="modal-title" id="H2">模型编辑</h4>
			</div>
			<div class="modal-body">
				<form role="form" id="modMask">
					<!--$for(var i in data.metadata){-->
						<!--$var oneMetadata = data.metadata[i];-->
						<!--$var oneData = data.data[i] || "";-->
						<!--$if(typeof oneData == "object"){oneData = FW.use().toJSONString(oneData);}-->
						<div class="form-group">
							<label mod-value="data.${i}" mod-key="${i}" mod-type="${oneMetadata.type}">${oneMetadata.title}</label>
							<!--$if(oneMetadata.type=="Text"){-->
								<input   class="form-control" value="${oneData}">
							<!--$}else if(oneMetadata.type=="TextArea"){-->
								<textarea class="form-control" rows="3">${oneData}</textarea>		            			
							<!--$}else if(oneMetadata.type=="Select"){-->
								<select class="form-control">
									<!--$for(var j=0;j<oneMetadata.valueRange.length;j++){-->
										<!--$for(var k in oneMetadata.valueRange[j]){-->
											<!--$if(oneMetadata.valueRange[j][k] == oneData){-->
												<option value="${oneMetadata.valueRange[j][k]}" selected>${k}</option>
											<!--$}else{-->
												<option value="${oneMetadata.valueRange[j][k]}">${k}</option>
											<!--$}-->
										<!--$}-->
									<!--$}-->
								</select>
		            					<!--$}-->
                      					</div>
					<!--$}-->
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal" onClick="FW.trigerEvent('closeModMask');">关闭</button>
                			<button type="button" class="btn btn-primary" onClick="FW.trigerEvent('saveModMask','${data.key}','${data.id}');">保存</button>
            			</div>
        		</div>
    	</div>
</div>