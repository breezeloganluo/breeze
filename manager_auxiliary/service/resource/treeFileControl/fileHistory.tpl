    <h3 class="header smaller lighter grey">
        <i class="icon-th-large blue"></i>
        ${data.dir}的历史文件信息
        
       
       <i class="pull-right bigger-130 icon-reply-all"></i>
       
          
    </h3>
	<ol class="dd-list">
        <!--$for(var i=0;i<data.length;i++){-->
        <li class="dd-item">
              <div class="dd-handle">
                  <i class="icon-stackexchange orange"></i>${p:("formattime",data[i])}
                  <a class="pull-right bigger-130 icon-reply-all orange2" href="#none" onclick="FireEvent.recovery('${data.dir}','${data[i]}')"></a>
              </div>
		<!--$}-->
		</li>
	</ol>