<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata&&data.metadata.title}</label>
	<div class="col-lg-6 picsUpload" data-value="${data.appId}" data-type="${data.metadata.type}">
		<textarea class="form-control" style="display:none">${data&&data.data||""}</textarea>
		<div style="margin-top:5px;" class="btn btn-mini btn-info" href="javascript:void(0);">
			<i class="icon-search bigger-120"></i>
			<span id="spanButtonPlaceholder"></span>
		</div>
		<div id="divFileProgressContainer" class="ProgressContainer"></div>
		<div id="PicsField" class="PicsClass">
			<!--$if(data.data){-->
				<!--$for(var i=0;i<data.data.length;i++){-->
					<div class='PicItem'>
						<div class='picsThumb'>
							<img data-src="${data.data[i].picUrl}" src="${B}/${data.data[i].picUrl}"/>
						</div>
						<a href='javascript:void(0)' class='delpic'>删除</a>
						<input style="width:106px;" type="text" value="${data.data[i].alt}" placeholder="图片描述" />
					</div>					
				<!--$}-->
			<!--$}-->
		</div>
	</div>
</div>