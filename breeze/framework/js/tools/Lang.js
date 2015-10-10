/** 
* @fileOverview FW配套使用的核心默认函数lang 
* @author <a href="http://www.wgfly.com">Logan</a> 
* @version 0.1
* @version 0.01 罗光瑜修改 getParameter函数
*/ 

/**
* @namespace
* @author Logan 
* @name lang
* @description  FW的核心基本扩展 
*/ 
define(function(require, exports, module) {
	//用函数自身做域名承载对象
	//这样在外部使用的时候，可以简化比如use("xx/x/xx")(FW);
	var _result = function(fw){
		fw.use(_result);
	}
	
	_result.getDomain = function(){
		return "lang";
	}
	
	var APICtr = {
		JsonAPI:require("./lib/json"),
		BreezeTemplate:require("./lib/BreezeTemplate"),
		FormAPI:require("./lib/FormOper")
	}
	// alert(APICtr.JsonAPI.toJSONString({name:"alec"}));
	/**
	 * @function
	 * @memberOf lang
	 * @name getParameter
	 * @description 从url中获取参数
	 * @param {String}pName 参数名
	 * @returns 参数名对应的参数值
	 */
	_result.getParameter=function(__pName){
		var url = window.location.toString();
		//2014-05-28 罗光瑜修改 某些IE浏览器url地址是不进行中文转换的，这时取参数正则要修改
		//2014年8月13日 16:12:47 程明剑 添加支持type参数
		var execResult = (new RegExp(__pName+"=([^&#]+)|"+__pName+"_([^*&.-]+)")).exec(url);
		if (execResult){
			//2014年1月14日 20:46:56 程明剑 添加URL解密
			//2014年8月13日 16:13:04 程明剑 判断是正常参数还是type参数
			var result = execResult[1] == null ?execResult[2]:execResult[1];
			return decodeURIComponent(result);
		}
		return null;
	};
	
	/**
	 * @function
	 * @memberOf lang
	 * @name save
	 * @desctiption 本地存储,存
	 * @param {String} name 存储名称
	 * @param {Object} data 被存储的对象，如果为null，则是把name删除掉
	 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
	 * @see load
	 * @example
	 * FW.use().save("abc",{a:'hello'});//存储
	 * FW.use().save("abc",null);//删除
	 * 
	 */
	_result.save=function(name,data,isPermanent){
		if(!window.localStorage || !window.sessionStorage ){
			seajs.log("browser not supprt window.loalStorage!");
			return;
		}
		var storage = (isPermanent)?localStorage:sessionStorage;
		if (data){
			storage.setItem(name,APICtr.JsonAPI.toJSONString(data));					
		}else{
			//如果是null，表示删除
			storage.removeItem(name);
		}
	};

	/**
	 * @function
	 * @memberOf lang
	 * @name savecookie
	 * @desctiption cookies,存入cookies信息
	 * @param {String} name 存储名称
	 * @param {Object} data 被存储的对象，如果为null，则是把name删除掉
	 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
	 * @see load
	 * @example
	 * FW.use().savecookie("abc",{a:'hello'});//存储
	 * FW.use().savecookie("abc",null);//删除
	 * 
	 */
	_result.saveCookie=function(name,data,isPermanent){
		var Days = (isPermanent)?300:0;
		if (data == null){
			Days = -1;
		}
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
	};

	/**
	 * @function
	 * @memberOf lang
	 * @name load
	 * @desctiption 本地存储，取
	 * @param {String} name 存储名称
	 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
	 * @return 返回本地存储name对应的值
	 * @see save
	 * @example
	 * FW.use().load("abc");
	 * 
	 */
	_result.load=function(name,isPermanent){
		if(!window.localStorage || !window.sessionStorage ){
			seajs.log("browser not supprt window.loalStorage!");
			return null;
		}
		var storage = (isPermanent)?localStorage:sessionStorage;
		var resultJson = storage.getItem(name);
		return eval("("+resultJson+")");
	};

	/**
	 * @function
	 * @memberOf lang
	 * @name load
	 * @desctiption cookies存储，取
	 * @param {String} name 存储名称
	 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
	 * @return 返回本地存储name对应的值
	 * @see save
	 * @example
	 * FW.use().load("abc");
	 * 
	 */
	_result.loadCookie=function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
	    if(arr=document.cookie.match(reg))
	 
	        return unescape(arr[2]); 
	    else 
	        return null; 
	};
	
	/**
	 * @function
	 * @memberOf lang
	 * @name parserTemplate
	 * @desctiption 模板解析函数
	 * @param {String} src 模板名称
	 * @param {Object} data 用于模板的数据对象
	 * @param {Object} useAPI 在模板中，可用于xx:xx模式的api对象，例如{a:{f:function(){}}}则在模板中使用${a:f()}调用
	 * @return 模板解析后的值
	 */
	_result.parserTemplate = function(__src,__data,_useAPI){
		return APICtr.BreezeTemplate.parserTemplate(__src,__data,_useAPI);
	}

	/**
	 * @function
	 * @memberOf lang
	 * @name evalJSON
	 * @desctiption 将Json转换函数
	 * @param {String} strJson json字符串
	 * @return 返回object,array,string等对象
	 * @example
	 * FW.use().evalJSON("{name:'alec'}");
	 */
	_result.evalJSON = function(strJson){
		return APICtr.JsonAPI.evalJSON(strJson);
	}

	/**
	 * @function
	 * @memberOf lang
	 * @name toJSONString
	 * @desctiption 将javascript数据类型转换为json字符串的方法
	 * @param {object} object 需转换为json字符串的对象, 一般为Json 【支持object,array,string,function,number,boolean,regexp *】
	 * @return 返回json字符串
	 * @example
	 * FW.use().toJSONString({name:'alec'});
	 */
	_result.toJSONString = function(object){
		function deleteNull(object){
			for(var i in object){
				if(object[i]!=null&&typeof(object[i])=="object"){
					deleteNull(object[i]);
				}
				if(object[i]==null){
					object[i] = "";
					delete object[i];
				}
			}
		}
		deleteNull(object);
		return APICtr.JsonAPI.toJSONString(object);
	}
	
	/**
	 * @function
	 * @memberOf lang
	 * @name createForm
	 * @desctiption 使用对象描述符，创建表单
	 * @param {Object}desc 对象描述符 
	 * @param {JqueryContainer}dom 加载生成的表单，挂接到dom节点
	 * @param {Object}data 对象实际的值，可以为空
	 */
	_result.createForm = function(desc,dom,data,callback){
		APICtr.FormAPI.createFormByObjDesc(desc,dom,data,callback);
	}

	/**
	 * @function
	 * @memberOf lang
	 * @name createFormList
	 * @desctiption 使用对象描述符，创建表单列表页
	 * @param {Object}desc 对象描述符 
	 * @param {JqueryContainer}dom 加载生成的表单，挂接到dom节点
	 * @param {Object}data 对象实际的值，可以为空
	 * @param {Object}callback 提供给外联显示类型的执行函数 有两个参数 value,valueRange
	 * @param {int}type 提供列表显示模型 默认值：0 
	 					0用于正常列表，     复选框，  带操作按钮列，  有批量操作区， 有批量删除按钮  无增加按钮； 
 						1用于批量添加列表，  复选框，  无操作按钮列，  有批量操作区， 有批量删除按钮  有增加按钮； 
 						2用于关联列表，     单选框，  无操作按钮列，  无批量操作区， 无批量删除  无增加按钮；

	 */
	_result.createFormList = function(desc,dom,data,callback,type){
		APICtr.FormAPI.createFormListByObjDesc(desc,dom,data,callback,type);
	}

	_result.showPagination = function(dom,dataCount,pageSize,pageNum,reShowList){
		
		//重置分页列表的dom节点
		var strPageBtn = "<div class='dataTables_paginate paging_bootstrap pagination'>";
		strPageBtn += "<ul>";

		//计算总页数
		if(dataCount){
			var pageCount = 1;
		}else{
			var dataCount = pageCount = 0;
		}

		if(dataCount && pageSize && dataCount >= pageSize){

			//计算总页数
			pageCount = Math.ceil(dataCount/pageSize);

			//计算页码
			if(!pageNum) var pageNum = 1;

			//首页 and 上一页
			if(pageNum==1){
				strPageBtn += "<li class='pfirst disabled'><a href='javascript:void(0);'><i class='icon-double-angle-left'>首页</i></a></li>";
				strPageBtn += "<li class='prev disabled'><a href='javascript:void(0);'><i class='icon-angle-left'>上一页</i></a></li>";
			}else{
				strPageBtn += "<li class='pfirst'><a href='javascript:void(0);'><i class='icon-double-angle-left'>首页</i></a></li>";
				strPageBtn += "<li class='prev'><a href='javascript:void(0);'><i class='icon-angle-left'>上一页</i></a></li>";
			}

			//中间数字
			var begNo = pageNum - 3 > 0 ? pageNum - 2 : 1;
			if(pageCount - pageNum < 2){begNo = begNo + pageCount - pageNum - 2 > 0 ? begNo + pageCount - pageNum - 2 : 1;}
			var endNo = begNo + 5 > pageCount ? pageCount + 1 : begNo + 5;
			for(var i=begNo; i<endNo; i++){	
				if(pageNum == i){
					strPageBtn += '<li class="pagenum active"><a href="javascript:void(0);">'+i+'</a></li>\n';
				}else{
					strPageBtn += '<li class="pagenum"><a href="javascript:void(0);">'+i+'</a></li>\n';
				}
			}

			//下一页 and 尾页
			if(pageNum == pageCount){
				strPageBtn += "<li class='next disabled'><a href='javascript:void(0);'><i class='icon-angle-right'>下一页</i></a></li>";
				strPageBtn += "<li class='plast disabled'><a href='javascript:void(0);'><i class='icon-double-angle-right'>最后一页</i></a></li>";
			}else{
				strPageBtn += "<li class='next'><a href='javascript:void(0);'><i class='icon-angle-right'>下一页</i></a></li>";
				strPageBtn += "<li class='plast'><a href='javascript:void(0);'><i class='icon-double-angle-right'>最后一页</i></a></li>";
			}
		}
		//总计信息
		strPageBtn += "<li class='disabled'><a href='javascript:void(0);'>共<b>"+pageCount+"</b>页"+dataCount+"条</a></li>";
		strPageBtn += "</ul>";
		strPageBtn += "</div>";

		//插入到dom中显示出来
		dom.html(strPageBtn);
		
		//获取分页的dom
		$pageFirst = dom.find("li.pfirst").not(".disabled");  //首页 Dom
		$pagePrev = dom.find("li.prev").not(".disabled");     //上页 Dom
		$pageNum = dom.find("li.pagenum").not(".active");     //中间数字 Dom
		$pageNext = dom.find("li.next").not(".disabled");     //下页 Dom
		$pageLast = dom.find("li.plast").not(".disabled");    //尾页 Dom

		//给分页按钮绑定点击事件
		$pageFirst.on("click",function(){
			reShowList && reShowList(1);
		})
		//林浩旋 2013年12月19日 15:23:52  修改了上一页 下一页没有事件问题
		$pagePrev.on("click",function(){
			reShowList && reShowList(parseInt(dom.find("li.pagenum.active").text())-1);
		})
		$pageNum.on("click",function(){
			reShowList && reShowList(parseInt($(this).text()));
		})
		$pageNext.on("click",function(){
			reShowList && reShowList(parseInt(dom.find("li.pagenum.active").text())+1);
		})
		$pageLast.on("click",function(){
			reShowList && reShowList(pageCount);
		})
	}

	/**
	 * @function
	 * @memberOf lang
	 * @name cmsUrl
	 * @desctiption 这个函数用于生成连接的cms的url
	 * @param {Object}_desc 对象描述符 
	 * @param {JqueryContainer}_dom 加载生成的表单，挂接到dom节点
	 */
	_result.cmsUrl = function(__alias,__type){
		return Cfg.baseUrl+"/page/go2page.jsp?alias="+__alias+"&type="+__type;
	}
	 
	/**
	 * @function
	 * @memberOf lang
	 * @name bindFormList
	 * @desctiption 创建表单分页列表页
	 * @param {Object}_desc 对象描述符 
	 * @param {JqueryContainer}_dom 加载生成的表单，挂接到dom节点
	 * @param {String}_serverName 请求列表数据总数的serverName  查询结果获取格式data[0].count
	 * @param {String}_package 请求列表数据总数的package
	 * @param {Object}_param 请求列表数据总数的param 
	 * @param {Number}_pagesize 列表m每页显示多少条数据
	 * @param {function}_bindFormListCB 分页列表显示后的回调函数，用途例如：用于给列表绑定按钮事件
	 * @param {function}_outLinkCB 分页列表显示后的外联回调函数
	 * @param {int}_type 提供列表显示模型 默认值：0 
	 					0用于正常列表，     复选框，  带操作按钮列，  有批量操作区， 有批量删除按钮  无增加按钮； 
 						1用于批量添加列表，  复选框，  无操作按钮列，  有批量操作区， 有批量删除按钮  有增加按钮； 
 						2用于关联列表，     单选框，  无操作按钮列，  无批量操作区，  无批量删除按钮  无增加按钮；
	 */
	_result.bindFormList = function(_desc,_dom,_serverName,_package,_param,_pagesize,_bindFormListCB,_outLinkCB,_type){
		// this.FW.blockUI("<a href=''>alec</a>",0,0,400,400,0);
		var _this = this;

		//增加储存查询关键字的变量
		_this.keyword = _this.keyword || "";

		//重置为查询总数的param
		_param.resultset = "count";
		if(_param.spes.limit) delete _param.spes.limit;
		
		//计算list的数据总数
		_this.FW.doServer(_serverName,_package,_param,function(code,data){
			if(code==0){

				//储存数据总数
				var dataCount = data.cmsdata[0].count || 0;

				//储存总页数
				var pageCount = Math.ceil(dataCount/_pagesize);

				//分页函数
				/*function showPagination(pageNum){
					//更新数字连接
					strPageNum = "";
					
					var begNo = pageNum - 3 > 0 ? pageNum - 2 : 1;
					if(pageCount - pageNum < 2){begNo = begNo + pageCount - pageNum - 2 > 0 ? begNo + pageCount - pageNum - 2 : 1;}
					var endNo = begNo + 5 > pageCount ? pageCount + 1 : begNo + 5;
					for(var i=begNo; i<endNo; i++){	
						if(pageNum == i){
							strPageNum += '<li class="pagenum active"><a href="javascript:void(0);">'+i+'</a></li>\n';
						}else{
							strPageNum += '<li class="pagenum"><a href="javascript:void(0);">'+i+'</a></li>\n';
						}
					}

					//重置分页列表的dom节点
					var strPageBtn = "<div class='dataTables_paginate paging_bootstrap pagination'>";
					strPageBtn += "<ul>";
					if(pageNum!=0){
						//首页 and 上一页
						if(pageNum<=1){
							strPageBtn += "<li class='pfirst disabled'><a href='#'><i class='icon-double-angle-left'></i></a></li>";
							strPageBtn += "<li class='prev disabled'><a href='#'><i class='icon-angle-left'></i></a></li>";
						}else{
							strPageBtn += "<li class='pfirst'><a href='#'><i class='icon-double-angle-left'></i></a></li>";
							strPageBtn += "<li class='prev'><a href='#'><i class='icon-angle-left'></i></a></li>";
						}
						//中间数字
						strPageBtn += strPageNum;

						//下一页 and 尾页
						if(pageNum == pageCount){
							strPageBtn += "<li class='next disabled'><a href='#'><i class='icon-angle-right'></i></a></li>";
							strPageBtn += "<li class='plast disabled'><a href='#'><i class='icon-double-angle-right'></i></a></li>";
						}else{
							strPageBtn += "<li class='next'><a href='#'><i class='icon-angle-right'></i></a></li>";
							strPageBtn += "<li class='plast'><a href='#'><i class='icon-double-angle-right'></i></a></li>";
						}
					}
					//总计信息
					strPageBtn += "<li class='disabled'><a href='#'>共<b>"+pageCount+"</b>页"+dataCount+"条</a></li>";
					strPageBtn += "</ul>";
					strPageBtn += "</div>";

					//插入到dom中显示出来
					_dom.find("#pagination").html(strPageBtn);
					
					//获取分页的dom
					$pageFirst = _dom.find("#pagination li.pfirst").not(".disabled");  //首页 Dom
					$pagePrev = _dom.find("#pagination li.prev").not(".disabled");     //上页 Dom
					$pageNum = _dom.find("#pagination li.pagenum").not(".active");     //中间数字 Dom
					$pageNext = _dom.find("#pagination li.next").not(".disabled");     //下页 Dom
					$pageLast = _dom.find("#pagination li.plast").not(".disabled");    //尾页 Dom

					//给分页按钮绑定点击事件
					$pageFirst.on("click",function(){
						//会话存储sessionStorage
						if(_param.param && _param.param.nodeid){
							_result.save(_param.alias+"_"+_type+"_"+_param.param.nodeid, "1");
						}else{
							_result.save(_param.alias+"_"+_type, "1");
						}
						
						reShowFormList(1);
					})
					$pagePrev.on("click",function(){
						var curPageNum = parseInt(_dom.find("#pagination li.pagenum.active").text());
						//会话存储sessionStorage
						if(_param.param && _param.param.nodeid){
							_result.save(_param.alias+"_"+_type+"_"+_param.param.nodeid, curPageNum-1);
						}else{
							_result.save(_param.alias+"_"+_type, curPageNum-1);
						}
						reShowFormList(curPageNum-1);
					})
					$pageNum.on("click",function(){
						var curPageNum = parseInt($(this).text());
						//会话存储sessionStorage
						if(_param.param && _param.param.nodeid){
							_result.save(_param.alias+"_"+_type+"_"+_param.param.nodeid, curPageNum);
						}else{
							_result.save(_param.alias+"_"+_type, curPageNum);
						}
						reShowFormList(curPageNum);
					})
					$pageNext.on("click",function(){
						var curPageNum = parseInt(_dom.find("#pagination li.pagenum.active").text());
						//会话存储sessionStorage
						if(_param.param && _param.param.nodeid){
							_result.save(_param.alias+"_"+_type+"_"+_param.param.nodeid, curPageNum+1);
						}else{
							_result.save(_param.alias+"_"+_type, curPageNum+1);
						}
						reShowFormList(curPageNum+1);
					})
					$pageLast.on("click",function(){
						//会话存储sessionStorage
						if(_param.param && _param.param.nodeid){
							_result.save(_param.alias+"_"+_type+"_"+_param.param.nodeid, pageCount);
						}else{
							_result.save(_param.alias+"_"+_type, pageCount);
						}
						reShowFormList(pageCount);
					})
				
				}*/

				function showSearchBar(){
					var $serDom = _dom.find("#searchForList");
					var strSerHTML = "";
					strSerHTML+="<div class='input-append'>";
				    strSerHTML+="<input type='text' style='padding:3px 6px; width:180px; height:16px; line-height:16px; border:1px solid #d7d7d7;' placeholder='请输入关键字'>";
				    strSerHTML+="<button class='btn btn-success btn-mini' type='button'><i class='icon-search'></i> 查询</button>";
				    strSerHTML+="</div>";
				    $serDom.html(strSerHTML);

				    //给关键字表单附上查询关键字
				    $serDom.find("input").val(_this.keyword);
				    
				    //查询功能函数逻辑
				    $serDom.find("button").click(function(){
				    	//获取输入的keyword
				    	_this.keyword = $serDom.find("input").val();
				    	// if(!keyword){
				    	// 	alert("请输入查询条件！");
				    	// 	return;
				    	// }

				    	//重组查询条件param

				    	//增加后台查询“或”和“与”逻辑的判断指针参数
				    	_param.method = "query";

				    	//从_desc中获取需要查询匹配的参数 放入到param的查询条件
				    	_param.param = _param.param || {};
				    	// _param.param = {};  //临时处理，只查询or的条件，不能指定栏目id

						for(var v_serprop in _desc){
							if(_desc[v_serprop].issearch == "1"){
								_param['param'][v_serprop] = "%"+_this.keyword+"%";
							}
						}
						
				    	//重新showContentList
				    	_result.bindFormList(_desc,_dom,_serverName,_package,_param,_pagesize,_bindFormListCB,_outLinkCB,_type);

				    })
				}

				//显示列表函数
				function reShowFormList(pageNum){

					//将_param参数修改为获取最新newData数据的param
					_param.resultset = 'list';
					_param.spes = _param.spes || {};
					_param.spes.limit = {
						start: _pagesize*(pageNum-1)+"",
						length: _pagesize+""
					};

					_this.FW.doServer(_serverName,_package,_param,function(code,data){

						var newData = null;
						if(code == 0){							
							if(data.cmsdata && data.cmsdata.length){
								
								//转换data中数组字符串的情况为数组
								for(var v_prop in _desc){
									if($.inArray(_desc[v_prop].type, ['List','Pics']) != -1){
										for(var i=0;i<data.cmsdata.length;i++){
											if(!data.cmsdata[i][v_prop]) continue;
											data.cmsdata[i][v_prop] = APICtr.JsonAPI.evalJSON(data.cmsdata[i][v_prop]);
										}
									}
								}
								newData = data.cmsdata;
							}

							//重新显示列表数据
							APICtr.FormAPI.createFormListByObjDesc(_desc,_dom,newData,_outLinkCB,_type);

							//绑定分页
							showPagination(pageNum);
								
							//增加查询功能框
							showSearchBar();

							//回调函数
							_bindFormListCB(newData);

						}else{
							alert(_this.alias+"列表内容请求报错！");
						}
					})
				}

				//如果pageCount等于0,则显示空列表
				if(pageCount){
					if(_param.param && _param.param.nodeid){
						if(_result.load(_param.alias+"_"+_type+"_"+_param.param.nodeid) && pageCount >= parseInt(_result.load(_param.alias+"_"+_type+"_"+_param.param.nodeid))){
							reShowFormList(parseInt(_result.load(_param.alias+"_"+_type+"_"+_param.param.nodeid)));
						}else{
							//默认显示第一页
							reShowFormList(1);
						}
					}else{
						if(_result.load(_param.alias+"_"+_type) && pageCount >= parseInt(_result.load(_param.alias+"_"+_type))){
							reShowFormList(parseInt(_result.load(_param.alias+"_"+_type)));
						}else{
							//默认显示第一页
							reShowFormList(1);
						}
					}
					
				}else{
					APICtr.FormAPI.createFormListByObjDesc(_desc,_dom,null,_outLinkCB,_type);
					//回调函数
					_bindFormListCB();
					//绑定分页
					showPagination(0);
					//增加查询功能框
					showSearchBar();
				}
				
			}else{
				alert("对不起，您没有操作权限！");
			}
		})
	}
	
	/**
	 * @function
	 * @memberOf lang
	 * @name lang
	 * @desctiption 使用语言信息格式化要显示的内容，如果要显示的内容对象包含了多语信息，则显示成多语言，否则直接显示成字符串
	 * @param {String}_displayObj 对象描述符 
	 */
	_result.lang = function(__displayObj){
		try{
			var langObj = eval("("+__displayObj+")");
			var lang = Cfg.lang;
			if (_SYS_PageLang){
				lang = _SYS_PageLang;
			}
			if (langObj[lang]){
				return langObj[lang];
			}
			return __displayObj;
		}catch(e){
			return __displayObj;
		}
	},
	/**
	*深度拷贝，这个方法用于深度的拷贝一个对象
	*@param __srcObj 原始的对象
	*@param __destObj 拷贝到的目标对象
	*@param __filterFun 只是一个拷贝过程中回调的过滤函数，回调的输入参数有如下：
	*                  srcMemberName当前要拷贝的成员名,path 路径名,srcObj上一级父亲名，destObj上一级父亲名
	*                  返回值true这个成员继续拷贝，否则不拷贝了
	*/
	_result.deepCopy = function(__srcObj, __destObj, __filterFun,_allPath) {
		if (_allPath == null){
			_allPath = "";
		}
		for (var name in __srcObj) {
			if (!__srcObj.hasOwnProperty(name)) {
				continue;
			}
			
			//先用传入的filter进行过滤
			var allPath = "";
			if (_allPath != ""){
				allPath = _allPath + "." + name;
			}else{
				allPath = _allPath + name;
			}
			if (__filterFun && !__filterFun(name,allPath,__srcObj,__destObj)){
				continue;
			}
			var oo = __srcObj[name];
			//2013-12-06 罗光瑜修改 如果是null那么直接跳过这个成员
			if (oo == null){
				continue;
			}
			if (/function/i.test(typeof(oo))) {
				//2013-11-15日lgy修改，函数也要进行覆盖性判断，如果目标子类存在就不用父类的方法
				if (__destObj[name] == null){
					__destObj[name] = oo;
				}
				continue;
			}
			if (/Object/i.test(typeof(oo))) {
				if (__destObj[name] == null) {
					//lgy 2013-12-06 如果目标不存在，因为这里是对象类型，所以不能直接赋值，否则不是深度拷贝
					//判断数组类型
					if (oo instanceof Array){
						__destObj[name] = [];
					}else{
						__destObj[name] = {};
					}
				}
				//递归调用对对象
				
				_result.deepCopy(oo, __destObj[name], __filterFun,allPath);
				continue;
			}
			//lgy 2013-11-13 子类如果存在对应的值就不能用父类覆盖。这里oo是父类的值
			if (__destObj[name] == null){
				__destObj[name] = oo;
			}					
		}
	}

	return _result;
});