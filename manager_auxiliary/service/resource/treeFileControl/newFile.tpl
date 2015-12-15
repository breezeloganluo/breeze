

  <div class="widget-box"> 
   <div class="widget-header" style="text-align: left;"> 
    <h4>
      <!--$if (fileGlobleSetting.icon != null){-->
      <img src="${fileGlobleSetting.icon}" width="20" height="24" ></img>
      <!--$}else{-->
      <i class="bigger-130 icon-plus orange" href="#none"></i>
      <!--$}-->
    
      添加文件
    </h4> 
    <div class="widget-toolbar"> 
     <a href="#" onclick="FW.unblockUI();"> <i class="icon-remove"></i> </a> 
    </div> 
   </div> 
   <div class="widget-body"> 
    <div class="widget-main"> 
     
     <div style="text-align:left"> 
      <label class="blue">当前目录是：${data}，请输入文件名</label>
      <input type="text" class="form-control" id="newFileName" placeholder="目录名"></input> 注意不用填写扩展名
     </div> 
     <hr /> 
     
     <!--$for(var i=0;i<curGlobleSetting.length;i++){-->
     	<a class="btn  btn-success" href="#" onclick="FireEvent.newFile('${data}',${i});return false;" title="${curGlobleSetting[i].name}">
     	<!--$if (curGlobleSetting[i].icon != null){-->
           <img src="${curGlobleSetting[i].icon}" widht="18" height="18"></img>
        <!--$}else{-->
           <i class="icon-ok"></i>
        <!--$}-->
        ok
        </a>
     <!--$}-->
    </div> 
   </div> 
  </div>
