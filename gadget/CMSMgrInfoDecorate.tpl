<div class="panel panel-default">
	<div class="panel-body">
		<div id="wizard" role="application" class="wizard">
			<div class="steps clearfix">
				<ul role="tablist">
					<!--$for(var i=0;i<data.length;i++){-->
						<li role="tab" class="done" info-key="${data[i].value}" aria-disabled="false" aria-selected="false">
							<a href="javascript:void(0);" onclick="FW.trigerEvent('changeInfoTag','${data[i].value}');" aria-controls="wizard-p-0">
								<span class="number"></span>${data[i].title}
							</a>
						</li>
					<!--$}-->
				</ul>
			</div>
			<!--$for(var i=0;i<data.length;i++){-->
				<textarea style="display:none" info-id="${data[i].value}" info-name="${data[i].name}" info-value="${data[i].value}" class="col-lg-12">${data[i].desc||""}</textarea>
			<!--$}-->
		</div>
	</div>
</div>