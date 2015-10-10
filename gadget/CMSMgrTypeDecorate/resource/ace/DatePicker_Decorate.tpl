<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata.title}</label>
	<div class="col-lg-6 input-group" data-value="${data.appId}" data-type="${data.metadata.type}">
		<input class="form-control date-picker" type="text" data-date-format="yyyy-mm-dd" value="${data.data||''}"/>
		<span class="input-group-addon">
			<i class="fa fa-calendar bigger-110"></i>
		</span>
	</div>
</div>