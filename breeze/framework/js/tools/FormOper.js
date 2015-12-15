/**
 * 本函数体用于进行窗口相关的操作，包括自动解析生产窗体
 * 自动获取窗体下面的表单对象 
 *  v0.01 罗光瑜修改 把校验函数独立成一个check方法
 *  v0.02 程明剑修改 去除switch判断 修改验证函数支持自动定位
 */
define(function(require, exports, module) {
    var _win = window;
    var _doc = _win.document;
    var _result = {
        name : "FormAPI",
        desc : "表单解析函数",
        domain : "FormAPI"
    };

    var _api = _result.f = function(fw){
		fw.use(_api);
	};
	_api.getDomain = function(){
		return "form";
	}

	var API = {
		JsonAPI:require("./lib/json"),
		dateTimeAPI:require("./DateTime"),
		BreezeTemplate:require("./lib/BreezeTemplate"),
		lang:{
			formatQuota : function(str){
				return str.replace(/'/g,"&apos;");
			},
			showPicsList: function(PicsArr){
				var PicsListHtml = "";
				for (var i = 0; i < PicsArr.length; i++) {
					PicsListHtml += "<div class='PicItem'>";
					PicsListHtml += "<div class='picsThumb'><img data-src='"+PicsArr[i].picUrl+"' src='"+Cfg.baseUrl+'/'+PicsArr[i].picUrl+"' title='"+PicsArr[i].alt+"'/></div>";
					PicsListHtml += "<a href='javascript:void(0)' class='delpic'>删除</a>";
					PicsListHtml += "<input style='width:106px;' type='text' value='"+PicsArr[i].alt+"' placeholder='图片描述' />";
					PicsListHtml += "</div>";
				};
				return PicsListHtml;
			}
		}
	};
	
    /**
     * 依据对象描述信息创建窗体,实现原理：
     * 对象描述结构，参见下面。
     * 在顶级对象成员中以树形方式对对象表单进行解析
     * 二级或二级以上对象（所谓二级就是该成员是在一个列表中，二级以上，就是列表中的某个成员，还是列表）用嵌套的div实现
     * 比如：
     * <div>这个div表示列表中的一行记录，这里不要用table了，全部用div
     *     <li>xxx</li>.....一行中的每一列
     *     <div>这一行中的子列表，就是二级列表，注意前面有缩进
     *          <li>xxx</li>.....一行中的每一列
     *     </div>
     * </div>
     * @param objdesc 对象描述信息，其结构为：
     *           {
     *             a:{
     *                  title:"该字段显示的名称",
     *                  type:"Text--输入框，Select[{name:value},{name:value}]--单选框,MultSelect--多选框，TextArea--文本区域",
     *                  valueRange:"字段校验用的正则表达式,如果是复选框或者单选框，这里给出字段复选和单选范围",
     *                  desc:"该字段帮助的描述文字"
     *             }
	 *	           b:{
     *                  title:"该字段显示的名称",
     *                  type:"Text--输入框，Select--单选框,MultSelect--多选框，TextArea--文本区域",
     *                  valueRange:"字段校验用的正则表达式,如果是复选框或者单选框，这里给出字段复选和单选范围",
     *                  desc:"该字段帮助的描述文字"
     *             },
     *             c:{
		 				title:"",
						type:"List",
						valueRange:[ //这个表示嵌套的子对象表单，注意，只描述
										{
										  aa:{
					                         title:"该字段显示的名称",
					                         type:"Text--输入框，Select--单选框,MultSelect--多选框，TextArea--文本区域",
					                         valueRange:"字段校验用的正则表达式,如果是复选框或者单选框，这里给出字段复选和单选范围",
					                         width:list的子表单一定是列表方式给出，这个描述字段告知列表中该字段的比例,
					                         desc:"该字段帮助的描述文字"
					                  	    },
					                      bb:这里不展开了，这里既是第二层子节点，描述方式同上，本函数支持无限层次描述
									   }
					              ]
					}
     *           }
	 */
	 /**
     * 上述例子中，对象的成员名就是实际对象的成员名，即这个对象结构和真实独享结构是一致的
     * @param dom 将表单生成到目标节点中去
     * @return 返回一个生成好的form节点的内容
     */

     //根据数据描述和data生成列表
     _api.createFormListByObjDesc = function(objdesc,dom,formData,callback,type){
     	var islist = true;
     	var _objdesc = {
     		formList:{
				type:"List",
				valueRange:[objdesc]
     		}
     	};

     	if(formData){
	     	var _formData = {
	     		formList:formData
	     	};
	     	beginCreateFormOrList(islist,_objdesc,dom,_formData,callback,type);
	     }else{
	     	beginCreateFormOrList(islist,_objdesc,dom,null,callback,type);
	     }
	}

    //生成form
    _api.createFormByObjDesc = function(objdesc,dom,formData,callback){
    	var islist = false;
    	beginCreateFormOrList(islist,objdesc,dom,formData,callback)
    }

    /**
    *2014-06-12罗光瑜增加
    *把校验函数单独拎出来做一个独立的API
    *校验对象都在valueRange里面，valueRange的定义如下：
    *[
    *   {
	*		checkers:function(checkValue,__data){
	*           //校验代码
	*       },
	*       failTips:"失败的提示"
    *   },
    *   {
	*		checkers:"function(){   //校验代码  }",
	*       failTips:"失败的提示"
    *   },
    *   {
	*		checkers:"^abcd",
	*       failTips:"失败的提示"
    *   },
    *   {
	*		checkers:/^abcd/,
	*       failTips:"失败的提示"
    *   }
    *]
    *2014-07-04 17:36:49 程明剑 添加固定校验函数
    *2014-09-11 15:42:08 程明剑 支持对象长度验证
    *long 被检验数据不可以大于规定值
    *格式 [long:长度]
    *short 被检验数据不可以小于规定值
	*格式 [short:长度]
	*longness 被检验数据必须为规定值
	*格式 [longness:长度]
    */
    _api.checkData = function(checkData,checkMetadata){
    	//定义一个全值
    	var __data=checkData;
    	//这时一个递归函数
    	function checkValueFun(checkObj,checkDesc){
    		//接收验证失败信息
    		var errorMessage = null; 		
			for(var name in checkDesc){
				if (!checkDesc.hasOwnProperty(name)){
					continue;
				}
				var checkValue = checkObj[name] || "";
				var descObj = checkDesc[name];

				//过滤不需要校验的对象
				if (descObj.type == "Select" ||descObj.type == "MultSelect"||descObj.type == "hidden"||descObj.type == "CheckBox"||descObj.type == "Radio"||descObj.type == "Json"){
					continue;
				}
				//检查是否需要校验
				if (!descObj.valueRange || (descObj.type == "List" && descObj.valueRange.length==0)){
					continue;
				}
				for (var i=0;i<descObj.valueRange.length;i++){
					if (descObj.type == "List" && i==0){
						for (var j=0;j<checkValue.length;j++){
							if (checkValueFun(checkValue[j],descObj.valueRange[i]) == null){
								return null;
							}
						}
						continue;
					}
					var checkOne = descObj.valueRange[i];

					//2013-11-23罗光瑜修改，这里要重新使用会原来的功能，当然function是一个字符串，同样json也是一个字符串
					//因为标准的json里面如果作为通信传输的话，这两个对象（function和json）是不能被传输的，所以都转成字符串了
					//2014-07-04 17:08:22 程明剑修改 正则标准格式改为 "/正则内容/"
					if(checkOne.checkers){
						if (/function/i.test(typeof(checkOne.checkers)) || /^function/i.test(checkOne.checkers)){									
							var funCheck = checkOne.checkers;
							if (/string/i.test(typeof(funCheck))){
								funCheck = eval ("("+checkOne.checkers+")");
							}
							//这是一个函数
							if (!funCheck(checkValue,__data)){
								if(!errorMessage){
									errorMessage = {
										"checkFailed":"true"
									};
								}
								//当备注信息不存在的时候就返回缺省值
								errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
							}
						}else {
							var cReg = checkOne.checkers;
							if (/string/i.test(typeof(cReg))){
								cReg = new RegExp(checkOne.checkers,"i");
							}
							//2013-12-23日罗光瑜添加，要保证这是一个正则表达式									
							if (cReg.test && !cReg.test(checkValue)){
								if(!errorMessage){
									errorMessage = {
										"checkFailed":"true"
									};
								}
								//当备注信息不存在的时候就返回缺省值
								errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
							}
						}
					}
					if(checkOne.long){
						try{
							checkValue = eval ("("+checkValue+")");
						}catch(e){

						}
						if(/\d+/ig.test(checkValue)){
							checkValue = ""+checkValue+"";
						}

						if(checkValue && checkValue.length>checkOne.long){
							var error = descObj.title+"的长度超出规定值("+checkOne.long+")！";
							if(!errorMessage){
								errorMessage = {
									"checkFailed":"true"
								};
							}
							//当备注信息不存在的时候就返回缺省值
							errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
						}					
					}
					if(checkOne.short){
						try{
							checkValue = eval ("("+checkValue+")");
						}catch(e){

						}
						if(/\d+/ig.test(checkValue)){
							checkValue = ""+checkValue+"";
						}

						if(checkValue && checkValue.length<checkOne.short){
							var error = descObj.title+"的长度小于规定值("+checkOne.short+")！";
							if(!errorMessage){
								errorMessage = {
									"checkFailed":"true"
								};
							}
							//当备注信息不存在的时候就返回缺省值
							errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
						}
					}
					if(checkOne.longness){
						try{
							checkValue = eval ("("+checkValue+")");
						}catch(e){

						}
						if(/\d+/ig.test(checkValue)){
							checkValue = ""+checkValue+"";
						}

						if(checkValue && checkValue.length!=checkOne.longness){
							var error = descObj.title+"的长度不等于规定值("+checkOne.longness+")!";
							if(!errorMessage){
								errorMessage = {
									"checkFailed":"true"
								};
							}
							errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
						}
					}
					
					if(checkOne.quickCheck){
						if (checkOne.quickCheck == "notNull"){
							if (checkValue === "" || checkValue==null || checkValue.length == 0){
								var error = descObj.title+"不能为空";
								if(!errorMessage){
									errorMessage = {
										"checkFailed":"true"
									};
								}
								errorMessage[name] = checkOne.failTips == null ? error : checkOne.failTips;
							}
						}
					}
				}
			}
			return errorMessage || checkObj;
		}
		return checkValueFun(checkData,checkMetadata);
    }

    function beginCreateFormOrList(islist,objdesc,dom,formData,callback,type){
        //开始解析objdesc
        var formStr = "<div class='form-wrap ";//罗光瑜修改：这里取消了表单的提交按钮
        if(islist){
        	formStr += "islist ";
        }else{
        	formStr += "pull-left ";
        }
		formStr += "clearfix'>";

		//2014年7月8日 09:47:01 程明剑 多处多图唯一标识符
		var PicsNum = 0;

        parserObjDesc(objdesc); // 根据对象结构描述文件生成表单
		formStr += "</div>";

    	var htmlParser = API.BreezeTemplate.parserTemplate(formStr,formData,API);	//根据数据解析表单字符串生成最终表单html
    	dom.html(htmlParser);
		
    	//2014年8月12日 16:36:49 程明剑 临时添加兼容日期问题
    	if(formData&&formData.borrowerInfo&&formData.borrowerInfo.length){
    		var borrowerInfo = formData.borrowerInfo;
    		for(var i=0;i<borrowerInfo.length;i++){
				var provinces =borrowerInfo[i].provinces;
				var city = borrowerInfo[i].city;
				var area =borrowerInfo[i].area;
				var provincesID =  "data.borrowerInfo["+i+"].provinces";
				var cityID = "data.borrowerInfo["+i+"].city";
				var areaID = "data.borrowerInfo["+i+"].area";
				
				jsAddress(provincesID,cityID,areaID,provinces,city,area);
    		}
    	}
		
		// 给List类型增加"增加一行"、"删除一行"、"全选"、"删除所选等功能"
		formAction();
		
		//整体表单描述对象解析函数
		function parserObjDesc($obj,$objName,isListtype){
			var lastTitle = null;
			for(var prop in $obj){

				//对数据描述name属性中包含.的情况进行批量替换动作 替换规则："." To "_dot_" 
    			var propForName = prop.replace(/\./gi,"_dot_");

				var fTitle = $obj[prop].title?$obj[prop].title:"";
				var fType = $obj[prop].type?$obj[prop].type:"";
				var fValueRange = $obj[prop].valueRange?$obj[prop].valueRange:"";
				var fDesc = $obj[prop].desc?$obj[prop].desc:"";
				var fWidth = (islist || "$listTit" == $objName || isListtype)?($obj[prop].width?$obj[prop].width:""):"";				
				var fIsList = $obj[prop].islist=="1"?true:false;
				//2014年2月12日10:11:33 程明剑 添加按钮扩展
				var fExtAttr = $obj[prop].extAttr?$obj[prop].extAttr:"";

				//==== 不存在参数$objName ========
				//==== 表示解析一级内容 ===========
				if(!$objName){
					var fName = "data." + propForName; 
					var fValue = "data[\"" + prop + "\"]";
					formStr+="<div class='control-group c_"+fType+"'>";//每个表单的结构开始 罗光瑜修改：加上表单的类型
					if (fTitle!=""){//罗光瑜修改：如果没标题不要显示：
						formStr+="<label for='"+fName+"' class='control-label'>"+fTitle+"：</label>";
					}
					formStr+="<div class='controls'>";
					parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr); //解析表单
					if(fDesc){
						formStr+="<span class='help-inline'>"+fDesc+"</span>";
					}else{
						formStr+="<span class='help-inline'></span>";
					}
					formStr+="</div></div>";
				}
				
				//==== 存在参数$objName=$listTit ======
				//==== 表示解析子循环title =============

				else if($objName=="$listTit"){
					//2014-01-01 罗光瑜修改 如果和上一个title相同，那么就合并
					if (lastTitle == fTitle){
						continue;
					}
					//定义节点class
					var fName = "data." + propForName;
					var __fClass = fName.replace(/_dot_/gi,".").replace(/(\[.*?\])|(data)/g,"").replace(/\./g,"_").toLowerCase();//罗光瑜修改：对象间用_
					if(islist && !fIsList){
						formStr+="<th class='th"+__fClass+" th_"+fType+"' style='display:none;'>"+fTitle+"</th>";
					}else{
						if(fType=="Button"){
							formStr+="<th class='th"+__fClass+" th_"+fType+"' >"+fTitle+"</th>";
						}else{
							formStr+="<th class='th"+__fClass+" th_"+fType+"' style='cursor:pointer' onclick=\"FW.getAPP('appWithButton').changeOrderBy('"+propForName+"','"+__fClass+"');\">"+fTitle+"</th>";
						}
					}
				}
				
				//==== 存在参数$objName,且不等于"$listTit"====
				//==== 表示解析子循环内容 ====================
				
				else{ //子级循环
					//2014-01-01 罗光瑜修改 如果和上一个title相同，那么就合并
					if (lastTitle == fTitle){
						//去掉上一个的td部分
						formStr = formStr.substr(0,formStr.length - 5);
					}
					var fName = $objName + "." + propForName;

					//将递归所需的$objName 转换成data['name']['age']的形式获取对应的fValue，防止属性名中有.的情况
					var arrFname = $objName.split(".");
					var newFname = arrFname[0];
					for(var i=1;i<arrFname.length;i++){
						if(arrFname[i].split("[")){
							newFname += "['" + arrFname[i].split("[")[0] + "'][" + arrFname[i].split("[")[1];
						}else{
							newFname += "['"+arrFname[i]+"']";
						}
					}
					
					var fValue = newFname.replace(/_dot_/gi,".") + "[\"" + prop + "\"]";
					fValue = fValue.replace(/(\$\{)([^\}]*?)(\})/g,function(a,b,c,d){if(a){ return c;}});

					var __fClass = fName.replace(/_dot_/gi,".").replace(/(\[.*?\])|(data)/g,"").replace(/\./g,"_").toLowerCase().replace("formlist_","");//罗光瑜修改：对象间用_
					//2014-01-01 罗光瑜修改 如果和上一个title相同，那么就合并
					if (lastTitle != fTitle){						
						if(islist && !fIsList){
						formStr+="<td class='td"+__fClass+" td_"+fType+"' style='display:none;'>";
						}else{
							formStr+="<td class='td"+__fClass+" td_"+fType+"'";
							//2014年9月11日 14:56:21 程明剑 按钮不可换行
							if(fType=="Button"){
								formStr+=" style='white-space:nowrap'";
							}
							formStr+=">";
						}
					}					
					parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr); //解析表单
					if(fDesc){
						formStr+="<span class='help-inline'>* "+fDesc+"</span>";
					}
					formStr+="</td>";
				}
				lastTitle = fTitle;
			}
		}
		//2014年9月11日 10:49:46 程明剑 定义类型
		function StateManager(){
			var states = {
				//单行文本函数
				Text:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<input id='"+fName+"' class='inp_text "+fClass+"_inp' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
				},
				//hidden隐藏的表单类型
				Hidden:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<input id='"+fName+"' class='inp_text "+fClass+"_inp' type='hidden' name='"+fName+"' ";			
				    formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					formStr+="/>";
				},
				//只读文本
				ReadOnly:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<input id='"+fName+"' class='inp_text readOnly "+fClass+"_inp' type='text' name='"+fName+"' readOnly='true' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
				},
				//外联类型
				OuterLink:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='input-append' style='width:100%;'>";
					formStr+="<input id='"+fName+"' class='inp_text outerlink "+fClass+"_inp' name='"+fName+"' type='text' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					//增加编辑按钮
					formStr+="<a style='line-height:28px; height:28px; padding:0 5px; border:1px solid #ccc;' alt='"+fTitle+"' class='btn btn-mini btn-light outerLinkEdit' href='javascript:void(0);'><i class='icon-edit bigger-120'> ";
					if(!islist){
						formStr+="选择";
					}
					formStr+="</i></a>";
					formStr+="</div>";
				},
				//按钮类型
				Button:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					var htmlStr="<a {S_base}  href='javascript:void(0);' {attr} title=\"{title}\" class=\"FormOperBtn btn btn-mini {style} {S_class}\" > <i class=\"{styleClass} bigger-120\">"+(fValueRange.name||"")+"</i></i></a>";
					if (fValueRange.htmlStr){
						htmlStr = fValueRange.htmlStr;
					}
					htmlStr = htmlStr.replace("{S_base}","id='"+fName+"' btnValue='"+fValueRange.title +"'");
					htmlStr = htmlStr.replace("{S_class}",fClass+"_inp");
					htmlStr = htmlStr.replace(/\{([\w]+)\}/ig,function(a,b,c,d,e){
						if (fValueRange[b]){
							return fValueRange[b];	
						}
						return a;
					});
					var newHtml = "";
					if(fExtAttr){				
						var serverName = "";		
						for(var i in fExtAttr){
							newHtml += (i + "='" + fExtAttr[i] + "' ");
						}
					}
					htmlStr = htmlStr.replace("{attr}",newHtml);
					formStr+=htmlStr;
					formStr+="&nbsp;";
				},
				//日期选择器
				DatePicker:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='input-append date date-picker'>";
					formStr+="<input id='"+fName+"' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					formStr+="<span class='add-on'><i data-time-icon='icon-time' data-date-icon='icon-calendar'></i></span></div>";
				},
				//时间选择器
				TimePicker:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='input-append date time-picker'>";
					formStr+="<input id='"+fName+"' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					formStr+="<span class='add-on'><i data-time-icon='icon-time' data-date-icon='icon-calendar'></i></span></div>";
				},
				//日期+时间选择器
				DateTimePicker:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='input-append date date-time-picker'>";
					formStr+="<input id='"+fName+"' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					formStr+="<span class='add-on'><i data-time-icon='icon-time' data-date-icon='icon-calendar'></i></span></div>";
				},
				//日期间隔选择器
				DateRangePicker:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='input-prepend'><span class='add-on'><i class='icon-calendar'></i></span>";
					formStr+="<input id='"+fName+"' class='date-range-picker' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					formStr+="</div>";
				},
				//多选列表函数
				CheckBox:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					for (var i=0; i<fValueRange.length; i++){
						for(var emun in fValueRange[i]){
							formStr+="<label><input class='ace-checkbox-2' type='checkbox' name='"+fName+"' value='"+fValueRange[i][emun]+"' ";
							formStr+="<!--$if(valueStatus){-->";
							formStr+="<!--$for(var j=0; j<"+fValue+".length; j++){-->";
							//罗光瑜 2014-1-13日修改，对于checkbox使用字符串
							//2014年8月11日 15:57:27 程明剑 修改兼容性 判断是否为Object
							formStr+="<!--$if((eval('('+"+fValue+"+')'))[j]=='"+fValueRange[i][emun]+"'||(typeof("+fValue+")=='object'&&"+fValue+"[j]=='"+fValueRange[i][emun]+"')){-->";
							formStr+="checked='true' ";
							formStr+="<!--$}}}-->";
							formStr+="/><span class='lbl'> "+emun+"</span></label>";
						}
					}
				},
				//单选列表函数
				Radio:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					for (var i=0; i<fValueRange.length; i++){
						for(var emun in fValueRange[i]){
							formStr+="<label><input type='radio' name='"+fName+"' value='"+fValueRange[i][emun]+"' ";
							formStr+="<!--$if(valueStatus){-->";
							formStr+="<!--$if("+fValue+"=='"+fValueRange[i][emun]+"'){-->";
							formStr+="checked='true' ";
							formStr+="<!--$}-->";
							formStr+="<!--$}else{-->";
							if(i==0){
								formStr+="checked='true' ";	
							}
							formStr+="<!--$}-->";
							formStr+="/><span class='lbl'> "+emun+"</span></label>";
						}
					}
				},
				//下拉菜单函数
				Select:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<select id='"+fName+"' class='"+fClass+"_sel' ";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="name='"+fName+"'>";
					for (var i=0; i<fValueRange.length; i++){
						for(var emun in fValueRange[i]){
							formStr+="<option value='"+fValueRange[i][emun]+"' ";
							formStr+="<!--$if(valueStatus){-->";
							formStr+="<!--$if("+fValue+"=='"+fValueRange[i][emun]+"'){--> selected='selected' <!--$}-->";
							formStr+="<!--$}-->";
							formStr+=">"+emun+"</option>";
						}
					}
					formStr+="</select>";
				},
				//多选列表函数
				MultSelect:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<select id='"+fName+"' class='"+fClass+"_sel' name='"+fName+"' multiple='multiple'>";
					for (var i=0; i<fValueRange.length; i++){
						for(var emun in fValueRange[i]){
							formStr+="<option value='"+fValueRange[i][emun]+"' ";
							formStr+="<!--$if(valueStatus){-->";
							formStr+="<!--$for(var j=0; j<"+fValue+".length; j++){-->";
							formStr+="<!--$if("+fValue+"[j]=="+fValueRange[i][emun]+"){-->";
							formStr+="selected='selected' ";
							formStr+="<!--$}}-->";
							formStr+="<!--$}-->";
							formStr+=">"+emun+"</option>";
						}
					}
					formStr+="</select>";
				},
				//附件函数
				Affix:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					var onclickStr = "";
					onclickStr+="this.id = this.id.replace(/\\]/ig,'_');";
					onclickStr+="this.id = this.id.replace(/[\\[\\.]/ig,'_');";

					onclickStr+="var tmpid=this.id;";
					onclickStr+="$.ajaxFileUpload({";
					onclickStr+="url:'${Cfg.ajaxFileUpLoadUrl}',";
					onclickStr+="secureuri:false,";
					onclickStr+="fileElementId:tmpid,";
					onclickStr+="dataType: 'json',";
					onclickStr+="success: function (data, status){";
					onclickStr+="document.getElementById('"+fName+"_hidden').value = data.succUrl; ";
					onclickStr+="}";
					onclickStr+="});";
					formStr+="<input id='"+fName+"_hidden' type='text' class='inp_affix_val' style='width:300px; float:left;' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					formStr+="/>";
					formStr+="<button type='button' style='line-height:26px; float:left;' class='btn btn-mini btn-info thumbBtn'><i class='icon-edit bigger-120'> 上传</i></button>";
					formStr+="<input style='opacity:0; cursor:pointer; filter:alpha(opacity=0); float:left; width:62px; margin-right:-42px; overflow:hidden; position:relative; left:-62px; zindex:10;' id='"+fName+"_affix' name='upload' class='inp_affix "+fClass+"_affix' type='file' onchange=\""+onclickStr+"\"/>";
				},
				//缩略图函数
				File:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					var onclickStr = "";
					onclickStr+="this.id = this.id.replace(/\\]/ig,'_');";
					onclickStr+="this.id = this.id.replace(/[\\[\\.]/ig,'_');";
					onclickStr+="var tmpid=this.id;";
					onclickStr+="$.ajaxFileUpload({";
					onclickStr+="url:'${Cfg.ajaxFileUpLoadUrl}',";
					onclickStr+="secureuri:false,";
					onclickStr+="fileElementId:tmpid,";
					onclickStr+="dataType: 'json',";
					onclickStr+="success: function (data, status){";
					onclickStr+="document.getElementById('"+fName+"_hidden').value = data.succUrl; ";
					onclickStr+="$(document.getElementById('"+fName+"_img_file')).attr('src',Cfg.baseUrl+'/'+data.succUrl);";
					onclickStr+="}";
					onclickStr+="});";
					formStr+="<input id='"+fName+"_hidden' type='text' class='inp_file_val' style='width:300px; float:left;' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					formStr+="/>";
					formStr+="<button type='button' style='line-height:26px; float:left;' class='btn btn-mini btn-info thumbBtn'><i class='icon-edit bigger-120'> 上传</i></button>";
					formStr+="<input style='opacity:0; cursor:pointer; filter:alpha(opacity=0); float:left; width:62px; margin-right:-42px; overflow:hidden; position:relative; left:-62px; zindex:10;' id='"+fName+"_file' name='upload' class='inp_file "+fClass+"_file' type='file' onchange=\""+onclickStr+"\"/>";
					
					formStr+="<div style='float:left; height:60px; width:90px; margin:0 10px 0 0; background:url(${Cfg.baseUrl}/images/nopic.gif) no-repeat; overflow:hidden;'>";
					formStr+="<a data-toggle='lightbox' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="href='${Cfg.baseUrl}/${lang:formatQuota("+fValue+")}' data-title='<a target=_black href=${Cfg.baseUrl}/${lang:formatQuota("+fValue+")}>在新窗口查看</a> ' >";
					formStr+="<!--$}else{-->"; 
					formStr+="href='${Cfg.baseUrl}/images/nopic.gif' >";
					formStr+="<!--$}-->";

					formStr+="<img class='img_file "+fName+"_img_file' id='"+fName+"_img_file' style='height:60px; width:90px;' "; 
					formStr+="<!--$if(valueStatus){-->";
					formStr+="src='${Cfg.baseUrl}/${lang:formatQuota("+fValue+")}' />";
					formStr+="<!--$}else{-->"; 
					formStr+="src='${Cfg.baseUrl}/images/nopic.gif' />";
					formStr+="<!--$}-->";
					formStr+="</a>";
					formStr+="</div>";
				},
				//文本域函数
				TextArea:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='row-fluid'><textarea id='"+fName+"' class='span12 "+fClass+"_tex' name='"+fName+"' ";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+=">";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${"+fValue+"}";
					formStr+="<!--$}-->";
					formStr+="</textarea></div>";
				},
				//html编辑器函数
				Html:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<div class='row-fluid'><textarea id='"+fName+"' class='"+"span12 xheditor "+fClass+"_tex' name='"+fName+"' ";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+=">";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${"+fValue+"}";
					formStr+="<!--$}-->";
					formStr+="</textarea></div>";
				},
				//数据列表——支持 对象类型，字符串类型
				List:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<table style='margin-bottom:10px; width:"+fWidth+"' class='table table-list table"+fClass+" table-striped table-bordered table-hover'>";
					
					//递归解析 列表title名称;
					//Alec 判断是否是字符串类型

					if($.isArray(fValueRange)){  //如果是list列表型
						formStr+="<thead>";
						formStr+="<tr><th style='width:60px;' class='center'>选择</th>";
						parserObjDesc(fValueRange[0],"$listTit");
						//存在列表，且是默认数据列表type存在，或等于0的情况，才有操作列
						if(islist && !type){
							//2014-01-01罗光瑜修改 任何时候，不加操作列
							//formStr+="<th style='width:120px;'>操作</th>";
						}
						formStr+="</tr></thead>";
					}
					formStr+="<tbody>";
					//如果存在数据对象参数,循环解析
					formStr+="<!--$if(valueStatus && "+fValue+".length){-->";

					//非常重要，避免递归i变量重复
					var idx = fName.replace(/_dot_/gi,".").replace(/(\$\{)([^\}]*?)(\})/g,function(a,b,c,d){if(a){return c;}}).replace(/(\[)|(\])|(\.)|(data)/g,"")+"_i";
					formStr+="<!--$for( var "+idx+"=0; "+idx+"<"+fValue+".length; "+idx+"++){-->";
					
					if(islist && type==2){
						//用于关联列表的时候，用单选框
						formStr+="<tr><td style='width:60px;' class='center'><label><input name='rowRadio' idx='${"+idx+"}' type='radio'/><span class='lbl'></span></label></td>";
					}else{
						//非列表或默认列表的时候，用复选框
						formStr+="<tr><td style='width:60px;' class='center'><label><input name='rowCheckbox' type='checkbox' idx='${"+idx+"}'/><span class='lbl'></span></label></td>";
					}
					if(islist && !type){
						//除关联列表视图，添加操作按钮列区域
						var btnHtml = "";
						//2014-01-01罗光瑜修改 任何时候，不加操作列
				     	//btnHtml+="<td><div class='hidden-phone visible-desktop btn-group actionBtnForList'></div></td>";
				     }
					//递归解析
					if($.isArray(fValueRange)){  //如果是list列表型
						parserObjDesc(fValueRange[0], fName+"[${"+idx+"}]",true);
						if(islist && !type){
							//2014-01-01罗光瑜修改 任何时候，不加操作列
							//formStr += btnHtml;
						}
					}else{ //字符型
						var fTitle2 = "";
						var fType2 = fValueRange.type?fValueRange.type:"";
						var fValueRange2 = fValueRange.valueRange?fValueRange.valueRange:"";
						var fDesc2 = fValueRange.desc?fValueRange.desc:"";
						var fWidth2 = fValueRange.width?fValueRange.width:"";
						var fName2 = fName+"[${"+idx+"}]";

						//将递归所需的$objName 转换成data['name']['age']的形式获取对应的fValue，防止属性名中有.的情况
						var arrFname = fName2.split(".");
						var newFname = arrFname[0];
						for(var i=1;i<arrFname.length;i++){
							if(arrFname[i].split("[")){
								newFname += "['" + arrFname[i].split("[")[0] + "'][" + arrFname[i].split("[")[1];
							}else{
								newFname += "['"+arrFname[i]+"']";
							}
						}

						var fValue2 = newFname.replace(/_dot_/gi,".").replace(/(\$\{)([^\}]*?)(\})/g,function(a,b,c,d){if(a){ return c;}});
					
						var fIsList2 = fValueRange.islist?fValueRange.islist:"";
						formStr+="<td>";
						changeState(fTitle2,fType2,fValueRange2,fDesc2,fWidth2,fName2,fValue2,fIsList2,fClass);
						formStr+="</td>";
					}
					formStr+="</tr>";
					formStr+="<!--$}-->";

					//如果不存在数据对象参数
					formStr+="<!--$}else{-->";
					formStr+="<tr class='list-none'><td colspan='100' style='padding:40px; font-size:16px; color:orange; text-align:center;'>暂无数据<input type='hidden' name='"+fName+"' /></td></tr>"; //递归解析
					formStr+="<!--$}-->";

					//输出空白表单 用于增加一行操作
					formStr+="<tr class='list-tr-hidden' style='display:none;'><td style='width:60px;' class='center'><label><input type='checkbox'/><span class='lbl'></span></label></td>";
					if($.isArray(fValueRange)){  //如果是list列表型
						parserObjDesc(fValueRange[0],fName+"[99]");
						if(islist && !type){
							formStr += btnHtml;
						}
					}else{ //字符型
						var fName2 = fName+"[99]"; 

						//将递归所需的$objName 转换成data['name']['age']的形式获取对应的fValue，防止属性名中有.的情况
						var arrFname = fName2.split(".");
						var newFname = arrFname[0];
						for(var i=1;i<arrFname.length;i++){
							if(arrFname[i].split("[")){
								newFname += "['" + arrFname[i].split("[")[0] + "'][" + arrFname[i].split("[")[1];
							}else{
								newFname += "['"+arrFname[i]+"']";
							}
						}
						var fValue2 = newFname.replace(/_dot_/gi,".").replace(/(\$\{)([^\}]*?)(\})/g,function(a,b,c,d){if(a){ return c;}});
						
						formStr+="<td>";
						changeState(fTitle2,fType2,fValueRange2,fDesc2,fWidth2,fName2,fValue2,fIsList2,fClass);
						formStr+="</td>";
					}
					formStr+="</tr>";
					formStr+="</tbody></table>";

					//增加list action 按钮 
					
					formStr += "<div style='width:220px;' class='hidden-phone visible-desktop btn-group pull-left'>";
					if(type!==2){
						//增加按钮
						formStr += "<button type='button' class='btn btn-mini btn-success btn-add-con' ";
						if(islist && type!==1){	//当为列表视图，并且非批量添加操作视图，隐藏增加按钮
							formStr += "style='display:none;'";
						}
						formStr += ">";
						formStr += "<i class='icon-plus bigger-120'> 增加</i>";
						formStr += "</button>";

						//全选，反选按钮
						formStr += "<button type='button' class='btn btn-mini btn-info btn-sel-all'>";
						formStr += "<i class='icon-ok bigger-120'> 全选</i>";
						formStr += "</button>";
						formStr += "<button type='button' class='btn btn-mini btn-warning btn-sel-oppo'>";
						formStr += "<i class='icon-remove bigger-120'> 反选</i>";
						formStr += "</button>";

						//删除按钮
						if(islist && !type){
							/*2014-01-02 去掉批量删除按钮
							formStr += "<button authority='deleteContent' type='button' class='btn btn-mini btn-danger btn-del btn-del-list'>";
							formStr += "<i class='icon-trash bigger-120'> 批量删除</i>";
							formStr += "</button>";
							*/
						}else{
							formStr += "<button type='button' class='btn btn-mini btn-danger btn-del'>";
							formStr += "<i class='icon-trash bigger-120'> 删除</i>";
							formStr += "</button>";
						}
					}
					formStr += "</div>";
				},
				//对象数据
				Object:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					//文本域显示json字符串
					formStr+="<textarea style='display:none;' class='"+fClass+"_tex' name='"+fName+"' isJson='true'>";
						formStr+="<!--$if(valueStatus){-->";
						formStr+="${"+fValue+"}";
						formStr+="<!--$}-->";
					formStr+="</textarea>";
					
					//增加编辑按钮
					formStr+="<a style='margin-top:5px;' alt='"+fTitle+"' class='btn btn-mini btn-info edit' href='javascript:void(0);'><i class='icon-edit bigger-120'> 点击编辑</i></a>";
				},
				//双语言模型
				Langs:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<textarea readOnly='true' class='"+fClass+"_tex' name='"+fName+"' isJson='true'>";
						formStr+="<!--$if(valueStatus){-->";
						formStr+="${"+fValue+"}";
						formStr+="<!--$}-->";
					formStr+="</textarea>";
					
					//增加编辑按钮
					formStr+="<a style='margin:5px 0 0 10px;' alt='"+fTitle+"' class='btn btn-mini btn-info edit' href='javascript:void(0);'><i class='icon-edit bigger-120'> 点击编辑</i></a>";
				},
				//多图上传
				Pics:function(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
					formStr+="<textarea id='PicsTextArea"+(++PicsNum)+"' style='display:none;' class='"+fClass+"_tex' name='"+fName+"'></textarea>";
					//增加选择按钮
					formStr+="<div style='margin-top:5px;' alt='"+fTitle+"' class='btn btn-mini btn-info' href='javascript:void(0);'>";
					formStr+="<i class='icon-search bigger-120'></i> <span id='spanButtonPlaceholder'></span>";
					formStr+="</div>";
					
					//进度条
					//2014年7月8日 09:49:35 程明剑 修改进度条唯一ID
					formStr+="<div id='divFileProgressContainer' name='ProgressContainer"+PicsNum+"' class='ProgressContainer"+PicsNum+"'></div>";

					//显示图片区域
					//2014年7月8日 09:50:44 程明剑 修改图片显示区域唯一ID
					formStr+="<div id='PicsField' class='PicsClass"+PicsNum+"''>";

					//循环显示图片列表
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${lang:showPicsList("+fValue+")}";
					formStr+="<!--$}-->";
					formStr+="</div>";
				}
			}

			function changeState(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass){
				states[fType]&&states[fType](fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass);
			}

			return {
				changeState : changeState
			}
		}

		//=====表单内容解析函数=====
		//=====共n种类型=====
		//2014年9月11日 11:47:14 程明剑 去除switch方便扩展
		function parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr){ 

			//定义节点class
			var fClass = fName.replace(/_dot_/gi,".").replace(/(\[.*?\])|(data)/g,"").replace(/\./g,"_").toLowerCase();//罗光瑜修改：对象间用_

			//判断是否有值，布尔状态
			formStr+="<!--$var valueStatus = true;-->";
			formStr+="<!--$try{ if(!"+fValue+"){ valueStatus = false;}} catch(e){ valueStatus = false; };-->";
			StateManager().changeState(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList,fExtAttr,fClass);
		}
		//parseField() end
		
		
		//=========================================
		//============== 表单函数功能 ===============
		//=========================================
		
		function formAction(){
			//外联按钮定义
			function bindOuterLink(_dom){
				_dom.find('.outerLinkEdit').on('click',function(){
					//获取参数一：fieldName
					var _fieldName = $(this).siblings(".outerlink").attr("name");
					//获取参数二：fieldValue
					var _fieldValue = $(this).siblings(".outerlink").val();
				    callback && callback( _fieldName, _fieldValue,"OuterLink");
				})
			}
			//OuterLink 操作事件，只支持一层，list字段里面不支持外联
			bindOuterLink(dom);

			//绑定Select类型事件
			function bindSelect(_dom){
				_dom.find('select').on('change',function(){
					//获取参数一：fieldName
					var _fieldName = $(this).attr("name");
					//获取参数二：fieldValue
					var _fieldValue = $(this).val();
				    callback && callback( _fieldName, _fieldValue,"Select");
				})
			}
			bindSelect(dom);

			//绑定blur类型事件
			function bindText(_dom){
				_dom.find('input:enabled[type=text]').on('blur',function(){
					//获取参数一：fieldName
					var _fieldName = $(this).attr("name");
					//获取参数二：fieldValue
					var _fieldValue = $(this).val();
				    callback && callback( _fieldName, _fieldValue,"Text_onblur");
				});
				
				_dom.find('input:enabled[type=text]').on('focus',function(){
					//获取参数一：fieldName
					var _fieldName = $(this).attr("name");
					//获取参数二：fieldValue
					var _fieldValue = $(this).val();
				    callback && callback( _fieldName, _fieldValue,"Text_onfocus");
				})
			}
			bindText(dom);

			//绑定按钮类型事件
			function bindBtn(_dom){
				_dom.find('.FormOperBtn').on('click',function(){
					//获取参数一：fieldName
					var _fieldName = $(this).attr("id");
					//获取参数二：fieldValue
					var _fieldValue = $(this).attr("btnValue");;//btnValue
				    callback && callback( _fieldName, _fieldValue,"btn");
				});
			}
			bindBtn(dom);


			//新增时间类型
			//date-picker
			function bindDateP(domDateP){
				var formatDateP = 'yyyy-MM-dd';
				domDateP.datetimepicker({
					format: formatDateP,
			        pickTime: false
			    })
			    domDateP.find('input').each(function(){
			    	var defaultTimeObj = $(this).val()?new Date(parseInt($(this).val())):new Date();
			    	var curval = API.dateTimeAPI.format(defaultTimeObj, formatDateP);
			    	$(this).val(curval);
			    	$(this).attr("dateFormat",formatDateP);
			    });
		    }
		    //time-picker
		    function bindTimeP(domTimeP){
			    var formatTimeP = 'hh:mm:ss';
			    domTimeP.datetimepicker({
			    	format: formatTimeP,
			        pickDate: false
			    });
			    domTimeP.find('input').each(function(){
			    	var defaultTimeObj = $(this).val()?new Date(parseInt($(this).val())):new Date();
			    	var curval = API.dateTimeAPI.format(defaultTimeObj, formatTimeP);
			    	$(this).val(curval);
			    	$(this).attr("dateFormat",formatTimeP);
			    });
			}
			//date-time-picker
		    function bindDateTimeP(domDateTimeP){
			    var formatDateTimeP = 'yyyy-MM-dd hh:mm:ss';
			    domDateTimeP.datetimepicker({
			    	format: formatDateTimeP
			    });
			    
			    domDateTimeP.find('input').each(function(){
			    	var defaultTimeObj = $(this).val()?new Date(parseInt($(this).val())):new Date();
			    	var curval = API.dateTimeAPI.format(defaultTimeObj, formatDateTimeP);
			    	$(this).val(curval);
			    	$(this).attr("dateFormat",formatDateTimeP);
			    });
			}
			//Alec 20130630
			try{
			    bindDateP(dom.find('.date-picker'));
				bindTimeP(dom.find('.time-picker'));
				bindDateTimeP(dom.find('.date-time-picker'));
			    //date-range-picker
				dom.find('.date-range-picker').daterangepicker();
			}catch(e){
			}

			//如何是列表，则不绑定增加和删除操作，增加按钮不显示，删除按钮事件在app的gadget里面绑定
			//======增加一行操作=======
			dom.find(".btn-add-con").on("click",function(){
				if($(this).parent().prev().find(">tbody>tr.list-none").length){
					$(this).parent().prev().find(">tbody>tr.list-none").remove();
					var idx = 0;
				}else{
					//找到最后一行name[idx]
					var Col = $(this).parent().prev().find(">tbody>tr"); 
					var lastCol = Col.eq(Col.length-2);
					var arr = lastCol.html().match(/(name=["']?)(data.*?)(["']?[\s>])/)[2].split("[");
					var idx = parseInt(arr[arr.length-1].split("]")[0]) + 1;
				}
				//克隆空白行
				var lcwnone = $(this).parent().prev().find(">tbody>tr.list-tr-hidden");
				var cloneCol = lcwnone.clone(true).removeClass("list-tr-hidden");
				cloneCol.insertBefore(lcwnone);
				cloneCol.html(cloneCol.html().replace(/\[99\]/g,"["+idx+"]")).show();
				
				//2014年8月12日 15:31:58 程明剑 临时添加判断省市区ID添加事件
				//定义ID
				var provinces =  "data.borrowerInfo["+idx+"].provinces";
				var city = "data.borrowerInfo["+idx+"].city";
				var area = "data.borrowerInfo["+idx+"].area";
				jsAddress(provinces,city,area,"北京市","北京市","朝阳区");
				
				//添加外联事件
				bindOuterLink(cloneCol);
				try{
				    bindDateP(cloneCol.find('.date-picker'));
					bindTimeP(cloneCol.find('.time-picker'));
					bindDateTimeP(cloneCol.find('.date-time-picker'));
				}catch(e){
				}
			});

			if(!islist || (islist && type==1)){
				//======删除操作=======
				dom.find(".btn-del").on("click",function(){
					$(this).parent().prev().find(">tbody>tr").each(function(){
						var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
						if(cbox.is(':checked')){
							$(this).remove();
						}
					});
					if($(this).parent().prev().find(">tbody>tr").length == 1){
						var _vname = $(this).parent().prev().find(">tbody>tr").find("input[name]:eq(0)").attr("name");
						_vname = _vname.split("[99]")[0];
						$(this).parent().prev().find(">tbody>tr").before("<tr class='list-none'><td colspan='100' style='padding:40px; font-size:16px; color:orange; text-align:center;'>暂无数据<input type='hidden' name='"+_vname+"' /></td></tr>");
					}
				});
			}

			// dom.delegate(".table-list input[type='checkbox']","click",function(){
			// 	if($(this).attr("checked")){
			// 		$(this).attr("checked",false);
			// 	}else{
			// 		$(this).attr("checked",true);
			// 	}
			// })

			//======全选操作=======
			dom.find(".btn-sel-all").on("click",function(){
				$(this).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function(){
					// $(this).find("input[type='checkbox']:eq(0)").attr("checked",true);
					var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
					if(!cbox.is(':checked')){
						cbox.click();
					}
				});
			});
			
			//======反选操作=======
			dom.find(".btn-sel-oppo").on("click",function(){
				$(this).parent().prev().find(">tbody>tr").not(".list-tr-hidden").each(function(){
					var cbox = $(this).find(">td:eq(0) input[type='checkbox']");
					cbox.click();
				});
			});
			
			
			//xheditor编辑器
			try{
				if($('.xheditor').length && !islist){
					var editor=[];
					$('.xheditor').each(function(index){
						editor[index] = $(".xheditor:eq("+index+")").xheditor({urlType:"rel",skin:'nostyle',width:'100%',height:'300px',upLinkUrl:"upload.php",upLinkExt:"zip,rar,txt",upImgUrl:"upload.php",upImgExt:"jpg,jpeg,gif,png",upFlashUrl:"upload.php",upFlashExt:"swf",upMediaUrl:"upload.php",upMediaExt:"avi"});
					})
				}
			}catch(e){
				
			}

			
			

			//给生成的表单绑定 JSON 编辑事件
			dom.find('.c_Object .edit, .c_Langs .edit').on('click',function(){
				
				//数据节点
				var domJosn = $(this).prev();
				
				//获得对话框标题：
				var titDialog = $(this).attr("alt");
				
				// 获取当前json数据描述对象
				var curJSONName = domJosn.attr("name");
				var arrName = curJSONName.split(".");
				for(var i=1; i<arrName.length; i++){
					var reg =new RegExp(/\[.*?\]/);
					if(reg.test(arrName[i])){
						arrName[i] = arrName[i].replace(/\[.*?\]/g,function(a){if(a){return ".valueRange[0]";}});
					}else{
						arrName[i] = arrName[i] + ".valueRange";
					}
				}
				curJSONName = arrName.join(".");
				var data = objdesc;
				var curDescObj = eval(curJSONName);
				
				//获得当前数据data
				try{
					var curJSONFormData = API.JsonAPI.evalJSON(domJosn.val());
				}catch(err){
					var curJSONFormData = "";
				}
				
				//将需要传递到模式对话框json编辑页面的数据转为对象
				// var popenData = {};
				// popenData.descObj = curDescObj; //数据描述对象
				// popenData.formData = curJSONFormData; //真实数据对象
				// popenData.domJosn = domJosn; //数据节点
				// popenData.titDialog = titDialog; //获得对话框标题
				

				//生成新的表单html代码
				var jsonStrHTML = "<div class='modal-header' style='margin-bottom:20px;'><h3>"+titDialog+"</h3></div><form id='jsonEditForm' class='form-horizontal clearfix'></form>";
				bootbox.dialog(jsonStrHTML, [{
						"label" : "<i class='icon-ok bigger-110'></i> 保存",
						"class" : "btn btn-small btn-success",
						"callback": function() {
							var curFormDom = $("#jsonEditForm");
							var curFormData = curFormDom[0].getData();
							// alert(API.JsonAPI.toJSONString(curFormData));
							domJosn.val(API.JsonAPI.toJSONString(curFormData));
						}
					}, {
						"label" : "<i class='icon-undo bigger-110'></i> 取消",
						"class" : "btn btn-small",
						"callback": function() {

						}
					}]
				);

				var curFormDom = $("#jsonEditForm");
				beginCreateFormOrList(false,curDescObj,curFormDom,curJSONFormData);
				curFormDom.css("background","#fff");
				var fWid = curFormDom.find(".form-wrap").outerWidth(), 
					fHei = curFormDom.outerHeight();
				
				curFormDom.parents(".modal:eq(0)").addClass("formJsonModal").animate({
					width:fWid+30,
					height:fHei+181,
					marginLeft:-(fWid+30)/2,
					marginTop:-(fHei+181)/2
				});
			})
			
			//多图批量上传函数绑定
			if(dom.find('.c_Pics').length){
				//2014年7月8日 09:51:23 程明剑 循环显示多个多图上传控件
				for (var i=0;i<dom.find('.c_Pics').length;i++){
					(function(idx){
						swfu = new SWFUpload({
							// Backend Settings
							upload_url: Cfg.swfuploadUrl,
							post_params: {"PHPSESSID": "session_id()"},

							// File Upload Settings
							file_size_limit : "1 MB",	// 2MB
							file_types : "*.jpg; *.gif; *.png",
							file_types_description : "选择 JPEG/GIF/PNG 格式图片",
							file_upload_limit : "0",

							// Event Handler Settings - these functions as defined in Handlers.js
							//  The handlers are not part of SWFUpload but are part of my website and control how
							//  my website reacts to the SWFUpload events.
							file_queue_error_handler : fileQueueError,
							file_dialog_complete_handler : fileDialogComplete,
							upload_progress_handler : uploadProgress,
							upload_error_handler : uploadError,
							// upload_success_handler : uploadSuccess,
							// upload_complete_handler : uploadComplete,

							//上传成功回调函数
					        upload_success_handler : function(file,result){
								 var ImgArr = [];
								 var picUrl = API.JsonAPI.evalJSON(result).succUrl;
								 ImgArr[0] = {picUrl:picUrl, alt:""};
								 var htmlStr = API.lang.showPicsList(ImgArr);
								 dom.find(" .PicsClass"+idx).append(htmlStr);
							},

							upload_complete_handler : function (file){
								dom.find(' .ProgressContainer'+idx).show();
								dom.find(' .ProgressContainer'+idx).css({'width': '0%'});
						 		dom.find('#progressName').html('');
								this.startUpload();
							},

							// Button Settings,
							button_placeholder_id : "spanButtonPlaceholder",
							button_width: 230,
							button_height: 18,
							button_text : '<span class="button">选择本地图片 <span class="buttonSmall">(单图最大为 1 MB，支持多选)</span></span>',
							button_text_style : '.button {color:#ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
							button_text_top_padding: 0,
							button_text_left_padding: 0,
							button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
							button_cursor: SWFUpload.CURSOR.HAND,
							
							// Flash Settings
							flash_url : Cfg.baseUrl+"/breeze/swfupload/swfupload.swf",

							custom_settings : {
								upload_target : "ProgressContainer" + idx
							},
							
							// Debug Settings
							debug: false
						});
						
						//banding删除按钮
						dom.find(" .PicsClass"+idx).delegate(".delpic","click",function(){
							$(this).parent().remove();
						})
					})(i+1)
					
				}
				

			}
			//给list列表页增加搜索框和分页按钮
			if(islist){
				//增加查询框节点,增加分页页码节点
				dom.find(".btn-group:last").after("<div id='searchForList' class='pull-left'></div><div id='pagination' class='pull-right'></div>");
			}

			// 给生成的表单赋予getDate函数
			dom[0].getData=function(){//罗光瑜修改：不要把获取数据方法，绑定到表单提交上
				//让编辑器的内容填充回真实的textarea
				try{
					for(var i=0; i<editor.length;i++){
						editor[i].getSource();
					}
				}catch(e){

				}
				//记录空表单的html并清空;避免提交空值
				var lcwnoneArr = [];
				for(var i=0; i<$(this).find(".list-tr-hidden").length; i++){
					lcwnoneArr[i] =  $(this).find(".list-tr-hidden:eq("+i+")").html();
					$(this).find(".list-tr-hidden:eq("+i+")").empty();
				}

				var data = _api.createJsonByForm($(this),objdesc);

				//处理批量上传图片的字段
				if(dom.find(".c_Pics").length){
					//2014年6月9日 18:12:30 程明剑
					//遍历PicItem，组合图片数组
					for(var j=1;j<=dom.find(".c_Pics").length;j++){
						var PicsArr = [];
						dom.find(".PicsClass"+j+" .PicItem").each(function(){
							var objPicItem = {
								picUrl: $(this).find(".picsThumb img").attr("data-src"),
								alt:    $(this).find("input").val()
							};
							PicsArr.push(objPicItem);
						})
						eval(dom.find("#PicsTextArea"+j).attr("name")+"= PicsArr;");
					}
				}
				
				//将其还原回来
				for(var i=0; i<$(this).find(".list-tr-hidden").length; i++){
					$(this).find(".list-tr-hidden:eq("+i+")").html(lcwnoneArr[i]);
				}
				return data;
			};

			dom[0].getSelectedData=function(){
				var data = this.getData();
				var resultData = [];
				if(islist && type==2){
					$("input[name=rowRadio]").each(function(){
						var idx = parseInt($(this).attr("idx"));						
						if ($(this).attr("checked")){
							resultData.push(data.formList[idx]);
						}						
					});
				}//单选框情况
				else{
					$("input[name=rowCheckbox]").each(function(){
						var idx = parseInt($(this).attr("idx"));						
						if ($(this).attr("checked")){
							resultData.push(data.formList[idx]);
						}	
					});
				}
				return resultData;
			};

			//获得原始单行数据，用于批量添加时，判断单行记录是否填值
			dom[0].getHiddenData = function(){
				 var data = _api.createJsonByForm(dom.find(".table_formlist:eq(0)>tbody>tr.list-tr-hidden"),objdesc);
				 return data.formList;
			}

			//获取数据并校验
			dom[0].checkData = function(){

				var __data = dom[0].getData(); 
				
				//下面开始进行值校验，罗光瑜修改
				function checkValueFun(checkObj,checkDesc){
					for(var name in checkDesc){
						if (!checkDesc.hasOwnProperty(name)){
							continue;
						}
						var checkValue = checkObj[name] || "";
						var descObj = checkDesc[name];

						//过滤不需要校验的对象
						if (descObj.type == "Select" ||descObj.type == "MultSelect"||descObj.type == "hidden"||descObj.type == "CheckBox"||descObj.type == "Radio"||descObj.type == "Json"){
							continue;
						}
						//检查是否需要校验
						if (!descObj.valueRange || (descObj.type == "List" && descObj.valueRange.length==0)){
							continue;
						}
						for (var i=0;i<descObj.valueRange.length;i++){
							if (descObj.type == "List" && i==0){
								for (var j=0;j<checkValue.length;j++){
									if (checkValueFun(checkValue[j],descObj.valueRange[i]) == null){
										return null;
									}
								}
								continue;
							}
							var checkOne = descObj.valueRange[i];

							//2013-11-23罗光瑜修改，这里要重新使用会原来的功能，当然function是一个字符串，同样json也是一个字符串
							//因为标准的json里面如果作为通信传输的话，这两个对象（function和json）是不能被传输的，所以都转成字符串了
							if(checkOne.checkers ){
								if (/function/i.test(typeof(checkOne.checkers)) || /^function/i.test(checkOne.checkers)){									
									var funCheck = checkOne.checkers;
									if (/string/i.test(typeof(funCheck))){
										funCheck.evalJSON(checkOne.checkers);
									}
									//这是一个函数
									if (!funCheck(__data,checkValue)){
										//没有通过
										alert(checkOne.failTips);
										return null;
									}
								}else{
									var cReg = checkOne.checkers;
									if (/string/i.test(typeof(cReg))){
										cReg = new RegExp(checkOne.checkers,"i");
									}
									//2013-12-23日罗光瑜添加，要保证这是一个正则表达式									
									if (cReg.test && !cReg.test(checkValue)){
										alert(checkOne.failTips);
										return null;
									}
								}
							}
						}
					}
					return checkObj;
				}
				return checkValueFun(__data,objdesc);
			}

			// 给生成的列表表单赋予批量修改函数
			if(islist){
				dom[0].batchEdit=function(){
					var checkArr = [];
					var data = dom[0].getData();
					if(!data) return;
					
					var dataArr = data.formList;
					dom.find(".table-list:eq(0)>tbody>tr").each(function(index){
						var status = $(this).find("td:eq(0) input[type='checkbox'], td:eq(0) input[type='radio']").attr("checked");
						if(status == "checked"){
							checkArr.push(dataArr[index]);
						}
					})
					return checkArr;
				}
			}
		}
		//表单函数功能结束
	}
	
	//===============================================
	//====== 逆向处理模板里面的数据，返回json对象 =======
	//===============================================
	 
	/* 
	 * 根据页面表单内容，提交后将form表单内容还原为真实数据json格式
	 * @param dom 指定form的jquery节点包装 器eg:$("#descForm form");
     * @return 返回一个生成好的数据json
	 */
	 
	_api.createJsonByForm = function(dom,objdesc){
		
		var data = {};
		var arr = dom.find(":input");//罗光瑜修改：可以非form里面获取表单     /////////////为什么会  ？？？？？？？
		//2014-01-13罗光瑜修改，checkbox要直接变成json字符串所以如果是checkbox的话要把checkbox的字段记录下来
		var checkboxData = {};
		$.each(arr, function() {
			if (/button|file/i.test(this.type)){//罗光瑜修改：对file和button的过滤
				return;
			}
			if (!this.name || this.name=="rowRadio" || this.name == "rowCheckbox"){
				return;
			}
			var name = this.name;
			var type = this.type;
			var value = this.value || "";
			var isJson = $(this).attr('isJson');
			var dateFormat = $(this).attr('dateFormat');
			var arrName = name.split(".");

			//给对象各层属性定义类型;
			if(name.split(']')[1]==""){
				var len = arrName.length;
			}else{
				var len = arrName.length-1;
			}
			
			for(var i=0; i<len;i++){
				var jsArrName = arrName.slice(0,i+1).join(".");
				var reg = new RegExp(/\[[0-9]+\]/);
				if(reg.test(arrName[i])){
					var sArrName = arrName[i].split(reg);
					var newJsArrName = arrName.slice(0,i).join(".")+"."+sArrName[0];
					eval("if(!"+newJsArrName+"){"+newJsArrName+"=[];}");
				};
				eval("if(!"+jsArrName+"){"+jsArrName+"={};}");
			}

			if(/checkbox|radio/i.test(this.type) && !this.checked){
				eval(name+"="+name+" || \"\";");
				return;
			}
			
			if(dateFormat){   //新增类型的处理 Alec 20130730 Date时间类型
				if(value){
					eval(name+"='"+API.dateTimeAPI.format4(value,dateFormat).getTime()+"';");
				}else{
					eval(name+"=\"\";");
				}
			}else if(/checkbox/i.test(this.type)){   //新增类型的处理 Alec 20130630 checkbox
				eval("if(!"+name+"){ "+name+"=[];}");
				eval(name+".push("+value+");");
				//2014-01-13罗光瑜修改，checkbox要直接变成json字符串
				checkboxData[name] = true;
			}
			else{
				if(value){
					eval(name+"="+API.JsonAPI.toJSONString(value)+";");
				}else{
					eval(name+"=\"\";");
				}
			}
			
		});
		//2014-01-13罗光瑜修改，将复选框转变成json
		for (var cName in checkboxData){
			var orgData = eval("("+cName+")");
			var tmpData = API.JsonAPI.toJSONString(orgData);
			eval (cName + "=tmpData");
		}
		//将生成的data对象中，如果属性名存在_dot_，将其还原成. 
		data = API.JsonAPI.evalJSON(API.JsonAPI.toJSONString(data).replace(/_dot_/gi,"."));
		return data;
	}
	
	//2014年8月12日 15:26:36 程明剑 临时封装address函数
	function jsAddress(_cmbProvince, _cmbCity, _cmbArea, defaultProvince, defaultCity, defaultArea){
		var addressInit = function(_cmbProvince, _cmbCity, _cmbArea, defaultProvince, defaultCity, defaultArea)
		{
			var cmbProvince = document.getElementById(_cmbProvince);
			var cmbCity = document.getElementById(_cmbCity);
			var cmbArea = document.getElementById(_cmbArea);
			
			if(cmbProvince==null||cmbCity==null||cmbArea==null)return;
			
			function cmbSelect(cmb, str)
			{
				for(var i=0; i<cmb.options.length; i++)
				{
					if(cmb.options[i].value == str)
					{
						cmb.selectedIndex = i;
						return;
					}
				}
			}
			function cmbAddOption(cmb, str, obj)
			{
				var option = document.createElement("OPTION");
				cmb.options.add(option);
				option.innerHTML = str;
				option.value = str;
				option.obj = obj;
			}
			
			function changeCity()
			{
				cmbArea.options.length = 0;
				if(cmbCity.selectedIndex == -1)return;
				var item = cmbCity.options[cmbCity.selectedIndex].obj;
				for(var i=0; i<item.areaList.length; i++)
				{
					cmbAddOption(cmbArea, item.areaList[i], null);
				}
				cmbSelect(cmbArea, defaultArea);
			}
			function changeProvince()
			{
				cmbCity.options.length = 0;
				cmbCity.onchange = null;
				if(cmbProvince.selectedIndex == -1)return;
				var item = cmbProvince.options[cmbProvince.selectedIndex].obj;
				for(var i=0; i<item.cityList.length; i++)
				{
					cmbAddOption(cmbCity, item.cityList[i].name, item.cityList[i]);
				}
				cmbSelect(cmbCity, defaultCity);
				changeCity();
				cmbCity.onchange = changeCity;
			}
			
			for(var i=0; i<provinceList.length; i++)
			{
				cmbAddOption(cmbProvince, provinceList[i].name, provinceList[i]);
			}
			cmbSelect(cmbProvince, defaultProvince);
			changeProvince();
			cmbProvince.onchange = changeProvince;
		}

		var provinceList = [
		{name:'北京', cityList:[		   
		{name:'市辖区', areaList:['东城区','西城区','崇文区','宣武区','朝阳区','丰台区','石景山区','海淀区','门头沟区','房山区','通州区','顺义区','昌平区','大兴区','怀柔区','平谷区']},		   
		{name:'县', areaList:['密云县','延庆县']}
		]},
		{name:'上海', cityList:[		   
		{name:'市辖区', areaList:['黄浦区','卢湾区','徐汇区','长宁区','静安区','普陀区','闸北区','虹口区','杨浦区','闵行区','宝山区','嘉定区','浦东新区','金山区','松江区','青浦区','南汇区','奉贤区']},		   
		{name:'县', areaList:['崇明县']}
		]},
		{name:'天津', cityList:[		   
		{name:'市辖区', areaList:['和平区','河东区','河西区','南开区','河北区','红桥区','塘沽区','汉沽区','大港区','东丽区','西青区','津南区','北辰区','武清区','宝坻区']},		   
		{name:'县', areaList:['宁河县','静海县','蓟　县']}
		]},
		{name:'重庆', cityList:[		   
		{name:'市辖区', areaList:['万州区','涪陵区','渝中区','大渡口区','江北区','沙坪坝区','九龙坡区','南岸区','北碚区','万盛区','双桥区','渝北区','巴南区','黔江区','长寿区']},		   
		{name:'县', areaList:['綦江县','潼南县','铜梁县','大足县','荣昌县','璧山县','梁平县','城口县','丰都县','垫江县','武隆县','忠　县','开　县','云阳县','奉节县','巫山县','巫溪县','石柱土家族自治县','秀山土家族苗族自治县','酉阳土家族苗族自治县','彭水苗族土家族自治县']},		   
		{name:'市', areaList:['江津市','合川市','永川市','南川市']}
		]},
		{name:'四川', cityList:[		   
		{name:'成都市', areaList:['市辖区','锦江区','青羊区','金牛区','武侯区','成华区','龙泉驿区','青白江区','新都区','温江县','金堂县','双流县','郫　县','大邑县','蒲江县','新津县','都江堰市','彭州市','邛崃市','崇州市']},		   
		{name:'自贡市', areaList:['市辖区','自流井区','贡井区','大安区','沿滩区','荣　县','富顺县']},		   
		{name:'攀枝花市', areaList:['市辖区','东　区','西　区','仁和区','米易县','盐边县']},		   
		{name:'泸州市', areaList:['市辖区','江阳区','纳溪区','龙马潭区','泸　县','合江县','叙永县','古蔺县']},		   
		{name:'德阳市', areaList:['市辖区','旌阳区','中江县','罗江县','广汉市','什邡市','绵竹市']},		   
		{name:'绵阳市', areaList:['市辖区','涪城区','游仙区','三台县','盐亭县','安　县','梓潼县','北川羌族自治县','平武县','江油市']},		   
		{name:'广元市', areaList:['市辖区','市中区','元坝区','朝天区','旺苍县','青川县','剑阁县','苍溪县']},		   
		{name:'遂宁市', areaList:['市辖区','船山区','安居区','蓬溪县','射洪县','大英县']},		   
		{name:'内江市', areaList:['市辖区','市中区','东兴区','威远县','资中县','隆昌县']},		   
		{name:'乐山市', areaList:['市辖区','市中区','沙湾区','五通桥区','金口河区','犍为县','井研县','夹江县','沐川县','峨边彝族自治县','马边彝族自治县','峨眉山市']},		   
		{name:'南充市', areaList:['市辖区','顺庆区','高坪区','嘉陵区','南部县','营山县','蓬安县','仪陇县','西充县','阆中市']},		   
		{name:'眉山市', areaList:['市辖区','东坡区','仁寿县','彭山县','洪雅县','丹棱县','青神县']},		   
		{name:'宜宾市', areaList:['市辖区','翠屏区','宜宾县','南溪县','江安县','长宁县','高　县','珙　县','筠连县','兴文县','屏山县']},		   
		{name:'广安市', areaList:['市辖区','广安区','岳池县','武胜县','邻水县','华莹市']},		   
		{name:'达州市', areaList:['市辖区','通川区','达　县','宣汉县','开江县','大竹县','渠　县','万源市']},		   
		{name:'雅安市', areaList:['市辖区','雨城区','名山县','荥经县','汉源县','石棉县','天全县','芦山县','宝兴县']},		   
		{name:'巴中市', areaList:['市辖区','巴州区','通江县','南江县','平昌县']},		   
		{name:'资阳市', areaList:['市辖区','雁江区','安岳县','乐至县','简阳市']},		   
		{name:'阿坝藏族羌族自治州', areaList:['汶川县','理　县','茂　县','松潘县','九寨沟县','金川县','小金县','黑水县','马尔康县','壤塘县','阿坝县','若尔盖县','红原县']},		   
		{name:'甘孜藏族自治州', areaList:['康定县','泸定县','丹巴县','九龙县','雅江县','道孚县','炉霍县','甘孜县','新龙县','德格县','白玉县','石渠县','色达县','理塘县','巴塘县','乡城县','稻城县','得荣县']},		   
		{name:'凉山彝族自治州', areaList:['西昌市','木里藏族自治县','盐源县','德昌县','会理县','会东县','宁南县','普格县','布拖县','金阳县','昭觉县','喜德县','冕宁县','越西县','甘洛县','美姑县','雷波县']}
		]},
		{name:'贵州', cityList:[		   
		{name:'贵阳市', areaList:['市辖区','南明区','云岩区','花溪区','乌当区','白云区','小河区','开阳县','息烽县','修文县','清镇市']},		   
		{name:'六盘水市', areaList:['钟山区','六枝特区','水城县','盘　县']},		   
		{name:'遵义市', areaList:['市辖区','红花岗区','汇川区','遵义县','桐梓县','绥阳县','正安县','道真仡佬族苗族自治县','务川仡佬族苗族自治县','凤冈县','湄潭县','余庆县','习水县','赤水市','仁怀市']},		   
		{name:'安顺市', areaList:['市辖区','西秀区','平坝县','普定县','镇宁布依族苗族自治县','关岭布依族苗族自治县','紫云苗族布依族自治县']},		   
		{name:'铜仁地区', areaList:['铜仁市','江口县','玉屏侗族自治县','石阡县','思南县','印江土家族苗族自治县','德江县','沿河土家族自治县','松桃苗族自治县','万山特区']},		   
		{name:'黔西南布依族苗族自治州', areaList:['兴义市','兴仁县','普安县','晴隆县','贞丰县','望谟县','册亨县','安龙县']},		   
		{name:'毕节地区', areaList:['毕节市','大方县','黔西县','金沙县','织金县','纳雍县','威宁彝族回族苗族自治县','赫章县']},		   
		{name:'黔东南苗族侗族自治州', areaList:['凯里市','黄平县','施秉县','三穗县','镇远县','岑巩县','天柱县','锦屏县','剑河县','台江县','黎平县','榕江县','从江县','雷山县','麻江县','丹寨县']},		   
		{name:'黔南布依族苗族自治州', areaList:['都匀市','福泉市','荔波县','贵定县','瓮安县','独山县','平塘县','罗甸县','长顺县','龙里县','惠水县','三都水族自治县']}
		]},
		{name:'云南', cityList:[		   
		{name:'昆明市', areaList:['市辖区','五华区','盘龙区','官渡区','西山区','东川区','呈贡县','晋宁县','富民县','宜良县','石林彝族自治县','嵩明县','禄劝彝族苗族自治县','寻甸回族彝族自治县','安宁市']},		   
		{name:'曲靖市', areaList:['市辖区','麒麟区','马龙县','陆良县','师宗县','罗平县','富源县','会泽县','沾益县','宣威市']},		   
		{name:'玉溪市', areaList:['市辖区','红塔区','江川县','澄江县','通海县','华宁县','易门县','峨山彝族自治县','新平彝族傣族自治县','元江哈尼族彝族傣族自治县']},		   
		{name:'保山市', areaList:['市辖区','隆阳区','施甸县','腾冲县','龙陵县','昌宁县']},		   
		{name:'昭通市', areaList:['市辖区','昭阳区','鲁甸县','巧家县','盐津县','大关县','永善县','绥江县','镇雄县','彝良县','威信县','水富县']},		   
		{name:'丽江市', areaList:['市辖区','古城区','玉龙纳西族自治县','永胜县','华坪县','宁蒗彝族自治县']},		   
		{name:'思茅市', areaList:['市辖区','翠云区','普洱哈尼族彝族自治县','墨江哈尼族自治县','景东彝族自治县','景谷傣族彝族自治县','镇沅彝族哈尼族拉祜族自治县','江城哈尼族彝族自治县','孟连傣族拉祜族佤族自治县','澜沧拉祜族自治县','西盟佤族自治县']},		   
		{name:'临沧市', areaList:['市辖区','临翔区','凤庆县','云　县','永德县','镇康县','双江拉祜族佤族布朗族傣族自治县','耿马傣族佤族自治县','沧源佤族自治县']},		   
		{name:'楚雄彝族自治州', areaList:['楚雄市','双柏县','牟定县','南华县','姚安县','大姚县','永仁县','元谋县','武定县','禄丰县']},		   
		{name:'红河哈尼族彝族自治州', areaList:['个旧市','开远市','蒙自县','屏边苗族自治县','建水县','石屏县','弥勒县','泸西县','元阳县','红河县','金平苗族瑶族傣族自治县','绿春县','河口瑶族自治县']},		   
		{name:'文山壮族苗族自治州', areaList:['文山县','砚山县','西畴县','麻栗坡县','马关县','丘北县','广南县','富宁县']},		   
		{name:'西双版纳傣族自治州', areaList:['景洪市','勐海县','勐腊县']},		   
		{name:'大理白族自治州', areaList:['大理市','漾濞彝族自治县','祥云县','宾川县','弥渡县','南涧彝族自治县','巍山彝族回族自治县','永平县','云龙县','洱源县','剑川县','鹤庆县']},		   
		{name:'德宏傣族景颇族自治州', areaList:['瑞丽市','潞西市','梁河县','盈江县','陇川县']},		   
		{name:'怒江傈僳族自治州', areaList:['泸水县','福贡县','贡山独龙族怒族自治县','兰坪白族普米族自治县']},		   
		{name:'迪庆藏族自治州', areaList:['香格里拉县','德钦县','维西傈僳族自治县']}
		]},
		{name:'西藏', cityList:[		   
		{name:'拉萨市', areaList:['市辖区','城关区','林周县','当雄县','尼木县','曲水县','堆龙德庆县','达孜县','墨竹工卡县']},		   
		{name:'昌都地区', areaList:['昌都县','江达县','贡觉县','类乌齐县','丁青县','察雅县','八宿县','左贡县','芒康县','洛隆县','边坝县']},		   
		{name:'山南地区', areaList:['乃东县','扎囊县','贡嘎县','桑日县','琼结县','曲松县','措美县','洛扎县','加查县','隆子县','错那县','浪卡子县']},		   
		{name:'日喀则地区', areaList:['日喀则市','南木林县','江孜县','定日县','萨迦县','拉孜县','昂仁县','谢通门县','白朗县','仁布县','康马县','定结县','仲巴县','亚东县','吉隆县','聂拉木县','萨嘎县','岗巴县']},		   
		{name:'那曲地区', areaList:['那曲县','嘉黎县','比如县','聂荣县','安多县','申扎县','索　县','班戈县','巴青县','尼玛县']},		   
		{name:'阿里地区', areaList:['普兰县','札达县','噶尔县','日土县','革吉县','改则县','措勤县']},		   
		{name:'林芝地区', areaList:['林芝县','工布江达县','米林县','墨脱县','波密县','察隅县','朗　县']}
		]},
		{name:'河南', cityList:[		   
		{name:'郑州市', areaList:['市辖区','中原区','二七区','管城回族区','金水区','上街区','邙山区','中牟县','巩义市','荥阳市','新密市','新郑市','登封市']},		   
		{name:'开封市', areaList:['市辖区','龙亭区','顺河回族区','鼓楼区','南关区','郊　区','杞　县','通许县','尉氏县','开封县','兰考县']},		   
		{name:'洛阳市', areaList:['市辖区','老城区','西工区','廛河回族区','涧西区','吉利区','洛龙区','孟津县','新安县','栾川县','嵩　县','汝阳县','宜阳县','洛宁县','伊川县','偃师市']},		   
		{name:'平顶山市', areaList:['市辖区','新华区','卫东区','石龙区','湛河区','宝丰县','叶　县','鲁山县','郏　县','舞钢市','汝州市']},		   
		{name:'安阳市', areaList:['市辖区','文峰区','北关区','殷都区','龙安区','安阳县','汤阴县','滑　县','内黄县','林州市']},		   
		{name:'鹤壁市', areaList:['市辖区','鹤山区','山城区','淇滨区','浚　县','淇　县']},		   
		{name:'新乡市', areaList:['市辖区','红旗区','卫滨区','凤泉区','牧野区','新乡县','获嘉县','原阳县','延津县','封丘县','长垣县','卫辉市','辉县市']},		   
		{name:'焦作市', areaList:['市辖区','解放区','中站区','马村区','山阳区','修武县','博爱县','武陟县','温　县','济源市','沁阳市','孟州市']},		   
		{name:'濮阳市', areaList:['市辖区','华龙区','清丰县','南乐县','范　县','台前县','濮阳县']},		   
		{name:'许昌市', areaList:['市辖区','魏都区','许昌县','鄢陵县','襄城县','禹州市','长葛市']},		   
		{name:'漯河市', areaList:['市辖区','源汇区','郾城区','召陵区','舞阳县','临颍县']},		   
		{name:'三门峡市', areaList:['市辖区','湖滨区','渑池县','陕　县','卢氏县','义马市','灵宝市']},		   
		{name:'南阳市', areaList:['市辖区','宛城区','卧龙区','南召县','方城县','西峡县','镇平县','内乡县','淅川县','社旗县','唐河县','新野县','桐柏县','邓州市']},		   
		{name:'商丘市', areaList:['市辖区','梁园区','睢阳区','民权县','睢　县','宁陵县','柘城县','虞城县','夏邑县','永城市']},		   
		{name:'信阳市', areaList:['市辖区','师河区','平桥区','罗山县','光山县','新　县','商城县','固始县','潢川县','淮滨县','息　县']},		   
		{name:'周口市', areaList:['市辖区','川汇区','扶沟县','西华县','商水县','沈丘县','郸城县','淮阳县','太康县','鹿邑县','项城市']},		   
		{name:'驻马店市', areaList:['市辖区','驿城区','西平县','上蔡县','平舆县','正阳县','确山县','泌阳县','汝南县','遂平县','新蔡县']}
		]},
		{name:'湖北', cityList:[		   
		{name:'武汉市', areaList:['市辖区','江岸区','江汉区','乔口区','汉阳区','武昌区','青山区','洪山区','东西湖区','汉南区','蔡甸区','江夏区','黄陂区','新洲区']},		   
		{name:'黄石市', areaList:['市辖区','黄石港区','西塞山区','下陆区','铁山区','阳新县','大冶市']},		   
		{name:'十堰市', areaList:['市辖区','茅箭区','张湾区','郧　县','郧西县','竹山县','竹溪县','房　县','丹江口市']},		   
		{name:'宜昌市', areaList:['市辖区','西陵区','伍家岗区','点军区','猇亭区','夷陵区','远安县','兴山县','秭归县','长阳土家族自治县','五峰土家族自治县','宜都市','当阳市','枝江市']},		   
		{name:'襄樊市', areaList:['市辖区','襄城区','樊城区','襄阳区','南漳县','谷城县','保康县','老河口市','枣阳市','宜城市']},		   
		{name:'鄂州市', areaList:['市辖区','梁子湖区','华容区','鄂城区']},		   
		{name:'荆门市', areaList:['市辖区','东宝区','掇刀区','京山县','沙洋县','钟祥市']},		   
		{name:'孝感市', areaList:['市辖区','孝南区','孝昌县','大悟县','云梦县','应城市','安陆市','汉川市']},		   
		{name:'荆州市', areaList:['市辖区','沙市区','荆州区','公安县','监利县','江陵县','石首市','洪湖市','松滋市']},		   
		{name:'黄冈市', areaList:['市辖区','黄州区','团风县','红安县','罗田县','英山县','浠水县','蕲春县','黄梅县','麻城市','武穴市']},		   
		{name:'咸宁市', areaList:['市辖区','咸安区','嘉鱼县','通城县','崇阳县','通山县','赤壁市']},		   
		{name:'随州市', areaList:['市辖区','曾都区','广水市']},		   
		{name:'恩施土家族苗族自治州', areaList:['恩施市','利川市','建始县','巴东县','宣恩县','咸丰县','来凤县','鹤峰县']},		   
		{name:'省直辖行政单位', areaList:['仙桃市','潜江市','天门市','神农架林区']}
		]},
		{name:'湖南', cityList:[		   
		{name:'长沙市', areaList:['市辖区','芙蓉区','天心区','岳麓区','开福区','雨花区','长沙县','望城县','宁乡县','浏阳市']},		   
		{name:'株洲市', areaList:['市辖区','荷塘区','芦淞区','石峰区','天元区','株洲县','攸　县','茶陵县','炎陵县','醴陵市']},		   
		{name:'湘潭市', areaList:['市辖区','雨湖区','岳塘区','湘潭县','湘乡市','韶山市']},		   
		{name:'衡阳市', areaList:['市辖区','珠晖区','雁峰区','石鼓区','蒸湘区','南岳区','衡阳县','衡南县','衡山县','衡东县','祁东县','耒阳市','常宁市']},		   
		{name:'邵阳市', areaList:['市辖区','双清区','大祥区','北塔区','邵东县','新邵县','邵阳县','隆回县','洞口县','绥宁县','新宁县','城步苗族自治县','武冈市']},		   
		{name:'岳阳市', areaList:['市辖区','岳阳楼区','云溪区','君山区','岳阳县','华容县','湘阴县','平江县','汨罗市','临湘市']},		   
		{name:'常德市', areaList:['市辖区','武陵区','鼎城区','安乡县','汉寿县','澧　县','临澧县','桃源县','石门县','津市市']},		   
		{name:'张家界市', areaList:['市辖区','永定区','武陵源区','慈利县','桑植县']},		   
		{name:'益阳市', areaList:['市辖区','资阳区','赫山区','南　县','桃江县','安化县','沅江市']},		   
		{name:'郴州市', areaList:['市辖区','北湖区','苏仙区','桂阳县','宜章县','永兴县','嘉禾县','临武县','汝城县','桂东县','安仁县','资兴市']},		   
		{name:'永州市', areaList:['市辖区','芝山区','冷水滩区','祁阳县','东安县','双牌县','道　县','江永县','宁远县','蓝山县','新田县','江华瑶族自治县']},		   
		{name:'怀化市', areaList:['市辖区','鹤城区','中方县','沅陵县','辰溪县','溆浦县','会同县','麻阳苗族自治县','新晃侗族自治县','芷江侗族自治县','靖州苗族侗族自治县','通道侗族自治县','洪江市']},		   
		{name:'娄底市', areaList:['市辖区','娄星区','双峰县','新化县','冷水江市','涟源市']},		   
		{name:'湘西土家族苗族自治州', areaList:['吉首市','泸溪县','凤凰县','花垣县','保靖县','古丈县','永顺县','龙山县']}
		]},
		{name:'广东', cityList:[		   
		{name:'广州市', areaList:['市辖区','东山区','荔湾区','越秀区','海珠区','天河区','芳村区','白云区','黄埔区','番禺区','花都区','增城市','从化市']},		   
		{name:'韶关市', areaList:['市辖区','武江区','浈江区','曲江区','始兴县','仁化县','翁源县','乳源瑶族自治县','新丰县','乐昌市','南雄市']},		   
		{name:'深圳市', areaList:['市辖区','罗湖区','福田区','南山区','宝安区','龙岗区','盐田区']},		   
		{name:'珠海市', areaList:['市辖区','香洲区','斗门区','金湾区']},		   
		{name:'汕头市', areaList:['市辖区','龙湖区','金平区','濠江区','潮阳区','潮南区','澄海区','南澳县']},		   
		{name:'佛山市', areaList:['市辖区','禅城区','南海区','顺德区','三水区','高明区']},		   
		{name:'江门市', areaList:['市辖区','蓬江区','江海区','新会区','台山市','开平市','鹤山市','恩平市']},		   
		{name:'湛江市', areaList:['市辖区','赤坎区','霞山区','坡头区','麻章区','遂溪县','徐闻县','廉江市','雷州市','吴川市']},		   
		{name:'茂名市', areaList:['市辖区','茂南区','茂港区','电白县','高州市','化州市','信宜市']},		   
		{name:'肇庆市', areaList:['市辖区','端州区','鼎湖区','广宁县','怀集县','封开县','德庆县','高要市','四会市']},		   
		{name:'惠州市', areaList:['市辖区','惠城区','惠阳区','博罗县','惠东县','龙门县']},		   
		{name:'梅州市', areaList:['市辖区','梅江区','梅　县','大埔县','丰顺县','五华县','平远县','蕉岭县','兴宁市']},		   
		{name:'汕尾市', areaList:['市辖区','城　区','海丰县','陆河县','陆丰市']},		   
		{name:'河源市', areaList:['市辖区','源城区','紫金县','龙川县','连平县','和平县','东源县']},		   
		{name:'阳江市', areaList:['市辖区','江城区','阳西县','阳东县','阳春市']},		   
		{name:'清远市', areaList:['市辖区','清城区','佛冈县','阳山县','连山壮族瑶族自治县','连南瑶族自治县','清新县','英德市','连州市']},		   
		{name:'东莞市', areaList:['东莞市']},		   
		{name:'中山市', areaList:['中山市']},		   
		{name:'潮州市', areaList:['市辖区','湘桥区','潮安县','饶平县']},		   
		{name:'揭阳市', areaList:['市辖区','榕城区','揭东县','揭西县','惠来县','普宁市']},		   
		{name:'云浮市', areaList:['市辖区','云城区','新兴县','郁南县','云安县','罗定市']}
		]},
		{name:'广西', cityList:[		   
		{name:'南宁市', areaList:['市辖区','兴宁区','青秀区','江南区','西乡塘区','良庆区','邕宁区','武鸣县','隆安县','马山县','上林县','宾阳县','横　县']},		   
		{name:'柳州市', areaList:['市辖区','城中区','鱼峰区','柳南区','柳北区','柳江县','柳城县','鹿寨县','融安县','融水苗族自治县','三江侗族自治县']},		   
		{name:'桂林市', areaList:['市辖区','秀峰区','叠彩区','象山区','七星区','雁山区','阳朔县','临桂县','灵川县','全州县','兴安县','永福县','灌阳县','龙胜各族自治县','资源县','平乐县','荔蒲县','恭城瑶族自治县']},		   
		{name:'梧州市', areaList:['市辖区','万秀区','蝶山区','长洲区','苍梧县','藤　县','蒙山县','岑溪市']},		   
		{name:'北海市', areaList:['市辖区','海城区','银海区','铁山港区','合浦县']},		   
		{name:'防城港市', areaList:['市辖区','港口区','防城区','上思县','东兴市']},		   
		{name:'钦州市', areaList:['市辖区','钦南区','钦北区','灵山县','浦北县']},		   
		{name:'贵港市', areaList:['市辖区','港北区','港南区','覃塘区','平南县','桂平市']},		   
		{name:'玉林市', areaList:['市辖区','玉州区','容　县','陆川县','博白县','兴业县','北流市']},		   
		{name:'百色市', areaList:['市辖区','右江区','田阳县','田东县','平果县','德保县','靖西县','那坡县','凌云县','乐业县','田林县','西林县','隆林各族自治县']},		   
		{name:'贺州市', areaList:['市辖区','八步区','昭平县','钟山县','富川瑶族自治县']},		   
		{name:'河池市', areaList:['市辖区','金城江区','南丹县','天峨县','凤山县','东兰县','罗城仫佬族自治县','环江毛南族自治县','巴马瑶族自治县','都安瑶族自治县','大化瑶族自治县','宜州市']},		   
		{name:'来宾市', areaList:['市辖区','兴宾区','忻城县','象州县','武宣县','金秀瑶族自治县','合山市']},		   
		{name:'崇左市', areaList:['市辖区','江洲区','扶绥县','宁明县','龙州县','大新县','天等县','凭祥市']}
		]},
		{name:'陕西', cityList:[		   
		{name:'西安市', areaList:['市辖区','新城区','碑林区','莲湖区','灞桥区','未央区','雁塔区','阎良区','临潼区','长安区','蓝田县','周至县','户　县','高陵县']},		   
		{name:'铜川市', areaList:['市辖区','王益区','印台区','耀州区','宜君县']},		   
		{name:'宝鸡市', areaList:['市辖区','渭滨区','金台区','陈仓区','凤翔县','岐山县','扶风县','眉　县','陇　县','千阳县','麟游县','凤　县','太白县']},		   
		{name:'咸阳市', areaList:['市辖区','秦都区','杨凌区','渭城区','三原县','泾阳县','乾　县','礼泉县','永寿县','彬　县','长武县','旬邑县','淳化县','武功县','兴平市']},		   
		{name:'渭南市', areaList:['市辖区','临渭区','华　县','潼关县','大荔县','合阳县','澄城县','蒲城县','白水县','富平县','韩城市','华阴市']},		   
		{name:'延安市', areaList:['市辖区','宝塔区','延长县','延川县','子长县','安塞县','志丹县','吴旗县','甘泉县','富　县','洛川县','宜川县','黄龙县','黄陵县']},		   
		{name:'汉中市', areaList:['市辖区','汉台区','南郑县','城固县','洋　县','西乡县','勉　县','宁强县','略阳县','镇巴县','留坝县','佛坪县']},		   
		{name:'榆林市', areaList:['市辖区','榆阳区','神木县','府谷县','横山县','靖边县','定边县','绥德县','米脂县','佳　县','吴堡县','清涧县','子洲县']},		   
		{name:'安康市', areaList:['市辖区','汉滨区','汉阴县','石泉县','宁陕县','紫阳县','岚皋县','平利县','镇坪县','旬阳县','白河县']},		   
		{name:'商洛市', areaList:['市辖区','商州区','洛南县','丹凤县','商南县','山阳县','镇安县','柞水县']}
		]},
		{name:'甘肃', cityList:[		   
		{name:'兰州市', areaList:['市辖区','城关区','七里河区','西固区','安宁区','红古区','永登县','皋兰县','榆中县']},		   
		{name:'嘉峪关市', areaList:['市辖区']},		   
		{name:'金昌市', areaList:['市辖区','金川区','永昌县']},		   
		{name:'白银市', areaList:['市辖区','白银区','平川区','靖远县','会宁县','景泰县']},		   
		{name:'天水市', areaList:['市辖区','秦城区','北道区','清水县','秦安县','甘谷县','武山县','张家川回族自治县']},		   
		{name:'武威市', areaList:['市辖区','凉州区','民勤县','古浪县','天祝藏族自治县']},		   
		{name:'张掖市', areaList:['市辖区','甘州区','肃南裕固族自治县','民乐县','临泽县','高台县','山丹县']},		   
		{name:'平凉市', areaList:['市辖区','崆峒区','泾川县','灵台县','崇信县','华亭县','庄浪县','静宁县']},		   
		{name:'酒泉市', areaList:['市辖区','肃州区','金塔县','安西县','肃北蒙古族自治县','阿克塞哈萨克族自治县','玉门市','敦煌市']},		   
		{name:'庆阳市', areaList:['市辖区','西峰区','庆城县','环　县','华池县','合水县','正宁县','宁　县','镇原县']},		   
		{name:'定西市', areaList:['市辖区','安定区','通渭县','陇西县','渭源县','临洮县','漳　县','岷　县']},		   
		{name:'陇南市', areaList:['市辖区','武都区','成　县','文　县','宕昌县','康　县','西和县','礼　县','徽　县','两当县']},		   
		{name:'临夏回族自治州', areaList:['临夏市','临夏县','康乐县','永靖县','广河县','和政县','东乡族自治县','积石山保安族东乡族撒拉族自治县']},		   
		{name:'甘南藏族自治州', areaList:['合作市','临潭县','卓尼县','舟曲县','迭部县','玛曲县','碌曲县','夏河县']}
		]},
		{name:'青海', cityList:[		   
		{name:'西宁市', areaList:['市辖区','城东区','城中区','城西区','城北区','大通回族土族自治县','湟中县','湟源县']},		   
		{name:'海东地区', areaList:['平安县','民和回族土族自治县','乐都县','互助土族自治县','化隆回族自治县','循化撒拉族自治县']},		   
		{name:'海北藏族自治州', areaList:['门源回族自治县','祁连县','海晏县','刚察县']},		   
		{name:'黄南藏族自治州', areaList:['同仁县','尖扎县','泽库县','河南蒙古族自治县']},		   
		{name:'海南藏族自治州', areaList:['共和县','同德县','贵德县','兴海县','贵南县']},		   
		{name:'果洛藏族自治州', areaList:['玛沁县','班玛县','甘德县','达日县','久治县','玛多县']},		   
		{name:'玉树藏族自治州', areaList:['玉树县','杂多县','称多县','治多县','囊谦县','曲麻莱县']},		   
		{name:'海西蒙古族藏族自治州', areaList:['格尔木市','德令哈市','乌兰县','都兰县','天峻县']}
		]},
		{name:'宁夏', cityList:[		   
		{name:'银川市', areaList:['市辖区','兴庆区','西夏区','金凤区','永宁县','贺兰县','灵武市']},		   
		{name:'石嘴山市', areaList:['市辖区','大武口区','惠农区','平罗县']},		   
		{name:'吴忠市', areaList:['市辖区','利通区','盐池县','同心县','青铜峡市']},		   
		{name:'固原市', areaList:['市辖区','原州区','西吉县','隆德县','泾源县','彭阳县','海原县']},		   
		{name:'中卫市', areaList:['市辖区','沙坡头区','中宁县']}
		]},
		{name:'新疆', cityList:[		   
		{name:'乌鲁木齐市', areaList:['市辖区','天山区','沙依巴克区','新市区','水磨沟区','头屯河区','达坂城区','东山区','乌鲁木齐县']},		   
		{name:'克拉玛依市', areaList:['市辖区','独山子区','克拉玛依区','白碱滩区','乌尔禾区']},		   
		{name:'吐鲁番地区', areaList:['吐鲁番市','鄯善县','托克逊县']},		   
		{name:'哈密地区', areaList:['哈密市','巴里坤哈萨克自治县','伊吾县']},		   
		{name:'昌吉回族自治州', areaList:['昌吉市','阜康市','米泉市','呼图壁县','玛纳斯县','奇台县','吉木萨尔县','木垒哈萨克自治县']},		   
		{name:'博尔塔拉蒙古自治州', areaList:['博乐市','精河县','温泉县']},		   
		{name:'巴音郭楞蒙古自治州', areaList:['库尔勒市','轮台县','尉犁县','若羌县','且末县','焉耆回族自治县','和静县','和硕县','博湖县']},		   
		{name:'阿克苏地区', areaList:['阿克苏市','温宿县','库车县','沙雅县','新和县','拜城县','乌什县','阿瓦提县','柯坪县']},		   
		{name:'克孜勒苏柯尔克孜自治州', areaList:['阿图什市','阿克陶县','阿合奇县','乌恰县']},		   
		{name:'喀什地区', areaList:['喀什市','疏附县','疏勒县','英吉沙县','泽普县','莎车县','叶城县','麦盖提县','岳普湖县','伽师县','巴楚县','塔什库尔干塔吉克自治县']},		   
		{name:'和田地区', areaList:['和田市','和田县','墨玉县','皮山县','洛浦县','策勒县','于田县','民丰县']},		   
		{name:'伊犁哈萨克自治州', areaList:['伊宁市','奎屯市','伊宁县','察布查尔锡伯自治县','霍城县','巩留县','新源县','昭苏县','特克斯县','尼勒克县']},		   
		{name:'塔城地区', areaList:['塔城市','乌苏市','额敏县','沙湾县','托里县','裕民县','和布克赛尔蒙古自治县']},		   
		{name:'阿勒泰地区', areaList:['阿勒泰市','布尔津县','富蕴县','福海县','哈巴河县','青河县','吉木乃县']},		   
		{name:'省直辖行政单位', areaList:['石河子市','阿拉尔市','图木舒克市','五家渠市']}
		]},
		{name:'河北', cityList:[		   
		{name:'石家庄市', areaList:['市辖区','长安区','桥东区','桥西区','新华区','井陉矿区','裕华区','井陉县','正定县','栾城县','行唐县','灵寿县','高邑县','深泽县','赞皇县','无极县','平山县','元氏县','赵　县','辛集市','藁城市','晋州市','新乐市','鹿泉市']},		   
		{name:'唐山市', areaList:['市辖区','路南区','路北区','古冶区','开平区','丰南区','丰润区','滦　县','滦南县','乐亭县','迁西县','玉田县','唐海县','遵化市','迁安市']},		   
		{name:'秦皇岛市', areaList:['市辖区','海港区','山海关区','北戴河区','青龙满族自治县','昌黎县','抚宁县','卢龙县']},		   
		{name:'邯郸市', areaList:['市辖区','邯山区','丛台区','复兴区','峰峰矿区','邯郸县','临漳县','成安县','大名县','涉　县','磁　县','肥乡县','永年县','邱　县','鸡泽县','广平县','馆陶县','魏　县','曲周县','武安市']},		   
		{name:'邢台市', areaList:['市辖区','桥东区','桥西区','邢台县','临城县','内丘县','柏乡县','隆尧县','任　县','南和县','宁晋县','巨鹿县','新河县','广宗县','平乡县','威　县','清河县','临西县','南宫市','沙河市']},		   
		{name:'保定市', areaList:['市辖区','新市区','北市区','南市区','满城县','清苑县','涞水县','阜平县','徐水县','定兴县','唐　县','高阳县','容城县','涞源县','望都县','安新县','易　县','曲阳县','蠡　县','顺平县','博野县','雄　县','涿州市','定州市','安国市','高碑店市']},		   
		{name:'张家口市', areaList:['市辖区','桥东区','桥西区','宣化区','下花园区','宣化县','张北县','康保县','沽源县','尚义县','蔚　县','阳原县','怀安县','万全县','怀来县','涿鹿县','赤城县','崇礼县']},		   
		{name:'承德市', areaList:['市辖区','双桥区','双滦区','鹰手营子矿区','承德县','兴隆县','平泉县','滦平县','隆化县','丰宁满族自治县','宽城满族自治县','围场满族蒙古族自治县']},		   
		{name:'沧州市', areaList:['市辖区','新华区','运河区','沧　县','青　县','东光县','海兴县','盐山县','肃宁县','南皮县','吴桥县','献　县','孟村回族自治县','泊头市','任丘市','黄骅市','河间市']},		   
		{name:'廊坊市', areaList:['市辖区','安次区','广阳区','固安县','永清县','香河县','大城县','文安县','大厂回族自治县','霸州市','三河市']},		   
		{name:'衡水市', areaList:['市辖区','桃城区','枣强县','武邑县','武强县','饶阳县','安平县','故城县','景　县','阜城县','冀州市','深州市']}
		]},
		{name:'山西', cityList:[		   
		{name:'太原市', areaList:['市辖区','小店区','迎泽区','杏花岭区','尖草坪区','万柏林区','晋源区','清徐县','阳曲县','娄烦县','古交市']},		   
		{name:'大同市', areaList:['市辖区','城　区','矿　区','南郊区','新荣区','阳高县','天镇县','广灵县','灵丘县','浑源县','左云县','大同县']},		   
		{name:'阳泉市', areaList:['市辖区','城　区','矿　区','郊　区','平定县','盂　县']},		   
		{name:'长治市', areaList:['市辖区','城　区','郊　区','长治县','襄垣县','屯留县','平顺县','黎城县','壶关县','长子县','武乡县','沁　县','沁源县','潞城市']},		   
		{name:'晋城市', areaList:['市辖区','城　区','沁水县','阳城县','陵川县','泽州县','高平市']},		   
		{name:'朔州市', areaList:['市辖区','朔城区','平鲁区','山阴县','应　县','右玉县','怀仁县']},		   
		{name:'晋中市', areaList:['市辖区','榆次区','榆社县','左权县','和顺县','昔阳县','寿阳县','太谷县','祁　县','平遥县','灵石县','介休市']},		   
		{name:'运城市', areaList:['市辖区','盐湖区','临猗县','万荣县','闻喜县','稷山县','新绛县','绛　县','垣曲县','夏　县','平陆县','芮城县','永济市','河津市']},		   
		{name:'忻州市', areaList:['市辖区','忻府区','定襄县','五台县','代　县','繁峙县','宁武县','静乐县','神池县','五寨县','岢岚县','河曲县','保德县','偏关县','原平市']},		   
		{name:'临汾市', areaList:['市辖区','尧都区','曲沃县','翼城县','襄汾县','洪洞县','古　县','安泽县','浮山县','吉　县','乡宁县','大宁县','隰　县','永和县','蒲　县','汾西县','侯马市','霍州市']},		   
		{name:'吕梁市', areaList:['市辖区','离石区','文水县','交城县','兴　县','临　县','柳林县','石楼县','岚　县','方山县','中阳县','交口县','孝义市','汾阳市']}
		]},
		{name:'内蒙古', cityList:[		   
		{name:'呼和浩特市', areaList:['市辖区','新城区','回民区','玉泉区','赛罕区','土默特左旗','托克托县','和林格尔县','清水河县','武川县']},		   
		{name:'包头市', areaList:['市辖区','东河区','昆都仑区','青山区','石拐区','白云矿区','九原区','土默特右旗','固阳县','达尔罕茂明安联合旗']},		   
		{name:'乌海市', areaList:['市辖区','海勃湾区','海南区','乌达区']},		   
		{name:'赤峰市', areaList:['市辖区','红山区','元宝山区','松山区','阿鲁科尔沁旗','巴林左旗','巴林右旗','林西县','克什克腾旗','翁牛特旗','喀喇沁旗','宁城县','敖汉旗']},		   
		{name:'通辽市', areaList:['市辖区','科尔沁区','科尔沁左翼中旗','科尔沁左翼后旗','开鲁县','库伦旗','奈曼旗','扎鲁特旗','霍林郭勒市']},		   
		{name:'鄂尔多斯市', areaList:['东胜区','达拉特旗','准格尔旗','鄂托克前旗','鄂托克旗','杭锦旗','乌审旗','伊金霍洛旗']},		   
		{name:'呼伦贝尔市', areaList:['市辖区','海拉尔区','阿荣旗','莫力达瓦达斡尔族自治旗','鄂伦春自治旗','鄂温克族自治旗','陈巴尔虎旗','新巴尔虎左旗','新巴尔虎右旗','满洲里市','牙克石市','扎兰屯市','额尔古纳市','根河市']},		   
		{name:'巴彦淖尔市', areaList:['市辖区','临河区','五原县','磴口县','乌拉特前旗','乌拉特中旗','乌拉特后旗','杭锦后旗']},		   
		{name:'乌兰察布市', areaList:['市辖区','集宁区','卓资县','化德县','商都县','兴和县','凉城县','察哈尔右翼前旗','察哈尔右翼中旗','察哈尔右翼后旗','四子王旗','丰镇市']},		   
		{name:'兴安盟', areaList:['乌兰浩特市','阿尔山市','科尔沁右翼前旗','科尔沁右翼中旗','扎赉特旗','突泉县']},		   
		{name:'锡林郭勒盟', areaList:['二连浩特市','锡林浩特市','阿巴嘎旗','苏尼特左旗','苏尼特右旗','东乌珠穆沁旗','西乌珠穆沁旗','太仆寺旗','镶黄旗','正镶白旗','正蓝旗','多伦县']},		   
		{name:'阿拉善盟', areaList:['阿拉善左旗','阿拉善右旗','额济纳旗']}
		]},
		{name:'江苏', cityList:[		   
		{name:'南京市', areaList:['市辖区','玄武区','白下区','秦淮区','建邺区','鼓楼区','下关区','浦口区','栖霞区','雨花台区','江宁区','六合区','溧水县','高淳县']},		   
		{name:'无锡市', areaList:['市辖区','崇安区','南长区','北塘区','锡山区','惠山区','滨湖区','江阴市','宜兴市']},		   
		{name:'徐州市', areaList:['市辖区','鼓楼区','云龙区','九里区','贾汪区','泉山区','丰　县','沛　县','铜山县','睢宁县','新沂市','邳州市']},		   
		{name:'常州市', areaList:['市辖区','天宁区','钟楼区','戚墅堰区','新北区','武进区','溧阳市','金坛市']},		   
		{name:'苏州市', areaList:['市辖区','沧浪区','平江区','金阊区','虎丘区','吴中区','相城区','常熟市','张家港市','昆山市','吴江市','太仓市']},		   
		{name:'南通市', areaList:['市辖区','崇川区','港闸区','海安县','如东县','启东市','如皋市','通州市','海门市']},		   
		{name:'连云港市', areaList:['市辖区','连云区','新浦区','海州区','赣榆县','东海县','灌云县','灌南县']},		   
		{name:'淮安市', areaList:['市辖区','清河区','楚州区','淮阴区','清浦区','涟水县','洪泽县','盱眙县','金湖县']},		   
		{name:'盐城市', areaList:['市辖区','亭湖区','盐都区','响水县','滨海县','阜宁县','射阳县','建湖县','东台市','大丰市']},		   
		{name:'扬州市', areaList:['市辖区','广陵区','邗江区','郊　区','宝应县','仪征市','高邮市','江都市']},		   
		{name:'镇江市', areaList:['市辖区','京口区','润州区','丹徒区','丹阳市','扬中市','句容市']},		   
		{name:'泰州市', areaList:['市辖区','海陵区','高港区','兴化市','靖江市','泰兴市','姜堰市']},		   
		{name:'宿迁市', areaList:['市辖区','宿城区','宿豫区','沭阳县','泗阳县','泗洪县']}
		]},
		{name:'浙江', cityList:[		   
		{name:'杭州市', areaList:['市辖区','上城区','下城区','江干区','拱墅区','西湖区','滨江区','萧山区','余杭区','桐庐县','淳安县','建德市','富阳市','临安市']},		   
		{name:'宁波市', areaList:['市辖区','海曙区','江东区','江北区','北仑区','镇海区','鄞州区','象山县','宁海县','余姚市','慈溪市','奉化市']},		   
		{name:'温州市', areaList:['市辖区','鹿城区','龙湾区','瓯海区','洞头县','永嘉县','平阳县','苍南县','文成县','泰顺县','瑞安市','乐清市']},		   
		{name:'嘉兴市', areaList:['市辖区','秀城区','秀洲区','嘉善县','海盐县','海宁市','平湖市','桐乡市']},		   
		{name:'湖州市', areaList:['市辖区','吴兴区','南浔区','德清县','长兴县','安吉县']},		   
		{name:'绍兴市', areaList:['市辖区','越城区','绍兴县','新昌县','诸暨市','上虞市','嵊州市']},		   
		{name:'金华市', areaList:['市辖区','婺城区','金东区','武义县','浦江县','磐安县','兰溪市','义乌市','东阳市','永康市']},		   
		{name:'衢州市', areaList:['市辖区','柯城区','衢江区','常山县','开化县','龙游县','江山市']},		   
		{name:'舟山市', areaList:['市辖区','定海区','普陀区','岱山县','嵊泗县']},		   
		{name:'台州市', areaList:['市辖区','椒江区','黄岩区','路桥区','玉环县','三门县','天台县','仙居县','温岭市','临海市']},		   
		{name:'丽水市', areaList:['市辖区','莲都区','青田县','缙云县','遂昌县','松阳县','云和县','庆元县','景宁畲族自治县','龙泉市']}
		]},
		{name:'安徽', cityList:[		   
		{name:'合肥市', areaList:['市辖区','瑶海区','庐阳区','蜀山区','包河区','长丰县','肥东县','肥西县']},		   
		{name:'芜湖市', areaList:['市辖区','镜湖区','马塘区','新芜区','鸠江区','芜湖县','繁昌县','南陵县']},		   
		{name:'蚌埠市', areaList:['市辖区','龙子湖区','蚌山区','禹会区','淮上区','怀远县','五河县','固镇县']},		   
		{name:'淮南市', areaList:['市辖区','大通区','田家庵区','谢家集区','八公山区','潘集区','凤台县']},		   
		{name:'马鞍山市', areaList:['市辖区','金家庄区','花山区','雨山区','当涂县']},		   
		{name:'淮北市', areaList:['市辖区','杜集区','相山区','烈山区','濉溪县']},		   
		{name:'铜陵市', areaList:['市辖区','铜官山区','狮子山区','郊　区','铜陵县']},		   
		{name:'安庆市', areaList:['市辖区','迎江区','大观区','郊　区','怀宁县','枞阳县','潜山县','太湖县','宿松县','望江县','岳西县','桐城市']},		   
		{name:'黄山市', areaList:['市辖区','屯溪区','黄山区','徽州区','歙　县','休宁县','黟　县','祁门县']},		   
		{name:'滁州市', areaList:['市辖区','琅琊区','南谯区','来安县','全椒县','定远县','凤阳县','天长市','明光市']},		   
		{name:'阜阳市', areaList:['市辖区','颍州区','颍东区','颍泉区','临泉县','太和县','阜南县','颍上县','界首市']},		   
		{name:'宿州市', areaList:['市辖区','墉桥区','砀山县','萧　县','灵璧县','泗　县']},		   
		{name:'巢湖市', areaList:['市辖区','居巢区','庐江县','无为县','含山县','和　县']},		   
		{name:'六安市', areaList:['市辖区','金安区','裕安区','寿　县','霍邱县','舒城县','金寨县','霍山县']},		   
		{name:'亳州市', areaList:['市辖区','谯城区','涡阳县','蒙城县','利辛县']},		   
		{name:'池州市', areaList:['市辖区','贵池区','东至县','石台县','青阳县']},		   
		{name:'宣城市', areaList:['市辖区','宣州区','郎溪县','广德县','泾　县','绩溪县','旌德县','宁国市']}
		]},
		{name:'福建', cityList:[		   
		{name:'福州市', areaList:['市辖区','鼓楼区','台江区','仓山区','马尾区','晋安区','闽侯县','连江县','罗源县','闽清县','永泰县','平潭县','福清市','长乐市']},		   
		{name:'厦门市', areaList:['市辖区','思明区','海沧区','湖里区','集美区','同安区','翔安区']},		   
		{name:'莆田市', areaList:['市辖区','城厢区','涵江区','荔城区','秀屿区','仙游县']},		   
		{name:'三明市', areaList:['市辖区','梅列区','三元区','明溪县','清流县','宁化县','大田县','尤溪县','沙　县','将乐县','泰宁县','建宁县','永安市']},		   
		{name:'泉州市', areaList:['市辖区','鲤城区','丰泽区','洛江区','泉港区','惠安县','安溪县','永春县','德化县','金门县','石狮市','晋江市','南安市']},		   
		{name:'漳州市', areaList:['市辖区','芗城区','龙文区','云霄县','漳浦县','诏安县','长泰县','东山县','南靖县','平和县','华安县','龙海市']},		   
		{name:'南平市', areaList:['市辖区','延平区','顺昌县','浦城县','光泽县','松溪县','政和县','邵武市','武夷山市','建瓯市','建阳市']},		   
		{name:'龙岩市', areaList:['市辖区','新罗区','长汀县','永定县','上杭县','武平县','连城县','漳平市']},		   
		{name:'宁德市', areaList:['市辖区','蕉城区','霞浦县','古田县','屏南县','寿宁县','周宁县','柘荣县','福安市','福鼎市']}
		]},
		{name:'江西', cityList:[		   
		{name:'南昌市', areaList:['市辖区','东湖区','西湖区','青云谱区','湾里区','青山湖区','南昌县','新建县','安义县','进贤县']},		   
		{name:'景德镇市', areaList:['市辖区','昌江区','珠山区','浮梁县','乐平市']},		   
		{name:'萍乡市', areaList:['市辖区','安源区','湘东区','莲花县','上栗县','芦溪县']},		   
		{name:'九江市', areaList:['市辖区','庐山区','浔阳区','九江县','武宁县','修水县','永修县','德安县','星子县','都昌县','湖口县','彭泽县','瑞昌市']},		   
		{name:'新余市', areaList:['市辖区','渝水区','分宜县']},		   
		{name:'鹰潭市', areaList:['市辖区','月湖区','余江县','贵溪市']},		   
		{name:'赣州市', areaList:['市辖区','章贡区','赣　县','信丰县','大余县','上犹县','崇义县','安远县','龙南县','定南县','全南县','宁都县','于都县','兴国县','会昌县','寻乌县','石城县','瑞金市','南康市']},		   
		{name:'吉安市', areaList:['市辖区','吉州区','青原区','吉安县','吉水县','峡江县','新干县','永丰县','泰和县','遂川县','万安县','安福县','永新县','井冈山市']},		   
		{name:'宜春市', areaList:['市辖区','袁州区','奉新县','万载县','上高县','宜丰县','靖安县','铜鼓县','丰城市','樟树市','高安市']},		   
		{name:'抚州市', areaList:['市辖区','临川区','南城县','黎川县','南丰县','崇仁县','乐安县','宜黄县','金溪县','资溪县','东乡县','广昌县']},		   
		{name:'上饶市', areaList:['市辖区','信州区','上饶县','广丰县','玉山县','铅山县','横峰县','弋阳县','余干县','鄱阳县','万年县','婺源县','德兴市']}
		]},
		{name:'山东', cityList:[		   
		{name:'济南市', areaList:['市辖区','历下区','市中区','槐荫区','天桥区','历城区','长清区','平阴县','济阳县','商河县','章丘市']},		   
		{name:'青岛市', areaList:['市辖区','市南区','市北区','四方区','黄岛区','崂山区','李沧区','城阳区','胶州市','即墨市','平度市','胶南市','莱西市']},		   
		{name:'淄博市', areaList:['市辖区','淄川区','张店区','博山区','临淄区','周村区','桓台县','高青县','沂源县']},		   
		{name:'枣庄市', areaList:['市辖区','市中区','薛城区','峄城区','台儿庄区','山亭区','滕州市']},		   
		{name:'东营市', areaList:['市辖区','东营区','河口区','垦利县','利津县','广饶县']},		   
		{name:'烟台市', areaList:['市辖区','芝罘区','福山区','牟平区','莱山区','长岛县','龙口市','莱阳市','莱州市','蓬莱市','招远市','栖霞市','海阳市']},		   
		{name:'潍坊市', areaList:['市辖区','潍城区','寒亭区','坊子区','奎文区','临朐县','昌乐县','青州市','诸城市','寿光市','安丘市','高密市','昌邑市']},		   
		{name:'济宁市', areaList:['市辖区','市中区','任城区','微山县','鱼台县','金乡县','嘉祥县','汶上县','泗水县','梁山县','曲阜市','兖州市','邹城市']},		   
		{name:'泰安市', areaList:['市辖区','泰山区','岱岳区','宁阳县','东平县','新泰市','肥城市']},		   
		{name:'威海市', areaList:['市辖区','环翠区','文登市','荣成市','乳山市']},		   
		{name:'日照市', areaList:['市辖区','东港区','岚山区','五莲县','莒　县']},		   
		{name:'莱芜市', areaList:['市辖区','莱城区','钢城区']},		   
		{name:'临沂市', areaList:['市辖区','兰山区','罗庄区','河东区','沂南县','郯城县','沂水县','苍山县','费　县','平邑县','莒南县','蒙阴县','临沭县']},		   
		{name:'德州市', areaList:['市辖区','德城区','陵　县','宁津县','庆云县','临邑县','齐河县','平原县','夏津县','武城县','乐陵市','禹城市']},		   
		{name:'聊城市', areaList:['市辖区','东昌府区','阳谷县','莘　县','茌平县','东阿县','冠　县','高唐县','临清市']},		   
		{name:'滨州市', areaList:['市辖区','滨城区','惠民县','阳信县','无棣县','沾化县','博兴县','邹平县']},		   
		{name:'荷泽市', areaList:['市辖区','牡丹区','曹　县','单　县','成武县','巨野县','郓城县','鄄城县','定陶县','东明县']}
		]},
		{name:'辽宁', cityList:[		   
		{name:'沈阳市', areaList:['市辖区','和平区','沈河区','大东区','皇姑区','铁西区','苏家屯区','东陵区','新城子区','于洪区','辽中县','康平县','法库县','新民市']},		   
		{name:'大连市', areaList:['市辖区','中山区','西岗区','沙河口区','甘井子区','旅顺口区','金州区','长海县','瓦房店市','普兰店市','庄河市']},		   
		{name:'鞍山市', areaList:['市辖区','铁东区','铁西区','立山区','千山区','台安县','岫岩满族自治县','海城市']},		   
		{name:'抚顺市', areaList:['市辖区','新抚区','东洲区','望花区','顺城区','抚顺县','新宾满族自治县','清原满族自治县']},		   
		{name:'本溪市', areaList:['市辖区','平山区','溪湖区','明山区','南芬区','本溪满族自治县','桓仁满族自治县']},		   
		{name:'丹东市', areaList:['市辖区','元宝区','振兴区','振安区','宽甸满族自治县','东港市','凤城市']},		   
		{name:'锦州市', areaList:['市辖区','古塔区','凌河区','太和区','黑山县','义　县','凌海市','北宁市']},		   
		{name:'营口市', areaList:['市辖区','站前区','西市区','鲅鱼圈区','老边区','盖州市','大石桥市']},		   
		{name:'阜新市', areaList:['市辖区','海州区','新邱区','太平区','清河门区','细河区','阜新蒙古族自治县','彰武县']},		   
		{name:'辽阳市', areaList:['市辖区','白塔区','文圣区','宏伟区','弓长岭区','太子河区','辽阳县','灯塔市']},		   
		{name:'盘锦市', areaList:['市辖区','双台子区','兴隆台区','大洼县','盘山县']},		   
		{name:'铁岭市', areaList:['市辖区','银州区','清河区','铁岭县','西丰县','昌图县','调兵山市','开原市']},		   
		{name:'朝阳市', areaList:['市辖区','双塔区','龙城区','朝阳县','建平县','喀喇沁左翼蒙古族自治县','北票市','凌源市']},		   
		{name:'葫芦岛市', areaList:['市辖区','连山区','龙港区','南票区','绥中县','建昌县','兴城市']}
		]},
		{name:'吉林', cityList:[		   
		{name:'长春市', areaList:['市辖区','南关区','宽城区','朝阳区','二道区','绿园区','双阳区','农安县','九台市','榆树市','德惠市']},		   
		{name:'吉林市', areaList:['市辖区','昌邑区','龙潭区','船营区','丰满区','永吉县','蛟河市','桦甸市','舒兰市','磐石市']},		   
		{name:'四平市', areaList:['市辖区','铁西区','铁东区','梨树县','伊通满族自治县','公主岭市','双辽市']},		   
		{name:'辽源市', areaList:['市辖区','龙山区','西安区','东丰县','东辽县']},		   
		{name:'通化市', areaList:['市辖区','东昌区','二道江区','通化县','辉南县','柳河县','梅河口市','集安市']},		   
		{name:'白山市', areaList:['市辖区','八道江区','抚松县','靖宇县','长白朝鲜族自治县','江源县','临江市']},		   
		{name:'松原市', areaList:['市辖区','宁江区','前郭尔罗斯蒙古族自治县','长岭县','乾安县','扶余县']},		   
		{name:'白城市', areaList:['市辖区','洮北区','镇赉县','通榆县','洮南市','大安市']},		   
		{name:'延边朝鲜族自治州', areaList:['延吉市','图们市','敦化市','珲春市','龙井市','和龙市','汪清县','安图县']}
		]},
		{name:'黑龙江', cityList:[		   
		{name:'哈尔滨市', areaList:['市辖区','道里区','南岗区','道外区','香坊区','动力区','平房区','松北区','呼兰区','依兰县','方正县','宾　县','巴彦县','木兰县','通河县','延寿县','阿城市','双城市','尚志市','五常市']},		   
		{name:'齐齐哈尔市', areaList:['市辖区','龙沙区','建华区','铁锋区','昂昂溪区','富拉尔基区','碾子山区','梅里斯达斡尔族区','龙江县','依安县','泰来县','甘南县','富裕县','克山县','克东县','拜泉县','讷河市']},		   
		{name:'鸡西市', areaList:['市辖区','鸡冠区','恒山区','滴道区','梨树区','城子河区','麻山区','鸡东县','虎林市','密山市']},		   
		{name:'鹤岗市', areaList:['市辖区','向阳区','工农区','南山区','兴安区','东山区','兴山区','萝北县','绥滨县']},		   
		{name:'双鸭山市', areaList:['市辖区','尖山区','岭东区','四方台区','宝山区','集贤县','友谊县','宝清县','饶河县']},		   
		{name:'大庆市', areaList:['市辖区','萨尔图区','龙凤区','让胡路区','红岗区','大同区','肇州县','肇源县','林甸县','杜尔伯特蒙古族自治县']},		   
		{name:'伊春市', areaList:['市辖区','伊春区','南岔区','友好区','西林区','翠峦区','新青区','美溪区','金山屯区','五营区','乌马河区','汤旺河区','带岭区','乌伊岭区','红星区','上甘岭区','嘉荫县','铁力市']},		   
		{name:'佳木斯市', areaList:['市辖区','永红区','向阳区','前进区','东风区','郊　区','桦南县','桦川县','汤原县','抚远县','同江市','富锦市']},		   
		{name:'七台河市', areaList:['市辖区','新兴区','桃山区','茄子河区','勃利县']},		   
		{name:'牡丹江市', areaList:['市辖区','东安区','阳明区','爱民区','西安区','东宁县','林口县','绥芬河市','海林市','宁安市','穆棱市']},		   
		{name:'黑河市', areaList:['市辖区','爱辉区','嫩江县','逊克县','孙吴县','北安市','五大连池市']},		   
		{name:'绥化市', areaList:['市辖区','北林区','望奎县','兰西县','青冈县','庆安县','明水县','绥棱县','安达市','肇东市','海伦市']},		   
		{name:'大兴安岭地区', areaList:['呼玛县','塔河县','漠河县']}
		]},
		{name:'海南', cityList:[		   
		{name:'海口市', areaList:['市辖区','秀英区','龙华区','琼山区','美兰区']},		   
		{name:'三亚市', areaList:['市辖区']},		   
		{name:'省直辖县级行政单位', areaList:['五指山市','琼海市','儋州市','文昌市','万宁市','东方市','定安县','屯昌县','澄迈县','临高县','白沙黎族自治县','昌江黎族自治县','乐东黎族自治县','陵水黎族自治县','保亭黎族苗族自治县','琼中黎族苗族自治县','西沙群岛','南沙群岛','中沙群岛的岛礁及其海域']}
		]},
		{name:'台湾', cityList:[
		]},
		{name:'香港', cityList:[
		]},
		{name:'澳门', cityList:[
		]}
		];
		addressInit(_cmbProvince, _cmbCity, _cmbArea, defaultProvince, defaultCity, defaultArea);
	}
	
	
	//===============================================
	//====== 罗光瑜修改：增加ajax上传文件的处理函数=======
	//===============================================
	if (_win.APICtr && _win.APICtr.addAPI){
		_win.APICtr.addAPI(_result);
	}else{
		module.exports = _api;	
	}
});