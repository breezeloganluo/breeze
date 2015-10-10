<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata.title}</label>
	<div class="col-lg-6" data-value="${data.appId}" data-type="${data.metadata.type}">
		<div id="wizard" role="application">
			<div class="tabbable">
				<ul class="nav nav-tabs">
					<!--$for(var i=0;i<data.cfgList.length;i++){-->
					<li role="tab" class="done" aria-disabled="false" aria-selected="fals"e>
						<a href="javascript:void(0);" aria-controls="wizard-p-0" onclick="FireEvent.changeInfo('${data.cfgList[i].sig}',this)">
							<span class="number"></span>${data.cfgList[i].name}
						</a>
					</li>
					<!--$}-->
				</ul>
			</div>
			<!--$for (var n in data.cfgData){-->
			<textarea style="display:none" info-id="${n}" class="col-lg-12">${data.cfgData[n]}</textarea>
			<!--$}-->			
		</div>
	</div>
</div>