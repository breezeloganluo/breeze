<!--$if(data&&data.pageCount=="0"){-->
	
<!--$}else if(data&&data.pageCount=="1"){-->
	<div class="dataTables_paginate paging_simple_numbers">
		<ul class="pagination">
			<li class="pfirst disabled"><a href="javascript:void(0);"><i class="icon-double-angle-left"></i>首页</a></li>
		    	<li class="prev disabled"><a href="javascript:void(0);"><i class="icon-angle-left"></i>上一页</a></li>
			<li class="pagenum disabled"><a href="javascript:void(0);">1</a></li>
		    	<li class="next disabled"><a href="javascript:void(0);"  ><i class="icon-angle-right"></i>下一页</a></li>
			<li class="plast disabled"><a href="javascript:void(0);"><i class="icon-double-angle-right"></i>末页</a></li>
		</ul>
	</div>
<!--$}else{-->
	<div class="dataTables_paginate paging_simple_numbers">
		<ul class="pagination">
			<li class="${data.nowPage == 0 ? 'pfirst disabled' : 'pfirst' }" onclick="FireEvent.go2page('0');"><a href="javascript:void(0);"><i class="icon-double-angle-left"></i>首页</a></li>
		    	<li class="${data.nowPage == 0 ? 'prev disabled' : 'prev' }" onclick="FireEvent.go2page('${data.nowPage - 1}');"><a href="javascript:void(0);"><i class="icon-angle-left"></i>上一页</a></li>
			<!--$if(data.pageCount<=5){-->
				<!--$for(var i=0;i<data.pageCount;i++){-->
					<!--$if(i==data.nowPage){-->
						<li class="pagenum active"><a href="javascript:void(0);">${i+1}</a></li>
					<!--$}else{-->
						<li class="pagenum" onclick="FireEvent.go2page('${i}');"><a href="javascript:void(0);">${i+1}</a></li>
					<!--$}-->
				<!--$}-->
			<!--$}else{-->
				<!--$for(var i=data.nowPage-2;i<=data.nowPage+2;i++){-->
					<!--$if(i<0){continue;}-->
					<!--$if(i>data.pageCount-1){break;}-->
					<!--$if(i==data.nowPage){-->
						<li class="pagenum active"><a href="javascript:void(0);">${i+1}</a></li>
					<!--$}else{-->
						<li class="pagenum"><a href="javascript:void(0);" onclick="FireEvent.go2page('${i}');">${i+1}</a></li>
					<!--$}-->
				<!--$}-->
			<!--$}-->
		    	<li class="${data.nowPage == data.pageCount - 1 ? 'next disabled' : 'next' }" onclick="FireEvent.go2page('${data.nowPage+1}');"><a href="javascript:void(0);"  ><i class="icon-angle-right"></i>下一页</a></li>
			<li class="${data.nowPage == data.pageCount - 1 ? 'plast disabled' : 'plast' }" onclick="FireEvent.go2page('${data.pageCount-1}');"><a href="javascript:void(0);"><i class="icon-double-angle-right"></i>末页</a></li>
		</ul>
	</div>
<!--$}-->
