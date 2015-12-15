<!--$for (var i=0;i<data.length;i++){-->
   <div class="well">
	    <!--$if (data[i].selected != null){-->
           <h4 class="red smaller lighter">${data[i].name}</h4>
           <a href="javascript:void(0)" onclick="FireEvent.removeDBSelected('${data[i].name}')">取消关注</a>
        <!--$}else{-->
           <h4 class="green smaller lighter">${data[i].name}</h4>
           <a href="javascript:void(0)" onclick="FireEvent.addDBSelected('${data[i].name}')">关注</a>
        <!--$}-->
   </div>
<!--$}-->
