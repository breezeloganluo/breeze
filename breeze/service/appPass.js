define(function(require, exports, module) {
	var FW = require("../framework/js/BreezeFW");
	FW.register(
		{
			name:"appPass",
			onCreate:function(){	

				var data = [{name:"林浩旋"},{name:"饭饭"}];
				data = FW.use().toJSONString(data);  //测试
				
				data = FW.use().evalJSON(data);      //测试
				
				//this.API.show("viewTestData",data);
				
				//搜集所有的addpost   到了doPost才统一发  但前提是要initPost 初始化
//				this.API.initPost();
//				this.API.addPost("lhx","lhx",this.param.manager,
//						function(code,data){
//							alert(1);
//				});
//				alert(10);
//				this.API.addPost("lhx","lhx",this.param.manager,
//						function(code,data){
//							alert(2);
//				});
//				this.API.addPost("lhx","lhx",this.param.manager,
//						function(code,data){
//							alert(3);
//				});
//				this.API.doPost();
				
				
				
				//doserver方法
				this.API.doServer("lhx","lhx",this.param.manager,function(code,data){
					
					this.API.show("viewPass",data);
					var myForm=this.API.find("#myForm");
//					alert(myForm.find("#abcd"));
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