define(function(require, exports, module) {
	var FW = require("../framework/js/BreezeFW");
	FW.register(
		{
			name:"appTestData",
			onCreate:function(){	


				
				//doserver方法
				this.API.doServer("lhx","lhx",this.param.manager,function(code,data){
					
					this.API.show("viewTestData",data);
					var myForm=this.API.find("#myForm");
					alert(myForm.find("#abcd"));
				});
				//this.API.find("#abc"); 获取form表单
				//this.API.mask("viewTestData",data,500,500);
				this.API.find("#abc");
			},
			FireEvent:{
				//所有事件
				eventSubmit:function()
				{
					alert("您提交了");
				},
				checkNotNull:function(tt)
				{
					if(tt.value=="")
					{
						alert("不能为空");
					}
				}
			},
			TrigerEvent:{
				//所有触发点
				testClick:function()
				{
					alert("你触发了按钮");
				}
			}
		}
	);
	return FW;
});