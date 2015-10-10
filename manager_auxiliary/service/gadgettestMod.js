define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	var formatJS = require("breeze/framework/js/tools/formatJS");
	FW.register({
		name: "gadgettestMod",
		param: {
		},
		
		public: {
			/**
			 * 根据传入的gadget字符串，将字符串解析成class类结构
			 * 结构如下：
			 * {
			 * testName:"xxxxx",
			 * testPath:"require路径",
			 * testBody:[
			 *    methodName:[
			 *       sig:{
			 *       	title:标题
			 *          desc:测试描述
			 *          simulation 模拟描述
			 *          input 输入项描述
			 *          assert 校验内容描述
			 *          content 函数内容体
			 *       }
			 *    ]
			 * ]
			 * }
			 * 例如函数名为：testPublicLoan_checkLessInves2
			 * 那么methodName就是PublicLoan
			 * sig就是checkLessInves2
			 */
			createTestMod: function(contentText) {
				if (contentText == null){
					return null;
				}
				var t = this.API.private("pDefine", contentText, 0);
				//内容解析
				var testName = /addTest\(\"(.*)\"/.exec(contentText)[1];
				var formatContent = {
					"testName" : testName,
					"testBody" : []
				};
				for(var i=0;i<t.include.length;i++){
					if(t.include[i].vName != "JSTest"){
						formatContent.testPath = t.include[i].vDir;
						break;
					}
				}
				var title = null;
				var desc = null;
				var simulation = null;
				var input = null;
				var assert = null;
				for(var i=0;i<t.objArry.length;i++){
					//注释
					if(t.objArry[i].type == 1 && t.objArry[i].name == "comments"){
						var content = t.objArry[i].content;
						//获取注释信息
						title = /@title (.*)/.exec(content)[1];
						desc = /@desc (.*)/.exec(content)[1];
						simulation = /@simulation (.*)/.exec(content)[1];
						input = /@input (.*)/.exec(content)[1];
						assert = /@assert (.*)/.exec(content)[1];
					}else{
						//方法名
						var name = /^test([a-zA-Z0-9]*)/.exec(t.objArry[i].name)[1];
						//用例名
						var sig = /^test.*_([a-zA-Z0-9]*)/.exec(t.objArry[i].name)[1];
						//方法体
						var content = "";
						if(t.objArry[i].type == 3){
							for(var j=0;j<t.objArry[i].content.body.length;j++){
								if(t.objArry[i].content.body[j].type == 0){
									content += "//";
								}
								content+= t.objArry[i].content.body[j].content + "\r\n";
							}
						}
						var body = {};
						var hasMetod = false;
						var number = 0;
						body[name] = [];

						//查看是否存在相同方法
						outer:for(var j=0;j<formatContent.testBody.length;j++){
							for(var k in formatContent.testBody[j]){
								if(k == name){
									body[name] = formatContent.testBody[j][k];
									hasMetod = true;
									number = j;
									break outer;
								}
							}
						}
						
						var sigContent = {};
						sigContent[sig] = {
							"title" : title,
							"desc" : desc,
							"simulation" : simulation,
							"input" : input,
							"assert" : assert,
							"content" : content
						};
						body[name].push(sigContent);
						//若存在相同方法 则更新内容 否则添加内容
						hasMetod ? formatContent.testBody[number] = body : formatContent.testBody.push(body);
						//清空注释解析内容
						title = null;
						desc = null;
						simulation = null;
						input = null;
						assert = null;
					}
				}
				return formatContent;
			},
			/**
			 * 输入的是一个类型，返回函数文本
			 * @param mod
			 */
			createText: function(mod){
				var code = "define(function(require, exports, module) {";
				code += "var JSTest = require(\"breeze/framework/js/JSTest\");";
				code += "var FW = require(\"breeze/framework/js/BreezeFW\");";
				code += "require(\"" + this.MY.requirePath + "\");";
				code += "JSTest.addTest(\"" + this.MY.testName + "\", {";
				var hasUp = false;
				outer:for(var i=0;i<mod.length;i++){
					for(var j in mod[i]){
						if(mod[i][j].length==0){
							continue outer;
						}else{
							for(var k=0;k<mod[i][j].length;k++){
								for(var l in mod[i][j][k]){
									if(hasUp){
										code += ",";
									}
									hasUp = true;
									code += "/**" + "\n\r";;
									code += "* @title " + mod[i][j][k][l].title + "\n\r";
									code += "* @desc " + mod[i][j][k][l].desc + "\n\r";
		 							code += "* @simulation " + mod[i][j][k][l].simulation + "\n\r";
		 							code += "* @input " + mod[i][j][k][l].input + "\n\r";
		 							code += "* @assert " + mod[i][j][k][l].assert + "\n\r";
									code += "*/";
									code += "test" + j + "_" + l + ":function(){";
									code += mod[i][j][k][l].content;;
									code += "}";
								}
							}
						}
					}
				}
				code += "});";
				code += "return JSTest;";
				code += "});";
				code = formatJS.js_beautify(code);
				return code;
			}
		},
		private: {
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
				pIdx = allStr.indexOf("JSTest.addTest") + "JSTest.addTest".length;
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
console.log("193:null-readStr:"+readStr+allStr.charAt(pIdx+1));
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
console.log("230");
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
console.log("315 null");
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
						//  }
					} 
					//else{
					else {
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
console.log("639:null");
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