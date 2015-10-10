<div class="form-group">
	<label class="control-label col-lg-2">${data.title}</label>
	<div class="col-lg-10" data-value="${data.appId}" data-type="${data.metadata.type}">
		<table class="table table-striped table-bordered table-hover dataTable no-footer" aria-describedby="dataTables-example_info">
			<thead>
				<tr role="row">
					<!--$var lastTitle="";-->
					<th style='width:60px;' class='center'>选择</th>
					<!--$for(var i in data.metadata){-->
						<!--$var thTitle = data.metadata[i].title;-->
						<!--$var _id="data."+i;-->
						<!--$if(thTitle==lastTitle){continue;}-->
						<!--$lastTitle=thTitle;-->
						<!--$if(data.metadata[i].type=="Button"){-->
							<th>${thTitle}</th>
						<!--$}else if(data.metadata[i].type=="Hidden"){-->
							<th style="display:none">${thTitle}</th>
						<!--$}else if(data.metadata[i].type.indexOf("Hidden")!=-1){-->
							<th style="display:none">${thTitle}</th>
						<!--$}else{-->
							<!--$if(data.metadata[i].type=="CheckBox" || data.metadata[i].type=="Radio" || data.metadata[i].type=="Html" || data.metadata[i].type=="List"){-->
								<!--$continue;-->
							<!--$}-->
							<th>${thTitle}</th>
						<!--$}-->
					<!--$}-->
				</tr>
			</thead>
			<tbody>
			<!--$if(data.data){-->
				<!--$for(var i=0;i<data.data.length;i++){-->
					<!--$if(i%2==0){-->
						<tr class="gradeA odd">
					<!--$}else{-->
						<tr class="gradeA even">
					<!--$}-->
					<td style='width:30px;' class='center'>
						<label>
							<input name="rowCheckbox" data-checkbox="${data.appId}[${i}]" type='checkbox' idx='${i}'/>
							<span class='lbl'></span>
						</label>
					</td>
					<!--$for(var j in data.metadata){-->
						<!--$var data_list_value = data.appId + "[" + i  +"]." + j; -->
						<!--$var data_list_type = data.metadata[j].type;-->
						<!--$var oneMetadata = data.metadata[j];-->
						<!--$var oneData = data.data[i][j];-->
						<!--$if(typeof oneData == "object"){oneData = FW.use().toJSONString(oneData);}-->
						<!--$if(oneMetadata.type == "Text" || oneMetadata.type == "Hidden_Text"){-->
							<!--$if(oneMetadata.type == "Hidden_Text"){-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
							<!--$}else{-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<!--$}-->
							<input class="form-control" value="${oneData||''}">
						<!--$}else if(oneMetadata.type == "ReadOnly"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
								<input class="form-control" readonly value="${oneData||''}">
						<!--$}else if(oneMetadata.type == "DatePicker"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
								<input type="text" class="form-control datepicker" value="${oneData!=null?FW.use('DateTime').formatTimeStamp(oneData,'yyyy-MM-dd'):''}" >
						<!--$}else if(oneMetadata.type == "TimePicker"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}" class="col-lg-2">
							<div class="input-group bootstrap-timepicker">
								<input class="timepicker-24 form-control" type="text" value="${oneData!=null?FW.use('DateTime').formatTimeStamp(oneData,'hh:mm:ss'):""}">
								<span class="input-group-addon add-on"><i class="icon-time"></i></span>
							</div>
						<!--$}else if(oneMetadata.type == "TextArea" || oneMetadata.type == "Hidden_TextArea"){-->
							<!--$if(oneMetadata.type == "Hidden_TextArea"){-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
							<!--$}else{-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<!--$}-->
							<textarea class="form-control">${oneData||''}</textarea>
						<!--$}else if(oneMetadata.type == "Hidden"){-->
							<td style="display:none" data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
								<input class="form-control" value="${oneData||''}">
						<!--$}else if(oneMetadata.type == "Select" || oneMetadata.type == "Hidden_Select"){-->
							<!--$if(oneMetadata.type == "Hidden_Select"){-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
							<!--$}else{-->
								<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<!--$}-->
							<select class="form-control">
								<!--$for(var k=0;k<oneMetadata.valueRange.length;k++){-->
									<!--$for(var l in oneMetadata.valueRange[k]){-->
										<!--$if(oneData && oneData == oneMetadata.valueRange[k][l]){-->
											<option value="${oneData}" selected="selected">${l}</option>
										<!--$}else{-->
											<option value="${oneMetadata.valueRange[k][l]}">${l}</option>
										<!--$}-->
									<!--$}-->
								<!--$}-->
							</select>
						<!--$}else if(oneMetadata.type.indexOf("Button")!=-1){-->
							<td>
								<button type="button" class="btn btn-private btn-xs" onclick="FW.trigerEvent('openModMask','${i}','${data.appId}');">
									<i class="ace-icon fa fa-wrench  bigger-110 icon-only"></i>
								</button>
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
			<tr class="list-tr-hidden" style="display:none">
				<td style="width:30px;" class="center">
					<label>
						<input name="rowCheckbox" type="checkbox" data-checkbox="${data.appId}[99]">
						<span class="lbl"></span>
					</label>
				</td>
				<!--$for(var j in data.metadata){-->
					<!--$var data_list_value = data.appId + "[99]." + j; -->
					<!--$var data_list_type = data.metadata[j].type;-->
					<!--$var oneMetadata = data.metadata[j];-->
					<!--$if(oneMetadata.type == "Text" || oneMetadata.type == "Hidden_Text"){-->
						<!--$if(oneMetadata.type == "Hidden_Text"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
						<!--$}else{-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
						<!--$}-->
						<input class="form-control">
					<!--$}else if(oneMetadata.type == "ReadOnly"){-->
						<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<input class="form-control" readonly>
					<!--$}else if(oneMetadata.type == "Hidden"){-->
						<td style="display:none" data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<input class="form-control">
					<!--$}else if(oneMetadata.type == "DatePicker"){-->
						<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
							<input type="text" class="form-control datepicker">
					<!--$}else if(oneMetadata.type == "TimePicker"){-->
						<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}" class="col-lg-2">
							<div class="input-group bootstrap-timepicker">
								<input class="timepicker-24 form-control" type="text">
								<span class="input-group-addon add-on"><i class="icon-time"></i></span>
							</div>
					<!--$}else if(oneMetadata.type == "TextArea" || oneMetadata.type == "Hidden_TextArea"){-->
						<!--$if(oneMetadata.type == "Hidden_TextArea"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
						<!--$}else{-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
						<!--$}-->
						<textarea class="form-control"></textarea>
					<!--$}else if(oneMetadata.type == "Select" || oneMetadata.type == "Hidden_Select"){-->
						<!--$if(oneMetadata.type == "Hidden_Select"){-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type.replace('Hidden_','')}" data-list-key="${j}" style="display:none">
						<!--$}else{-->
							<td data-list-value="${data_list_value}" data-list-type="${data_list_type}" data-list-key="${j}">
						<!--$}-->
						<select class="form-control">
							<!--$for(var k=0;k<oneMetadata.valueRange.length;k++){-->
								<!--$for(var l in oneMetadata.valueRange[k]){-->
									<option value="${oneMetadata.valueRange[k][l]}">${l}</option>
								<!--$}-->
							<!--$}-->
						</select>
					<!--$}else if(oneMetadata.type.indexOf("Button")!=-1){-->
						<td>
							<button type="button" class="btn btn-private btn-xs" onclick="FW.trigerEvent('openModMask','${i}','${data.appId}');">
								<i class="ace-icon fa fa-wrench  bigger-110 icon-only"></i>
							</button>
					<!--$}-->
					</td>
				<!--$}-->
				</tr>
			</tbody>
		</table>
		<div style="width:220px;" class="hidden-phone visible-desktop btn-group pull-left">
			<button type="button" class="btn btn-xs btn-success btn-add-con" onClick="FW.trigerEvent('selectAdd',this);">
				<i class="icon-plus bigger-120"> 增加</i>
			</button>
			<button type="button" class="btn btn-xs btn-info btn-sel-all" onClick="FW.trigerEvent('selectAll',this);">
				<i class="icon-ok bigger-120"> 全选</i>
			</button>
			<button type="button" class="btn btn-xs btn-warning btn-sel-oppo" onClick="FW.trigerEvent('selectChange',this);">
				<i class="icon-remove bigger-120"> 反选</i>
			</button>
			<button type="button" class="btn btn-xs btn-danger btn-del" onClick="FW.trigerEvent('selectDelete',this);">
				<i class="icon-trash bigger-120"> 删除</i>
			</button>
		</div>
	</div>
</div>