<div class="form-group" style="display:none">
	<label class="control-label col-lg-2">${data.metadata&&data.metadata.title}</label>
	<div class="col-lg-6" data-value="${data.appId}" data-type="${data.metadata.type}">
		<input type="text" class="form-control" value="${data.data||''}">
	</div>
</div>