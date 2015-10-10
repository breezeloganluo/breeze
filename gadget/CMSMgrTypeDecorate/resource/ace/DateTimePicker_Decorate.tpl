<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata.title}</label>
	<div class="col-lg-5 input-group bootstrap-timepicker" data-value="${data.appId}" data-type="${data.metadata.type}">
		<input name="timepicker" type="text" class="form-control datetimepicker" value="${data.data||''}" data-date-format="yyyy-mm-dd hh:ii:ss">
		</input>
	</div>
</div>