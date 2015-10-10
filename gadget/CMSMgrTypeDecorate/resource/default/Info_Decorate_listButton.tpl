<div  id="modListMask"  class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;padding-top:53px">
	<div class="modal-dialog" style="min-width:1000px">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onClick="var args=[];var app = FW.getAPP('data\\.configuration');app.FireEvent.closeAddNew.apply(app,args);">×</button>
				<h4 class="modal-title" id="H2">详情页按钮编辑</h4>
			</div>
			<div class="modal-body">
				<table class="table table-striped table-bordered table-hover dataTable no-footer" aria-describedby="dataTables-example_info">
					<thead>
						<tr role="row">
							<th style='width:60px;' class='center'>选择</th>
							<th>显示名称</th>
							<th>单击事件</th>
							<th>type参数</th>
							<th>CMS权限名</th>
							<th>权限标识名</th>
							<th>事件节点</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style='width:30px;' class='center'>
								<label>
									<input type='checkbox' name="rowCheckbox"/>
									<span class='lbl'></span>
								</label>
							</td>
							<td attr-d="name">
								<input class="form-control"></input>
							</td>
							<td attr-d="onclick">
								<input class="form-control"></input>
							</td>
							<td attr-d="type">
								<input class="form-control"></input>
							</td>
							<td attr-d="authority">
								<input class="form-control"></input>
							</td>
							<td attr-d="actionKey">
								<input class="form-control"></input>
							</td>
							<td attr-d="dom">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
						</tr>
						<tr class="list-tr-hidden" style="display:none">
							<td style='width:30px;' class='center'>
								<label>
									<input type='checkbox' name="rowCheckbox"/>
									<span class='lbl'></span>
								</label>
							</td>
							<td attr-d="name">
								<input class="form-control"></input>
							</td>
							<td attr-d="onclick">
								<input class="form-control"></input>
							</td>
							<td attr-d="type">
								<input class="form-control"></input>
							</td>
							<td attr-d="authority">
								<input class="form-control"></input>
							</td>
							<td attr-d="actionKey">
								<input class="form-control"></input>
							</td>
							<td attr-d="dom">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<div style="width:220px;" class="hidden-phone visible-desktop btn-group pull-left">
					<button type="button" class="btn btn-xs btn-success btn-add-con" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectAdd.apply(app,args);">
						<i class="icon-plus bigger-120"> 增加</i>
					</button>
					<button type="button" class="btn btn-xs btn-info btn-sel-all" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectAll.apply(app,args);">
						<i class="icon-ok bigger-120"> 全选</i>
					</button>
					<button type="button" class="btn btn-xs btn-warning btn-sel-oppo" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectChange.apply(app,args);">
						<i class="icon-remove bigger-120"> 反选</i>
					</button>
					<button type="button" class="btn btn-xs btn-danger btn-del" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectDelete.apply(app,args);">
						<i class="icon-trash bigger-120"> 删除</i>
					</button>
				</div>
			</div>
			<div class="modal-footer">
				<input type="button" class="btn btn-success btn-lg btn-rect" value="确认提交" title="确认提交" onClick="var args=['listButton'];var app = FW.getAPP('data\\.configuration');app.FireEvent.saveAddNew.apply(app,args);">
				<input type="button" class="btn btn-primary btn-lg btn-rect" value="取消编辑" title="取消编辑"  onClick="var args=[];var app = FW.getAPP('data\\.configuration');app.FireEvent.closeAddNew.apply(app,args);">
            			</div>
        		</div>
    	</div>
</div>