define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	require("breeze/framework/js/tools/formatJS")(FW);
	FW.register(
		{
			name:"editSMData",			
			param:{				
			},
			onCreate:function(){
				
			},
			TrigerEvent:{
				getFile:function(fileContent){
					//将file文件转换成json，并存入全局变量中
					this.MY.content = fileContent;
					var file = JSON.parse(fileContent);
					var data = {};
					var _package = [];

					for(var i in file){
						_package.push({
							name : i,
							selected :false
						});
					}

					this.MY.package = _package;

					data.package = _package;
					//把全局变量结构转成如下显示数据
					//+ 整个页面用于显示的数据如下：
					//{
					//	package:[
					//		{
					//			name:packageName,
					//			selected:true
					//		}
					//	],
					//	service:[
					//		{
					//			name:serviceName,
					//			selected:true
					//		}
					//	],
					//	smList:[
					//		{
					//			paramName:paramName,
					//			serviceParam:param
					//		}
					//	]
					//}
					//将这个数据show一次，使用视图view_selectService
					
					this.API.show("view_selectService",data);
				}
			},
			FireEvent:{
				selectPackage:function(packageDom){
					var file = JSON.parse(this.MY.content);
					//根据packageDomId获取选择的包的值
					//根据包的值组装显示数据
					var data = {};
					for(var i =0;i<this.MY.package.length;i++){
						if(this.MY.package[i].name == packageDom.value){
							this.MY.package[i].selected = true;
						}else{
							this.MY.package[i].selected = false;
						}
					}
					data.package = this.MY.package;

					var _service = [];

					for(var i in file[packageDom.value]){
						_service.push({
							name : i,
							selected : false
						});
					}

					this.MY.service = _service;
					data.service = _service;

					this.MY.packageSelect = packageDom;
					//show显示数据，视图：view_selectService
					this.API.show("view_selectService",data,"appEditSMData");
				},
				selectService:function(serviceDom){
					var file = JSON.parse(this.MY.content);
					//根据serviceDomId获取选择的service的值
					//根据service的值组装显示数据
					var data = {};
					for(var i =0;i<this.MY.service.length;i++){
						if(this.MY.service[i].name == serviceDom.value){
							this.MY.service[i].selected = true;
						}else{
							this.MY.service[i].selected = false;
						}
					}

					data.package = this.MY.package;
					data.service = this.MY.service;

					var _smList = [];

					for(var i in file[this.MY.packageSelect.value][serviceDom.value]){
						_smList.push({
							name : i,
							selected : false
						});
					}

					this.MY.smList = _smList;
					data.smList = _smList;

					this.MY.serviceSelect = serviceDom;
					//show显示数据，视图：view_selectService
					this.API.show("view_selectService",data);
				},
				selectParam:function(paramName){
					this.MY.smListSelect = paramName;

					var file = JSON.parse(this.MY.content);
					//根据paramName获取编辑对象
					//根据service的值组装编辑对象
					//+编辑数据结构如下：
					for(var i =0;i<this.MY.smList.length;i++){
						if(this.MY.smList[i].name == paramName.value){
							this.MY.smList[i].selected = true;
						}else{
							this.MY.smList[i].selected = false;
						}
					}
					var _file = file[this.MY.packageSelect.value][this.MY.serviceSelect.value][paramName.value];
					var _data = {};
					_data.name = paramName.value;
					_data.param = _file.param;
					_data.code = _file.code;

					_data.data = _file.data || "";

					//{
					//	name:名称
					//	param:参数
					//	code:结果码
					//	data:数据
					//}
					//show显示数据，视图：view_editService


					_data.param = FW.use("formatJS").js_beautify(_data.param);
					_data.data = FW.use("formatJS").js_beautify(_data.data);

					this.API.show("view_editService",_data);
				},
				submitEdit:function(editParam){
					//{
					//	oldName:旧名称
					//	newName:新名称
					//	param:参数
					//	code:结果码
					//	data:数据
					//}
					var file = JSON.parse(this.MY.content);
					var packageSelect = this.MY.packageSelect.value;
					var serviceSelect = this.MY.serviceSelect.value;
					var smListSelect = this.MY.smListSelect.value;

					file[packageSelect][serviceSelect][smListSelect].name = this.API.find("#name").val();
					file[packageSelect][serviceSelect][smListSelect].param = this.API.find("#param").val();
					file[packageSelect][serviceSelect][smListSelect].code = this.API.find("#code").val();
					file[packageSelect][serviceSelect][smListSelect].data = this.API.find("#data").val();

					//根据这个改动修改全局变量
					//将修改好的值转成json
					this.API.trigerOtherEvent("saveFile",file);
					//提交，回调函数{
					//	整理当前的数据
					//	show(view_selectService);
					//}
				}
			}
		}
	);
	return FW;
});