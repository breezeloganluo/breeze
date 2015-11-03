<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata&&data.metadata.title}</label>
	<!--$if(data.metadata.fieldType && data.metadata.ourterLink){-->
		<div class="col-lg-6" data-value="${data.appId}" data-type="${data.metadata.type}" outer-data="${data.metadata.ourterLink}">
	<!--$}else{-->
		<div class="col-lg-6" data-value="${data.appId}" data-type="${data.metadata.type}">
	<!--$}-->
		<input readonly class="form-control" value="${data&&data.data||''}">
	</div>
</div>