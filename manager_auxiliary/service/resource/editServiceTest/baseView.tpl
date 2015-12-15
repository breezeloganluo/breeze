<h4 class="header green">测试基本信息</h4>

<div class="widget-box">
  <div class="widget-header">
    <h4><i class="icon-dashboard"></i></h4>
    
  </div>

  <div class="widget-body">
    <div class="widget-main no-padding">


<form class="form-horizontal" role="form" id="baseinfo">
  <div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">service名称</label>
      <div class="col-sm-9">
        <span class="input-icon">
          <input type="text" name="servicename" value="${data.servicename}">
          <i class="icon-leaf blue"></i>
        </span>
    </div>
  </div>
  
  <div class="form-group">
    <label class="col-sm-3 control-label no-padding-right">service所在包名</label>
      <div class="col-sm-9">
        <span class="input-icon">
          <input type="text" name="package" value="${data.package}">
          <i class="icon-bookmark-empty blue"></i>
        </span>
    </div>
  </div>
  
  
  <div class="form-actions center">
    <button type="button" class="btn btn-sm btn-success" onclick="FireEvent.saveBase('baseinfo')">
      确定
      <i class="icon-arrow-right icon-on-right bigger-110"></i>
    </button>
  </div>
  
</form>




    </div>
  </div>
</div>

