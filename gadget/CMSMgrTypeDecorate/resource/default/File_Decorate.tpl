<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata&&data.metadata.title}</label>
	<div class="col-lg-6 pic" data-value="${data.appId}" data-type="${data.metadata.type}">
		<div class="input-group">
			<!--$if(data.data){-->
				<input type="text" class="inp_file_val form-control" name="fId_hidden" value="${data.data}" >
			<!--$}else{-->
				<input type="text" class="inp_file_val form-control" name="fId_hidden">
			<!--$}-->
			<span class="btn btn-sm btn-info thumbBtn input-group-addon">上传</span>
			<input style="opacity:0; cursor:pointer; filter:alpha(opacity=0);width:62px; margin-right:-42px; overflow:hidden; position:relative; left:-62px; zindex:10;" id="${data.appId}" name="upload" type="file" />
		</div>
	</div>
</div>