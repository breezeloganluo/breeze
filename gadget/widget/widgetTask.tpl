<ul id="tasks" class="item-list ui-sortable">
	<!--$for(var i=0;i<data.length;i++){-->
	<li class="item-orange clearfix">
		<label class="inline">
			<a class="lbl" href="${Cfg.baseUrl}/${data[i][0].taskurl}">${data[i][0].taskName}</a>
		</label>

		<div class="pull-right easy-pie-chart percentage easyPieChart" data-size="30" data-color="#ECCB71" data-percent="42" style="width: 30px; height: 30px; line-height: 30px;">
			<span class="percent">${data[i][0].taskCount}</span>
			<canvas width="33" height="33" style="width: 30px; height: 30px;"></canvas>
		</div>
	</li>
	<!--$}-->
	
</ul>