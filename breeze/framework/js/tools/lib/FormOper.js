/**
 * 本函数体用于进行窗口相关的操作，包括自动解析生产窗体
 * 自动获取窗体下面的表单对象
 */
define(function(require, exports, module) {
    var _win = window;
    var _doc = _win.document;
    var _result = {
        name : "FormAPI",
        desc : "表单解析函数",
        domain : "FormAPI"
    };
    var _api = _result.f = {};
	
	var API = {
		JsonAPI:require("./json"),
		dateTimeAPI:require("./../DateTime"),
		BreezeTemplate:require("./BreezeTemplate"),
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

    function beginCreateFormOrList(islist,objdesc,dom,formData,callback,type){
        //开始解析objdesc
        var formStr = "<div class='form-wrap ";//罗光瑜修改：这里取消了表单的提交按钮
        if(islist){
        	formStr += "islist ";
        }else{
        	formStr += "pull-left ";
        }
		formStr += "clearfix'>";

        parserObjDesc(objdesc); // 根据对象结构描述文件生成表单
		formStr += "</div>";

    	var htmlParser = API.BreezeTemplate.parserTemplate(formStr,formData,API);	//根据数据解析表单字符串生成最终表单html
    	dom.html(htmlParser);
		
		
		// 给List类型增加"增加一行"、"删除一行"、"全选"、"删除所选等功能"
		formAction();
		
		//整体表单描述对象解析函数
		function parserObjDesc($obj,$objName){
			for(var prop in $obj){

				//对数据描述name属性中包含.的情况进行批量替换动作 替换规则："." To "_dot_" 
    			var propForName = prop.replace(/\./gi,"_dot_");

				var fTitle = $obj[prop].title?$obj[prop].title:"";
				var fType = $obj[prop].type?$obj[prop].type:"";
				var fValueRange = $obj[prop].valueRange?$obj[prop].valueRange:"";
				var fDesc = $obj[prop].desc?$obj[prop].desc:"";
				var fWidth = $obj[prop].width?$obj[prop].width:"";
				var fIsList = $obj[prop].islist=="1"?true:false;

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
					parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList); //解析表单
					if(fDesc){
						formStr+="<span class='help-inline'>"+fDesc+"</span>";
					}
					formStr+="</div></div>";
				}
				
				//==== 存在参数$objName=$listTit ======
				//==== 表示解析子循环title =============

				else if($objName=="$listTit"){
					//定义节点class
					var fName = "data." + propForName;
					var __fClass = fName.replace(/_dot_/gi,".").replace(/(\[.*?\])|(data)/g,"").replace(/\./g,"_").toLowerCase();//罗光瑜修改：对象间用_
					if(islist && !fIsList){
						formStr+="<th class='th"+__fClass+" th_"+fType+"' style='display:none;'>"+fTitle+"</th>";
					}else{
						formStr+="<th class='th"+__fClass+" th_"+fType+"'>"+fTitle+"</th>";
					}
				}
				
				//==== 存在参数$objName,且不等于"$listTit"====
				//==== 表示解析子循环内容 ====================
				
				else{ //子级循环
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
					if(islist && !fIsList){
						formStr+="<td class='td"+__fClass+" td_"+fType+"' style='display:none;'>";
					}else{
						formStr+="<td class='td"+__fClass+" td_"+fType+"'>";	
					}
					parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList); //解析表单
					if(fDesc){
						formStr+="<span class='help-inline'>* "+fDesc+"</span>";
					}
					formStr+="</td>";
				}
			}
		}
		
		//=====表单内容解析函数=====
		//=====共n种类型=====
		function parserField(fTitle,fType,fValueRange,fDesc,fWidth,fName,fValue,fIsList){ 

			//定义节点class
			var fClass = fName.replace(/_dot_/gi,".").replace(/(\[.*?\])|(data)/g,"").replace(/\./g,"_").toLowerCase();//罗光瑜修改：对象间用_

			//判断是否有值，布尔状态
			formStr+="<!--$var valueStatus = true;-->";
			formStr+="<!--$try{ if(!"+fValue+"){ valueStatus = false;}} catch(e){ valueStatus = false; };-->";

			//根据type判断，逐一解析
			switch(fType){
				
				//单行文本函数
				case "Text": 
					formStr+="<input id='"+fName+"' class='inp_text "+fClass+"_inp' type='text' name='"+fName+"' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					break;

				//hidden隐藏的表单类型
				case "Hidden": 
				    formStr+= "<input id='"+fName+"' class='inp_text "+fClass+"_inp' type='hidden' name='"+fName+"' ";		//2013-03-20 Alec修改			
				    formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					formStr+="/>";
					break;

				//只读文本
				case "ReadOnly": 
					formStr+="<input id='"+fName+"' class='inp_text readOnly "+fClass+"_inp' type='text' name='"+fName+"' readOnly='true' ";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="value='${lang:formatQuota("+fValue+")}' ";
					formStr+="<!--$}-->";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+="/>";
					break;

				//外联类型
				case "OuterLink": 
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
					break;

				//日期选择器
				case "DatePicker": 
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
					break;

				//时间选择器	
				case "TimePicker":											
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
					break;

				//日期+时间选择器
				case "DateTimePicker": 
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
					break;

				//日期间隔选择器	
				case "DateRangePicker":											
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
					break;
				
				//checkbox列表函数
				case "CheckBox": 
					for (var i=0; i<fValueRange.length; i++){
						for(var emun in fValueRange[i]){
							formStr+="<label><input class='ace-checkbox-2' type='checkbox' name='"+fName+"' value='"+fValueRange[i][emun]+"' ";
							formStr+="<!--$if(valueStatus){-->";
							formStr+="<!--$for(var j=0; j<"+fValue+".length; j++){-->";
							formStr+="<!--$if("+fValue+"[j]=='"+fValueRange[i][emun]+"'){-->";
							formStr+="checked='true' ";
							formStr+="<!--$}}-->";
							formStr+="<!--$}-->";
							formStr+="/><span class='lbl'> "+emun+"</span></label>";
						}
					}
					break;

				//checkbox列表函数
				case "Radio": 
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
					break;


				//下拉菜单函数
				case "Select": 
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
					break;
				
				//多选列表函数
				case "MultSelect": 					
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
					break;
				
				//附件函数
				case "Affix":			
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
					break;

				//缩略图函数
				case "File":
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
					formStr+="<img class='img_file "+fName+"_img_file' id='"+fName+"_img_file' style='height:60px; width:90px;' "; 
					formStr+="<!--$if(valueStatus){-->";
					formStr+="src='${Cfg.baseUrl}/${lang:formatQuota("+fValue+")}' />";
					formStr+="<!--$}else{-->"; 
					formStr+="src='${Cfg.baseUrl}/images/nopic.gif' />";
					formStr+="<!--$}-->";
					formStr+="</div>";

					break;

				//文本域函数
				case "TextArea": 
					formStr+="<div class='row-fluid'><textarea id='"+fName+"' class='span12 "+fClass+"_tex' name='"+fName+"' ";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+=">";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${"+fValue+"}";
					formStr+="<!--$}-->";
					formStr+="</textarea></div>";
					break;

				//html编辑器函数
				case "Html": 
					formStr+="<div class='row-fluid'><textarea id='"+fName+"' class='"+"span12 xheditor "+fClass+"_tex' name='"+fName+"' ";
					if (fWidth){
						formStr+="style='width:"+fWidth+"' ";
					}
					formStr+=">";
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${"+fValue+"}";
					formStr+="<!--$}-->";
					formStr+="</textarea></div>";
					break;

				//数据列表——支持 对象类型，字符串类型
				case "List": 

					//表格显示列表
					formStr+="<table style='margin-bottom:10px; width:"+fWidth+"' class='table table-list table"+fClass+" table-striped table-bordered table-hover'>";
					
					//递归解析 列表title名称;
					//Alec 判断是否是字符串类型

					if($.isArray(fValueRange)){  //如果是list列表型
						formStr+="<thead>";
						formStr+="<tr><th style='width:60px;' class='center'>选择</th>";
						parserObjDesc(fValueRange[0],"$listTit");
						//存在列表，且是默认数据列表type存在，或等于0的情况，才有操作列
						if(islist && !type){ 
							formStr+="<th style='width:120px;'>操作</th>";
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
						formStr+="<tr><td style='width:60px;' class='center'><label><input name='rowRadio' type='radio'/><span class='lbl'></span></label></td>";
					}else{
						//非列表或默认列表的时候，用复选框
						formStr+="<tr><td style='width:60px;' class='center'><label><input type='checkbox'/><span class='lbl'></span></label></td>";
					}
					if(islist && !type){
						//除关联列表视图，添加操作按钮列区域
						var btnHtml = "";
				     	btnHtml+="<td><div class='hidden-phone visible-desktop btn-group actionBtnForList'></div></td>";
				     }
					//递归解析
					if($.isArray(fValueRange)){  //如果是list列表型
						parserObjDesc(fValueRange[0], fName+"[${"+idx+"}]");
						if(islist && !type){
							formStr += btnHtml;
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
						parserField(fTitle2,fType2,fValueRange2,fDesc2,fWidth2,fName2,fValue2,fIsList2);
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
						parserField(fTitle2,fType2,fValueRange2,fDesc2,fWidth2,fName2,fValue2,fIsList2);
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
							formStr += "<button authority='deleteContent' type='button' class='btn btn-mini btn-danger btn-del btn-del-list'>";
							formStr += "<i class='icon-trash bigger-120'> 批量删除</i>";
							formStr += "</button>";
						}else{
							formStr += "<button type='button' class='btn btn-mini btn-danger btn-del'>";
							formStr += "<i class='icon-trash bigger-120'> 删除</i>";
							formStr += "</button>";
						}
					}
					formStr += "</div>";
					break;
					
				//Object数据
				case "Object": 
					//文本域显示json字符串
					formStr+="<textarea style='display:none;' class='"+fClass+"_tex' name='"+fName+"' isJson='true'>";
						formStr+="<!--$if(valueStatus){-->";
						formStr+="${"+fValue+"}";
						formStr+="<!--$}-->";
					formStr+="</textarea>";
					
					//增加编辑按钮
					formStr+="<a style='margin-top:5px;' alt='"+fTitle+"' class='btn btn-mini btn-info edit' href='javascript:void(0);'><i class='icon-edit bigger-120'> 点击编辑</i></a>";
					break;

				//双语言模型
				case "Langs":
					formStr+="<textarea readOnly='true' class='"+fClass+"_tex' name='"+fName+"' isJson='true'>";
						formStr+="<!--$if(valueStatus){-->";
						formStr+="${"+fValue+"}";
						formStr+="<!--$}-->";
					formStr+="</textarea>";
					
					//增加编辑按钮
					formStr+="<a style='margin:5px 0 0 10px;' alt='"+fTitle+"' class='btn btn-mini btn-info edit' href='javascript:void(0);'><i class='icon-edit bigger-120'> 点击编辑</i></a>";
					break;

				//多图上传
				case "Pics":
					formStr+="<textarea id='PicsTextArea' style='display:none;' class='"+fClass+"_tex' name='"+fName+"'></textarea>";
					//增加选择按钮
					formStr+="<div style='margin-top:5px;' alt='"+fTitle+"' class='btn btn-mini btn-info' href='javascript:void(0);'>";
					formStr+="<i class='icon-search bigger-120'></i> <span id='spanButtonPlaceholder'></span>";
					formStr+="</div>";
					
					//进度条
					formStr+="<div id='divFileProgressContainer'></div>";

					//显示图片区域
					formStr+="<div id='PicsField'>";

					//循环显示图片列表
					formStr+="<!--$if(valueStatus){-->";
					formStr+="${lang:showPicsList("+fValue+")}";
					formStr+="<!--$}-->";
					formStr+="</div>";
					break;
			}
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
				    callback && callback( _fieldName, _fieldValue);
				})
			}
			//OuterLink 操作事件，只支持一层，list字段里面不支持外联
			bindOuterLink(dom);

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
						if(cbox.attr("checked")){
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
					if(!cbox.attr("checked")){
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
				swfu = new SWFUpload({
					// Backend Settings
					upload_url: Cfg.swfuploadUrl,
					post_params: {"PHPSESSID": "session_id()"},

					// File Upload Settings
					file_size_limit : "2 MB",	// 2MB
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
						 dom.find("#PicsField").append(htmlStr);
					},

					upload_complete_handler : function (file){
						dom.find('#divFileProgressContainer').show();
						dom.find('#progressBarInProgress').css({'width': '0%'});
				 		dom.find('#progressName').html('');
						this.startUpload();
					},

					// Button Settings,
					button_placeholder_id : "spanButtonPlaceholder",
					button_width: 230,
					button_height: 18,
					button_text : '<span class="button">选择本地图片 <span class="buttonSmall">(单图最大为 2 MB，支持多选)</span></span>',
					button_text_style : '.button {color:#ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
					button_text_top_padding: 0,
					button_text_left_padding: 0,
					button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
					button_cursor: SWFUpload.CURSOR.HAND,
					
					// Flash Settings
					flash_url : Cfg.baseUrl+"/breeze/swfupload/swfupload.swf",

					custom_settings : {
						upload_target : "divFileProgressContainer"
					},
					
					// Debug Settings
					debug: false
				});
				
				//banding删除按钮
				dom.find("#PicsField").delegate(".delpic","click",function(){
					$(this).parent().remove();
				})

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
					//遍历PicItem，组合图片数组
					var PicsArr = [];
					dom.find("#PicsField .PicItem").each(function(){
						var objPicItem = {
							picUrl: $(this).find(".picsThumb img").attr("data-src"),
							alt:    $(this).find("input").val()
						};
						PicsArr.push(objPicItem);
					})
					eval(dom.find("#PicsTextArea").attr("name")+"= PicsArr;");
				}
				
				//将其还原回来
				for(var i=0; i<$(this).find(".list-tr-hidden").length; i++){
					$(this).find(".list-tr-hidden:eq("+i+")").html(lcwnoneArr[i]);
				}
				return data;
			}

			//获得原始单行数据，用于批量添加时，判断单行记录是否填值
			dom[0].getHiddenData = function(){
				 var data = _api.createJsonByForm(dom.find(".table_formlist:eq(0)>tbody>tr.list-tr-hidden"),objdesc);
				 return data.formList;
			}

			//获取数据并校验
			dom[0].getDataAndCheck = function(){

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
		$.each(arr, function() {
			if (/button|file/i.test(this.type)){//罗光瑜修改：对file和button的过滤
				return;
			}
			if (!this.name || this.name=="rowRadio"){
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
			}
			else{
				if(value){
					eval(name+"="+API.JsonAPI.toJSONString(value)+";");
				}else{
					eval(name+"=\"\";");
				}
			}
			
		});
		
		//将生成的data对象中，如果属性名存在_dot_，将其还原成. 
		data = API.JsonAPI.evalJSON(API.JsonAPI.toJSONString(data).replace(/_dot_/gi,"."));
		return data;
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




