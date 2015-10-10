<div id="fitlerLocation_mainAppWithFilter">
	<!--$if(data){-->
		<!--$var filterSet = data.filterData;-->
		<div class="form-horizontal">
			<!--$for(var i=0;i<filterSet.length;i++){-->
				<label class="col-lg-1">${filterSet[i].displayName}</label>
				<!--$var _data=filterSet[i];-->
				<div>
					<div class="btn-group">
						<!--$if(!filterSet[i].type){-->
							<!--$for(var j=0;j<filterSet[i].filterValue.length;j++){-->
								<!--$if(data.selectData&&data.selectData[filterSet[i].filterName]&&data.selectData[filterSet[i].filterName]==_data.filterValue[j].Value){-->
									<a type="checkbox" class="btn btn-default btn-line btn-sm active" name="${_data.filterName}" value="${_data.filterValue[j].Value}" onClick="FireEvent.chooseFilter('${filterSet[i].filterName}','${_data.filterValue[j].Value}');">${_data.filterValue[j].Name}</a>
								<!--$}else{-->
									<a type="checkbox" class="btn btn-default btn-line btn-sm" name="${_data.filterName}" value="${_data.filterValue[j].Value}" onClick="FireEvent.chooseFilter('${filterSet[i].filterName}','${_data.filterValue[j].Value}');">${_data.filterValue[j].Name}</a>
								<!--$}-->
							<!--$}-->
						<!--$}-->
					</div>
				</div>
			<!--$}-->
		</div>
	<!--$}-->
</div>
${p:("childrenData",0)}