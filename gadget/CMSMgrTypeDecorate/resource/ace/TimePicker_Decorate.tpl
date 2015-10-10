<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata.title}</label>
	<div class="col-lg-5 input-group bootstrap-timepicker" data-value="${data.appId}" data-type="${data.metadata.type}">
		<input name="timepicker" type="text" class="form-control timepicker-24" value="${data.data||''}">
		</input>
		<span class="input-group-addon">
			<i class="fa fa-clock-o bigger-110"></i>
		</span>
	</div>
</div>