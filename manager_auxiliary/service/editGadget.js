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
			var fileOper = FW.getAPP("appViewFileSelect");
			this.MY.fileSelect = fileOper;
			this.initByFileUrl();
		},
		public: {
			initByFileUrl : function(){
				//获取url参数
			    var fileUrl = FW.use().getParameter("fileUrl");
			    //block(代码块){构造文件对象读取对象
			    var text = null;
			    //if (传入的url不为空){获取文件信息
			    if (fileUrl != null) {
			        //读取文件
			        var fileArr = fileUrl.split("/");
			        var fileName = fileArr.pop();
			        var fileDir = "/" + fileArr.join("/");
			        this.MY.fileSelect.setFileName(fileName);
			        this.MY.fileSelect.setPath(fileDir);
			        text = this.MY.fileSelect.queryFileContent();
			        $("#aliasTitle").html("[" + fileName + "]");
			    }
			    //}
			    //else{就是url不存在了，要退货
			    else {
			        return;
			    }
			    //}
			    //if(文件本身不存在){读取默认文件
			    if (text == null) {
			        //重新设置文件
			        this.newGadget();
			        return;
			    }
			    //}
			    //if (文件还是为空){这说明出错了
			    if (text == null) {
			        //alert错误并退出
			        alert("文件读取失败");
			        return;
			    }
			    //}
			    //}
			    
			    this.initNew(text);
			},
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
				//设置标题
				document.title = "编辑:"+this.MY.classMod.getMod().name;
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
					},
					version:{
						title:"版本信息",
						type:"List",
						valueRange:[
							{
								version:{
									title:"版本号",
									type:"Text"
								},
								author:{
									title:"作者",
									type:"Text"
								},
								description:{
									title:"描述",
									type:"Text"
								}
							}
						]
					}
				}
					//转化成数据
				var modData = this.MY.classMod.getMod();
				var data = {
					name: modData.name,
					include: modData.include,
					comments: modData.comments,
					"extends": [],
					version:modData.version
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
				
				
				//针对父类的情况，显示跳转链接
				$(".td_include_vdir").append("<a href='#' onclick=\"FireEvent('editGadget.goIncludeJS',this)\">编辑</a>");
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
				modData.version = data.version;
				alert('修改成功');
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
				if (!mod.attributeFragment){
					mod.attributeFragment = [];
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
				var hasChangeName = (oldData.name != newData.name);
				oldData.name = newData.name;
				oldData.content = newData.content;
				oldData.comments = newData.comments;
				alert("属性修改成功");
				if(hasChangeName){
					this.initNew();
				}
			},
			showFunBase: function(funObj) {
				this.MY.graphyMod.destroy();
				this.API.show("funBaseInfo");
				var openDom = this.API.find("#infoForm");
				//将编辑数据，记录到form中
				openDom[0].funObj = funObj;
				//扫描tips数据
				this.API.private("refreshFunTips",funObj);
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
				var txtMod = this.MY.textMod;
				delete mod.functionFragment[txtMod.getTypePrefix(oldData.type) + oldData.name];
				
				//将新的值插入到老的值中
				var hasChangeForTree = (oldData.name != newData.name)||(oldData.type != newData.type);
				oldData.name = newData.name;
				oldData.type = newData.type;
				
				if (oldData.type == "onCreate") {
					oldData.name = "onCreate";
				}
				if (!oldData.comments){
					oldData.comments = {};
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
				mod.functionFragment[txtMod.getTypePrefix(oldData.type) + oldData.name] = oldData;
				alert('修改成功');
				if (hasChangeForTree){
					this.initNew();
				}
				
			},
			showFunGraphy: function(funObj) {
				this.API.show("funGraphy");
				var _this = this;
				this.MY.graphyMod.showFun(funObj, function(n, p) {
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
				mod.functionFragment["+newFun"] = newFun;
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
				var deleteName = this.MY.textMod.getTypePrefix(oldData.type)+oldData.name;
				delete mod.functionFragment[deleteName];
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

				if (fragmentObj.type == "cycle") {
					fragmentObj.command = "while(" + data.condiction + "){" + data.doWhat;
				}
				if (fragmentObj.type == "branchBlock") {
					if (parent.subList[0] == fragmentObj) {
						fragmentObj.command = "if(" + data.condiction + "){" + data.doWhat;
						//把后续的改成else
						if (parent.subList.length == 2){
							parent.subList[1].command = parent.subList[1].command.replace(/^if\(.+\)/,"else");
						}else if (parent.subList.length > 2){
							parent.subList[1].command = parent.subList[1].command.replace(/^if/,"else if");
						}
					} else if (data.condiction == "else") {
						//修改了其他，必须保证第一个是if
						var firstBlockList = parent.subList[0].command;
						var execResult = /\(([^\)]*)\)\s*\{\s*(.+)/.exec(firstBlockList);
						if (execResult != null){
							parent.subList[0].command = "if(" + execResult[1] + "){" + execResult[2];
						}else{
							parent.subList[0].command = "if(--){--";
						}
						//修改自己
						fragmentObj.command = "else{" + data.doWhat;
					} else {
						//修改了其他，必须保证第一个是if
						var firstBlockList = parent.subList[0].command;
						var execResult = /\(([^\)]*)\)\s*\{\s*(.+)/.exec(firstBlockList);
						if (execResult != null){
							parent.subList[0].command = "if(" + execResult[1] + "){" + execResult[2];
						}else{
							parent.subList[0].command = "if(--){--";
						}
						fragmentObj.command = "else if(" + data.condiction + "){" + data.doWhat;
					}
				}
				if (fragmentObj.type == "block") {
					fragmentObj.command = "block(" + data.condiction + "){" + data.doWhat;
				}
				
				alert("修改成功");
			},
			showFunFragmentCode:function(fragmentObj, parent, funObj){
				this.MY.graphyMod.destroy();
				//显示视图
				this.API.show("FunFragmentCode",this.MY.tips["#"]);
				//初始化函数编辑器
				var code_panel = this.API.find("#infoForm")[0];
				code_panel.funObj = funObj;
				code_panel.fragmentParent = parent;
				code_panel.fragmentData = fragmentObj;
				//初始化代码
				var code ="";
				
				//将code整理成子函数
				var goFunFragmentObj = fragmentObj;
				//这说明这个是一个if的分子，要把外层加上去
				if (fragmentObj.type == 'branchBlock'){
					goFunFragmentObj = {
						type:"branchList",
						subList:[fragmentObj]
					}
				}
				var tmpFun = {
				   type:"public",
				   name:"tmpFun",
				   fragments:[goFunFragmentObj]
				};
				var funStr = this.MY.textMod.getFunStr(tmpFun);
				code = funStr.replace(/(^\/\\*\*[\s\S]+?function\(\)\s*\{)|([\n\r]*\}\s*$)/ig,"");
				code = code.replace(/(^[\s\t\r\n]*)|([\s\t\r\n]*$)/ig,"");
				
				code_panel.value = code;
				
				var editor = CodeMirror.fromTextArea(code_panel, {
					lineNumbers: true,
					matchBrackets: true,
					mode: "text/javascript"
				});
				this.API.private("cEditorTips",editor);
				code_panel.getValue = function(){
					return editor.getValue();
				}
				code_panel.setValue = function(v){
					editor.setValue(v);
				}
				code_panel.editor = editor;
				
				//设置函数字符串
				code_panel.setValue(code);

			},
			saveFunFragmentCode:function(){
				//获取当前函数
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent;
				var fragmentObj = openDom[0].fragmentData;

				var code_panel = openDom[0];
				
				var processArray = parent && parent.subList || funObj.fragments;
				var goFragmentObj = fragmentObj;
				var isBranchBlock = false;
				
				for (var i =0;i<processArray.length;i++){
					if(processArray[i] == fragmentObj){
						//获取code对象
						var tmpFunStr = "function(){\n"+code_panel.getValue()+"\n}";
						var tmpCodeFunObj = this.MY.textMod.createOneFunObj("tmp",tmpFunStr);
						//获取代码片段数组
						var newFunArr = tmpCodeFunObj.fragments;
						//如果父亲是branchList分支，那么要把儿子的部分代码去掉
						if (parent && parent.type == "branchList"){
							newFunArr = newFunArr[0].subList;
							isBranchBlock = true;
						}
						//插入到数组中
						var exeStr = "processArray.splice(i,1";
						for (var j=0;j<newFunArr.length;j++){
							if (isBranchBlock && newFunArr[j].type != "branchBlock"){
								alert("外层必须加入的是分支代码");
								return;
							}
							exeStr+=(",newFunArr["+j+"]");
						}
						exeStr += ");";
						
						eval(exeStr);
						//刷新提示信息
						this.API.private("refreshFunTips",funObj);
						alert("修改成功！");
						this.showFunGraphy(funObj);
						return;
					}
				}
				alert("修改失败，为找到儿子");

			},
			showFunEditor:function(funObj){
				this.MY.graphyMod.destroy();
				//显示视图
				this.API.show("funEditor",this.MY.tips["#"]);
				//初始化函数编辑器
				var code_panel = this.API.find("#infoForm")[0];
				code_panel.funObj = funObj;
				var editor = CodeMirror.fromTextArea(code_panel, {
					lineNumbers: true,
					matchBrackets: true,
					mode: "text/javascript",
					smartIndent:true,
					height:"800px",
					autoMatchParens:true
				});
				//绑定侦听事件，时期实现冒泡
				this.API.private("cEditorTips",editor);
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
				//为select绑定onchange事件
				function selectTheme(theme){
				    editor.setOption("theme", theme);
				    location.hash = "#" + theme;
					var choice = (location.hash && location.hash.slice(1)) || (document.location.search && decodeURIComponent(document.location.search.slice(1)));
					if (choice) {
					    editor.setOption("theme", choice);
					}
				}
				var theme = location.hash.slice(1);
				if (theme) { 
					selectTheme(theme); 
				}


				this.MY.oldCode = code;
				var _this = this;
				$(window).bind('beforeunload',function(){
					if(editor.getValue() != _this.MY.oldCode) return "您输入的内容尚未保存，确定离开此页面吗？";
				});
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
					if (!confirm("语法错误\n"+e+"("+e.number+")\n是否继续保存!")){
						return;
					};					
				}
				//}
				var editResultObj = this.MY.textMod.createOneFunObj(funObj.name,code);
				funObj.parameters = editResultObj.parameters;
				funObj.fragments = editResultObj.fragments;
				//刷新提示信息
				this.API.private("refreshFunTips",funObj);
				this.MY.oldCode = code;
				alert("修改成功");
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
				this.showFunFragment(newFragement, fragmentObj, funObj);
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
			saveFileInfo:function(){
				var openDom = this.API.find("#infoForm");
				var data = openDom[0].getData();
				var fileOper = FW.getAPP("appViewFileSelect");
				fileOper.setPath(data.path);
				fileOper.setFile(data.name);
			},
			saveFile:function(){
				var fileOper = FW.getAPP("appViewFileSelect");
				//if(文件没有填写路径信息){显示导航到路径信息填写
				if(!fileOper.getPath() || !fileOper.getFile()){
					this.showFileSave();
					return;
				}
				var code = this.MY.textMod.getClassStr();
				//}
				//block(--){语法校验
				var myVery = {
					define : function(){}
				}
				var veryCode = code.replace("define(function(require, exports, module) {","myVery.define(function(require, exports, module) {");
				
				try{
					eval(veryCode);
				}catch(e){
					if (!confirm("语法错误\n"+e+"("+e.number+")\n是否继续保存!")){
						return;
					};
				}
				//}
				
				fileOper.saveFile(code);
			},
			/**
			*这是一个工具类,返回到转向到模拟数据类
			*/
			getSimulateUrl:function(){
				//获取alias名，通过目录名分析
				//--alias的名称取路径名的第二级目录，即servicegadget后面的那个部分
				var fileUrl = FW.use().getParameter("fileUrl");
				if (!/servicegadget/i.test(fileUrl)){
					alert("不是servicegadget无法转入模拟数据");
					return;
				}
				
				fileUrl = fileUrl.replace('servicegadget','simulategadget');
				var url = "./gadgetCreator.jsp?fileUrl=" + encodeURIComponent(fileUrl);
				return url;
			},
			/**
			*这是一个工具类,转向到gadget的测试页面，转向需要携带一个参数就是被测试的gadget
			*这个参数为：testDir
			*参数的值是被测试gadget的路径，
			*路径的规律是第一级目录为testgadget后卖弄照抄，文件名前面加一个test就好
			*/
			go2Test:function(){
				//改路径
				var fileOper = FW.getAPP("appViewFileSelect");
				var dir = fileOper.getPath().replace("servicegadget","testgadget");
				if (!/testgadget/i.test(dir)){
					dir = "/testgadget/"+dir;
				}
				//获取名，通过基本信息获取
				var mod = this.MY.classMod.getMod();
				//下面将文件名首字母改成大写
				var fileName  = mod.name.replace(/^\w/,function(a,b){
					return a.toUpperCase();
				});
				fileName = "Test"+fileName;
				//合成url
				var urlParam = encodeURIComponent(dir+"/"+fileName+".js");
				var url = "gadgetTestCreator.jsp?fileUrl="+urlParam;
				return url;
			},
			go2changeTheme:function(){
				this.API.show("changeTheme");
				var code_panel = this.API.find("#infoFormTheme")[0];
				var editor = CodeMirror.fromTextArea(code_panel, {
					lineNumbers: true,
					matchBrackets: true,
					mode: "text/javascript",
					smartIndent:true,
					height:"800px",
					autoMatchParens:true
				});
				code_panel.getValue = function(){
					return editor.getValue();
				}
				code_panel.setValue = function(v){
					editor.setValue(v);
				}
				code_panel.editor = editor;
				var code = "";
				code += "function(__code){\r\n";
				code += "  alert(this.param.loginFailTips);\r\n";
				code += "  this.param.loginFailJumb && (window.location.href = thisparam.loginFailJumb);\r\n";
				code += "}";
				
				code_panel.setValue(code);
				//为select绑定onchange事件
				function selectTheme(){
					var input = document.getElementById("select");
					var theme = input.options[input.selectedIndex].textContent;
				    editor.setOption("theme", theme);
				    location.hash = "#" + theme;
					var choice = (location.hash && location.hash.slice(1)) || (document.location.search && decodeURIComponent(document.location.search.slice(1)));
					if (choice) {
					    input.value = choice;
					    editor.setOption("theme", choice);
					}
				}
				$("#select").change(function(){
					selectTheme();
				});
				var theme = location.hash.slice(1);
				if (theme) { 
					document.getElementById("select").value = theme; 
					selectTheme(); 
				}
			}
		},
		private:{
			/**
			* 刷新函数提示，函数提示的结构如下：
			* {
			*    #:"keyword1,keyword2....",
			*    keyword1:{//这是给对象使用的
			*           "#":{
			*		n:funObj.name,
			*		m:funTips.join(","),
			*		p:"",
			*		f:"",
			*		g:"",
			*	},
			*    }
			*}
			*/
			refreshFunTips:function(funObj){
				var allObj = this.MY.classMod.getMod();
				var funTips = this.MY.textMod.getFunVars(funObj);
				//引入包变量
				for (var i=0;allObj.include && i < allObj.include.length;i++){
					if (allObj.include[i].vName){
						funTips.push(allObj.include[i].vName);
					}
				}
				//合成字符串
				this.MY.tips = {
					"#":{
						n:funObj.name,
						m:funTips.join(","),
						p:"",
						g:"",
					},
					"FW":{
						"#":{
							n:"FW",
							m:"",
							p:"",
							g:""
						}
					},
					"window":{
						"#":{
							n:"FW",
							m:"",
							p:"",
							g:""
						}
					},
					"this":{
						"#":{
							n:"this",
							m:"",
							p:"",
							g:""
						}
					}
				}
				//函数的参数
				funTips = [];
				for (var i=0;funObj.parameters && i<funObj.parameters.length;i++){
					funTips.push(funObj.parameters[i]);
				}
				this.MY.tips["#"].p = funTips.join(',');

				//引入全局变量
				funTips = [];
				funTips.push("FW");
				funTips.push("window");
				funTips.push("this");
				this.MY.tips["#"].g = funTips.join(',');
				
				//整理FW
				var oneMenber = this.MY.tips.FW;
				var fwArray = [];
				for (var n in FW){
					if(n=="createAPP" || n=="getAPP"){
						continue;
					}
					fwArray.push(n);
					if (/function/i.test(typeof(FW[n]))){
						var funStr = n + FW[n].toString().replace(/function\s*(\([^\(\)]*\))\s*\{[\s\S]+/i,
						function(a,b){
							return b;
						});
						oneMenber[n] = funStr;
					}
				}
				oneMenber["#"].m = fwArray.join(',');
				//整理window
				oneMenber = this.MY.tips["window"];
				oneMenber["#"].m = "location,name,reload,title,confirm";
				oneMenber.reload = "window.location.reload(url)";
				oneMenber.confirm = "window.confirm(tips)"
				//整理this加入本类的公有，私有方法，以及参数
				oneMenber = this.MY.tips["this"];
				funTips = [];
				for (var n in allObj.functionFragment){
					if (allObj.functionFragment[n].type == "public" ){
						funTips.push(allObj.functionFragment[n].name);
						//设置实际显示的值
						oneMenber[allObj.functionFragment[n].name] = allObj.functionFragment[n].name + 
						"("+ (allObj.functionFragment[n].parameters && allObj.functionFragment[n].parameters.join(',')) +")";
					}
					if (allObj.functionFragment[n].type == "private"){
						funTips.push(allObj.functionFragment[n].name);
						//设置实际显示的值
						oneMenber[allObj.functionFragment[n].name] = "API.private('"+allObj.functionFragment[n].name + "',"+
						(allObj.functionFragment[n].parameters && allObj.functionFragment[n].parameters.join(',')) +")";
					}
				}
				oneMenber["#"].m = funTips.join(',');
				//参数部分
				oneMenber["#"].p = "param,id,MY,serialize";
				oneMenber.param = {
					"#":{
						n:"param",
						m:"",
						p:"",
						g:""
					}
				}
				oneMenber = oneMenber.param;
				if (allObj.attributeFragment){
					var mber = [];
					for(var i =0;i<allObj.attributeFragment.length;i++){
						mber.push(allObj.attributeFragment[i].name);
					}
					oneMenber["#"].p = mber.join(",");
				}

				//API部分
				oneMenber = this.MY.tips["this"];
				oneMenber["#"].g = "API";
				oneMenber.API = {
					"#":{
						n:"API",
						m:"",
						p:"",
						g:""
					}
				}
				oneMenber = oneMenber.API;
				var nameArr = [];
				for (var n in this.API){
					nameArr.push(n);
					var funStr = n + this.API[n].toString().replace(/function\s*(\([^\(\)]*\))\s*\{[\s\S]+/i,
					function(a,b){
						return b;
					});
					oneMenber[n] = funStr;	
				}
				oneMenber["#"].m = nameArr.join(',');
			},
			/**
			*接受来自编辑页面的反馈，情况如下：
			*1.如果编辑页面有字符输入，那么按照字符进行过滤，返回不为空，则匹配成功，一切欢迎，如果没有匹配上，切换空间，并返回空
			*2.如果输入为空，那么一切还原，一切为空
			*3.如果输入为完整字串，且第二个参数为true，则，切换当前空间
			*/
			changeTips:function(word,isObj){
			    //整理要show的字符串
				var showTmp = "名称：${data.n}<br/>\n";
				showTmp += "参数: ${data.p}<br/>\n";
				showTmp += "内部: ${data.m}<br/>\n";
				showTmp += "全局: ${data.g}<br/>";
				//处理当前tips
				if (!this.MY.currentTips){
					this.MY.currentTips = this.MY.tips;
				}
				//定义函数获取多个节点
				var foundFun=function(orgObj,memStr){
					var memArray = memStr.split(".");
					var destObj = orgObj;
					for (var i=0;i<memArray.length;i++){
						destObj = destObj[memArray[i]];
						if (!destObj){
							return null;
						}
					}
					return destObj;
				}
				//处理，切换对象
				if (isObj){
					this.MY.currentTips = foundFun(this.MY.tips,word) || {
						"#":{
							n:"",
							m:"",
							p:"",
							g:"",
						}
					}
					this.API.show(showTmp,this.MY.currentTips["#"],"tips");
					return;
				}
				//处理还原对象
				if (word == null){
					if (this.MY.currentTips != null){
						this.MY.currentTips = null;
						this.API.show(showTmp,this.MY.tips["#"],"tips");
					}
					return;
				}
				//处理切换部分情况
				var wordArr = /(^.+?)\.(\w+)$/.exec(word)||['','',word];
				var curO = foundFun(this.MY.tips,wordArr[1])||this.MY.tips;
				var curT = curO["#"];
				//输入的是原字符，过滤字段，输出的是目标被过滤字符串
				var filterFun = function(org,filterStr){
					var exp =  new RegExp("((^"+filterStr + "[^,]*)|,("+filterStr+"[^,]*))","ig");
					var resultArray = [];
					while(true){
						var res = exp.exec(org);
						if (res == null){
							break;
						}
						resultArray.push(res[1].replace(/,/g,""));
					}
					return resultArray;
				}
				var totalLen = 0;
				var result = "";
				var showTips = {};
				for (var n in curT){
					if (n=="n"){
						showTips[n] = curT[n];
						continue;
					}
					var oneResult = filterFun(curT[n],wordArr[2]);
					totalLen+=oneResult.length;
					showTips[n] = oneResult.join(",");
					result+=showTips[n];
				}
				if (totalLen == 1){
					this.MY.currentTips = null;
					this.API.show(showTmp,this.MY.tips["#"],"tips");
					return /string/i.test(typeof(curO[result]))?curO[result]:result;
				}else if (totalLen == 0){
				    //还原
					this.MY.currentTips = null;
					this.API.show(showTmp,this.MY.tips["#"],"tips");
					return null;
				}
				this.API.show(showTmp,showTips,"tips");
				//既然是多个，那么就要返回公共部分
				//获取多个提示数组
				var resultArray = result.split(",");
				var returnStr = wordArr[2];
				//for(当前输入值长度到第一个数组元素的长度){
				for(var i=wordArr[2].length ;i<resultArray[0].length;i++){
					var allEquals = true;
					//for(遍历数组所有元素){
					for (var j =1;j<resultArray.length;j++){
					//if(和第一个字符元素比较是不相等){
						if (resultArray[j].charAt(i) != resultArray[0].charAt(i)){
							//  合成上一个字符串内容并返回
							return returnStr;
						}					
					//}
					}
					//}
					returnStr += resultArray[0].charAt(i);
				}
				//}
				return null;
			},
			/**
			*给edit加上侦听事件时期能够实现冒泡的提示和自动补齐代码
			*/
			cEditorTips:function(editor){
				_this = this;
				editor.on("beforeChange", function (Editor, changes) {
					//console.log(changes);
					if (changes.text[0] == '\t'){
						var line = editor.getLine(changes.to.line);
						//只有在字符末尾，或者空格后面插入才算
						if (line.length!=0 && ( line.length ==  changes.from.ch || /[^\w]/.test(line.charAt(changes.from.ch)))){
							//获取tab左边字符
							var leftLine = line.substring(0,changes.from.ch);
							var execResult = /[^\w\.]*([\w\.]+)$/.exec(leftLine);
							if (execResult == null){
								return;
							}
							var dealWord = execResult[1];
							var filterS = _this.API.private("changeTips",dealWord)||"";
							var newFrom = (filterS=="")? changes.from:{
								ch:changes.from.ch-dealWord.split('.').pop().length,
								line:changes.from.line
							}
							if (changes.from.xRel){
								newFrom.xRel = changes.from.xRel
							}
							
							//console.log(changes);
							changes.update(newFrom, changes.to, [filterS], changes.origin);
							return;
						}
					}else if(changes.text[0] == ' '){
						//直接还原
						_this.API.private("changeTips",null);
					}else if(changes.text[0] == '.'){
						var line = editor.getLine(changes.to.line);
						//只有在字符末尾，或者空格后面插入才算
						if (line.length!=0 && ( line.length ==  changes.from.ch || /[^\w]/.test(line.charAt(changes.from.ch)))){
							//获取tab左边字符
							var leftLine = line.substring(0,changes.from.ch);
							var execResult = /[^\w\.]*([\w\.]+)$/.exec(leftLine);
							if (execResult == null){
								return;
							}
							var dealWord = execResult[1];
							var filterS = _this.API.private("changeTips",dealWord,true);
							return;
						}
					}
					//changes.update(changes.from, changes.to, ['.b'], changes.origin);
				});
				//键盘提示
				
				editor.on("keydown", function (Editor, Eevent) {					
					if (83 == Eevent.keyCode){
						if (Eevent.ctrlKey || Eevent.altKey){
							$("#btnSaveFun").trigger("click");
						}
					}
				});
				
			}
		},
		FireEvent: {
			saveBase: function() {
				this.saveBase();
				this.saveFile();
			},
			saveAttribute: function() {
				this.saveAttribute();
				this.saveFile();
			},
			newAttribute: function() {
				this.newAttribute();
			},
			delAttribute: function() {
				this.delAttribute();
			},
			saveFunBase: function() {
				this.saveFunBase();
				this.saveFile();
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
			showFunFragmentCode:function(){
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent;
				var fragment = openDom[0].fragmentData;
				this.showFunFragmentCode(fragment,parent,funObj);
			},
			saveFunFragmentCode: function() {
				this.saveFunFragmentCode();
				this.saveFile();
			},
			showFunFragment:function(){
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				var parent = openDom[0].fragmentParent;
				var fragment = openDom[0].fragmentData;
				this.showFunFragment(fragment,parent,funObj);
			},
			showFunEditor:function(){
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				this.showFunEditor(funObj);
			},
			saveFunStr:function(){
				this.saveFunStr();
				this.saveFile();
			},
			back2Graphy: function() {
				var openDom = this.API.find("#infoForm");
				var funObj = openDom[0].funObj;
				this.showFunGraphy(funObj);
			},
			saveFunFragment: function() {
				this.saveFunFragment();
				this.saveFile();
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
				this.saveFileInfo();
				this.saveFile();
			},
			goSimulatePage:function (){
				var url = this.getSimulateUrl();
				if (url != null){
					window.open(url);
				}
			},
			go2Test:function(){
				var url = this.go2Test();
				if (url != null){
					window.open(url);
				}
			},
			goIncludeJS:function(dom){
				var incldeurl = $(dom).parent().find("input").val();
				if (!/\.js$/.test(incldeurl)){
					incldeurl = incldeurl + ".js";
				}
				var fileUrl = FW.use().getParameter("fileUrl");
				if (/^\.\//.test(incldeurl)){
					//说明要使用相对路径，这个时候要注意替换文件
					var fileUrlArr = fileUrl.split('/');
					fileUrlArr.pop();
					fileUrl = fileUrlArr.join('/')+"/" + incldeurl;
				}else{
					fileUrl = incldeurl;
				}
				var url = "./gadgetCreator.jsp?fileUrl=" + encodeURIComponent(fileUrl);
			    //显示视图
			    window.open(url);
			},
			go2changeTheme:function(){
				this.go2changeTheme();
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