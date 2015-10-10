<div class="form-group">
	<!--$var alias = data.metadata.ourterLink.split(".")[0];-->
	<label class="control-label col-lg-2">${data.metadata.title}</label>
	<div class="col-lg-6 input-group" data-value="${data.appId}" data-type="${data.metadata.type}" outer-data="${data.metadata.ourterLink}">
		<input type="text" readonly class="form-control" value="${data.data||''}">
		<span class="input-group-addon outerLinkEdit" onClick="FW.trigerEvent('openMask','${alias}','mask');">选择</span>
	</div>
</div>