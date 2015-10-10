<div class="chat-panel panel panel-primary" id="roleactiongroupView">
	<div class="panel-heading">
		请选择权限组
	</div>
	<div class="panel-body">
		<div class="row">
			<!--$for(var i=0;i<data.length;i++){-->
				<div class="col-lg-3">
					<div class="checkbox">
						<label>
							<!--$if(data[i].selected){-->
									<input class="uniform" roleactiongroupcid="${data[i].cid}" type="checkbox" value="${data[i].displayName}" checked="checked">
							<!--$}else{-->
									<input class="uniform" roleactiongroupcid="${data[i].cid}" type="checkbox" value="${data[i].displayName}">
							<!--$}-->
							${data[i].displayName}
						</label>
					</div>
				</div>
			<!--$}-->
		</div>
		<button class="btn btn-xs btn-success no-border" onclick="FW.trigerEvent('save');">
			<i class="icon-ok bigger-150"></i>
			保存
		</button>
		<button class="btn btn-xs btn-warning no-border" onclick="FireEvent.goBack();">
			<i class="icon-undo bigger-150"></i>
			返回
		</button>
	</div>
</div>