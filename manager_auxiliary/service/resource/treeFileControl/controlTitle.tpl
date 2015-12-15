<ul class="breadcrumb">
  <li>
    <i class="icon-align-left"></i>    
  </li>
  
  <!--$for(var n in data.sigList){-->
  
  <!--$if (data.curSig != n){-->
  <li>
  	<a href="#" onclick="FireEvent.selectTitleControl('${n}');return false;">${data.sigList[n].name}</a>
  </li>
  <!--$}else{-->
  <li>
  	${data.sigList[n].name}
  </li>
  <!--$}-->
  
  
  <!--$}-->
</ul>