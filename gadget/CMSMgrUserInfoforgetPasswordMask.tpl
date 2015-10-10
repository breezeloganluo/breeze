<div class="modal fade in" id="statusMaskView" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onClick="FireEvent.cancelSelected();">×</button>
                <h4 class="modal-title" id="H2">密保验证</h4>
            </div>
            <div class="modal-body">
               <form role="form">
		            <div class="form-group">
		                <label>请选择密保问题</label>
		                <select id="select" class="form-control">
							<!--$for(var i in data){-->
								<!--$if(/question/ig.test(i)){-->
								<option id="${i}">${data[i]}</option>
								<!--$}-->
							<!--$}-->
						</select>
		            </div>
		            <div class="form-group">
		                <label>请输入密保答案</label>
		                <input name="securityanswer" id="securityanswerMask" class="form-control" placeholder="请输入密保答案">
		            </div>
		        </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" onClick="FireEvent.cancelSelected();">关闭</button>
                <button type="button" class="btn btn-primary" onClick="FireEvent.saveSelect('securityanswerMask');">找回密码</button>
            </div>
        </div>
    </div>
</div>