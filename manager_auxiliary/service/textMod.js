define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	require("./classMod");
	var formatJS = require("breeze/framework/js/tools/formatJS");
	FW.register({
		name: "textMod",
		param: {
		},
		
		public: {
			/**
			 * 根据传入的gadget字符串，将字符串解析成class类结构
			 * 创建后对象被保存到this.MY.classMod中,
			 * 用t = this.API.private("pDefine", __classContent, 0);获取第一层解析，具体解析格式参见对应函数
			 * 然后创建一个解析结构，如下：
			 * {
				 version:[{
					author: "lgy"
					description: "xxx"
					version: "1.0"
				 }],
				 name: "MyGadget",
				 include:[{
					vDir: "./MyGadget",
					vName: ""
				 }],
				 extends:[
					"MyGadget","MyGadget"
				 ],
				 functionFragment:{
					 "+函数名":{
						 comments:"",
						 fragments:xxx,
						 name:"",
						 parameters:"",
						 type: "public"
					 }
				 },
				 extends:["MyGadget"],
				 comments: "desc ",
				 attributeFragment:{
					comments: "描述内容",
					content: ""albb"",
					name: "newName"
				 },
				 view:{
					 id1:"dir",
					 id2:"dir"
				 }
			 }
			 */
			createClassMod: function(__classContent) {
				var t = this.API.private("pDefine", __classContent, 0);
				//完成解析后，要合成对象
				var result = {};
				if (t == null){
					return null;
				}
				for(var i=0;i<t.objArry.length;i++){
					var tmpObj = t.objArry[i];
					if (tmpObj.type == 2 && tmpObj.name == "name"){
						result.name = tmpObj.content.replace(/["']/g,"");
						break;
					}
				}
				//处理include
				console.log("construct include");
				result.include = t.include;
				//处理extends
				console.log("construct extends");
				for(var i=0;i<t.objArry.length;i++){
					var tmpObj = t.objArry[i];
					if (tmpObj.type == 4 && tmpObj.name == "extends"){
						result["extends"] = tmpObj.content;
						break;
					}
				}
				//注释
				console.log("construct comments");
				result.version = [];
				if (t.comments){
					var commObj = this.API.private("parserComment",t.comments);
					if (commObj && commObj.description){
						result.comments = commObj.description;
					}
					//处理version部分
					if (commObj && commObj.version){
						var versions = commObj.version.split(/\n+/);
						for (var i=0;versions != null &&i<versions.length;i++){
							var oneVersion = versions[i];
							var members = oneVersion.split(/\s+/);
							if (members!=null && members.length == 3){
								result.version.push({
									version:members[0],
									author:members[1],
									description:members[2]
								});
							}
						}
					}
				}
				//处理成员变量
				console.log("construct attribute");
				for(var i=0;i<t.objArry.length;i++){
					var tmpObj = t.objArry[i];
					if (tmpObj.type == 0 && tmpObj.name == "param"){
						var attrArray  = tmpObj.content;
						result.attributeFragment = [];
						for (var j =0 ;j<attrArray.length;j++){
							var oneTmpAttrObj = attrArray[j];
							if (oneTmpAttrObj.type == 1){
								//忽略注释，注释后处理
								continue;
							};
							var oneAttr = {
								name:oneTmpAttrObj.name,
								content:this.API.private("parserCommObj",oneTmpAttrObj)//暂时只考虑一级对象处理，嵌套的参数对象，先不支持
							};
							//判断是否有注释
							if (j>0 && attrArray[j-1].type == 1){
								var commStr = attrArray[j-1].content;
								var commObj = this.API.private("parserComment",commStr);
								oneAttr.comments = commObj.description;
							}
							//加入到结果中
							result.attributeFragment.push(oneAttr);
						}
						break;
					}
				}
				//下面处理函数--onCreate
				var processFun= function(objArr,type,resultArr){
					for (var i=0;objArr != null && i<objArr.length;i++){
						oneFun = objArr[i];
						if (oneFun.type != 3){
							continue;
						}
						var funName  = oneFun.name;
						var oneResult = {
							name:funName,
							type:type
						};
						
						if (i>0 && objArr[i-1].type == 1){
							var comments = this.API.private("parserComment",objArr[i-1].content);
							oneResult.comments = {
								param:comments.param,
								description:comments.description,
								"return":comments.return,
								example:comments.example
							}
						};
						oneResult.parameters = oneFun.content.param;
						//处理函数体
						oneResult.fragments = [];
						this.API.private("parserFunStart",oneFun.content.body,0,oneResult.fragments);
						resultArr[funName]=oneResult;
					}
				}
				console.log("construct function-->");
				result.functionFragment = {};
				for(var i=0;i<t.objArry.length;i++){
					var tmpObj = t.objArry[i];
					if (tmpObj.type == 3 && tmpObj.name == "onCreate"){
						var attrArray  = [];
						if (i>0 && t.objArry[i-1].type == 1){
							attrArray.push(t.objArry[i-1]);
						}
						attrArray.push(tmpObj);
						this.API.private("processFun",attrArray,"onCreate",result.functionFragment);
						continue;
					}
					
					if (tmpObj.type == 0 && tmpObj.name == "public"){
						this.API.private("processFun",tmpObj.content,"public",result.functionFragment);
						continue;
					}
					if (tmpObj.type == 0 && tmpObj.name == "private"){
						this.API.private("processFun",tmpObj.content,"private",result.functionFragment);
						continue;
					}
					if (tmpObj.type == 0 && tmpObj.name == "FireEvent"){
						this.API.private("processFun",tmpObj.content,"FireEvent",result.functionFragment);
						continue;
					}
					if (tmpObj.type == 0 && tmpObj.name == "TrigerEvent"){
						this.API.private("processFun",tmpObj.content,"TrigerEvent",result.functionFragment);
						continue;
					}
					//2015-11-4月处理view的情况
					if (tmpObj.type == 0 && tmpObj.name == "view"){
						result.view = tmpObj.content;
						continue;
					}
				}
				
				
				this.MY.classMod = FW.createApp("classMod", "classMod", this);
				this.MY.classMod.setMod(result);
				console.log(result);
				return this.MY.classMod;
			},
			/**
			*反向，通过内存的控制体获取对应的文件字符串
			*/
			getClassStr:function(){
				var cObj = this.MY.classMod.getMod();
				var result = "";
			    //这一段是注册的gadget{}里面的内容
				var mainStr = "";
				//处理name
				mainStr = mainStr + "\"name\":\""+cObj.name+"\"";
				//处理extends
				if (cObj["extends"] && cObj["extends"].length > 0){
					mainStr = mainStr + ",\n";
					mainStr = mainStr + "\"extends\":[\"" + cObj["extends"].join("\",\"")+"\"]";
				}
				//处理参数
				if (cObj.attributeFragment && cObj.attributeFragment.length>0){
					mainStr = mainStr + ",\n";
					mainStr = mainStr + "\"param\":{\n";
					var isFirst = true;
					for (var i = 0 ;i<cObj.attributeFragment.length;i++){
						if (isFirst){
							isFirst = false;
						}else{
							mainStr = mainStr + ",\n";
						}
						var oneParam = this.API.private("decompressionOneParam",cObj.attributeFragment[i],cObj.name);
						mainStr += oneParam;
					}
					mainStr = mainStr + "\n}"
				}
				
				
				//处理onCreate函数
				if (cObj.functionFragment.onCreate){
					mainStr = mainStr + ",\n";
					mainStr = mainStr + this.API.private("decompressionOneFunction",cObj.functionFragment.onCreate,cObj.name);
				}
				
				//处理所有函数
				var  allFunStr = {
					"public" : "",
					"private"  : "",
					FireEvent : "",
					TrigerEvent:""
				}
				
				for (var fName in cObj.functionFragment){
					if (fName == "onCreate"){
						continue;
					}
					var oneFObj = cObj.functionFragment[fName];
					if (allFunStr[oneFObj.type] == ""){
						//说明是第一次
						allFunStr[oneFObj.type] +=("\""+oneFObj.type+"\":{\n");
					}else{
						allFunStr[oneFObj.type] +=",\n";						
					}
					allFunStr[oneFObj.type] +=this.API.private("decompressionOneFunction",oneFObj,cObj.name);
				}
				for (var n in allFunStr){
					if (allFunStr[n] != ""){
						//说明是第一次
						allFunStr[n] += "\n}";
						mainStr += ",\n";
					}
					mainStr += allFunStr[n]
				}
				//处理view部分字段
				if (cObj.view){
					for (var i=0;i<cObj.view.length;i++){
						if (i==0){
							mainStr+=",view:{\n";
						}else{
							mainStr+=",";
						}
						mainStr = mainStr + "'" + cObj.view[i].name +"':"+cObj.view[i].content
						if (i == cObj.view.length-1){
						mainStr+="}\n"
						}
					}
				}
				
				//处理version字符串
				var versionStr = "";
				for (var i=0;cObj.version && i < cObj.version.length;i++){
					versionStr+= (cObj.version[i].version + " " + cObj.version[i].author + " " + cObj.version[i].description + "\n");
				}
				if (versionStr != ""){
					versionStr = "* @version "+versionStr;
				}
				//定义全局完整对象
				var result = "/**\n";
				result = result + "* @namespace\n";
				result = result + "* @name "+cObj.name+" \n";
				result = result + versionStr ;
				result = result + "* @description  "+(cObj.comments && cObj.comments.replace(/\n\r?/g,"$&*"))+" \n";
				result = result + "*/ \n";
				result = result + "define(function(require, exports, module) {\n";
				result = result + "var FW = require(\"breeze/framework/js/BreezeFW\");\n";
				for (var i =0;cObj.include && i<cObj.include.length;i++){
					var oneObj = cObj.include[i];
					if (oneObj.vName){
						result = result + "var " + oneObj.vName + "=";
					}
					result = result + "require(\"" + oneObj.vDir + "\");\n";
				}
				result = result + "FW.register({\n__body__\n},module);\n	return FW;\n});";
				result = result.replace("__body__",mainStr);
				result = formatJS.js_beautify(result);
				return result;
			},
			
			
			getFunStr:function(funObj){
				var orgResult =  this.API.private("decompressionOneFunction",funObj,"临时");
				return formatJS.js_beautify(orgResult);
			},
			createOneFunObj:function(funName,funStr){
				var allStr = "\""+funName+"\":"+funStr+"}";
				var allObj = [];
				var tmpObj = this.API.private("pBaseName",allStr, 0, allObj);
				//差把函数整合了
				var attrArray = allObj.objArry;
				var resultFuns = {};
				this.API.private("processFun",attrArray,"type",resultFuns);
				return resultFuns[funName];
			},
			getTypePrefix:function(type){
				//转义类型+-$~
				var prefix = "";
				if (type == "public"){
					prefix = "+";
				}else if(type == "private"){
					prefix = "-";
				}else if(type == "FireEvent"){
					prefix = "$";
				}else if(type == "TrigerEvent"){
					prefix = "~";
				}
				return prefix;
			},
			/**
			*该函数获取所有一个函数片段对象中声明的变量值
			*/
			getFunVars:function(funObj){
				var result = [];
				//block(递归){定义递归，获取列表的函数对象
				var getFunVars = function(funFragmentList){
					for (var i=0;i<funFragmentList.length;i++){
						var onef = funFragmentList[i];
						if (onef.type == "normal" && onef.code){
							var exp = /var\s+([^\s\r\n=]+)/ig;
							while(true){
								var execResult = exp.exec(onef.code);
								if (execResult == null){
									break;
								}
								if (execResult[1].length>1){
									result.push(execResult[1]);
								}
							}
						}else{
							onef.subList && getFunVars(onef.subList);
						}
					}
				}
				//}
				
				getFunVars(funObj.fragments);
				return result;
			}
		},
		private: {
			/**
			*这里是解压系列的函数
			* 这个函数用于返回单个参数的声明字符串
			*/
			decompressionOneParam:function(paramObj,className){
				var result = "";
				//先处理注释
				result = result + "/**\n";
				result = result + "*@memberOf " + className + "\n";
				result = result + "*@name " + paramObj.name + "\n";
				result = result + "*@description " + (paramObj.comments && paramObj.comments.replace(/\n\r?/g,"$&*")) + "\n";
				result = result + "*/\n";
				//处理声明信息
				//处理参数是对象或数组情况
				var content = paramObj.content;
				result = result + "\"" + paramObj.name +"\":" +  content;
				return result;
			},
			/**
			*解压单个函数
			*/
			decompressionOneFunction:function(funObj,className){
				var result = "";
				var funName = funObj.name;
				//先处理注释
				result = result + "/**\n";
				result = result + "*@function\n";
				result = result + "*@memberOf " + className + "\n";
				result = result + "*@name " + funObj.type+"$" + funName + "\n";
				if (funObj.comments){
					result = result + "*@description " + (funObj.comments.description && funObj.comments.description.replace(/\n\r?/g,"$&*"))+ "\n";
					if (funObj.comments.param){
						for (var name in funObj.comments.param){
							result = result + "*@param " + name + " " + funObj.comments.param[name] + "\n";
						}
					}
					if (funObj.comments["return"]){
						result = result + "*@return " + funObj.comments["return"] + "\n";
					}
					if (funObj.comments["example"]){
						result = result + "*@example " + (funObj.comments["example"] && funObj.comments["example"].replace(/\n\r?/g,"$&*")) + "\n";
					}
				}				
				result = result + "*/\n";
				var paramStr = "";
				if (funObj.parameters){
					paramStr = funObj.parameters.join(",");
				}
				result = result + "\""+funName+"\":function("+ paramStr +"){\n"
				//这个要递归的，使用三个内部的函数定义进行递归处理
				var normalFun = function(fObj){
					var result = "";
					if (fObj.command){
						result = result + "//"+fObj.command + "\n";
						for (var i=0;fObj.subCommand && i < fObj.subCommand.length ; i++){
							var oneSub = fObj.subCommand[i];
							result = result + "//"+ oneSub.type + oneSub.content + "\n";
						}
					}
					if (fObj.code){
						result = result + fObj.code + "\n";
					}
					return result;
				};
				var ifFun = function(fObj){
					var result = "";
					for (var i=0;fObj.subList && i<fObj.subList.length;i++){
						result = result + "//" + fObj.subList[i].command + "\n";
						for (var j=0;fObj.subCommand && j < fObj.subCommand.length ; j++){
							var oneSub = fObj.subCommand[j];
							result = result + "//"+ oneSub.type + oneSub.content + "\n";
						}
						if (fObj.subList[i].code){
							result = result + fObj.subList[i].code + "\n";
						}
						for (var j=0;fObj.subList[i].subList && j<fObj.subList[i].subList.length;j++){
							result = result + selectFun(fObj.subList[i].subList[j]);
						}
						//if(分支有代码){生成反向括号
						if (fObj.subList[i].code){
							result = result +  "}\n//}\n";
						}
						//}
						//else{不生成反向括号
						else{
							result = result +  "//}\n";
						}
						//}
					}
					return result;
				};
				var cycleFun = function(fObj){
					var result = "";
					result = result + "//" + fObj.command + "\n";
					for (var i=0;fObj.subCommand && i < fObj.subCommand.length ; i++){
						var oneSub = fObj.subCommand[i];
						result = result + "//"+ oneSub.type + oneSub.content + "\n";
					}
					if (fObj.code){
						result = result + fObj.code + "\n";
					}
					for (var i=0;fObj.subList && i<fObj.subList.length;i++){
						result = result + selectFun(fObj.subList[i]);
					}
					//if(分支有代码){生成反向括号
					if (fObj.code){
						result = result +  "}\n//}\n";
					}
					//}
					//else{不生成反向括号
					else{
						result = result +  "//}\n";
					}
					//}
					return result;
				};
				var blockFun = function(fObj){
					var result = "";
					result = result + "//" + fObj.command + "\n";
					for (var i=0;fObj.subCommand && i < fObj.subCommand.length ; i++){
						var oneSub = fObj.subCommand[i];
						result = result + "//"+ oneSub.type + oneSub.content + "\n";
					}
					for (var i=0;fObj.subList && i<fObj.subList.length;i++){
						result = result + selectFun(fObj.subList[i]);
					}
					result = result +  "//}\n";
					return result;
				};
				var selectFun = function(fObj){
					if (fObj.type == "normal"){
						return normalFun(fObj);
					}
					if (fObj.type == "branchList"){
						return ifFun(fObj);
					} 
					if (fObj.type == "cycle"){
						return cycleFun(fObj);
					} 
					if (fObj.type == "block"){
						return blockFun(fObj);
					} 
				};
				for (var i=0;i<funObj.fragments.length;i++){
					result = result + selectFun(funObj.fragments[i]);
				}
				result = result + "}";
				return result;
			},
		
		
			//下面处理函数--onCreate
			processFun : function(objArr,type,resultArr){
				for (var i=0;objArr != null && i<objArr.length;i++){
					oneFun = objArr[i];
					if (oneFun.type != 3){
						continue;
					}					
					var prefix = this.getTypePrefix(type);
					var funName  = oneFun.name;
					console.log("build ["+type+"]"+funName);
					var oneResult = {
						name:funName,
						type:type
					};
					
					if (i>0 && objArr[i-1].type == 1){
						var comments = this.API.private("parserComment",objArr[i-1].content);
						oneResult.comments = {
							param:comments.param,
							description:comments.description,
							"return":comments.return,
							example:comments.example
						}
					};
					//去除空字串的参数
					oneResult.parameters = [];
					for (var j=0;oneFun.content.param && j<oneFun.content.param.length;j++){
						if (/^\s*$/.test(oneFun.content.param[j])){
							continue;
						}
						oneResult.parameters.push(oneFun.content.param[j]);
					}
					//处理函数体
					oneResult.fragments = [];
					this.API.private("parserFunStart",oneFun.content.body,0,oneResult.fragments);
					resultArr[prefix + funName]=oneResult;
				}
			},
			/**
			*解析普通的对象，对象的形式参见下面pBaseName的注释说明
			*本函数当前用于参数的解析
			*这里只解析第一个对象
			*/
			parserCommObj:function($in){
			    //如果输入的本身就是字符串，那么直接返回
				if (/string/i.test(typeof($in))){
					return $in;
				}
				var tmpObj = $in;
				if (!tmpObj ){
					return "null";
				}
				//block(递归){处理对象情况
				//--content已经是子对象里面的数组
				var objKind = function(content){
				    var result = "{";
					var isFirst = true;
					for (var i=0;i<content.length;i++){
						var oneObj = content[i];
						if (!oneObj.name){
							continue;
						}
						if (isFirst){
							isFirst = false;
						}else{
							result +=",";
						}
						result += (oneObj.name + ":" + pAll(oneObj));
					}
					return result + "}";
				}
				//}
				//block(递归){处理数组情况，注意数组直接是字符串
				var arrayKind = function(content){
					return FW.use().toJSONString(content);
				}
				//}
				//block(递归){处理字符串情况
				var strKind = function(content){
					return content;
				}
				//}
				//block(处理所有情况){
				var pAll = function(base){
					if (base.type == null){
						return "{}"
					};
					if (base.type == 0){
						return objKind(base.content);
					}
					if (base.type == 2){
						return strKind(base.content);
					}
					if (base.type == 4){
						return arrayKind(base.content);
					}
					return null;
				}
				//}
				return pAll(tmpObj);
			},
			/**
			*这个函数用于分拣类型
			*返回的是当前解析的索引值
			* parserFunxxx系列是解析函数内部的注释的并从中获取整个函数的结构的代码
			* 解析过程有点类似下面的文件js解析，但是因为是后写的所以，这个递归结构比js解析清晰
			* 这个递归结构分成两个输出，一个是结果对象，统一用输出参数完成，第二个是解析索引，统一用返回值
			* 而js解析的函数针对这点就有点乱了，这个后面有时间和兴趣在优化一下
			* 要增加子注释的解析，子注释就用-- ++开头，将注释合并到上一个注释的subCommand中
			*/
			parserFunStart:function(srcArray,idx,destArray,parent){
				if (idx >= srcArray.length){
					return -1;
				}
				var type = srcArray[idx].type;
				var content = srcArray[idx].content;
				if (type == 1){
					//如果是代码类型就是直接的normal部分
					return this.API.private("parserFunNormal",srcArray,idx,destArray);
				}else{
					//if(是if分支){
					if (/^\s*if.+/.test(content)){
						return this.API.private("parserFunIf",srcArray,idx,destArray);
					//}
					}
					//else if(是}这个是结束标志){直接返回，不回调
					else if(/^\s*\}.*/.test(content)){
						return idx;
					//}
					}
					//else if(else的情况){还是调用处理if的分支
					else if(/^\s*else.*/.test(content)){
						return this.API.private("parserFunIf",srcArray,idx,destArray,true);
					//}
					}
					//else if(循环的情况，即for 或者while都可以){
					else if(/^\s*(for|while).*/.test(content)){
						return this.API.private("parserFunCycle",srcArray,idx,destArray);
					//}
					}
					//else if(块注释的情况){
					else if(/^\s*block.*/.test(content)){
						return this.API.private("parserFunBlock",srcArray,idx,destArray);
					//}
					}
					//else{这是普通情况
					else{
						return this.API.private("parserFunNormal",srcArray,idx,destArray);
					//}
					}
				}
			},
			/**
			*表示当前就已经是normal了，当前指向normal的注释，或者直接的代码部分
			*返回的是当前解析的索引值
			*/
			parserFunNormal:function(srcArray,idx,destArray){
				var oneResult = {
					type:'normal'
				};
				var nextidx = idx+1;
				if (srcArray[idx].type == 0){
					oneResult.command = srcArray[idx].content;
					idx = this.API.private("parserFunSubCommends",srcArray,idx+1,oneResult);
					nextidx = idx;
					if (idx<srcArray.length && srcArray[idx].type == 1){
						oneResult.code = srcArray[idx].content.replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
						nextidx++;
					}
				}else if(srcArray[idx].type == 1){
					//如果是纯代码，而且只是空的，那么就忽略掉
					if (!/^[\s\t\r\n]*$/.test(srcArray[idx].content)){
						oneResult.code = srcArray[idx].content.replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
					}
				}
				if (oneResult.command!=null || oneResult.code!=null){
					destArray.push(oneResult);
				}
				return this.API.private("parserFunStart",srcArray,nextidx,destArray,oneResult);
			},
			/**
			*  分析是if的情况,分支的情况每个分子都是对等的，所以分支直接取儿子分析
			*  isElse说明了这个是否是else分支，如果是else分子那么，就不要push新的
			*  注意：数组是三层分支结构，第一层是if空的，第二层是他的每个分支，第三层是每个分支上的内容
			*/
			parserFunIf:function(srcArray,idx,destArray,isElse){
				var oneResult = {
					type:'branchList',
					subList:[],
				}
				// if (不是else情况){创建新的并将加入到destArray中
				if (!isElse || destArray.length==0){
					destArray.push(oneResult);
				//}
				}
				//else{不要创建新的，用原先的，这时上一个一定是if，创建过的
				else{
					oneResult = destArray[destArray.length-1];
				//}
				}
				var oneInner = {
					type:'branchBlock',
					subList:[]
				}
				var code = null;
				var childCode = null;
				var comment = srcArray[idx].content;
				oneInner.command = comment;
				idx = this.API.private("parserFunSubCommends",srcArray,idx+1,oneInner);
				var nextIdx = idx;
				if (idx<srcArray.length && srcArray[idx].type == 1){
					code = srcArray[idx].content.replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
					//增加健壮性，如果这里解析到的代码是if()xxx{后面还有，那么要把这个从后面分离出来
					var execResult = /(((if)|(else))[^\r\n]*{)\s*[\r\n]+([\s\S]+)/.exec(code);
					if (execResult!=null && !/^[\s\t\r\n]*$/.test(execResult[2])){
						code = execResult[1];
						childCode = execResult[5].replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
					}
					nextIdx ++;
				};
				oneInner.code = code;
				if (childCode!=null){
					oneInner.subList.push(
						{
							type:'normal',
							code:childCode
						}
					);
				}
				//加入新的第二层
				oneResult.subList.push(oneInner);
				//分解if内容，属于if的第三层了
				var resultIdx = this.API.private("parserFunStart",srcArray,nextIdx,oneInner.subList,oneInner);
				//考虑代码健壮性，把oneInner.subList最后一个儿子的代码片段，如果有最后的{那么要去掉
				var lastCodeChild = oneInner.subList[oneInner.subList.length-1];
				if (lastCodeChild !=null && lastCodeChild.type == "normal" && lastCodeChild.code !=null){
					lastCodeChild.code = lastCodeChild.code.replace(/[\s\t\r\n]*\}[\s\t\r\n]*$/,"");
				}
				
				nextIdx = resultIdx+1;
				if (resultIdx<srcArray.length-1 && srcArray[resultIdx+1].type == 1){
					if (/^[\s\r\n\t]*\}[\r\s\n\t]*$/.test(srcArray[resultIdx+1].content) || /^[\s\t\r\n]*$/.test(srcArray[resultIdx+1].content)){
						//吃掉这个代码
						nextIdx++;
					}
				}
				//处理返回的是}else的情况
				if(/^[\s\r\n\t]*\}[\s\t]*else/.test(srcArray[resultIdx].content)){
					srcArray[resultIdx].content = srcArray[resultIdx].content.replace(/^[\s\r\n\t]*\}/g,"");
					return this.API.private("parserFunIf",srcArray,resultIdx,destArray,true,oneResult);
				}
				return this.API.private("parserFunStart",srcArray,nextIdx,destArray,oneResult);
			},
			/**
			* 这是处理循环的情况
			* 循环时，第一个是循环体本身的注释，吃掉最后一个，内容是循环体的subList，循环是两层结构
			*/
			parserFunCycle:function(srcArray,idx,destArray){
				var oneResult = {
					type:"cycle",
					command:srcArray[idx].content,
					subList:[]
				}
				destArray.push(oneResult);
				idx = this.API.private("parserFunSubCommends",srcArray,idx+1,oneResult);
				var nextIdx = idx;
				var childCode = null;
				if (idx<srcArray.length && srcArray[idx].type == 1){
					oneResult.code = srcArray[idx].content.replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
					//增加健壮性，如果这里解析到的代码是if()xxx{后面还有，那么要把这个从后面分离出来
					var execResult = /(\w+[^\r\n]+{)\s*[\r\n]+([\s\S]+)/.exec(oneResult.code);
					if (execResult!=null && !/^[\s\t\r\n]*$/.test(execResult[2])){
						oneResult.code = execResult[1];
						childCode = execResult[2].replace(/(^[\r\n\s\t]*)|([\r\n\s\t]*$)/g,"");
						oneResult.subList.push(
							{
								type:"normal",
								code:childCode
							}
						);
					}
					nextIdx++;
				}
				//处理块标识的儿子部分
				var nextIdx = this.API.private("parserFunStart",srcArray,nextIdx,oneResult.subList,oneResult)+1;
				//考虑代码健壮性，把oneInner.subList最后一个儿子的代码片段，如果有最后的{那么要去掉
				var lastCodeChild = oneResult.subList[oneResult.subList.length-1];
				if (lastCodeChild !=null && lastCodeChild.type == "normal" && lastCodeChild.code !=null){
					lastCodeChild.code = lastCodeChild.code.replace(/[\s\t\r\n]*\}[\s\t\r\n]*$/,"");
				}
				if (nextIdx<srcArray.length && srcArray[nextIdx].type == 1){
					if (/^[\s\r\n]*\}/.test(srcArray[nextIdx].content) || /^[\s\t\r\n]*$/.test(srcArray[nextIdx].content)){
						//吃掉这个代码
						nextIdx++;
					}
				}
				return this.API.private("parserFunStart",srcArray,nextIdx,destArray,oneResult);
			},
			/**
			* 这是处理块注释的情况
			* 当前是和循环一样的结构,不同的是，bolock是不把注释的下一句代码提上来的，全部都是body部分
			*/
			parserFunBlock:function(srcArray,idx,destArray){
				var oneResult = {
					type:"block",
					command:srcArray[idx].content,
					subList:[]
				}
				destArray.push(oneResult);
				idx = this.API.private("parserFunSubCommends",srcArray,idx+1,oneResult);
				var nextIdx = idx;
				
				//处理块标识的儿子部分
				var nextIdx = this.API.private("parserFunStart",srcArray,nextIdx,oneResult.subList,oneResult)+1;
				if (nextIdx<srcArray.length && srcArray[nextIdx].type == 1){
					if (/^[\s\t\r\n]*\}/.test(srcArray[nextIdx].content) || /^[\s\t\r\n]*$/.test(srcArray[nextIdx].content)){
						//吃掉这个代码
						nextIdx++;
					}
				}
				return this.API.private("parserFunStart",srcArray,nextIdx,destArray,oneResult);
			},
			/**
			*解析子注释
			*/
			parserFunSubCommends:function(srcArray,idx,parent){
				if (!parent){
					//没有parent就直接下一个
					return idx+1;
				}
				//将所有的子注释全部吃掉
				var i = idx;
				while(true){
					if (i>=srcArray.length){
						return i;
					}
					var comment = srcArray[i++].content;
					if (/^[\s\t\r\n]*$/.test(comment)){
						continue;
					}
					if (!/^((\+\+)|(--))/.test(comment)){
						return i-1;
					}
					var sub = parent.subCommand;
					if (!sub){
						sub = parent.subCommand = [];
					}
					var type = comment && comment.substr(0,2);
					var content = comment && comment.substring(2,comment.length);
					sub.push(
						{
							type:type,
							content:content
						}
					)
				}
			},
			/**
			* 处理注释的字符串
			* 用于解析语义化的注释信息
			* @param commentStr 输入的注释信息
			* @return 返回结构化的注释内容，包括：
			*  {
			*      name:'名称',
			*      description:'描述'
			*      param:{
			*            '参数名':'参数说明'
			*     },
			*     return:'返回值',
			*     example:'样例'
			*/
		    parserComment:function(commentStr){
				if (!commentStr){
					return null;
				}
				var cmArray = commentStr.split(/[\n\r]/);
				var result = {
					description:"",
					param:{}
				};
				var lastObj = result;
				var lastMenber = "description";
				for (var i=0;i<cmArray.length;i++){
					var oneComm = cmArray[i].replace(/^[\t\s]*\*/,'');
					if (oneComm == '' || /^\/\*?/.test(oneComm)){
						continue;
					}
					var execResult = /\s*@\s*(\w+)\s*(.*)/.exec(oneComm);
					if (execResult== null){
						//合并到上一个类型中
						if (lastObj[lastMenber]){
							lastObj[lastMenber] = lastObj[lastMenber] + "\n" + oneComm;
						}else{
							lastObj[lastMenber] = oneComm;
						}
						continue;
					}
					lastMenber = execResult[1];
					if (lastMenber == "param"){
						var execResult2 = /(\w+)\s+(.+)/.exec(execResult[2]);
						if (execResult2 != null){
							result.param[execResult2[1]] = execResult2[2];
							lastObj = result.param;
							lastMenber = execResult2[1];
						}
						continue;
					}
					result[lastMenber] = execResult[2];
					lastObj = result;
				}
				return result;
			},
			
			
			
			
			
			/**
			 * define的解析部分
			 * 记录程序开头define之前的所有注释字符串
			 * 将程序的注释部分加入到这里
			 * @param allStr 大字符串
			 * @param pIdx 当前解析到哪个位置
			 * @param allObj 当前的对象--我们会将全局的classStruct传入
			 */
			pDefine: function(allStr, pIdx, allObj) {
				allObj = {};
				//找到define
				var defIdx = allStr.indexOf("define");
				//截取define之前的字符串
				var commStartIdx = allStr.indexOf("/*");
				var commEndIdx = allStr.indexOf("*/");
				if (commStartIdx < defIdx && commEndIdx < defIdx){
					var subStr = allStr.substring(commStartIdx,commEndIdx+2);
					allObj.comments = subStr;
				}
				//调用pImport把上述allStr,pIdx,allObj传入
				allObj = this.API.private("pImport", allStr, defIdx, allObj);
				//return allObj
				return allObj;
			},
			/**
			 * import状态处理函数
			 * 遇到不等于[register]就自反
			 * 结果记录到.include中
			 * 否则跳到register状态
			 */
			pImport: function(allStr, pIdx, allObj) {
				var _pIdx = pIdx;
				//先用字符串找出FW.register关键字，并且把pIdx定位到该关键字的后一个字符上
				pIdx = allStr.indexOf("FW.register") + "FW.register".length;
				//截取输入的pIdx到定位的那一段字符信息中。				
				//var getStr = allStr.subString(_pIdx, pIdx);
				var importStr = allStr.substring(0,pIdx);
				allObj.include = [];
				//+[正则匹配]用正则循环匹配var FW = require("../breeze/framework/js/BreezeFW");并处理对应数据
				//声明正则对象/var\s+(\w+)\s*=\s*require\s*\(['"]([\.\/\\\w]+)["']\);/
				var partten = /\s+(\w*)\s*=?\s*require\s*\(['"]([^"']+)["']\)/ig;
				//while(正则对象能继续匹配){
				while (true) {
					var execResult = partten.exec(importStr);
					if (execResult == null) {
						break;
					}
					//  取到正则对象
					var vName = execResult[1] || "";
					var vDir = execResult[2] || "";
					//如果是FW就忽略
					if (/FW/.test(vName)){
						continue;
					}
					//  设置到allObj中
					allObj.include.push({
						"vName": vName,
						"vDir": vDir
					});
					//}
				}
				//-[正则匹配]
				//调用register状态函数
				allObj = this.API.private("pRegister", allStr, pIdx, allObj);
				//return allObj
				return allObj;
			},
			/**
			 * register状态处理函数
			 * 不等于{的就自反，否则就进入baseName状态
			 */
			pRegister: function(allStr, pIdx, allObj) {
				//从输入的pIdx开始查找，找到第一个{
				var readStr = allStr.charAt(pIdx++);
				while (readStr != "{") {
					readStr = allStr.charAt(pIdx++);
				}
				//标识出找到的地址，掉哦用basename状态
				allObj = this.API.private("pBaseName", allStr, pIdx, allObj);
				//+[整理结果]根据pBaseName返回的内容 整理大结果
				//-[整理结果]------------如何整理，待补充
				//return allObj;
				return allObj;
			},
			/**
			 * baseName状态
			 * 这个状态处理对象的名称，当然名称之前也有可能是一个注释
			 * 当输入的是/*转入注释状态，
			 * 当输入的是,则刷新一下自己状态，当输入的是}表示结束了，返回整个对象
			 * 当输入的是:表示是开始值状态处理
			 * 当拿到其他输入时，表示这是名字的开始
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @return 大对象数{
			 * idx://当前结束时的idx指针。不是下一个，这里主要是因为对象有递归的调用解析，所以不完全由参数传递
			 * objArry:[//大数组对象
			 * 	{
			 *    type:0表示普通对象，1表示注释，2表示字符串，3表示函数，4表示数组
			 *    name:'对象名称',注释表示为comments
			 *    content:实际的内容对象，如果是对象，则递归表示，如果是函数，则为一个对象参见如下
			 * 	}
			 * ]
			 * }
			 * 上述content如果是函数，这里是一个子对象，对象的描述如下：
			 * {
			 * 	  count:xxx,//函数体的括号技术其，每读入一个{+1没读入}-1 如果count为0则表示函数结束
			 *    param:[],//参数字符串数组
			 *    body:[
			 *    	{				 *
			 *        type:01, //0是注释，1是代码
			 *        content:"内容"
			 *    ],
			 * }
			 * 如果是null则表示出错了
			 */
			pBaseName: function(allStr, pIdx, allObj, isArray) {
				//从allObj中读入result，如果allObj为nnull了，则组装一个新的result=[{}],每一个新新成员向里面push一个
				var result = allObj;
				if (result == null) {
					result = {};
				}
				if (result.objArry == null) {
					result.objArry = [{}];
				}


				//if(pidx对应的字符为/){
				var readStr = allStr.charAt(pIdx++);
				if (readStr == "/") {
					//	if (pidx+1的字符为*){
					readStr = allStr.charAt(pIdx++);
					if (readStr == "*") {
						//		if(result的最后一个对象是新对象){
						if (!result.objArry[result.objArry.length - 1].name) {
							//			给空对象赋值附上注释类型
							result.objArry[result.objArry.length - 1].type = 1;
							result.objArry[result.objArry.length - 1].name = "comments";
							//		}else{
						} else {
							//			创建一个新的对象并push到result中，然后再给对应的类型赋值
							result.objArry.push({
								"type": 1,
								"name": "comments"
							});
							//		}
						}
						//		调用comments状态，pIdx为/*后一个索引，allObj为result
						//      根据返回值，给pIdx重新赋值
						result = this.API.private("pComments", allStr, pIdx, result);
						//  }else{
					}else if(readStr == "/"){
						//2014-05-21罗光瑜补充：增加//的注释功能
						var nId = allStr.indexOf("\n",pIdx);
						if (!result.objArry[result.objArry.length - 1].name) {
							//			给空对象赋值附上注释类型
							result.objArry[result.objArry.length - 1].type = 1;
							result.objArry[result.objArry.length - 1].name = "comments";
							//		}else{
						} else {
							//			创建一个新的对象并push到result中，然后再给对应的类型赋值
							result.objArry.push({
								"type": 1,
								"name": "comments"
							});
							//		}
						}
						result.objArry[result.objArry.length - 1].content = allStr.substring(pIdx,nId);
						allObj.objArry.push({});
						result = this.API.private("pBaseName", allStr, nId, result);
					}					
					else {
						//		return null;返回错误了
						return null;
						//	}
					}
					//}else if(pidx输入的字符为,){
				} else if (readStr == ",") {
					//	+[单个结束]说明这是某一个成员完整结束了
					//	在result中增加一个新的空值
					result.objArry.push({});
					//	递归调用pBaseName();
					result = this.API.private("pBaseName", allStr, pIdx, result, isArray);
					//}else if (pidx输入的字符为}){
				} else if (readStr == "}") {
					//  更改pIdx到result中
					result.idx = pIdx - 1;
					//	返回result了
					return result;
					//}else if (pidx输入的字符为空格或者回车,tab){
					//2014年4月3日14:00:17 数组结束
				} else if (readStr == "]" && isArray) {
					result.idx = pIdx;
					return result;
				} else if (/[ ]|[\s]|[\n]|[\r]/i.test(readStr)) {
					//	pidx继续+1直到读入第一个不是空格或者回车，然后递归调用pBaseName，除pidx外其他值不变
					while (/[ ]|[\s]|[\n]|[\r]/i.test(readStr)) {
						pIdx++;
						readStr = allStr.charAt(pIdx);
					}
					result = this.API.private("pBaseName", allStr, pIdx, result, isArray);
					//}else if (pidx读入的是:){
				} else if (readStr == ":") {
					//	调用baseValue函数参数idx移动下一个，
					result = this.API.private("pBaseValue", allStr, pIdx, allObj, isArray);
					//  if (返回是null){
					if (result == null || result == "") {
						//    +[表示错误]
						//    return null;
						return null;
						//    -[标识错误]
						//  }
					}
					//}else{
				} else {
					//	+[name情况]
					//	从result中读入最后一个对象，allObj为result
					//	读入pIdx的字符
					//  加入到result中的最后一个对象的名字部分
					if (/[^"']/i.test(readStr)){
						if (result.objArry[result.objArry.length - 1].name) {
							result.objArry[result.objArry.length - 1].name += readStr;
						} else {
							result.objArry[result.objArry.length - 1].name = readStr;
						}
					}
					//	pIdx+1后继续调用pBaseName
					result = this.API.private("pBaseName", allStr, pIdx, result);
					//	在返回值中，获取pidx的值，并加入到result中
					//	-[name情况]
					//}
				}
				//return result;
				return result;
			},
			/**
			 * 处理注释的函数，即comment状态
			 * 输入是* /则返回basenamme状态，否则自反记录所有注释信息
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @return 指针下一个的位置
			 */
			pComments: function(allStr, pIdx, allObj) {
				var _pIdx = pIdx;
				//congpIdx开始查找下一个*/
				//记录这个*/的下一个字符位置
				pIdx = allStr.indexOf("*/", ++pIdx) + "*/".length;
				//获取当前pIdx到*/之间的所有字符
				var readStr = allStr.substring(_pIdx, pIdx - 1);
				//展开allStr并找到最后一个对象，将获得的子串加入其中
				allObj.objArry[allObj.objArry.length - 1].content = readStr;
				allObj.idx = pIdx;
				//2014年3月27日15:08:45 
				allObj.objArry.push({});
				//调用pBaseName()idx为最后一个*/的位置
				allObj = this.API.private("pBaseName", allStr, pIdx, allObj);
				//return 调用后的当前的指针位置
				return allObj;
			},
			/**
			 * 处理json的值
			 * 如果是"则是字符串，跳到strValue处
			 * 如果是{则是对象，进行对象的递归处理
			 * 如果是function那么就是函数，进入函数处理
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pBaseValue: function(allStr, pIdx, allObj, isArray) {
				var memberName = allObj.objArry[allObj.objArry.length - 1].name;
				console.log("p2Obj:"+memberName);
				//读入下一个字符
				var readStr = allStr.charAt(pIdx++);
				//去除空格				
				while (/[\s\t]/i.test(readStr)) {
					readStr = allStr.charAt(pIdx++);
				}
				//if(字符串){处理字符串
				if (readStr == "\"") {
					//  调用strValue，传入pIdx为下一个字符,allObj不变
					return this.API.private("pStrVal", allStr, pIdx, allObj, isArray);
					//}else if {传入的是{){
				} 
				//}
				//else if(对象){处理对象情况
				else if (readStr == "{") {
					//block(说明是对象){进行对象处理
					//递归调用pBaseName，注意：这里是递归调用，所以allObj是传入null
					console.log("{go sub")
					var backVar = this.API.private("pBaseName", allStr, pIdx, null, isArray);
					console.log("}finished sub["+memberName+"]");
					//  if (返回值为null){
					if (backVar == null || backVar == "") {
						//     return null;
						return null;
						
					} 
					//}
					//else{
					else {
						//返回值中，将pBaseName的值放入到当前参数allObj中
						allObj.objArry[allObj.objArry.length - 1].content = backVar.objArry;
						allObj.objArry[allObj.objArry.length - 1].type = 0;
						pIdx = backVar.idx;
						
					}
					//}
					//pIdx+1后再递归调用pBaseName，这时的allObj是自己参数的allObj
					return this.API.private("pBaseName", allStr, pIdx+1, allObj, isArray);
					
				//}
				//else if(输入的是f){
				} else if (readStr == "f") {
					//  连续读入，检查是否是关键字function
					readStr = allStr.substr(pIdx - 1, "function".length);
					//  if (后续关键字是function){
					if (readStr == "function") {
						//    调用funVal函数进行函数处理
						allObj = this.API.private("pfunVal", allStr, pIdx, allObj, isArray);
						//    整理其结果，将pidx获取后并返回
						return allObj;
						//  }else{
					} else {
						//    return 表达式情况;
						return this.API.private("pExpVal", allStr, pIdx, allObj, isArray);
						//  }
					}
				//}
				//else if(数组情况){
				} else if (readStr == "[") {
					//2014年4月3日13:57:58 说明这是个数组，数组的自动机没有弄好
					//暂时硬编码，默认都是数字或字符的简单对象
					return this.API.private("pArrayVal", allStr, pIdx, allObj, isArray);
					
				} 
				//}
				//else{处理表达式情况
				else {
					//剩下的就是表达式
					return this.API.private("pExpVal", allStr, pIdx, allObj, isArray);
				}
				//}
			},
			/**
			 * 处理数组值
			 * 找到"]"然后获取之间的字符串，然后将其用,分割把整个简单数组解析出来
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pArrayVal: function (allStr, pIdx, allObj, isArray) {
				//设定当前位置为pIdx
				var _pIdx = pIdx;
				//while(true){
				while (true) {
					//	从赋值的当前位置开始查找下一个"
					var readStr = allStr.charAt(pIdx++);
					while (readStr != "]") {
						readStr = allStr.charAt(pIdx++);
					}
					//	if (找到的"的前一个字符不是\){
					if (readStr.charAt(pIdx - 1) != "\\") {
						//    break;
						break;
						//  }
					}
					//}
				}
				//获取从pIdx到设定的当前字符位置的字符串
				var getStr = allStr.substring(_pIdx, pIdx - 1);
				//获取分解后的字符串数组
				var getArray = getStr.split(',');
				for(var i=0;i<getArray.length;i++){
					getArray[i] = getArray[i].replace(/^[\s\t\r\n]*['"]?([^'"]+)['"]?[\s\t\r\n]*$/,
						function(a,b){return b});
				}
				//将这个字符串设置到allobj中
				allObj.objArry[allObj.objArry.length - 1].content = getArray;
				allObj.objArry[allObj.objArry.length - 1].type = 4;
				//调用basename
				allObj = this.API.private("pBaseName", allStr, pIdx, allObj, isArray);
				//返回basename的返回idx索引
				return allObj;
			},
			/**
			 * 处理字符串的值
			 * 如果是"则直接跳走返回basename
			 * 如果是\则往下读入一个，看是否是"如果是"则忽略
			 * 其他情况则继续读入
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pStrVal: function(allStr, pIdx, allObj, isArray) {
				//设定当前位置为pIdx
				var _pIdx = pIdx;
				//while(true){
				while (true) {
					//	从赋值的当前位置开始查找下一个"
					var readStr = allStr.charAt(pIdx++);
					while (readStr != "\"") {
						readStr = allStr.charAt(pIdx++);
					}
					//	if (找到的"的前一个字符不是\){
					if (readStr.charAt(pIdx - 2) != "\\") {
						//    break;
						break;
						//  }
					}
					//}
				}
				//获取从pIdx到设定的当前字符位置的字符串
				var getStr = allStr.substring(_pIdx, pIdx - 1);
				//将这个字符串设置到allobj中
				allObj.objArry[allObj.objArry.length - 1].content = "\""+getStr+"\"";
				allObj.objArry[allObj.objArry.length - 1].type = 2;
				//调用basename
				allObj = this.API.private("pBaseName", allStr, pIdx, allObj, isArray);
				//返回basename的返回idx索引
				return allObj;
			},
			/**
			 * 处理表达式的值
			 * 逻辑和字符串一样，只是遇到回车换行结束，或者遇到对象结束符如逗号括号结束，并前移一个位置
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pExpVal: function(allStr, pIdx, allObj, isArray) {
				//设定当前位置为pIdx
				var _pIdx = pIdx;
				//while(true){
				while (true) {
					//	从赋值的当前位置开始查找下一个"
					var readStr = allStr.charAt(pIdx-1);
					while (!/[\r\n,\}]/.test(readStr)) {
						readStr = allStr.charAt(pIdx++);
					}
					
					if (/[,\}]/.test(readStr)) {
						pIdx --;
					}
					break;
				}
				//}
				//获取从pIdx到设定的当前字符位置的字符串
				var getStr = allStr.substring(_pIdx-1, pIdx);
				//将这个字符串设置到allobj中
				allObj.objArry[allObj.objArry.length - 1].content = getStr;
				allObj.objArry[allObj.objArry.length - 1].type = 2;
				//调用basename
				allObj = this.API.private("pBaseName", allStr, pIdx, allObj, isArray);
				//返回basename的返回idx索引
				return allObj;
			},
			/**
			 * 处理函数部分
			 * 如果是空格就继续往下找
			 * 如果是(就调用param
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pfunVal: function(allStr, pIdx, allObj, isArray) {
				//设置当前位置为pIdx
				var _pIdx = pIdx;
				//while(true){
				while (true) {
					//  if (当前读入的是'('){
					if (allStr.charAt(pIdx) == "(") {
						//     break;
						break;
						//  }
					}
					//  当前位置+1
					pIdx++;
					//}
				}
				allObj.objArry[allObj.objArry.length - 1].type = 3;
				//调用pParam，位置是(的下一个字符
				allObj = this.API.private("pParam", allStr, ++pIdx, allObj, isArray);
				//返回调用的 返回值
				return allObj;
			},
			/**
			 * 处理函数的参数部分
			 * 如果是)就转入funbody调用
			 * 否则记录参数体
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pParam: function(allStr, pIdx, allObj, isArray) {
				//设置当前位置为pIdx
				var _pIdx = pIdx;
				//while(true){
				while (true) {
					//  if (当前读入的是')'){
					if (allStr.charAt(pIdx) == ")") {
						//     break;
						break;
						//  }
					}
					//  当前位置+1
					pIdx++;
					//}
				}
				//将pIdx到当前位置的字符记录下来
				var getStr = allStr.substring(_pIdx, pIdx);
				//用正则去掉字串中所有空格，
				getStr = getStr.replace(/\s/g, "");
				//用,号做间隔符转成数组，
				var _param = [];
				_param = getStr.split(",");
				//将结果记录到allObj中
				if (!allObj.objArry[allObj.objArry.length - 1].content) {
					allObj.objArry[allObj.objArry.length - 1].content = {};
				}
				allObj.objArry[allObj.objArry.length - 1].content.param = _param;
				//为allobj中初始创建一个空的body
				if (!allObj.objArry[allObj.objArry.length - 1].content.body) {
					allObj.objArry[allObj.objArry.length - 1].content.body = [];
				}
				//调用funbody,位置是)的下一个字符
				allObj = this.API.private("pFunbody", allStr, ++pIdx, allObj, isArray);
				return allObj;
			},
			/**
			 * 处理函数体
			 * 如果读到{则记录一个括号计数器+1
			 * 如果读到}计数器-1
			 * 如果}计数器为0则函数结束，调用basename
			 * 如果读入是//则调用pFComment，这是函数的注释体，不是上面的那个注释
			 * 其他情况下记录函数体内容
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pFunbody: function(allStr, pIdx, allObj, isArray) {
				//设置当前位置为pIdx
				var _pIdx = pIdx;
				var bodyarray = allObj.objArry[allObj.objArry.length - 1].content.body;
				//while(true){
				while (true) {
					//  if (当前读入的是'{'){
					if (allStr.charAt(pIdx) == "{") {
						//     allobj的函数计数器+1
						if (!allObj.objArry[allObj.objArry.length - 1].content.count) {
							//开头要push一个空的body作为起始
							allObj.objArry[allObj.objArry.length - 1].content.count = 1;
							bodyarray.push({content:''});
						} else {
							allObj.objArry[allObj.objArry.length - 1].content.count++;
							//将body加入到body中
							bodyarray[bodyarray.length-1].content += allStr.charAt(pIdx);
							bodyarray[bodyarray.length-1].type = 1;
						}
						//  }else if(读入的字符是'}'){
					} else if (allStr.charAt(pIdx) == "}") {
						//     allobj的函数计数器-1
						allObj.objArry[allObj.objArry.length - 1].content.count--;
						//     if (allobj中的函数计数器==0){
						if (allObj.objArry[allObj.objArry.length - 1].content.count == 0) {
							//结束前先判断上一个是否是注释，如果是则删除对应的注释
							if (!bodyarray[bodyarray.length-1].type){
								bodyarray.pop();
							}
							//        调用pBaseName同 2014年3月27日16:08:53 下标向后移动一位
							allObj = this.API.private("pBaseName", allStr, ++pIdx, allObj, isArray);
							//        return 调用结果
							return allObj;
							//     }
						}else{
							//否则的话就是正常信息，加入到body中
							bodyarray[bodyarray.length-1].content += allStr.charAt(pIdx);
							bodyarray[bodyarray.length-1].type = 1;
						}
						//  }else if (读入的字符为//){
					} else if (allStr.charAt(pIdx) == "/" && allStr.charAt(pIdx + 1) == "/") {
						//     在allobj中创建一个空的body内容
						bodyarray.push({content:''});
						//     调用pFComment其中pidx为//的下一个字符
						allObj = this.API.private("pFComment", allStr, pIdx+1, allObj, isArray);
						//     return pFComment的下一个idx
						return allObj;
						//  }	
					}else{
						//if(bodyarray.length == 0){程序还没解析到达括号，还未进入函数，忽略
						if (bodyarray.length == 0){
							pIdx++;
							continue;
						}
						//}
						//其余情况直接累计到bodyArray中
						//这里要对""进行处理的，因为在""里面可以包含{}会导致整个语法判断失效,这个后续再做
						var plFun = function($allStr,$idx,$c){
							var result = {
								l:$allStr.charAt($idx),
								idx:$idx
							}
							if ($allStr.charAt($idx) != $c){
								return null;
							}
							//否则，要开始往下寻找下一个$c而且不是转义情况
							while(true){
								result.idx++;
								result.l += $allStr.charAt(result.idx);
								//如果没结束就换行，那么表示这个不是对应的东西，如这是实际的除法
								if (/[\r\n]/.test($allStr.charAt(result.idx))){
									return null;
								}
								if ($allStr.charAt(result.idx) == $c && $allStr.charAt(result.idx-1) !="\\"){
									return result;
								}
							}
						}
						var r = plFun(allStr,pIdx,"\"");
						if (r == null){
							r = plFun(allStr,pIdx,"'");
						}
						if (r == null){
							r = plFun(allStr,pIdx,"/");
						}
						if (r == null){
							r ={
								l:allStr.charAt(pIdx),
								idx:pIdx
							}
						}
						pIdx = r.idx;
						bodyarray[bodyarray.length-1].content += r.l;
						bodyarray[bodyarray.length-1].type = 1;
					}
					//  当前位置+1
					pIdx++;
					//}
				}
			},
			/**
			 * 处理函数体内的注释
			 * 如果读到\n则调用回funbody
			 * 否则跳到自己继续读入
			 * @param allStr 所有大字符串信息
			 * @param pIdx 当前解析到的idx序号
			 * @param pidx的下一个指针位置
			 * @retur 返回pidx的指针位置，null表示错误
			 */
			pFComment: function(allStr, pIdx, allObj) {
				//设置当前位置为pIdx
				var _pidx = pIdx;
				//while(true){
				while (true) {
					//  if (当前读入的是'\n'){
					if (allStr.charAt(pIdx) == "\n") {
						//     break;
						break;
						//  }
					}
					//  当前位置+1
					pIdx++;
					//}
				}
				//记录从pidx开始到当前位置的字符串
				var getStr = allStr.substring(_pidx+1, pIdx++);
				//将字符串存入allobj中
				allObj.objArry[allObj.objArry.length - 1].content.body[allObj.objArry[allObj.objArry.length - 1].content.body.length - 1].type = 0;
				allObj.objArry[allObj.objArry.length - 1].content.body[allObj.objArry[allObj.objArry.length - 1].content.body.length - 1].content = getStr;
				//在allobj中创建一个空body对象
				allObj.objArry[allObj.objArry.length - 1].content.body.push({content:''});
				//调用pfunbody其中pidx是\n的后一个字符
				allObj = this.API.private("pFunbody", allStr, pIdx, allObj);
				//reutrn pfunbody返回的idx
				return allObj;
			}
		}
	});
	return FW;
});