<!--$for (var i=0;i<data.length;i++){-->
   <div class="well">
		<h4 class="green smaller lighter">${data[i]}</h4>
	    <a href="javascript:void(0)" onclick="FireEvent.showDatabaseTable('${data[i]}')">去编辑</a>|<a href="#"  onclick="FireEvent.removeDBSelected('${i}',true)">取消关注</a>
   </div>
<!--$}-->
