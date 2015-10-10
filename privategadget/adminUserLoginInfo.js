/** 
* @fileOverview 处理用户信息用户登录的gadget 
* @author <a href="http://www.wgfly.com">Logan</a> 
* @version 0.1
*/ 

/**
* @namespace
* @author Logan 
* @name userInfoGadget 
* @description  这是一个用户登录信息处理gadget包括，获取用户信息，用户登录，用户注册三个功能 
*/ 
define(function(require, exports, module) {
	var FW = require("../breeze/framework/js/BreezeFW");
	//2013-12-30 10:19:08 程明剑 加载FW
	window.FW  = FW;
	FW.register(
		{
			param:{
				/**				
				*@name getinfoServicePackage
				*@memberOf userInfoGadget
				*@description 获取用信息时doserver使用的包名，缺省是	customer
				*/
				getinfoServicePackage:"customer",
				/**				
				*@name getinfoServiceName
				*@memberOf userInfoGadget
				*@description 获取用信息时doserver使用的业务名，缺省是	getCustomerInfo
				*/
				getinfoServiceName:"getCustomerInfo",
				/**				
				*@name loginServicePackage
				*@memberOf userInfoGadget
				*@description 用户登录时doserver使用的包名，缺省是	customer
				*/
				loginServicePackage:"customer",
				/**				
				*@name loginServiceName
				*@memberOf userInfoGadget
				*@description 用户登录时doserver使用的业务名，缺省是	loginUser
				*/
				loginServiceName:"loginUser",
				/**				
				*@name registerServicePackage
				*@memberOf userInfoGadget
				*@description 用户注册时doserver使用的包名，缺省是	customer
				*/
				registerServicePackage:"customer",
				/**				
				*@name registerServiceName
				*@memberOf userInfoGadget
				*@description 用户注册时doserver使用的业务名，缺省是	registerUser
				*/
				registerServiceName:"registerUser",				
				/**				
				*@name getUserFailTips
				*@memberOf userInfoGadget
				*@description 当获取用户信息失败时的提示信息，默认值是'获取用户信息失败'				
				*/
				getUserFailTips:'获取用户信息失败',

				/**				
				*@name getUserFailJumb
				*@memberOf userInfoGadget
				*@description 当用获取用户失败后，跳转页面,如果为null表示不跳转				
				*/
				getUserFailJumb:null,

				/**				
				*@name userNotLoginJumb
				*@memberOf userInfoGadget
				*@description 当用获取用户成功，但是用户未登录则进行跳转的页面信息,如果为null表示不跳转				
				*/
				userNotLoginJumb:null,

				/**				
				*@name loginSuccTips
				*@memberOf userInfoGadget
				*@description 当获取登录成功时的提示信息，默认值是'用户登录成功'				
				*/
				//2014-6-23 16:33:33 陈慕淋 由于客户要求，无需提示登录成功，所以该变量（loginSuccTips）不需要

				//loginSuccTips:'用户登录成功',

				/**				
				*@name loginSuccJumb
				*@memberOf userInfoGadget
				*@description 当用登录成功后，跳转页面,如果为null表示不跳转				
				*/
				loginSuccJumb:null,
				
				/**				
				*@name loginFailTips
				*@memberOf userInfoGadget
				*@description 当获取登录失败时的提示信息，默认值是'用户名或密码错误'				
				*/
				loginFailTips:'用户名或密码错误',

				/**				
				*@name loginFailJumb
				*@memberOf userInfoGadget
				*@description 当用登录失败后，跳转页面,如果为null表示不跳转				
				*/
				loginFailJumb:null,
				
				/**				
				*@name registerSuccTips
				*@memberOf userInfoGadget
				*@description 当获取登录成功时的提示信息，默认值是'注册成功'				
				*/
				registerSuccTips:'注册成功',

				/**				
				*@name registerSuccJumb
				*@memberOf userInfoGadget
				*@description 当用登录成功后，跳转页面,如果为null表示不跳转				
				*/
				registerSuccJumb:null,
				
				/**				
				*@name registerFailTips
				*@memberOf userInfoGadget
				*@description 当获取登录失败时的提示信息，默认值是'用户登录失败'				
				*/
				registerFailTips:'用户注册失败',

				/**				
				*@name registerFailJumb
				*@memberOf userInfoGadget
				*@description 当用登录失败后，跳转页面,如果为null表示不跳转				
				*/
				registerFailJumb:null,

				/**
				*@name directShowView
				*@memberOf userInfoGadget
				*@description 直接显示的视图名称，当有指定的时候，直接先显示该视图。
				并且不做获取用户信息操作
				*/
				directShowView:null,

				/**
				*@name code
				*@memberOf userInfoGadget
				*@description 验证码
				*/
				code:null

			},
			name:"adminUserLoginInfo",
			/**
			*@function
			*@name onCreate
			*@memberOf userInfoGadget
			*@description 初始化，获取用户的信息，如果用已经登录，显示视图view_userLogin，未登录显示view_userNotLogin
			注意：从服务端返回的参数中，有loginStatus表示用户的登录状态，0表示已经登录，其他表示未登录
			*@example 
			*/
			onCreate:function(){
				tag = "login";
				first = true;
				if (this.param.directShowView){
					this.API.show(this.param.directShowView);
					this.API.private("createCode");
					return;
				};
				this.API.doServer(this.param.getinfoServiceName, this.param.getinfoServicePackage,{},
					function(code,data){
						if (code !=0 || !data){
							alert(this.param.getUserFailTips);							
							this.param.getUserFailJumb && (window.location.href = this.param.getUserFailJumb);
							return;
						}
						this.MY.userInfo = data;
						//判断用户是否已经登录
						if (this.MY.userInfo.loginStatus == 0){
							this.API.show("view_userLogin",this.MY.userInfo);
						}else{
							if (this.param.userNotLoginJumb){
								window.location.href = this.param.userNotLoginJumb;
								return;
							}
							this.API.show("view_userNotLogin",this.MY.userInfo);
							//2014年9月10日 14:38:20 程明剑 添加验证码显示
							this.API.private("createCode");
						}
					}
				);
			},
			FireEvent:{
	            "saveSelect":function(securityanswerMask){
	                var key = $("#select option:selected").attr("id");
	                var r = /\d/ig.exec(key)
	                var num = r[0];
	                num = "securityanswer" + num;
	                var inputVal = $("#"+securityanswerMask).val();
	                if(!inputVal){
	                	alert("密保答案不能为空");
	                	return;
	                }
	                if(this.MY.baseInfo[num]==inputVal){
	                	var chars = ['0','1','2','3','4','5','6','7','8','9'];
	                	var res = "";
                		for(var i = 0; i < 6 ; i ++) {
				        	var id = Math.ceil(Math.random()*9);
				        	res += chars[id];
				     	}
				     	var _this =this;
				     	var param = {};
				     	param.password = res;
				     	param.account = _this.MY.userAccount;
				     	var result = _this.API.doServer("updateAdminPwdByR","admin",param);
	                	if(result.code==0&&result.data){
	                		alert("密码已经随机生成为:"+res);
	                		window.location.reload();
	                	}else{
	                		alert("密码修改失败");
	                	}
	                }else{
	                	alert("密保校验失败");
	                }
	            },
				cancelSelected:function(){
					this.API.unmask();
				},
				/**
				*@function
				*@name FireEvent_fireChangeCode
				*@memberOf userInfoGadget
				*@description 用于用户登录的事件处理,customer.loginUser({account:xxx,password:xxx})
				*/
				checkUser:function(userAccount){
					var userAccount = $("#"+userAccount).val();
					this.MY.userAccount = userAccount;
					if(!userAccount||userAccount==""){
						alert("用户名不能为空");
						return;
					}
					//查询密保信息
					var queryData = this.API.doServer("queryAminQua","admin",{"account":userAccount});
					
					if(queryData.code==0&&first){
						first=false;
						if(queryData.data){
							this.MY.baseInfo = queryData.data[0];
							if(this.MY.baseInfo.securityanswer1){
								this.API.mask("forgetPasswordMask",this.MY.baseInfo);
							}else{
								alert("该用户未设置密保 无法使用找回密码功能");
							}
						}else{
							alert("该用户不存在");
						}
						first=true;
					}
				},
				/**
				*@function
				*@name FireEvent_fireChangeCode
				*@memberOf userInfoGadget
				*@description 用于用户登录的事件处理,customer.loginUser({account:xxx,password:xxx})
				*/
				fireChangeCode:function(){
					this.API.private("createCode");
				},
				/**
				*@function
				*@name FireEvent_fireLogin
				*@memberOf userInfoGadget
				*@description 用于用户登录的事件处理,customer.loginUser({account:xxx,password:xxx})
				*@param {String} accountNameid 帐号对应的表单id
				*@param {String} passwordid 密码对应的表单id号
				*@example 
				* 《a href="#" onclick="FireEvent.fireLogin(userName,password)" 》lioing《/a》
				* 《input type="input" id="userName"》
				* 《input type="input" id="password"》
				*/
				fireLogin:function(__accountNameid,__passwordid,__rand){
					//2014年1月15日18:13:49 程明剑 添加选择登陆地址
					var choose;

					//2014/05/24 陈慕淋  处理choose为空无法登陆

					//判断choose是否为空
					if(!document.getElementById("form-field-select"))
					{
						choose = "0";
					}else
					{
						choose = document.getElementById("form-field-select").value;
					}
					
					var _form = this.dom[0];
					switch(choose){
						case '0':{
							var account = this.API.find("#" + __accountNameid).val();
							var password = this.API.find("#" + __passwordid).val();
							var rand = this.API.find("#" + __rand).val();
							this.API.trigerMyEvent("trigerLogin",account,password,rand);
							break;
						}
						case '1':{
							_form.action = "http://www.gztonglida.com/admin/privilege.php";
							_form.submit();
							break;
						}
						case '2':{
							_form.action = "http://www.gztonglida.com/index.php?m=admin&c=index&a=login&dosubmit=1";
							_form.submit();
							break;
						}
					}				
				},
				/**
				*@function
				*@name FireEvent_fireRegister
				*@memberOf userInfoGadget
				*@description 用于用户注册事件处理,customer.fireRegister({自定义})
				*@param {Object} RegisterInfo 用户注册的对象信息格式为：<br/>
				         {[注册参数名]:[页面上的表单id字符串]}
				*@example 
				* 《input type="input" name="userNameid"》
				* 《input type="input" name="passwordid"》
				* 《a href="#" onclick="FireEvent.fireRegister({userName:'userNameid',password:'passwordid')}"》lioing《/a》
				*  其中userName是数据库，或是说service配置的参数名，userNameid是输入表单的name值，密码部分也是这样，这个函数可以支持任意数量字段的
				*  的注册处理
				*/
				fireRegister:function(__RegisterInfo){
					var regObj = {};
					for (var name in __RegisterInfo){
						var formObj = this.API.find("[name='"+__RegisterInfo[name]+"']");
						if(name == "serviceCenterCid"){
							regObj.dataOwner = "`"+formObj[0].value+"`-1`";
						}
						if (formObj.length == 1){
							var value = formObj[0].value;
							regObj[name] = value;
						}else if (formObj.length > 1){
							for (var i=0;i<formObj.length;i++){
								var inObj = formObj[i];
								if (inObj.checked){
									regObj[name] = inObj.value;
									break;
								}
							}
						}
					}
					//默认设置为普通用户
					regObj.userType="会员用户";
					
					//判断用户手机号唯一性
					var _data = this.API.doServer("queryCustomerByPhone","customer",{"phone":regObj.phone});
					if(_data.data){
						alert("该手机号已经注册过，无法再次注册!");
						return;
					}
					
					this.API.trigerMyEvent("trigerRegister",regObj);
				}
			},
			TrigerEvent:{
				/**
				*@function
				*@name TrigerEvent_trigerLogin
				*@memberOf userInfoGadget
				*@description 用于外部gadget的事件出发登录，同时也是内部公用的调用方法<br/>
				*注意，doServer使用信息：customer.loginUser({account:xxx,password:xxx})
				*另外，如果登录成功后，该函数会向其他APP触发一个trigerLoginSucc事件
				*@param {String} accountName 帐号
				*@param {String} password 密码
				*@example 
				*/
				trigerLogin:function(__accountName,__password,__rand){
					var param = {
						account:__accountName,
						password:__password,
						rand:__rand
					}
					var _this = this;
					//2014年9月10日 15:07:23 程明剑 添加验证码验证 不区分大小写
					//2015年1月13日10:13:51 FrankCheng 临时去除验证码验证
					//2015年3月16日19:04:30 FrankCheng 恢复验证码功能
					if(__rand.toLowerCase()!=this.param.code.toLowerCase()){
						alert("验证码输入有误！");
						this.API.private("createCode");
						//2014年9月29日 18:37:29 程明剑 清空验证码区域并且光标定位到对应位置
						this.API.find("#code").val("").focus();
						return;
					}else{
						this.API.doServer(this.param.loginServiceName,this.param.loginServicePackage,param,
							function(code,data){
							if (code != 0){
								_this.API.private("loginFail",code);	
								//2014年2月18日16:04:56 程明剑 添加登陆失败刷新验证码
								//2014年9月29日 19:14:31 程明剑 去除旧验证码
								//if(__rand){
									//document.getElementById("randImage").src = "image.jsp?"+Math.random();
								//}													
								//2014年9月29日 19:12:23 程明剑 清空所有显示数据 并且光标定位至账户处

								_this.API.find("#adminName").val("").focus();
								_this.API.find("#adminPass").val("");
								_this.API.find("#code").val("");
								_this.API.private("createCode");

								return;
							}else{
								//2014-6-23 16:33:33 陈慕淋 由于客户要求，无需提示登录成功，所以不需要弹窗
								//alert(this.param.loginSuccTips);
								_this.param.loginSuccJumb && (window.location.href = this.param.loginSuccJumb);
								_this.API.trigerOtherEvent("trigerLoginSucc");
								return;
							}
						});
					}
				},
				/**
				*@function
				*@name TrigerEvent_trigerRegister
				*@memberOf userInfoGadget
				*@description 用于外部gadget的事件出发登录，同时也是内部公用的调用方法
				*注意，doServer请求的参数包括：,customer.fireRegister({自定义})
				*@param {Object} registerInfo 帐号
				*@example 
				*/
				trigerRegister:function(__registerInfo){					
					if (!this.API.private("registerCheck",__registerInfo)){						
						return;
					};
					this.API.doServer(this.param.registerServiceName,this.param.registerServicePackage,__registerInfo,
						function(code,data){
						if (code != 0){
							alert(this.param.registerFailTips);
							this.param.registerFailJumb && (window.location.href = this.param.registerFailJumb);
							return;
						}else{
							alert(this.param.registerSuccTips);
							this.param.registerSuccJumb && (window.location.href = this.param.registerSuccJumb);
							return;
						}
					});
				}
			},
			private:{
				/**
				*@function
				*@name privata_loginFail
				*@memberOf userInfoGadget
				*@description 私有方法，可用于子类扩展继承，默认情况下，只显示登录失败的信息
				*@param {Object} registerInfo 用户帐户信息
				*@example 
				*/
				loginFail:function(__code){
					alert(this.param.loginFailTips);
					this.param.loginFailJumb && (window.location.href = this.param.loginFailJumb);
				},
				/**
				*@function
				*@name privata_registerCheck
				*@memberOf userInfoGadget
				*@description 私有方法，可用于子类扩展继承，默认情况下，只要输入内容部位空就为true
				*如果要定制特殊的校验，就要重载这个类
				*@param {Object} registerInfo 用户帐户信息
				*@example 
				*/
				registerCheck:function(__registerInfo){
					for (var name in __registerInfo){
						if (!__registerInfo[name]){
							alert("请填写完整！");
							return false;
						}
					}
					return true;
				},
				/**
				*@function
				*@name privata_createCode
				*@memberOf userInfoGadget
				*@description 私有方法,用于创建验证码
				*@example 
				*/
				createCode:function(){
					this.param.code = "";   
			       	var codeLength = 4;//验证码的长度 2014年9月29日 18:25:17 程明剑修改验证码长度 更改为只有数字验证码
			       	var checkCode = document.getElementById("checkCode");   
	       			var selectChar = new Array(0,1,2,3,4,5,6,7,8,9);//所有候选组成验证码的字符，当然也可以用中文的      
			       	for(var i=0;i<codeLength;i++){   
			        	var charIndex = Math.floor(Math.random()*10);   
				        this.param.code +=selectChar[charIndex];   
			       	}    
		       		if(checkCode){   
		         		checkCode.className="code";   
			         	checkCode.value = this.param.code;
		        		checkCode.blur();   
			       	}  
				}
			},
			"view":{
				forgetPasswordMask:require("gadget/CMSMgrUserInfoforgetPasswordMask.tpl")
			}
		}
	);
	return FW;
});

