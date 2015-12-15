

  <div class="widget-box"> 
   <div class="widget-header" style="text-align: left;"> 
    <h4><i class="bigger-130 icon-plus-sign-alt orange" href="#none"></i>添加目录</h4> 
    <div class="widget-toolbar"> 
     <a href="#" onclick="FW.unblockUI();"> <i class="icon-remove"></i> </a> 
    </div> 
   </div> 
   <div class="widget-body"> 
    <div class="widget-main"> 
     
     <div style="text-align:left"> 
      <label class="blue">当前目录是：${data}，请输入您要添加的新目录</label>
      <input type="text" class="form-control" id="newDirName" placeholder="目录名"></input> 
     </div> 
     <hr /> 
     <button class="btn  btn-success" onclick="FireEvent.newDir('${data}')">
     <i class="icon-ok"></i>
             确定
     </button>
                                            
     <button class="btn " onclick="FW.unblockUI();">
     <i class="icon-ok"></i>
             取消
     </button>                           

    </div> 
   </div> 
  </div>
