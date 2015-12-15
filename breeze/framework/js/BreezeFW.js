/** 
* @fileOverview 核心的框架类 
* @author <a href="http://www.wgfly.com">Logan</a> 
* version 0.02 罗光瑜增加了public机制
* version 0.03 罗光瑜 FW增对外增加了对应的getAPP方法，增加了APP可嵌套的能力，另外，将container取消。
* version 0.04 罗光瑜 doServer支持同步请求 消息回调支持如果没有消息，仍然回调结果,事件的修改。总之支持了新后台架构
* version 0.05 罗光瑜 支持在gadget里面直接声明view
* version 0.06 罗光瑜 seajs的版本更新后，发现seajs.log不能调用了，要重新修改去掉这些日志信息
* version 0.07 罗光瑜 调整app的顺序，让所有app加载后再调用oncreate。增加创建和获取page的功能
* version 0.08 罗光瑜 每个APP增加成员gadgetName返回该APP所对应的gadget名称
* version 0.09 罗光瑜 解决针对IE onxxx事件时取其html的时候，会将后面的“”去掉的问题
* @version 0.10 罗光瑜 为了模拟测试，增加APP中this.API的函数可以外部手工设置
* @version 0.11 罗光瑜 append方法当有target参数的时候不能用
* @version 0.12 罗光瑜 这个方法默认上给一个window的全局变量FW，不用外围设置
* @version 0.14 罗光瑜 use函数前置，保证能在循环的requeire中能把这个函数先提供出去
* @version 0.14 罗光瑜 _useAPI必须放到use函数前
* @version 0.15 罗光瑜 _useAPI.lang = require("./tools/Lang")忘记加分号了
* @version 0.16 罗光瑜 show方法如果viewID找不到的话，可以继续用viewID本身做模板继续处理
* @version 0.17 罗光瑜 增加hideAPP的功能
* @version 0.18 罗光瑜 onCreate没有doServer的时候，在go方法中_doPost是空
* @version 0.19 罗光瑜 静态化（一）绑定标签时，采用属性serializeGadget则直接加载忽略后续内容
* @version 0.20 罗光瑜 优化show函数的模板方法对象，模板内可以调用gadget内地方法
* @version 0.21 罗光瑜 静态化（二）进行序列化方法绑定serialize
* @version 0.22 罗光瑜 静态化（三）go函数方法要放置一个调用父亲的staticize方法
* @version 0.23 罗光瑜 createApp和getApp兼容两种大小写的方式
* @version 0.24 罗光瑜 2014-08-06 罗光瑜修改支持外部app的事件调用，即用FireEvent('应用id').事件
* @version 0.25 罗光瑜 改造show方法1，show方法一定返回show的字符串，2，如果输入的target是'-1'则不显示
* @version 0.26 罗光瑜 加入静态化的方法判断写错了，2014-08-14
* @version 0.27 罗光瑜 对图片标签的处理，增加图片的特殊属性bzImg，在show的时候将这个属性值改成src
* @version 0.28 罗光瑜 支持父类方法，super的使用，由于super是ie 8的关键字，所以这里改用father，2014-08-14
* @version 0.29 罗光瑜 2014-09-03 支持外部动态加载gadget级别的资源，在创建app的时候，gadget动态改变其初始的view信息
* @version 0.30 罗光瑜 2014-10-10 支持father方法支持onCreate的调用
* @version 0.31 罗光瑜 2014-11-29 FW支持alert功能和confirm功能，同时便于外部重写
* @version 0.32 罗光瑜 2014-12-19 参数param为空的时候要赋值一个空对象
* @version 0.34 罗光瑜 2014-12-22 修复callback的bug
* @version 0.35 罗光瑜 2015-01-05 避免重复使用go函数。如果重复使用go函数则进行告警，同时增加FW.log函数
* @version 0.36 罗光瑜2015-01-27 支持外部resource能够被多次创建，后米安定覆盖前面的部分字段。create
* @version 0.37 罗光瑜2015-01-28 罗光瑜修改，因为log函数后面少一个分号，导致加载错误
* @version 0.38 罗光瑜2015-01-28 罗光瑜修改，注册资源要支持两层的拷贝
* @version 0.39 罗光瑜2015-02-14 罗光瑜修改，在API中支持返回对应app便于重写方法后，能够重写app的this指针
* @version 0.40 罗光瑜2015-02-29 修改，修改father方法，原来father通过上级this指针去只想father的father是不对的
* @version 0.41 罗光瑜2015-05-01 修改对crteateapp的函数，创建完app要自动调用其onCreate方法
* @version 0.42 罗光瑜2015-05-03 createapp的时候，被创建的appid不对
* @version 0.43 罗光瑜2015-05-05 createapp方法的前置判断写错了
* @version 0.44 罗光瑜2015-06-22 解决ie下console不存在会报错的问题
* @version 0.45 罗光瑜2015-07-21 页面下如果有一个函数是relationx = xx会被当作onxx事件函数处理
* @version 0.46 罗光瑜2015-07-22 this.API对象，增加保存app对象
* @version 0.47 罗光瑜2015-07-25 this.API.show方法，在target不存在的时候就直接退出
* @version 0.48 罗光瑜2015-07-27 修改mask的高度的可用性
* @version 0.49 罗光瑜2015-09-02 增加返回gadget
* @version 0.50 罗光瑜2015-09-20 father函数中，寻找father的循环写的有问题，被修复
* @version 0.51 2015-10-19罗光瑜修改 注册gadget的时候增加module参数使得gadget能带上_uri属性
* @version 0.52 2015-11-05 罗光瑜修改，把doServer首次访问
*/ 

/**
* @namespace
* @author Logan 
* @name FW 
* @description  breeze的基本控制对象，这个对象通常取名为FW 
*/ 
define(function(require, exports, module) {
	var _win = window;
	var _doc = _win.document;
	var _obj = _win.FW = module.exports = {};
	var _gadget = {};
	var _app = {};
	var _container = {};
	var _allPost = _createPost();
	var _doserverUrl = null;
	var _APPAPI = {};//2014-03-04 罗光瑜修改 增加外部的API，就是说所有gadget的API可以外部定制 
	// 2014-09-03 声明一个gadget资源的成员
	var _gadgetResource = null;
	_obj.regResource = function(res){
		//2015-01-27 罗光瑜修改，支持后面的注册内容覆盖前面的注册内容
		if (res == null){
			return ;
		}
		
		if (_gadgetResource == null){
			_gadgetResource = res;
		}
		else{
			//拷贝覆盖资源
			//2015-01-28罗光瑜修改 要支持两层拷贝
			for (var n in res){				
				var src=res[n]
				var dest = _gadgetResource[n];
				if (dest == null){
					_gadgetResource[n] = src;
				}else{
					for (var nn in src){
						dest[nn] = src[nn];
					}
				}
			}
		}
	};
    /*
	 * 2013-04-29新加入的use机制
	 * 这里面放置的是默认的API信息
	 */
	var _useAPI = {
		
	};
	/**
	*@function
	*@name use
	*@memberOf FW
	*@description 对外部能力扩展调用，有两种模式，注册模式，即把外部扩展注册进来，使用模式，即使用该类。注册模式通常给开发扩展功能程序员使用
	*@param {String|Object} p 如果是String类型，就是使用模式，即引入该域功能；如果是一个对象就是注册模式，将该域功能注册进来，参数为空默认为使用模式，使用默认的功能，即lang功能域
	*@example 
	*使用模式：
	*require("tools/DataTime")(FW);
	*FW.use("DateTime").format();
	*/
	_obj.use = function (__p){
		if (__p == null){
			//这种情况就是用默认的域
			_useAPI.lang.FW = _obj;
			return _useAPI.lang;
		}
		if (/string/i.test(typeof(__p))){
			//说明是调用方式，返回这个域对应的对象
			_useAPI[__p].FW = _obj;
			return _useAPI[__p];
		}
		//说明是声明方式，设置这个域
		if (__p ){
			if (__p.getDomain){
				_useAPI[__p.getDomain()] = __p;
			}else{
				_useAPI.temp = __p;
			}
		}
	};

	_useAPI.lang = require("./tools/Lang");//这是默认的

	//2015-01-05 罗光瑜新曾自定义的日志信息
	//2015-01-28罗光瑜函数后面增加;
	_obj.log = function(str){
		//015-06-22 解决ie下报错的问题
		try{
			if (console){
				console.log(str);
			}
		}catch(e){
			
		}
		
	};
	
	//加载jquery.blockUI 源码并执行
	(require("./jquery.blockUI"))();

	//post对象
	function _createPost(){
		var _postData = [];
		return {
			addPost:function(__oneData){
				_postData.push(__oneData);
			},
			clear:function(){
				_postData=[];
			},
			doPost:function(__finishedCallback,__this){
				if (_postData == null || _postData.length == 0){
					//2013-12-23罗光瑜增加 如果消息长度为0 则仍然要回调
					__finishedCallback && __finishedCallback();
					return;
				}
				var pObj = {};
				for (var i =0;i<_postData.length;i++){
					//保留回调函数以及序号
					pObj[i] = _postData[i].callBack;
					pObj[i].thisObj = _postData[i].callbackThisObj;
					delete _postData[i].callbackThisObj;
					delete _postData[i].callBack;
				}
				var dataStr = _useAPI.lang.toJSONString(_postData);
				//2013-09-14修改
				//从url中获取参数，是否存在threadSignal,如果存在了，则将改标识发到服务端，并启动服务端的日志跟踪系统
				var myurl = window.location.toString();
				var threadSignal = null;
				var execResult = (new RegExp("threadSignal=([\\w%\\.]+)")).exec(myurl);
				if (execResult){
					threadSignal = execResult[1];
				}
				var postUrl = _doserverUrl;
				if (threadSignal){
					postUrl = _doserverUrl + "?threadSignal="+threadSignal;
				}
				
				$.post(postUrl,{data:dataStr},
				function(__returndata){
					for (var key in __returndata){
						if (!__returndata.hasOwnProperty(key)){
							continue;
						}
						pObj[key] && pObj[key].apply(pObj[key].thisObj,[__returndata[key].code,__returndata[key].data]);
					}
//					for(var i=0;i<__returndata.length;i++){
//						var sName = __returndata[i].name;
//						pObj[sName] && pObj[sName].callBack(__returndata[i].code,__returndata[i].data);
//					}
					//最后所有都结束了，统一给一个通知
					__finishedCallback && __finishedCallback.apply(__this||this,[]);
				},
				"json");
			}
		};
	}
	//为每个app创建一个工具类
	function _createFWTools(__app){
		var _$app = __app;
		//这个函数专门用于API批量提交post请求时用的临时变量
		var tmpPostObj  = null;
		/**
		* @namespace
		* @author Logan 
		* @name API 
		* @description  在FW中为每个gadget创建的内部公用函数，调用时使用this.API.xxx即可
		* 2015-07-22 this.API对象，增加保存app对象
		*/
		
		var result = {
			app:_$app
		};

		var showAPIObj = {};
		for (var n in _useAPI){
			showAPIObj[n] = _useAPI[n];
		}
		//使用方法${p:("f",adfd,sdfsdf)}
		showAPIObj.p = function(n,a,b,c,d,f,g,h){
			if (_$app[n]){
				return _$app[n](a,b,c,d,f,g,h);
			}
			if (_$app.private[n]){
				return _$app.API.private(n,a,b,c,d,f,g,h);
			}
		}
		
		/**
		*@function
		*@name getApp
		*@memberOf API
		*@description 返回本APP对象，便于重载doServer等函数,2015-02-14 罗光瑜增加
		*@example 
		*this.API.show("view1",data);
		*/	
		showAPIObj.getApp = function(){
			return _$app;
		}
		
		/**
		*@function
		*@name show
		*@memberOf API
		*@description 显示视图，即在本APP中显示一个指定的视图，视图即在html中，声明于app下的任何顶级带id的标签,建议这些标签id为view_前缀
		*@param {String} viewId 要显示的视图名称，某个顶级的标签的id
		*@param {Object} data 视图中使用的解析数据，在视图中将使用data引用这个对象
		*@param {String} target 视图显示的目标selector（jquery的selector），视图默认（即不填写该参数）将会把视图显示到app中，如果不是要覆盖当前视图，而是把这个视图显示到当前视图下都某个标签下，
		*则填写该标签的selector或者selector的字符串，或者对应的ID名称。
		*支持外显示，即显示到__target_appid对应的外部标签中
		*@example 
		*this.API.show("view1",data);
		*/		
		result.show = _APPAPI.show || function(__viewId,__data,__target){
			var tmpDom = $("#"+_$app.id);
			if (tmpDom.length != 0){
				_$app.dom = $("#"+_$app.id);
			}
			var target = _$app.dom;
			target&&target.show();
			if (__target &&  __target!='_'){
				target = _$app.dom.find(__target);
				if (!target || target.length == 0){
					target = _$app.dom.find("#"+__target);
				} 
				if (!target || target.length == 0){
					target = $("#"+__target+"_"+_$app.id);
				}
				if (!target || target.length == 0){
					target = _$app.dom;
					//2015-07-25如果还是没找到，就当成"_"处理
					__target='_';
				}
			}
			//201406-21日罗光瑜修改，如果找不到，那么把_viewId作为src继续查找
			var src = _$app.view[__viewId] || __viewId;
			if (src == null){
				target.html("");
				return;
			}
			//针对火狐把href中的${进行转移到处理
			src = src.replace(/(href=["'])([^"']+)(["'])/ig,
					function(all,a,b,c){
						return a+b.replace(/\$%7B/ig,function(a){return "${"}).replace(/%7D/ig,"}")+c;
					});
			var htmlStr = _useAPI.lang.parserTemplate(src,__data,showAPIObj);
			//进行事件替换
			htmlStr = htmlStr.replace(/([";]?)\s*FireEvent\.(\w+)\(([^\)]*)\)\s*([;"]?)/ig,function(a,b,c,d,e){
				var result = b+"var args=[" + d + "];";
				result += ("var app = FW.getAPP('" + _$app.id + "');");
				result += ("app.FireEvent." + c + ".apply(app,args)" + e);
				return result;
			});
			//2014-08-21 罗光瑜修改，img增加bzImg属性，使得该图片在show的时候，用这个属性替代原来的src属性
			htmlStr = htmlStr.replace(/(<img\s+[^>]*src=['"])([^'"]+)(['"][^>]+bzSrc=['"])([^'"]+)(['"][^>]*>)/ig,function(all,a,b,c,d,e,f){
				return a+d+c+d+e;
			});
			//2014-08-07 罗光瑜修改，show方法如果是target是_那么不会被输出
			if (__target != "_"){
				target.html(htmlStr);
				target.show();	
			}
			//2014-08-07 罗光瑜修改，show方法一定有输出
			return htmlStr;
		};
		
		/**
		*@function
		*@name hideApp
		*@memberOf API
		*@description 隐藏APP信息
		*则填写该标签的selector或者selector的字符串，或者对应的ID名称。
		*支持外显示，即显示到__target_appid对应的外部标签中
		*/
		result.hideApp = _APPAPI.hideApp || function(){
			var tmpDom = $("#"+_$app.id);
			tmpDom.hide();
		};
		
		/**
		*@function
		*@name append
		*@memberOf API
		*@description 显示追加append的方式，追加视图，即在本APP中显示一个指定的视图，视图即在html中，声明于app下的任何顶级带id的标签,建议这些标签id为view_前缀
		注意：追加的视图是不带标识视图自身的节点的。
		*@param {String} viewId 要显示的视图名称，某个顶级的标签的id
		*@param {Object} data 视图中使用的解析数据，在视图中将使用data引用这个对象
		*@param {String} target 视图显示的目标selector（jquery的selector），视图默认（即不填写该参数）将会把视图显示到app中，如果不是要覆盖当前视图，而是把这个视图显示到当前视图下都某个标签下，则填写该标签的selector
		*@example 
		*this.API.append("view1",data);
		*/
		result.append = _APPAPI.append || function(__viewId,__data,__target){
			var tmpDom = $("#"+_$app.id);
			if (tmpDom.length != 0){
				_$app.dom = $("#"+_$app.id);
			}
			var target = _$app.dom;
			if (__target ){
				target = _$app.dom.find(__target);
				if (!target || target.length == 0){
					target = _$app.dom.find("#"+__target);
				} 
				if (!target || target.length == 0){
					target = $("#"+__target+"_"+_$app.id);
				}
				if (!target || target.length == 0){
					target = _$app.dom;
				}
			}
			var src = _$app.view[__viewId];
			if (src == null){
				target.html(__viewId);
				return;
			}
			//针对火狐把href中的${进行转移到处理
			src = src.replace(/(href=["'])([^"']+)(["'])/ig,
					function(all,a,b,c){
						return a+b.replace(/\$%7B/ig,function(a){return "${"}).replace(/%7D/ig,"}")+c;
					});
			var htmlStr = _useAPI.lang.parserTemplate(src,__data,showAPIObj);
			//进行事件替换
			htmlStr = htmlStr.replace(/([";]?)\s*FireEvent\.(\w+)\(([^\)]*)\)\s*([;"]?)/ig,function(a,b,c,d,e){
				var result = b+"var args=[" + d + "];";
				result += ("var app = FW.getAPP('" + _$app.id + "');");
				result += ("app.FireEvent." + c + ".apply(app,args)" + e);
				return result;
			});
			//2014-08-21 罗光瑜修改，img增加bzImg属性，使得该图片在show的时候，用这个属性替代原来的src属性
			htmlStr = htmlStr.replace(/(<img\s+[^>]*src=['"])([^'"]+)(['"][^>]+bzSrc=['"])([^'"]+)(['"][^>]*>)/ig,function(all,a,b,c,d,e,f){
				return a+d+c+d+e;
			});
			target.append(htmlStr);
			target.show();
		};
		/**
		*@function
		*@name private
		*@memberOf API
		*@description 调用在private中声明的函数
		*@param {String} eventName 事件名称，和注册函数中的private下面的函数名相对应
		*@param [p1,p2,...] 后面可以一次增加对应的参数，与注册的TrigerEvent下的函数的声明参数相对应
		*@example 
		*this.API.private('hello', 1,2,3);
		*那么，在gadget中，凡是声明为hello的函数将被触发：
		*private:{
		*  hello:function(a,b,c){
		*     //a is 1,b is 2,c is 3
		*  }
		*}
		*/
		result.private = _APPAPI.private || function(evnName){
			var args = [];
			for (var i=1;i<arguments.length;i++){
				args.push(arguments[i]);
			}
			var app = this.reApp || _$app;
			if (app.private && app.private[evnName]) {
				return app.private[evnName].apply(app,args);
			}
		};
		/**
		*@function
		*@name trigerMyEvent
		*@memberOf API
		*@description 事件的触发器，使用该触发器，只触发自己这个APP中的TrigerEvent事件,不会触发别的gadet的事件
		*注意：本类中的TrigerEvent只能在通过这种方式调用，否则Triger中的this指针获取不到
		*@param {String} eventName 事件名称，和注册函数中的TrigerEvent下面的函数名相对应
		*@param [p1,p2,...] 后面可以一次增加对应的参数，与注册的TrigerEvent下的函数的声明参数相对应
		*@example 
		*this.API.trigerEvent('hello', 1,2,3);
		*那么，在gadget中，凡是声明为hello的函数将被触发：
		*TrigerEvent:{
		*  hello:function(a,b,c){
		*     //a is 1,b is 2,c is 3
		*  }
		*}
		*/
		result.trigerMyEvent = _APPAPI.trigerMyEvent || function(evnName){
			var args = [];
			for (var i=1;i<arguments.length;i++){
				args.push(arguments[i]);
			}
			var app = this.reApp || _$app;
			app.TrigerEvent && app.TrigerEvent[evnName] && app.TrigerEvent[evnName].apply(app,args);	
		};
		/**
		*@function
		*@name trigerOtherEvent
		*@memberOf API
		*@description 事件的触发器，使用该触发器，只触发非自己APP中的TrigerEvent事件,不会触发别的gadet的事件
		*注意：本类中的TrigerEvent只能在通过这种方式调用，否则Triger中的this指针获取不到
		*@param {String} eventName 事件名称，和注册函数中的TrigerEvent下面的函数名相对应
		*@param [p1,p2,...] 后面可以一次增加对应的参数，与注册的TrigerEvent下的函数的声明参数相对应
		*@example 
		*this.API.trigerEvent('hello', 1,2,3);
		*那么，在其他gadget中，凡是声明为hello的函数将被触发：
		*TrigerEvent:{
		*  hello:function(a,b,c){
		*     //a is 1,b is 2,c is 3
		*  }
		*}
		*/
		result.trigerOtherEvent = _APPAPI.trigerOtherEvent || function(evnName){
			var args = [];
			for (var i=1;i<arguments.length;i++){
				args.push(arguments[i]);
			}
			$(function(){
				for (var name in _app){
					if (!_app.hasOwnProperty(name)){
						continue;
					}
					var app = _app[name];
					if (app == _$app){
						continue;
					}
					app.TrigerEvent && app.TrigerEvent[evnName] && app.TrigerEvent[evnName].apply(app,args);
				}
			});
		};
		/**
		*@function
		*@name find
		*@memberOf API
		*@description 在本APP内，查找某个表单，使用的是jquery，返回的是container
		*@param {String} selector 要查找的jquery selector
		*@return {Container} 返回对应jquery查找的container
		*@example 
		*this.API.find("#abc");
		*/
		result.find = _APPAPI.find ||  function(__selector){
			var tmpDom = $("#"+_$app.id);
			if (tmpDom.length != 0){
				_$app.dom = $("#"+_$app.id);
			}
			return _$app.dom.find(__selector);
		};
		/**
		*@function
		*@name doServer
		*@memberOf API
		*@description 向服务器发起一个post的异步请求，如果__callback是null则是同步请求
		*@param {String} serverName 服务名
		*@param {String} package 所处包包名
		*@param {Object} param 要传递的参数对象
		*@param {Function} callback 异步请求结束后的回调函数，注意该函数的this已经 被重写，指向app，即gadget中服务函数的this
		*@example 
		*this.API.doServer("getCms","cms",{nodeId:'-1'},
		*function(code,data){
		*	this.API.show("abc",data);
		*});
		*/
		result.doServer = _APPAPI.doServer || function(__serverName,__package,__data,__callback){
			//2013-12-23罗光瑜修改，如果传入的__callback是null则是同步请求
			return _obj.doServer(__serverName,__package,__data,__callback,_$app);
		};
		
		/**
		*@function
		*@name initPost
		*@memberOf API
		*@description 准备一个批量post请求对象
		*/
		result.initPost = _APPAPI.initPost || function(){
			tmpPostObj = _createPost();
		};

		
		/**
		*@function
		*@name addPost
		*@memberOf API
		*@description 再initPost完成初始化后，添加一个服务请求，但是他不会立即发送，而是要等到doPost后才会批量触发
		*@param {String} serverName 服务名
		*@param {String} package 所处包包名
		*@param {Object} param 要传递的参数对象
		*@param {Function} callback 异步请求结束后的回调函数，注意该函数的this已经 被重写，指向app，即gadget中服务函数的this
		*@example 
		*this.API.initPost();
		*this.API.addPost("getCms","cms",{nodeId:'-1'},
		*function(code,data){
		*	this.API.show("abc",data);
		*});
		*this.API.doPost();
		*/
		result.addPost = _APPAPI.addPost || function(__serverName,__package,__data,__callback){
			if (tmpPostObj == null){
				alert('tmpPostObj is null please initPost first!');
				return;
			}
			var callbackThisObj = _$app;
			var postData = {
				name:__serverName,
				package:__package,
				param:__data,
				callBack:__callback,
				callbackThisObj:callbackThisObj
			}
			tmpPostObj.addPost(postData);
		};
		/**
		*@function
		*@name doPost
		*@memberOf API
		*@description 准当addPost结束后，真正触发发起请求
		*@param {function} __callBack 所有函数回调并执行完毕后的一个统一的回调函数
		*/
		result.doPost = _APPAPI.doPost || function(__callBack){
			if (tmpPostObj == null){
				alert('tmpPostObj is null please initPost first!');
				return;
			}
			tmpPostObj.doPost(__callBack,_$app);
			tmpPostObj = null;
		};
		/**
		*@function
		*@name mask
		*@memberOf API
		*@description 使用遮罩弹出一个模式对话框
		*@param {String} viewId 要显示的viewid
		*@param {Object} view中使用data变量引用这个对象
		*@param {int} width 可选参数，弹出的框的宽度，如果不存在，使用view中maskwidth定义宽度
		*@param {int} height 可选参数，弹出的框的高度，如果不存在，使用view中maskheight定义高度
		*@example 
		*this.API.mask("abc",data);
		*/
		result.mask = _APPAPI.mask || function(__viewId,__data,__width,__height){
			var src = _$app.view[__viewId];
			if (src == null){
				alert("view id " + __viewId + " not found!");
				return;
			}				
			var htmlStr = _useAPI.lang.parserTemplate(src,__data,_useAPI);
			//进行事件替换
			htmlStr = htmlStr.replace(/([";]?)\s*FireEvent\.(\w+)\(([^\)]*)\)\s*([;"]?)/ig,function(a,b,c,d,e){
				var result = b+"var args=[" + d + "];";
				result += ("var app = FW.getAPP('" + _$app.id + "');");
				result += ("app.FireEvent." + c + ".apply(app,args)" + e);
				return result;
			});
			var width = __width;
			var height = __height;
			if (width == null){
				var tmpExec = /maskwidth\s*=\s*['"]?(\d+)["']?/ig.exec(htmlStr);
				width = tmpExec && tmpExec[1];
				
				tmpExec = /maskheight\s*=\s*['"]?(\d+)["']?/ig.exec(htmlStr);
				height = tmpExec && tmpExec[1];
			}
			//2015-07-27日修复窗口高度计算问题
			var wHeight = window.screen.height;
			//取较小的那个
			wHeight = (wHeight > $(window).height())?$(window).height():wHeight;
			_obj.blockUI (htmlStr,($(window).width() - width) / 2,(wHeight - height) / 2,width,height,'none');
		};
		/**
		*@function
		*@name unmask
		*@memberOf API
		*@description 关闭模式对话框
		*@example 
		*this.API.unmask("abc",data);
		*/
		result.unmask = _APPAPI.unmask || function(){
			_obj.unblockUI();
		};
		
		/**
		*2013-12-19日罗光瑜添加  给一个获取本APP绑定节点
		*@function
		*@name getAppDom
		*@memberOf API
		*@description 获取本APP绑定节点的dom的jquery的包装器。app本身也有dom属性，但不推荐使用，因为当app的节点被移动或复制，则原来的属性会无效
		*/
		result.getAppDom = _APPAPI.getAppDom || function(){
			var tmpDom = $("#"+_$app.id);
			if (tmpDom.length != 0){
				_$app.dom = $("#"+_$app.id);
			}
			return _$app.dom;
		};
		
		/**
		*@function
		*@name father
		*@memberOf API
		*@description 2014-08-31 罗光瑜增加支持super的机制。客户端通过this.father("函数名",c,c,d)的方式，调用父类的方法
		*         注意，多重继承，这里不能在onCreate里面调用，这次懒得写了，onCreate调用要支持的话，就在本函数中
		*          扩展强制判断后调用即可，其他地方不用修改。
		*@param {String} fatherAPI 父亲的函数名，有几种选项：
		*        functionName这种情况，优先调用公有，私有，triger再到fireevent,如果是多重集成，那么默认选一个gadget
		*        preType.functionName 其中preType为public,private,fireEvent,TriggerEvent等，如果是多重集成，那么默认选一个gadget
		*        gadget.preType.functionName 这里就是即便是多重继承，也是调用其中的对应gadget的指定方法。
		*@param [p1,p2,...] 后面可以一次增加对应的参数，与注册的TrigerEvent下的函数的声明参数相对应
		*@example 
		*this.API.father('hello', 1,2,3);
		*那么，在gadget中，父类的hello将被触发：
		*因为是多继承，所以当当父类有多个hello的时候，可以用this.API.father('gadgetA.hello', 1,2,3);
		*的方式进行调用，如果没有前缀，而有多个继承，那么使用第一个定义的gadget结果
		*/
		result.father = _APPAPI.father || function(fatherAPI){
			var callerFun = _obj.getCaller();
			var args = [];
			for (var i=1;i<arguments.length;i++){
				args.push(arguments[i]);
			}
			//2015-02-29 罗光瑜改写，原来通过this指针递进寻找father是有问题的，因为在father层再调用普通函数，这个时候普通函数层级也被带入到father级别中
			//新的做法是将函数归属级别写入到函数本身，依据这个函数本身的归属级别找上一级函数。原来的reApp是传递当前函数的，现在完全没有用了
			var app = {
			};
			//下面寻找father
			var funOwner = callerFun.funowner;
			
			//说明是空的，就是本身自己，father找原先app的father就可以
			app._father = _$app._father;
			
			//funOwner是按照一个一个继承关系的反向数组，一定是单列的，而且如果是最终节点则为空
			//这个链条参见_getAfterExtendGadget函数实现
			//这里要考虑从集成关系的非底层调用开始的情况，这个时候，寻找father.father会为空
			if (funOwner != null){				
				for(var i=funOwner.length-1;i>=0;i--){
					//如果调用者不是从father链条的顶部往下走，那么就是从中间往下走，注意顺序一定是对的，这个时候只要跳过开始部分就可以
					if (!app._father._father || !app._father._father[funOwner[i]]){
						continue;
					}
					app._father = app._father._father[funOwner[i]];
				}
			}
			
			//下面调用父类的方法论
			var fatherObj = app._father;
			var invokArr = fatherAPI.split(".");
			var invoteFun = null;
			var gadgetName = null;
			
			if (invokArr.length == 1){
				invoteFun = fatherObj["public."+invokArr[0]];
				if (!invoteFun){
					invoteFun = fatherObj["private."+invokArr[0]];
				}
				if (!invoteFun){
					invoteFun = fatherObj["TrigerEvent."+invokArr[0]];
				}
				if (!invoteFun){
					invoteFun = fatherObj["FireEvent."+invokArr[0]];
				}
				if (!invoteFun && invokArr[0] == "onCreate"){
					invoteFun = fatherObj[invokArr[0]];
				}
				if (!invoteFun){
					return null;//最后还是没找到函数，不调用了
				}
				for (n in invoteFun){
					//默认就用第一个
					invoteFun = invoteFun[n];
					gadgetName = n;
					break;
				}
			}
			else if (invokArr.length == 2 && invokArr[1] != "onCreate"){
				invoteFun = fatherObj[invokArr[0]+'.'+invokArr[1]];
				if (!invoteFun){
					return null;//最后还是没找到函数，不调用了
				}
				for (n in invoteFun){
					//默认就用第一个
					invoteFun = invoteFun[n];
					gadgetName = n;
					break;
				}
			}
			else if (invokArr.length == 2 && invokArr[1] == "onCreate"){
				invoteFun = fatherObj[invokArr[1]];
				if (!invoteFun){
					return null;//最后还是没找到函数，不调用了
				}
				invoteFun = invoteFun[invokArr[0]];
				gadgetName = invokArr[0];
			}
			else if(invokArr.length == 3){
				invoteFun = fatherObj[invokArr[1]+'.'+invokArr[2]];
				if (!invoteFun){
					return null;//最后还是没找到函数，不调用了
				}
				invoteFun = invoteFun[invokArr[0]];
				gadgetName = invokArr[0];
			}
			else {
				return null;//参数数量不对了
			}
			
			//转换this的对象了.2015-02-29罗光瑜修改，不换father了
			/*
			fakeApp._father = app._father._father;
			if (fakeApp._father){
				fakeApp._father = fakeApp._father[gadgetName];
			}
			*/
			//好了，可以调用了，这个fakeApp的对象和API对象全部被改过了
			return invoteFun.apply(_$app,args);
		};
		return result;		
	}
	
	//继承类的缓存，如果每次都获取，效率太低
	var _afterExtendGadget = {};
	/**
	 * @name extends 
	 * @memberOf APP
	 * @description APP的继承信息，在编写gadget的时候重写。
	 *  继承的规则是，被继承的当前gadget会复盖父类相同的同名方法，以及同名参数。而没有复盖的部分
	 *  将使用父类的方法。
	 *  另外，通过[fatherGadget]_{FireEvent,private,TrigerEvent}_[functionName]的方式可以调用到父类的方法
	 *  继承的使用方式：在gadget中声明extends:[fatherGadget1,fatherGadget2...]
	 */
	 //这个方法是否辅助的临时方法，协助返回一个类，且这个类是完全已经实现继承机制了的
	var _getAfterExtendGadget = function(__gadgetObj) {
		var result = __gadgetObj;
		if (_afterExtendGadget[result.name]){
			//如果缓存存在，那么直接返回了
			return _afterExtendGadget[result.name];
		}

		//2013-12-18日罗光瑜修改 对象.extends在ie下是关键字，直接编译不过，改成['extends']
		//2014-08-31 支持super 每个类的father的结构是_father["private.<fun>"]["<gadgetName>"] = function(){xxxx}
		if (result['extends']) {
			for (var i = 0; i < result['extends'].length; i++) {
				var oneClassName = result['extends'][i];
				var oneClass = _getAfterExtendGadget(_gadget[oneClassName]);
				//2014-08-31罗光瑜改造了这个方法，使得支持上述的类结构
				_useAPI.lang.deepCopy(oneClass, result, function(name,path,srcObj,destObj){
					if (name == "_father"){
						return false;
					}
					if (/function/i.test(typeof(srcObj[name]))){
						if (result._father == null){
							result._father = {};
						}
						if (result._father[path] == null){
							result._father[path] = {};
						}
						result._father[path][oneClassName] = srcObj[name];
						//2015-02-26罗光瑜修改，要将函数的集成路径记录到函数里面，后续要用这个去判断father情况。
						//这个东西是写入到src的那个fun里面的，换句话说，如果被子类重写，那么这个数组就断掉了。
						if (srcObj[name].funowner == null){
							srcObj[name].funowner = [];
						}
						srcObj[name].funowner.push(oneClassName);
						
					}
					return true;
				});
				if (oneClass._father && result._father){
					//将father拷贝过去，便于递归调用，即father的father的情况
					//2015-02-26罗光瑜修改，要判断_father._father是否有如果没有才创建新的，否则会被覆盖
					if(result._father._father == null){
						result._father._father={};
					}					
					result._father._father[oneClassName] = oneClass._father;
				}
			}
		}
		_afterExtendGadget[result.name] = result;
		return result;
	}
	
	//下面开始是公有函数
	/**
	*@function
	*@name register
	*@memberOf FW
	*@description 用于注册业务gadget对象，即所说的业务代码，通常该类在业务代码第一行使用
	*@param {Object} c 要注册的业务gadget对象
	*@example 
	*var FW = require("../framework/js/BreezeFW");
	*FW.register(
	*   {
	*		name:"该gadget的名称",
	*		onCreate:function(){	
	*			//初始化部分
	*		},
	*		FireEvent:{
	*			//所有事件
	*		},
	*		TrigetEvent:{
	*			//所有触发点
	*		}
	*	}
	*)
	*/
	_obj.register =  function(__c,module){
		if (!__c || !__c.name){
			return;
		}
		_gadget[__c.name] = __c;
		//2015-10-19罗光瑜修改，增加参数module，使得gadget中可以获取自己所在路径
		if (module){
			_gadget[__c.name]._uri = module.uri;	
		}		
	};
	
	/**
	*@function
	*@name register
	*@memberOf FW
	*@description 注册gadget的API对象，用于模拟函数或者外部扩充情况
	*@param {Object} c 要注册的业务gadget对象
	*/
	_obj.regAPI =  function(__API){
		_APPAPI = __API;
	};
	
	
	/**
	*@function
	*@name register
	*@memberOf FW
	*@description 获取gadget数组或者指定gadget
	*@param name gadget名称，可以为空
	*/
	_obj.getGadget =  function(name){
		//@version 0.49 罗光瑜2015-09-02 增加返回gadget
		if (!name){
			return _gadget;
		}		
		return _gadget[name];
	};
	
	
	/**
	*@function
	*@name go
	*@memberOf FW
	*@description 用于注册业务gadget对象，即所说的业务代码，通常该类在业务代码第一行使用
	*该函数根据页面标class为FWApp关键字标签进行gadget绑定。注意：强烈建议在样式表中声明FWApp的display属性为none<br/>
	*该函数绑定的标签如果存在属性reserve=true，则绑定标签后，不清除对应的绑定代码。
	*支持“体外”加载资源，即所有class属性为FWRES的节点，都被认为是外部节点声明，其属性APPID指向对应归属的APP
	*例如《div APPID="123" class="APPResource"》
	*里面的内容就和普通的APP一样了
	*@param {String} url 该框架中的doServer函数，的提交目标
	*@param {Objet} pageGadget 一个基于页面的gadget由FW.page可以调用的到
	*@example 
	*seajs.use(['/tools/service/processor'], function(a) {
	*			a.go("breeze/framework/php/BreezeFW.php");
	*		});
	*/	
	_obj.go = function(__url,pageGadget,$callBack){
		//2015-01-05 罗光瑜 进行是否go初始化校验
		if (_obj.hasGo){
			//如果已经初始化过，则进行告警,为做一定的兼容性处理，这里不强制退出
			_obj.log("error! go 函数被重复执行");
		}else{
			_obj.hasGo = true;
		}
		//2014-07-26 罗光瑜修改为静态化做父亲窗口的调用
		var callBack = function(){
			$callBack && $callBack();
			if (parent && parent != window){
				parent.staticize && parent.staticize();
			}
		}
		_doserverUrl = __url;
		//2014-09-03罗光瑜，修改，将资源的view合并到gadget当中
		if (_gadgetResource){
			for (var n in _gadget){
				var gview = _gadgetResource[n];
				if (gview != null){
					if (_gadget[n].view!=null){
						_useAPI.lang.deepCopy(_gadget[n].view,gview);
					}
					_gadget[n].view = gview;
				}
			}
		}
		//下面是初始化要调用的执行内容
		$(
			function(){
				_createInstances(pageGadget);
				for (var name in _app){
					_app[name].onCreate();
				};
				//2014-7-12 罗光瑜增加对_allPost的空判断
				//2014-12-22 罗光瑜 原先的&&和||写法有问题，可能导致东西没有执行完就回调了
				if (_allPost){
					_allPost.doPost(callBack)
				}else{
					callBack();
				}				 
				_allPost = null;
			}
		);
		//2014-08-06创建全局的FireEvent函数
		_win.FireEvent = function(appInfo,a,b,c,d,e,f,g,h){
			//获取应用app
			var appArr = appInfo.split(".");
			var app = _obj.getApp(appArr[0]);
			var method = appArr[1];
			var args=[a,b,c,d,e,f,g,h];
			app.FireEvent[method].apply(app,args);
		}
	};
	/**
	*@name global
	*@memberOf FW
	*@description 在业务代码中，作为一个全局对象的容器
	*FW.global.a = {};
	*/
	_obj.global = {};
	
	/**
	*@function
	*@name trigerEvent
	*@memberOf FW
	*@description 框架事件的触发器，使用该触发器，那么注册的业务中的所有的TrigerEvent部分的函数，对应相同函数名的函数会被依次执行
	*@param {String} eventName 事件名称，和注册函数中的TrigerEvent下面的函数名相对应
	*@param [p1,p2,...] 后面可以一次增加对应的参数，与注册的TrigerEvent下的函数的声明参数相对应
	*@example 
	*FW.trigerEvent('hello', 1,2,3);
	*那么，在被注册的gadget中，凡是声明为hello的函数将被触发：
	*TrigerEvent:{
	*  hello:function(a,b,c){
	*     //a is 1,b is 2,c is 3
	*  }
	*}
	*/
	_obj.trigerEvent = function(evnName){
		var args = [];
		for (var i=1;i<arguments.length;i++){
			args.push(arguments[i]);
		}		
		$(function(){
			for (var name in _app){
				if (!_app.hasOwnProperty(name)){
					continue;
				}
				var app = _app[name];
				app.TrigerEvent && app.TrigerEvent[evnName] && app.TrigerEvent[evnName].apply(app,args);
			}
		});
	};
	
	
	
	/**
	*@function
	*@name doServer
	*@memberOf FW
	*@description 向服务器发起一个post的异步请求
	*@param {String} serverName 服务名
	*@param {String} package 所处包包名
	*@param {Object} param 要传递的参数对象
	*@param {Function} callback 异步请求结束后的回调函数，注意该函数的this已经 被重写，指向参数callbackThisObject
	*@param {Object} callbackThisObject 就是callback函数中的this指针，默认就是FW自己
	*@example 
	*FW.doServer("getCms","cms",{nodeId:'-1'},
	*function(code,data){
	*	this.use("DateTime").format(data);
	*});
	*/
	_obj.doServer=function(__serverName,__package,__data,__callback,__callbackThisObj){
			
		var callbackThisObj = __callbackThisObj||_obj;
		var postData = {
			name:__serverName,
			package:__package,
			param:__data,
			callBack:__callback,
			callbackThisObj:callbackThisObj
		}
		//2013-12-23日罗光瑜修改，如果传入的__callback是null则是同步请求	
		if (!postData.callBack){
			delete postData.callBack;
			delete postData.callbackThisObj;
			var dataStr = _useAPI.lang.toJSONString([postData]);

			var myurl = window.location.toString();
			var threadSignal = null;
			var execResult = (new RegExp("threadSignal=([\\w%\\.]+)")).exec(myurl);
			if (execResult){
				threadSignal = execResult[1];
			}
			var postUrl = _doserverUrl;			
			if (threadSignal){
				postUrl = _doserverUrl + "?threadSignal="+threadSignal;
			}

			$.ajaxSetup({
				async : false
			});
			var result = null;
			$.post(postUrl,{data:dataStr},
				function(__returndata){
					result = __returndata[0];					
				},
				"json");

			$.ajaxSetup({
				async : true
			});
			return result;
		}
		//第一次运行的时候，一起加载，其余的时候，单独加载
		//2015-11-05 罗光瑜 取消doServer统一消息处理
		if (false){
			_allPost.addPost(postData);
		}else{
			var temp = _createPost();
			temp.addPost(postData);
			temp.doPost();
		}
	};
	/**
	*@function
	*@name blockUI
	*@memberOf FW
	*@description 建立一个模式对话框
	*@param {String} src 模式对话框的html内容
	*@param {int} left 左边距坐标
	*@param {int} top 对象上边距坐标
	*@param {int} width 宽度
	*@param {int} height 高度
	*@param {String} 边框例如'none'
	*/
	_obj.blockUI = function(__src,__left,__top,__width,__height,__border){
		$.blockUI({
			message: __src,
			css: {
				width: __width+'px',
				height: __height+'px',
				left: __left + 'px',
				top: __top + 'px',
				border: __border
			}
		});
	};
	


	/**
	*@function
	*@name unblockUI
	*@memberOf FW
	*@description 解除模式对话框
	*/
	_obj.unblockUI = function(){
		$.unblockUI();
	};
	
	/**
	*2013-12-19 罗光瑜 对外提供根据APP的实例名称获取APP的函数
	*@function
	*@name getAPP
	*@param {String} name app的名称,如果为空，则返回所有app
	*@memberOf FW
	*@description 对外提供根据APP的实例名称获取APP的函数
	*/
	_obj.getAPP = function(__name){
		if (__name == null){
			return _app;
		}
		return _app[__name];
	};
	//2014-07-26兼容大小写写法
	_obj.getApp = _obj.getAPP;


	
	/**
	*2013-12-21 罗光瑜 提供一个FW能动态创建APP的机制
	*@function
	*@name createApp
	*@param {String} appName 创建后APP的名称,既Appid，这个appid会和被创建app有一定相关性，既被创建的app的实际名称是创建他的app的id_appName
	*@param {String} gadgetName 创建后gadget的名称
	*@param {String} resourceAPP 新app将绑定一个旧app的资源，这个是被绑定app的实例
	*@param {String} __useAppName 为true则使用本函数第一个参数的appName作为appName，否则按照规则appName_reouirceAPP作为appname
	*@return {String} 对应的APP实例，也可以是伪app，但需要如下参数
	*{
	*	id:'id名称，即绑定的dom节点id，创建的appid的实际名称，从fw中获取的APP为id+_+appName'，如果不存在，那么就不用
	*   dom:{obj},//xxx绑定的dom对象是jquery对象,
	*   param:{},//实际的参数
	*   view:{}//实际的视图内容
	*}
	*@memberOf FW
	*@description 提供一个FW能动态创建APP的机制
	*/
	_obj.createApp = function(__appName,__gadgetName,__resourceAPP,__useAppName){
		if (!__resourceAPP){
			alert("__resourceAPP is null in FW.createApp");
			return;
		};
		var inId = __resourceAPP.id;

		var appname = (__useAppName && __appName) || __resourceAPP.id+"_"+__appName;
		
		//2014-01-03日罗光瑜修改，支持app的命名，用_间隔资源和本app名称
		var app = _app[appname] = {};

		//罗光瑜2015-05-03 createapp的时候，被创建的appid不对
		app.id = appname;


		var classObj = _gadget[__gadgetName];
	
		app.dom = __resourceAPP.dom;

		//2014-01-08支持增加gadget名称
		app.gadgetName = __gadgetName;
		//复制所有class
		
		
		
		classObj = _getAfterExtendGadget(classObj);
		//最后再处理当前的app
		_useAPI.lang.deepCopy(classObj,app);
		//2014-08-31仅仅加注释，这里不是bug，因为优先级的问题，所以必须先拷贝resource里面的参数。先拷贝的优先级高
		app.param = {};
		_useAPI.lang.deepCopy(__resourceAPP.param,app.param);
		_useAPI.lang.deepCopy(classObj.param,app.param);
		
		//2013-12-18增加public的功能，将public函数搬到app直接函数下
		if (app.public){
			for (var member in app.public){
				app[member] = app.public[member];
			}
			//最后删除app的public成员
			delete app.public;
		}
		
		//2014-01-03罗光瑜修改，支持app的视图深度拷贝，且允许使用gadget的视图
		if (__resourceAPP && __resourceAPP.view){
			app.view || (app.view = {});
			_useAPI.lang.deepCopy(__resourceAPP.view,app.view);
		}
		
		app.API = _createFWTools(app);

		//2014-01-03罗光瑜修改，支持被创建的app使用创建它的app私有MY变量
		if (__resourceAPP && __resourceAPP.MY){
			app.MY = __resourceAPP.MY;	
		}else{
			app.MY = {};
		}
		
		//2014-07-26 静态化 为app创建序列化函数
		var serialize = function(){
			var param = FW.use().toJSONString(this.param);
			var MY = FW.use().toJSONString(this.MY);
			var result = {
				param:param,
				MY:MY
			};
			for (var n in this.view){
				result[n] = this.view[n];
			}
			return result;
		}
		//2014-08-14 罗光瑜修改
		if (!app["serializeGadget"]){
			app.serializeGadget = serialize;
		}
		//version 0.43 罗光瑜2015-05-05
		app.onCreate  && app.onCreate();
		return app;
	};

    //2014-07-26 兼容大小写app
	_obj.createAPP = _obj.createApp;
	
	

	/**
	*2014-12-01 罗光瑜 提供alert方法，注意该方法也可以被后续加载的js进行重写
	*@function
	*@name createApp
	*@param {String} alertStr 提示字符串
	*@memberOf FW
	*@description 提供alert方法
	*/
	_obj.alert = function(alertStr){
		window.alert(alertStr);
	}
	
	/**
	*2014-12-01 罗光瑜 提供confirm方法
	*@function
	*@name createApp
	*@param {String} confirmSgtr 提示字符串
	*@param {String} callBack 对应的回调函数
	*@memberOf FW
	*@description 提供confirm方法
	*/
	_obj.confirm = function(alertStr,callback){
		var result = window.confirm(alertStr);
		callback(result);
	}
	
	/**
	*2015-02-29 罗光瑜 提供一个获取函数调用者的方法
	*@function
	*@name createApp
	*@param {int} level 堆栈层数，0表示自己，1表示调用者，如此类推，默认是1
	*@param {String}  resultType 为空返回对应的函数，否则返回的是所有堆栈
	*@memberOf FW
	*@description 提供一个获取函数调用者的方法
	*/
	_obj.getCaller = function(level,resultType){
		var levelLen = level || 1;
		var stack = [];
	    var fun = _obj.getCaller;
	    fun = fun.caller;
	    var result = fun;
	    for (var i=0;i<=levelLen&&fun!=null;i++) {	    	
	        stack.push(fun);
	        result = fun;
	        fun = fun.caller;
	    }
	    if (resultType == null){
	    	return result;
	    }
	    return stack;
	}

	//私有函数
	//2014-01-03 罗光瑜修改，支持初始化的时候，初始化一个页面的page对象
	var _createInstances = function(__pageGadget) {
		_obj.page = {};
		if (__pageGadget) {
			var pageParam = {
				id: 'PAGE',
				dom: $(document.body), 
				param: {}, //实际的参数
				view: {} //实际的视图内容
			}
			//创建page对象
			_obj.page = _obj.createApp("page",__pageGadget,pageParam);
		}		
		_createInstancesByHtmlDom();
	};
	
	
	/*
	*这是一个神奇的函数，将根据当前加载的页面，将所有的类实例化，当然前提是该类存在
	*这里不需要任何显示的输入参数
	*所有参数来自页面约定好的格式，约定的形式如下：
	*1. 页面上所有class是FWApp的都是一个具体的APP实体，或者是容器实体
	*2. 该标签的ID就是对应实例ID
	*3. 该标签有一段注释是以<!--@classname@开头的其内容是一个json的完整注释就是一个完整的该APP的参数
	*4. 该参数将被转换成一个appparam的成员内容
	*5. 该方法将原来的class和appparam一起转成一个新的实例并丢到_app里面
	*新增处理解析容器能力，容器是一个由一个主APP加上若干个容器特定API构成。容器API仅仅对外提供容器内部APP的现实隐藏功能。
	*容器采用class=FWContainer形式，容器的dom的id和主app的id相同，建立好关联后，需要将容器的id属性删除掉
	*/
	var _createInstancesByHtmlDom = function(){
		//先解释和处理APP的
		//2013-12-19 罗光瑜修改 将each的回调函数单独抽出，便于递归调用
		var createOneApp = function(){
			var inId = this.id;
			//2013-12-19日 罗光瑜增加 判断是否有重复声明，如果重复声明则不进行
			if (_app[inId]){
				return;
			}
			//2013-12-19日 罗光瑜增加 进行递归判断，如果app内有app那么先把内部app进行解释
			$(this).find(".FWApp").each(createOneApp);

			var htmlStr = $(this).html();
			var serializeGadget = $(this).attr("serializeGadget");
			//取里面的系统配置参数
			var execResult =  /<!--\s*@(\s*[^@]+)\s*@([\s\S]+?)-->/.exec(htmlStr);
			if (execResult == null && serializeGadget == null){				
				return;
			}
			var gadgetName = serializeGadget || execResult[1];
			//2014-01-08支持app包含gadget成员变量
			var classObj = _gadget[gadgetName];
			if (classObj == null){				
				return;
			}
			var param =execResult && eval("(" + execResult[2] +")");
			//2014-12-19罗光瑜修改 param如果为空则赋值一个空对象
			if (param == null){
				param = {};
			}

			//下面组装新的APP
			
			/**
			 * @namespace
			 * @author Logan 
			 * @name APP 
			 * @description 这是app对象，而在我们FW里面注册的gadget实际上用this代表了一个具体的APP
			 */
			var app = _app[inId] = this.app = {};
			/**
			 * @name id 
			 * @memberOf APP
			 * @description APP的id
			 */
			app.id = inId;


			/**
			 * @name dom
			 * @memberOf APP 
			 * @description 这个APP代表的html的原始dom节点，不推荐使用这个属性，如果一旦html的dom节点被移动，则这个属性不会动态更新
			 */
			app.dom = $(this);
			app.serialize = (serializeGadget != null);

			//2014-01-08支持app包含gadget成员变量
			app.gadgetName = gadgetName;
			//复制所有class
			
			//找出所有父类
			
			classObj = _getAfterExtendGadget(classObj);
			//最后再处理当前的app
			_useAPI.lang.deepCopy(classObj,app);
			
			/**
			 * @name param 
			 * @memberOf APP
			 * @description 在该APP中声明的参数
			 */
			//把APP里面的默认值复制过去
			//2013-12-6日罗光瑜修改这里要用深度拷贝了，因为如果参数是一个对象，就变成引用拷贝了
			if (app.param){
				_useAPI.lang.deepCopy(app.param,param);				
			}
			app.param = param;
			
			//2013-12-18增加public的功能，将public函数搬到app直接函数下
			if (app.public){
				for (var member in app.public){
					app[member] = app.public[member];
				}
				//最后删除app的public成员
				delete app.public;
			}
			
			/**
			 * @name view 
			 * @memberOf APP
			 * @description 加入每个应用的视图,key是视图id，value是视图字符串
			 */
			 //2013-12-29罗光瑜修改，支持直接在gadget里面声明view，即如果原来已经有view段，就不要清空
			if (app.view == null){
				app.view = {};
			}

			//2014-07-26 静态化 为app创建序列化函数
			var serialize = function(){
				var param = FW.use().toJSONString(this.param);
				var MY = FW.use().toJSONString(this.MY);
				var result = {
					param:param,
					MY:MY
				};
				for (var n in this.view){
					result[n] = this.view[n];
				}
				return result;
			}
			//2014-08-14罗光瑜修改，静态化判断错了
			if (!app["serializeGadget"]){
				app.serializeGadget = serialize;
			}
		
			$.each($(this).children(),function(){
				if(this.id ==''){
					return;
				}
				var regStr = "<"+this.tagName+"\\s+[^>]*?id=[\"']?"+this.id+"[\"']?\\s*[^>]*>";
				var reg=new RegExp(regStr,"i");
				var execResult = reg.exec(htmlStr);
				var head = "";
				var tail = "";
				if (execResult!= null){
					head = execResult[0];
					tail = "</"+this.tagName+">";
					//alert(head+tail);
				}
				//到时补充替换事件处理能力
				var inhtml = $(this).html();
				inhtml = inhtml.replace(/&lt;!--/ig,"<!--").replace(/--&gt;/ig,"-->");	
				//因为ie的部分版本如果onclic后面html结果是不包含""的要手工加上
				//先判断on事件在其他属性前，即不是最后一个属性
				inhtml = inhtml.replace(/(on\w+\s*=\s*)(.+?)(\s*\w+\s*=)/ig,function(a,b,c,d){
					//如果已经存在""那么直接返回原始的内容
					if (/^["']/i.test(c)){
						return a;
					}
					//否则要加入""
					return b+"\""+c+"\""+d;
				});
				//再判断是最后一个属性的情况
				//2015-07-21 罗光瑜修改
				inhtml = inhtml.replace(/(on\w+\s*=\s*)([^=]+?)(>)/ig,function(a,b,c,d){
					//如果已经存在""那么直接返回原始的内容
					if (/^["']/i.test(c)){
						return a;
					}
					//如果是 onclick=a id=9>的情况，就会跨属性
					if (/\w+\s*=/i.test(c)){
						return a;
					}
					//否则就加入""这里不用考虑第二种情况是否要加"因为第二种情况在上一个replace中全部解决
					return b+"\""+c+"\""+d;
				});
				
				app.view[this.id] = head+inhtml+tail;
			});
			//2013-12-09 罗光瑜修改，增加外部资源  注意外部资源不用ourterhtml，只用内部的
			var ourterResDom = $(".FWRES[APPID="+app.id+"]");
			if (ourterResDom.length > 0) {
				//2013-12-19日 罗光瑜增加 进行递归判断，如果app内有app那么先把内部app进行解释
				$(this).find(".FWApp").each(createOneApp);
				$.each(ourterResDom, function() {
					var resid = $(this).attr("RESID");
					if (resid == '') {
						return;
					}
					//2014-07-17罗光瑜修改静态化（一），能支持param和MY的变量序列化
					var inhtml = $(this).html();
					if (resid == "PARAM"){
						var param = eval("("+inhtml+")");
						app.param = param;
					}else if(resid == "MY"){
						var MY = eval("("+inhtml+")");
						app.MY = MY;
					}else{
						inhtml = inhtml.replace(/&lt;!--/ig, "<!--").replace(/--&gt;/ig, "-->");
						app.view[resid] = inhtml;
					}
				});
			}
			//清除掉
			ourterResDom.html("");
			/**
			 * @name API 
			 * @memberOf APP
			 * @description 应用于该APP中的每一个API函数
			 * @see API
			 */
			app.API = _createFWTools(app);
			//创建自定函数对象
			/**
			 * @name MY 
			 * @memberOf APP
			 * @description 用于扩展，即留给每个APP由用户自定义的函数或类对象
			 */
			app.MY = app.MY || {};
			//2013-12-08罗光瑜修改，如果存在属性reserve属性则不清除
			if (!app.dom.attr("reserve") && !app.serialize){
				$(app.dom).html("");
			}
			//2013-12-08罗光瑜修改，处理完后，显示对应的APP
			$(app.dom).show();
		};
		$.each($(".FWApp"),createOneApp);
		
	};
	
	
});