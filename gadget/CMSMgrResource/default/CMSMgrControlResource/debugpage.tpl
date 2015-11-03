<form class="form-horizontal">
	<div class="form-group">
		<label class="control-label col-lg-2">alias</label>
		<div class="col-lg-6" data-value="data.titile" data-type="Text">
			<input type="text" class="form-control" value="${data.alias}">
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-lg-2">gadget</label>
		<div class="col-lg-6" data-value="data.type" data-type="Text">
			<input type="text" class="form-control" value="${data.gadgetName}">
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-lg-2">所在路径</label>
		<div class="col-lg-6" data-value="data.typename" data-type="Text">
			<input type="text" class="form-control" value="${data.gadgetDir}">
		</div>
	</div>
	
	<div class="form-actions no-margin-bottom" style="text-align:center;">
		<input type="button" class="btn btn-success btn-lg btn-rect" value="编辑gadget" title="确认提交" onclick="FireEvent.editControl('${data.gadgetDir}')">
		<input type="button" class="btn btn-primary btn-lg btn-rect" value="返回列表" title="返回列表" onclick="alert('暂时不返回')">
	</div>
</form>