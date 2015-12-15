/** 
* @fileOverview FW配套使用的时间处理API 
* @author <a href="http://www.wgfly.com">Logan</a> 
* @version 0.01
* @version 0.02 2014-5-23 日罗光瑜修改，判断win是否存在，如果存在则在本函数中直接加载到FW中，直接用requireFW会被循环加载
*/ 

/**
* @namespace
* @author Logan 
* @name DateTime
* @description  FW的核心基本扩展 
*/ 
define(function(require, exports, module) {
	//用函数自身做域名承载对象
	//这样在外部使用的时候，可以简化比如use("xx/x/xx")(FW);	
	var _result = function(fw){
		fw.use(_result);
	}
	
	_result.getDomain = function(){
		return "DateTime";
	}
	
	
	FW && FW.use(_result);
	
	
	
	/**
	 * @function
	 * @memberOf DateTime
	 * @name dateAdd
	 * @description 做时间加减法处理，给某个时间，增加或减少一定天数，返回是加减后的结果Date对象
	 * @param {Date}__dd 被加减的原时间对象
	 * @param {Number}__num 要加减的时间数量，整形，单位是天
	 * @returns 运算结果后的时间对象
	 */
	_result.dateAdd = function(__dd,__num){
		var num = __dd.getTime();
		num = num + __num*24*3600*1000;
		var result = new Date();
		result.setTime(num);
		return result;
	}
	
	/**
	 * @function
	 * @memberOf DateTime
	 * @name format
	 * @description 格式化一个时间显示信息
	 * @param {Date}__dd 被处理的时间对象
	 * @param {String}__sp 要输出的时间格式模板，例如YYYYMMddhhmmss代表年月日时分秒
	 * @returns 格式化后的字符串
	 */
	_result.format = function(__dd,__sp){
		
		var result = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return __dd.getFullYear();
			};
			if(b){
				var M = __dd.getMonth()+1;
				return (M<10)?'0'+M:M;
			};
			if (c){
				var _c = __dd.getDate();
				return (_c<10)?"0"+_c:_c;
			};
			if (d){
				var _d = __dd.getHours();
				return (_d<10)?"0"+_d:_d;
			};
			if (e){
				var _e = __dd.getMinutes();
				return (_e<10)?"0"+_e:_e;
			};
			if (f){
				var _f = __dd.getSeconds();
				return (_f<10)?"0"+_f:_f;
			}
		});
		return result;
	};
	
	
	/**
	 * @function
	 * @memberOf DateTime
	 * @name format
	 * @description 格式化一个时间显示信息
	 * @param {Date}__dd 被处理的时间对象
	 * @param {String}__sp 要输出的时间格式模板，例如YYYYMMddhhmmss代表年月日时分秒
	 * @returns 格式化后的字符串
	 */
	_result.formatTimeStamp = function(timestamp,__sp){
		var __dd = new Date();
		__dd.setTime(timestamp);
		
		return _result.format(__dd,__sp);
	};

	/**
	 * @function
	 * @memberOf DateTime
	 * @name format4
	 * @description 将一个格式化的时间字符串转换成Date对象
	 * @param {String}__ss 要处理的时间字符串
	 * @param {String}__sp 要输出的时间格式模板，例如YYYYMMddhhmmss代表年月日时分秒
	 * @returns 按照字符串输出的时间对象
	 */
	_result.format4 = function(__ss,__sp){
		__sp = __sp.replace(/\s+/gi,"\\s*");
		var result = new Date();
		result.setDate(1);
		
		//处理年份
		var t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "(\\d{4})";
			};
			if (b){				
				return "\\d{2}";
			};
			if (c){
				return "\\d{2}";
			};
			if (d){
				return "\\d{2}";
			};
			if (e){
				return "\\d{2}";
			};
			if (f){
				return "\\d{2}";
			}
		});
		var exp = new RegExp(t,"g");

		var expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setFullYear(d);
		}
		//处理月份
		t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "\\d{4}";
			};
			if (b){				
				return "(\\d{2})";
			};
			if (c){
				return "\\d{2}";
			};
			if (d){
				return "\\d{2}";
			};
			if (e){
				return "\\d{2}";
			};
			if (f){
				return "\\d{2}";
			}
		});
		exp = new RegExp(t,"g");
		expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setMonth(d-1);
		}
		
		//处理日期
		t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "\\d{4}";
			};
			if(b){				
				return "\\d{2}";
			};
			if (c){
				return "(\\d{2})";
			};
			if (d){
				return "\\d{2}";
			};
			if (e){
				return "\\d{2}";
			};
			if (f){
				return "\\d{2}";
			}
		});
		exp = new RegExp(t,"g");
		expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setDate(d);
		}

		//处理小时
		t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "\\d{4}";
			};
			if (b){				
				return "\\d{2}";
			};
			if (c){
				return "\\d{2}";
			};
			if (d){
				return "(\\d{2})";
			};
			if (e){
				return "\\d{2}";
			};
			if (f){
				return "\\d{2}";
			}
		});
		exp = new RegExp(t,"g");
		expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setHours(d);
		}

		//处理分钟
		t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "\\d{4}";
			};
			if (b){				
				return "\\d{2}";
			};
			if (c){
				return "\\d{2}";
			};
			if (d){
				return "\\d{2}";
			};
			if (e){
				return "(\\d{2})";
			};
			if (f){
				return "\\d{2}";
			}
		});
		exp = new RegExp(t,"g");
		expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setMinutes(d);
		}

		//处理秒
		t = __sp.replace(/(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)/g,function(all,a,b,c,d,e,f){
			if (a){
				return "\\d{4}";
			};
			if (b){				
				return "\\d{2}";
			};
			if (c){
				return "\\d{2}";
			};
			if (d){
				return "\\d{2}";
			};
			if (e){
				return "\\d{2}";
			};
			if (f){
				return "(\\d{2})";
			}
		});
		exp = new RegExp(t,"g");
		expResult = exp.exec(__ss);
		if (expResult.length == 2){
			var d = Number(expResult[1]);
			result.setSeconds(d);
		}
		return result;
	}
	
	return _result;
});