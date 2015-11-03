<div id="fitlerLocation_mainAppWithFilter">
	<!--$if(data){-->
		<!--$var filterSet = data.filterData;-->
		<div class="form-horizontal">
			<!--$for(var i=0;i<filterSet.length;i++){-->
				<label class="col-lg-1">${filterSet[i].displayName}</label>
				<!--$var _data=filterSet[i];-->
				<!--$var metadata = data.metadata;-->
				<div>
					<div class="btn-group">
						<!--$if(_data.filterName!="opertime" && !/Picker/i.test(metadata[_data.filterName].fieldType)){-->
							<!--$for(var j=0;j<filterSet[i].filterValue.length;j++){-->
								<!--$if(data.selectData&& data.selectData["%"+filterSet[i].filterName+"%"]&& data.selectData["%"+filterSet[i].filterName+"%"]==_data.filterValue[j].Value){-->
									<a type="checkbox" class="btn btn-default btn-line btn-sm active" name="${_data.filterName}" value="${_data.filterValue[j].Value}" onClick="FireEvent.chooseFilter('${filterSet[i].filterName}','${_data.filterValue[j].Value}');">${_data.filterValue[j].Name}</a>
								<!--$}else{-->
									<a type="checkbox" class="btn btn-default btn-line btn-sm" name="${_data.filterName}" value="${_data.filterValue[j].Value}" onClick="FireEvent.chooseFilter('${filterSet[i].filterName}','${_data.filterValue[j].Value}');">${_data.filterValue[j].Name}</a>
								<!--$}-->
							<!--$}-->
						<!--$}else{-->
							<!--$var start = "";-->
							<!--$var end= "";-->
							<!--$if(data.selectData && data.selectData[_data.filterName] && data.selectData[_data.filterName].length > 1){-->
								<!--$start = FW.use('DateTime').formatTimeStamp(data.selectData[_data.filterName][0],'yyyy/MM/dd');-->
								<!--$end = FW.use('DateTime').formatTimeStamp(data.selectData[_data.filterName][1],'yyyy/MM/dd');-->
							<!--$}-->
							<div class="input-daterange input-group">
								<input type="text" class="input-sm form-control" name="${_data.filterName}" data-t="start" value="${start}">
								<span class="input-group-addon">
									<i class="fa fa-exchange"></i>
								</span>
								<input type="text" class="input-sm form-control" name="${_data.filterName}" data-t="end" value="${end}">
							</div>
						<!--$}-->
					</div>
				</div>
			<!--$}-->
		</div>
	<!--$}-->
</div>
${p:("childrenData",0)}
