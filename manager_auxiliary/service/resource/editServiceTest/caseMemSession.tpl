<div class="row">
                                                           <div class="col-sm-6">
                                                               <h3 class="row header smaller lighter green">
                                                                    <span class="col-sm-8">
                                                                        <i class="icon-bell-alt"></i>
                                                                        内存设置
                                                                    </span><!-- /span -->

                                                                    <span class="col-sm-4">
                                                                        <label class="pull-right inline">
                                                                            <a href="#" class="icon-plus-sign-alt bigger-160 btn-primary" onclick="FireEvent.addCaseMemSession('${data.idx}','globel')">
                                                                            </a>
                                                                        </label>
                                                                    </span><!-- /span -->
                                                               </h3>
                                                               <div class="container-fluid ">
                                                                     <!--这里是内容-->
                                                                     <!--$for (var n in data.globel){-->
                                                                     <div class="row alert alert-success">
                                                                     	<div class="col-sm-2" style="padding: 0;">
                                                                            <input type="text" id="memset${n}key" value="${n}" style="width:100%"/>
                                                                        </div>
                                                                        <div class="col-sm-8">
                                                                            <input type="text" id="memset${n}value" value="${data.globel[n]}" style="width:100%"/>
                                                                        </div>
                                                                        <div class="col-sm-2">
                                                                            <a href="javascript:void(0)" class="icon-ok  bigger-110 icon-only btn-success" title="确定修改" onclick="FireEvent.modifyCaseMem('${data.idx}','${n}')"></a>
                                                                            <a href="javascript:void(0)" class="icon-trash  bigger-110 icon-only btn-warning" title="删除"></a>
                                                                        </div>
                                                                     </div>
                                                                     <!--$}-->
                                                               </div>
                                                           </div>
                                                           
                                                           
                                                           
                                                           
                                                           <div class="col-sm-6">
                                                           		<h3 class="row header smaller lighter orange">
                                                                	<span class="col-sm-8">
                                                                        <i class="icon-bell-alt"></i>
                                                                        session设置
                                                                    </span><!-- /span -->

                                                                    <span class="col-sm-4">
                                                                        <label class="pull-right inline">
                                                                            <a href="#" class="icon-plus-sign-alt bigger-160 alert-danger"  onclick="FireEvent.addCaseMemSession('${data.idx}','session')">
                                                                            </a>
                                                                        </label>
                                                                    </span><!-- /span -->
                                                                </h3>
                                                                <div class="container-fluid ">
                                                                     <!--这里是内容-->
                                                                     <!--$for (var n in data.session){-->
                                                                     <div class="row alert alert-danger">
                                                                     	<div class="col-sm-2" style="padding: 0;">
                                                                        	<input type="text" value="${n}" style="width:100%" id="sessionset${n}key"/>
                                                                        </div>
                                                                        <div class="col-sm-8">
                                                                            <input type="text" value="${data.session[n]}" style="width:100%" id="sessionset${n}value"/>
                                                                        </div>
                                                                        <div class="col-sm-2">
                                                                            <a href="javascript:void(0)" class="icon-ok  bigger-110 icon-only btn-success" title="确定修改" onclick="FireEvent.modifyCaseSession('${data.idx}','${n}')"></a>
                                                                            <a href="javascript:void(0)" class="icon-trash  bigger-110 icon-only btn-warning" title="删除"></a>
                                                                        </div>
                                                                     </div>
                                                                     <!--$}-->
                                                               </div>
                                                           </div>
</div>