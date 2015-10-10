define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	var formOper = require("breeze/framework/js/tools/FormOper");
	require("./textMod");
	require("./graphyFunMod");
	var Q = require("breeze/framework/js/tools/qunee-module");
	FW.register({
		name: "editGadget",
		onCreate: function() {
			this.MY.textMod = FW.createApp("textMod", "textMod", this);
		},
		public: {
			initNew: function(txt) {
				var classMod = this.MY.classMod;
				if (/string/.test(typeof(txt))) {
					classMod = this.MY.classMod = this.MY.textMod.createClassMod(txt);
					if (!classMod){
						alert("文件解析失败！");
						return null;
					}
				}
				if (/object/.test(typeof(txt))) {
					if (txt){						
						classMod = this.MY.classMod =  FW.createApp("classMod","classMod",this);
						classMod.setMod(txt);
					}					
				}

				var tree = this.MY.treeMod = FW.getAPP("fileMemberTree");
				tree.setClassMod(classMod);
				tree.showClass();
				var graphy = this.MY.graphyMod = FW.getAPP("funGraphy");
				graphy.setClassMod(classMod);
				this.showBase();
			},
			newGadget:function(){
				var newGadget = {
					name:"newGadget",
					functionFragment:{
						onCreate:{
							type:"onCreate",
							name:"onCreate",
							fragments:[{
								type:"normal",
								command:"toDO"
							}
							]
						}
					}
				}
				this.initNew(newGadget);
			},
			showBase: function() {
				this.API.show("baseInfo");
				var openDom = this.API.find("#infoForm");
				//合成数据描述
				var metadata = {
					name: {
						title: "类名",
						type: "Text",
						desc: "文件类类名"
					},
					"extends": {
						title: "继承项",
						type: "List",
						valueRange: [{
							name: {
								title: "类名",
								type: "Text",
							}
						}]
					},
					include: {
						title: "引用包",
						type: "List",
						valueRange: [{
							vName: {
								title: "引用后变量名",
								type: "Text"
							},
							vDir: {
								title: "类路径",
								type: "Text"
							}
						}]
					},
					comments: {
						title: "类说明",
						type: "TextArea"
					}
				}
					//转化成数据
				var modData = this.MY.classMod.getMod();
				var data = {
					name: modData.name,
					include: modData.include,
					comments: modData.comments,
					"extends": []
				}

				for (var i = 0;modData["extends"] && i < modData["extends"].length; i++) {
					var n = modData["extends"][i];
					data["extends"].push({
						name: n
					});
				}

				//显示数据
				formOper.createFormByObjDesc(metadata, openDom, data);
				$("#actionName").html(data.name + ".js");
			},
			saveBase: function() {
				var openDom = this.API.find("#infoForm");
				var data = openDom[0].getData();
				var modData = this.MY.classMod.getMod();
				modData.name = data.name;
				modData.include = data.include;
				modData["extends"] = [];
				for (var i = 0; data["extends"] && i < data["extends"].length; i++) {
					modData["extends"].push(data["extends"][i].name);
				};
				modData.comments = data.comments;
				this.initNew();
			},
			showAttribute: function(attObj) {
				this.API.show("attInfo");
				var openDom = this.API.find("#infoForm");
				//将编辑数据，记录到form中
				openDom[0].attObj = attObj;
				//合成数据描述
				var metadata = {
						name: {
							title: "属性名",
							type: "Text",
							desc: "属性名称"
						},
						"content": {
							title: "属性值",
							type: "Text",
							desc: "属性的初始值,全是字符串类型"
						},
						comments: {
							title: "类说明",
							type: "TextArea"
						}
					}
					//转化成数据
				var data = attObj;
				//显示数据
				formOper.createFormByObjDesc(metadata, openDom, data);
			},
			newAttribute: function() {
				if (!this.MY.classMod) {
					alert("没有可操作的Gadget");
					return;
				}
				this.MY.graphyMod.destroy();
				var mod = this.MY.classMod.getMod();
				var newAttr = {
					name: "newName",
					content: "content",
					comments: "comments"
				}
				mod.attributeFragment.push(newAttr);
				this.showAttribute(newAttr);
			},
			delAttribute: function() {
				var mod = this.MY.classMod.getMod();
				var openDom = this.API.find("#infoForm");
				var oldData = openDom[0].attObj;
				//重新排列属性数组
				var attrArr = mod.attributeFragment;
				mod.attributeFragment = [];
				for (var i = 0; i < attrArr.length; i++) {
					var one = attrArr[i];
					if (one.name == oldData.name) {
						continue;
					}
					mod.attributeFragment.push(one);
				}
				this.initNew();
			},
			saveAttribute: function() {
				var openDom = this.API.find("#infoForm");
				var newData = openDom[0].getData();
				var oldData = openDom[0].attObj;
				oldData.name = newData.name;
				oldData.content = newData.content;
				oldData.comments = newData.comments;
				this.initNew();
			},
			showFunBase: function(funObj) {
				this.MY.graphyMod.destroy();
				this.API.show("funBaseInfo");
				var openDom = this.API.find("#infoForm");
				//将编辑数据，记录到form中
				openDom[0].funObj = funObj;
				//合成数据描述
				var metadata = {
						name: {
							title: "函数名",
							type: "Text",
							desc: "函数名"
						},
						type: {
							title: "类型",
							type: "Select",
							valueRange: [{
								"onCreate": "onCreate"
							}, {
								"public": "public"
							}, {
								"private": "private"
							}, {
								"FireEvent": "FireEvent"
							}, {
								"TrigerEvent": "TrigerEvent"
							}]
						},
						desc: {
							title: "描述",
							type: "TextArea",
							desc: "函数的描述"
						},
						parameters: {
							title: "参数",
							type: "List",
							valueRange: [{
								name: {
									title: "名称",
									type: "Text",
								},
								desc: {
									title: "描述",
									type: "Text"
								}
							}]
						},
						"return": {
							title: "返回值",
							type: "Text"
						},
						example: {
							title: "样例说明",
							type: "TextArea"
						}
					}
					//转化成数据
				var data = {
					name: funObj.name,
					type: funObj.type,
					parameters: [],
					desc: funObj.comments && funObj.comments.description,
					"return": funObj.comments && funObj.comments["return"],
					example: funObj.comments && funObj.comments.example
				};
				for (var i = 0; funObj.parameters && i < funObj.parameters.length; i++) {
					var oneParam = funObj.parameters[i];
					data.parameters.push({
						name: oneParam,
						desc: funObj.comments && funObj.comments.param[oneParam]
					});
				}
				//显示数据
				formOper.createFormByObjDesc(metadata, openDom, data);
			},

			saveFunBase: function() {
				//获取新的值
				var openDom = this.API.find("#infoForm");
				var newData = openDom[0].getData();
				//获取老的值
				var oldData = openDom[0].funObj;
				var mod = this.MY.classMod.getMod();
				if (oldData.name != newData.name) {
					delete mod.functionFragment[oldData.name];
				}
				//将新的值插入到老的值中
				oldData.name = newData.name;
				oldData.type = newData.type;
				if (oldData.type == "onCreate") {
					oldData.name = "onCreate";
				}
				oldData.comments.description = newData.desc;
				oldData.comments["return"] = newData["return"];
				oldData.comments.example = newData.example;
				oldData.comments.param = {};
				oldData.parameters = [];
				for (var i = 0; newData.parameters && i < newData.parameters.length; i++) {
					var one = newData.parameters[i];
					oldData.comments.param[one.name] = one.desc;
					oldData.parameters.push(one.name);
				}
				//将原来的名称的函数至空
				mod.functionFragment[oldData.name] = oldData;

				this.initNew();
			},
			showFunGraphy: function(funObj) {
				this.API.show("funGraphy");
				var _this = this;
				this.MY.graphyMod.showFun(funObj.name, function(n, p) {
					_this.showFunFragment(n, p, funObj);
				});
				var openDom = this.API.find("#infoForm");
				openDom[0].funObj = funObj;
			},
			newFun: function() {
				if (!this.MY.classMod) {
					alert("请先选择Gadget");
					return;
				}
				this.MY.graphyMod.destroy();
				//创建一个新的值
				var newFun = {
						name: "newFun",
						type: "public",
						comments: {
							param: {
								p1: "toDo"
							},
							description: "toDo",
							"return": "toDo",
							example: "toDO"
						},
						parameters: [
							"p1"
						],
						fragments: [{
							type: "normal",
							command: "toDo"
						}]
					}
					//插入到大对象中
				var mod = this.MY.classMod.getMod();
				mod.functionFragment.newFun = newFun;
				//将这个数据用于显示
				this.showFunBase(newFun);
			},
			delFun: function() {
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var oldData = openDom[0].funObj;
				//获取大对象
				var mod = this.MY.classMod.getMod();
				//将这个对象删除掉
				delete mod.functionFragment[oldData.name];
				this.initNew();
			},
			showFunFragment: function(fragmentObj, parent, funObj) {
				if (!this.MY.classMod) {
					alert("请先选择Gadget");
					return;
				}
				this.MY.graphyMod.destroy();

				this.API.show("FunFragment");
				//初始准备好数据
				var openDom = this.API.find("#infoForm");
				openDom[0].funObj = funObj;
				openDom[0].fragmentParent = parent;
				openDom[0].fragmentData = fragmentObj;

				//整理formOper的metadata
				var getMetadata = function(type) {
					var metadata = {
						type: {
							title: "类型",
							type: (type == "branchBlock") ? "ReadOnly" : "Select",
							valueRange: (type == "branchBlock") ? null : [{
								"普通": "normal",
								"分支": "branchList",
								"循环": "cycle",
								"代码块": "block"
							}]
						},
						command: {
							title: "主注释名称",
							type: (type != "normal") ? "Hidden" : "Text"
						},
						condiction: {
							title: "条件",
							type: (type == "normal" || type == "branchList") ? "Hidden" : "Text"
						},
						doWhat: {
							title: "做什么",
							type: (type == "normal" || type == "branchList") ? "Hidden" : "Text"
						},

						subCommand: {
							title: "子注释",
							type: "List",
							valueRange: [{
								type: {
									title: "类型",
									type: "Select",
									valueRange: [{
										"toDo": "++",
										"完成": "--"
									}]
								},
								content: {
									title: "内容",
									type: "Text"
								}
							}]
						},
						code: {
							title: "代码片段",
							type: (type != "branchList") ? "TextArea" : "Hidden"
						}
					}
					return metadata;
				};
				var metadata = getMetadata(fragmentObj.type);
				//转换函数片段数据				
				var data = {};
				for (var n in fragmentObj) {
					var oneObj = fragmentObj[n];
					data[n] = oneObj;
				}
				if (fragmentObj.type != "normal") {
					var execResult = /\((.+?)\)\{(.*)/.exec(fragmentObj.command);
					if (execResult != null) {
						data.condiction = execResult[1];
						data.doWhat = execResult[2];
					} else {
						if (/else/.test(fragmentObj.command)) {
							data.condiction = "else";
						}
					}
				}
				console.log(data);
				//合成并显示数据
				var callBackFun = function(name, value, type) {
					if (/select/i.test(type) && /data\.type/i.test(name)) {
						var metadata = getMetadata(value);
						var data = openDom[0].getData();
						formOper.createFormByObjDesc(metadata, openDom, data, callBackFun);
					}
				}
				formOper.createFormByObjDesc(metadata, openDom, data, callBackFun);
			},
			saveFunFragment: function() {
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent;
				var fragmentObj = openDom[0].fragmentData;

				var data = openDom[0].getData();

				fragmentObj.type = data.type;
				fragmentObj.command = data.command;
				fragmentObj.subCommand = data.subCommand;
				fragmentObj.code = data.code;

				if (fragmentObj.type == "cycle") {
					fragmentObj.command = "while(" + data.condiction + "){" + data.doWhat;
				}
				if (fragmentObj.type == "branchBlock") {
					if (parent.subList[0] == fragmentObj) {
						fragmentObj.command = "if(" + data.condiction + "){" + data.doWhat;
					} else if (data.condiction == "else") {
						fragmentObj.command = "else{" + data.doWhat;
					} else {
						fragmentObj.command = "else if(" + data.condiction + "){" + data.doWhat;
					}
				}
				alert("保存成功！");
			},
			showFunEditor:function(funObj){
				this.MY.graphyMod.destroy();
				//显示视图
				this.API.show("funEditor");
				//初始化函数编辑器
				var code_panel = this.API.find("#infoForm")[0];
				code_panel.funObj = funObj;

				var editor = CodeMirror.fromTextArea(code_panel, {
					lineNumbers: true,
					matchBrackets: true,
					mode: "text/javascript"
				});
				code_panel.getValue = function(){
					return editor.getValue();
				}
				code_panel.setValue = function(v){
					editor.setValue(v);
				}
				code_panel.editor = editor;
				
				//获取函数字符串
				var code = this.MY.textMod.getFunStr(funObj).replace(/[\s\S]*?:\s*function/,"function");
				//设置函数字符串
				code_panel.setValue(code);
			},
			saveFunStr:function(){
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var code = openDom[0].getValue();
				//block(--){进行code语法检查
				var str = "openDom[0].checkFun = " + code;
				try{
				  eval(str);
				}catch(e){
					alert("语法错误!\n"+e+"\n保存失败！");
					return;
				}
				//}
				var editResultObj = this.MY.textMod.createOneFunObj(funObj.name,code);
				funObj.parameters = editResultObj.parameters;
				funObj.fragments = editResultObj.fragments;
				alert("保存成功");
			},
			newFunFragmentBA: function(s) {
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent && openDom[0].fragmentParent.subList || funObj.fragments;
				var fragmentObj = openDom[0].fragmentData;

				var newFragement = {
					type: 'normal',
					command: 'toDo',
					code: ''
				}

				if (fragmentObj.type == "branchBlock") {
					newFragement.type = "branchBlock";
					newFragement.subList = [{
						type: 'normal',
						command: 'toDo',
						code: ''
					}]
				}

				//从parent中查找，并插入
				for (var i = 0; i < parent.length; i++) {
					if (parent[i] == fragmentObj) {
						parent.splice(i + s, 0, newFragement);
						break;
					}
				}
				//跳转到新曾部分进行修改操作
				this.showFunFragment(newFragement, openDom[0].fragmentParent, funObj);
			},
			newFunFragmentC: function() {
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent && openDom[0].fragmentParent.subList || funObj.fragments;
				var fragmentObj = openDom[0].fragmentData;

				if (fragmentObj.type == "normal") {
					alert("该类型不允许添加子节点");
					return;
				}

				var newFragement = {
					type: 'normal',
					command: 'toDo',
					code: ''
				}

				if (fragmentObj.type == "branchList") {
					newFragement.type = "branchBlock";
					newFragement.subList = [{
						type: 'normal',
						command: 'toDo',
						code: ''
					}]
				}

				//从parent中查找，并插入
				if (!fragmentObj.subList){
					fragmentObj.subList = [];
				}

				fragmentObj.subList.push(newFragement);
				//跳转到新曾部分进行修改操作
				this.showFunFragment(newFragement, openDom[0].fragmentParent, funObj);
			},
			delFunFragment:function(){
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent && openDom[0].fragmentParent.subList || funObj.fragments;
				var fragmentObj = openDom[0].fragmentData;

				//从parent中查找，并插入
				for (var i = 0; i < parent.length; i++) {
					if (parent[i] == fragmentObj) {
						parent.splice(i,1);
						break;
					}
				}

				//显示图形
				this.showFunGraphy(funObj);
			},
			showFileSelecte: function() {
				this.MY.graphyMod && this.MY.graphyMod.destroy();
				this.API.show("appViewFileSelect");
				var fileOper = FW.getAPP("appViewFileSelect");
				fileOper.showInit();
			},
			showFileSave:function(){
				//整理窗口相关的数据
				if (!this.MY.classMod) {
					alert("请先选择Gadget");
					return;
				}
				this.API.show("view_fileSave");
				this.MY.graphyMod.destroy();
				var classMod = this.MY.classMod.getMod();
				var textMod = this.MY.textMod;
				var openDom = this.API.find("#infoForm");
				var fileOper = FW.getAPP("appViewFileSelect");
				//先整理要显示的dataform的metadata
				var metadata = {
					path:{
						title:"路径",
						type:"Text",
					},
					name:{
						title:"类名",
						type:"ReadOnly",
					},
					code:{
						title:"代码",
						type:"TextArea"
					}
				}
				//整理要显示的数据
				var data = {
					path:fileOper.getPath(),
					name:classMod.name+".js",
					code:textMod.getClassStr()
				}
				//显示到页面中
				formOper.createFormByObjDesc(metadata, openDom, data);
			},
			saveFile:function(){
				var openDom = this.API.find("#infoForm");
				var data = openDom[0].getData();
				var fileOper = FW.getAPP("appViewFileSelect");
				//block(--){语法校验
				openDom[0].define = function(){};
				var code = data.code.replace("define(function(require, exports, module) {","openDom[0].define(function(require, exports, module) {");
				
				try{
					eval(code);
				}catch(e){
					alert("语法错误\n"+e+"\n文件保存失败!");
					return;
				}
				//}
				fileOper.setPath(data.path);
				fileOper.setFile(data.name);
				fileOper.saveFile(data.code);
				alert("文件保存成功");
			}
		},
		FireEvent: {
			saveBase: function() {
				this.saveBase();
			},
			saveAttribute: function() {
				this.saveAttribute();
			},
			newAttribute: function() {
				this.newAttribute();
			},
			delAttribute: function() {
				this.delAttribute();
			},
			saveFunBase: function() {
				this.saveFunBase();
			},
			newFun: function() {
				this.newFun();
			},
			delFun: function() {
				this.delFun();
			},
			showFunGraphy: function() {
				var openDom = this.API.find("#infoForm");
				var oldData = openDom[0].funObj;
				this.showFunGraphy(oldData);
			},
			showFunBase: function() {
				var openDom = this.API.find("#infoForm");
				var oldData = openDom[0].funObj;
				this.showFunBase(oldData);
			},
			showFunEditor:function(){
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				this.showFunEditor(funObj);
			},
			saveFunStr:function(){
				this.saveFunStr();
			},
			back2Graphy: function() {
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				this.showFunGraphy(funObj);
			},
			saveFunFragment: function() {
				this.saveFunFragment();
			},
			newFunFragmentBefore: function() {
				this.newFunFragmentBA(0);
			},
			newFunFragmentAfter: function() {
				this.newFunFragmentBA(1);
			},
			newFunFragmentChild: function() {
				this.newFunFragmentC();
			},
			delFunFragment:function(){
				this.delFunFragment();
			},
			saveFile:function(){
				this.saveFile();
			}
		},
		TrigerEvent: {
			getFile: function(data) {
				this.initNew(data);
			},
			trigerChangeClass: function(cid) {
				if (cid == "base") {
					this.MY.graphyMod && this.MY.graphyMod.destroy();
					this.showBase();
					return;
				}
				//处理属性值
				if (/^data\.attributeFragment/.test(cid)) {
					this.MY.graphyMod.destroy();
					var data = this.MY.classMod.getMod();
					var processData = eval("(" + cid + ")");
					this.showAttribute(processData);
					return;
				}
				//处理函数
				if (/^data\.functionFragment/.test(cid)) {
					this.MY.graphyMod.destroy();
					var data = this.MY.classMod.getMod();
					var processData = eval("(" + cid + ")");
					this.showFunBase(processData);
					return;
				}
			}
		}
	});
	return FW;
});