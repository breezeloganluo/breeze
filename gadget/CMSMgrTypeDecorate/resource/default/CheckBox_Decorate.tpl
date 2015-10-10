<div class="form-group">
	<label class="control-label col-lg-2">${data.metadata&&data.metadata.title}</label>
	<div class="col-lg-6" data-value="${data.appId}" data-type="${data.metadata.type}">
		<!--$var radioData = data.metadata.valueRange;-->
		<!--$for(var j=0;j<radioData.length;j++){-->
			<!--$for(var k in radioData[j]){-->
				<!--$if(data.data){-->
					<!--$for(var l=0;l<data.data.length;l++){-->
						<!--$if(data.data[l] == radioData[j][k]){-->
							<label class="checkbox-inline">
								<input name="${data.appId}" checked="checked" type="checkbox" value="${radioData[j][k]}">${k}</input>
							</label>
							<!--$break;-->
						<!--$}-->
						<!--$if(l==data.data.length-1){-->
							<label class="checkbox-inline">
								<input name="${data.appId}" type="checkbox" value="${radioData[j][k]}">${k}</input>
							</label>
						<!--$}-->
					<!--$}-->
				<!--$}else{-->
					<label class="checkbox-inline">
						<input name="${data.appId}" type="checkbox" value="${radioData[j][k]}">${k}</input>
					</label>
				<!--$}-->
			<!--$}-->
		<!--$}-->
	</div>
</div>