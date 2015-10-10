<!--$if(data.showData){-->
	<div id="tagLocation_mainAppWithTag">
		<ul id="tagView" class="nav nav-tabs padding-18">
			<!--$for(var i=0;i<data.showData.length;i++){-->
				<!--$if(data.showData[i].selected){-->
					<li class="active">
						<a href="javascrpt:void(0)" data-toggle="tab">${data.showData[i].showName}</a>
					</li>
				<!--$}else{-->
					<li>
						<a href="javascript:void(0)" sonalias="wmssku" data-toggle="tab" onclick="FireEvent.changeTag('${data.showData[i].alias}');">${data.showData[i].showName}</a>
					</li>
				<!--$}-->
			<!--$}-->
		</ul>
	</div>
<!--$}-->
<div class="panel panel-default">
	<div class="panel-body">
		${p:("childrenData",0)}
	</div>
</div>