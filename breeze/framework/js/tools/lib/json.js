/**
* @file  json.js
* @use  FW.use().func();
* @description 用于支持Json与其它类型互转的扩展方法
* @prame .evalJSON(strJson);  .toJSONString(object);
* @date 2013-05-14
**/

define(function(require, exports, module) {
	var _win = window;
    var _doc = _win.document;
    var _result = {
        name : "JsonAPI",
        desc : "Json转换函数",
        domain : "JsonAPI"
    }
    
    var _api = _result.f = {};

/**
* 将json字符串转换为对象的方法。
*
* @public
* @param json字符串
* @return 返回object,array,string等对象

/** * @see 将json字符串转换为对象 * @param json字符串 * @return 返回object,array,string等对象 */
	_api.evalJSON = function(strJson) {
		return eval("(" + strJson + ")");
	}



/**
* 将javascript数据类型转换为json字符串的方法。
*
* @public
* @param {object} 需转换为json字符串的对象, 一般为Json 【支持object,array,string,function,number,boolean,regexp *】
* @return 返回json字符串
**/

	_api.toJSONString = function(object) {
		var type = typeof object;
		if ('object' == type) {
			if (Array == object.constructor) type = 'array';
			else if (RegExp == object.constructor) type = 'regexp';
			else type = 'object';
		}
		switch (type) {
			case 'undefined':
			case 'unknown':
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function() {
				var a = arguments[0];
				return (a == '\n') ? '\\n': (a == '\r') ? '\\r': (a == '\t') ? '\\t': ""
				}) + '"';
				break;
			case 'object':
				if (object === null) return 'null';
				var results = [];
				for (var property in object) {
				var value = _api.toJSONString(object[property]);
				if (value !== undefined) results.push(_api.toJSONString(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for (var i = 0; i < object.length; i++) {
				var value = _api.toJSONString(object[i]);
				if (value !== undefined) results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
			}
	}
	if (_win.APICtr && _win.APICtr.addAPI){
		_win.APICtr.addAPI(_result);
	}else{
		module.exports = _api;	
	}
})