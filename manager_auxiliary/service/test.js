define(function(require, exports, module) {
	var FW = require("../../breeze/framework/js/BreezeFW");
	FW.register(
		{
			name:"test",
			onCreate:function(){
				var selectMod = FW.use().getParameter("isTest");
				var statusDisplay = selectMod?"进入真实环境":"进入模拟测试";
				this.API.show("view_main",statusDisplay);
				if (this.param.testData ){
					var allService = this.param.testData.d;
					for (var i=0;i<allService.length;i++){
						var sArr = allService[i].name.split(".");
						allService[i].package = sArr[0];
						allService[i].name = sArr[1];
					}
					
				}
				FW.use().createForm(this.param.objdesc,this.API.find("#form"),this.param.testData);
			},
			FireEvent:{
				submitData:function(){
					var testData = FW.use().getParameter("testData");
					if (!testData){
						testData = "testdata.js";
					}
					var postList = this.API.find("#form")[0].getData().d;
					this.API.initPost();
					for (var i=0;i<postList.length;i++){
						(function(oneData,API){
							oneData.testData = testData;
							oneData.paramName = oneData.paramName || "";
							var paramObj = eval("("+oneData.param+")");
							API.addPost(oneData.name,oneData.package,paramObj,
									function(code,data){
								oneData.code = code;
								if (/String/i.test(typeof(data))){
									oneData.data = data;
								}else{
									oneData.data = FW.use().toJSONString(data);
								}
								oneData.param = FW.use().toJSONString(paramObj);
							});
						})(postList[i],this.API);						
					};
					this.API.doPost(
							function(){
								this.API.show("view_result",postList);
							}
							);					
				},
				selectMode:function(){
					var testData = FW.use().getParameter("testData");
					var selectMod = FW.use().getParameter("isTest");
					var url = "testserver.jsp";
					if (!selectMod){
						url = url+"?isTest=true";
					}
					if (testData!=null){
						if (!selectMod){
							url = url+"&";
						}else{
							url =url +"?";
						}
						url = url + "testData="+testData;
					}
					window.location.href = url;
				},
				changeMode:function(dom){
					var selected = dom.value;
					var selectMod = FW.use().getParameter("isTest");
					var url = "testserver.jsp";
					if ("testdata.js" == selected){
						if (selectMod != null){
							url = url+"?isTest=true";
						}
					}else{
						url = url+"?testData="+selected;
						if (selectMod != null){
							url = url + "&isTest=true";
						}
					}
					window.location.href = url;
				}
			},
			TrigetEvent:{
				showAddContent:function(__type,__nodeId){
					
				}
			}
		}
	);
	return FW;
});
