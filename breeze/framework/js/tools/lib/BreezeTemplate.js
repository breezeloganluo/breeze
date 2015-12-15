/**
 * 本函数体用于进行模板技术处理，模板语法如下
 * <div>${data.name}</div>
 * <!--$for(var i=0;i<data.list.length;i++){-->
 *    <div>这里显示${data.list[i].name}的内容
 * <!--$}-->
 */
define(function(require, exports, module) {
	var _win = window;
    var _doc = _win.document;
    var _result = {
        name : "BreezeTemplate",
        desc : "模板解析",
        domain : "BreezeTemplate"
    }
    var _api = _result.f = {};
    var _objParser = {};
    /**
     * 保存数据
     * @param pTemplate 模板的内容字符串
     * @param pObjNames 返回模板函数后，进行数据解析的js对象名数组，例如['data1','data2'],那么解析出来的正向函数，支持输入的对象参数有两个分别是data1和data2
     * @param pAPI 是处理函数api对象，比如对象为{a:{f:function()},g:function(){xxx}}，那么可以a:f();去使用,也可以新增用法b:("ss")使用
     * @return 返回模板字符串，其结构如下：
     */
	 
    _api.parserTemplate = function(pTemplate,pObjNames,pAPI){
        //Alec:=====time:20120522
		//正向解析模板
        var parserTemplate = function(s){  
            if(!s){
                return '';
            }  
            if(s!==parserTemplate.template){  
                parserTemplate.template = s;  
                parserTemplate.aStatement = parserTemplate.parsing(parserTemplate.separate(s));  
            }  
            var aST = parserTemplate.aStatement;
            var data;
            return (new Function(data,aST));
        };  
        parserTemplate.separate = function(s){  
            var r = /\\'/g;   
            var sRet = s.replace(/(<!--\$(.*?)-->)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g,function(a,b,c,d,e,f,g){    
                if(b){
                    return '{|}'+'$'+c+'{|}';
                }  
                if(d){
                    return '\\\'';
                }  
                if(e){
                    if(e=='\r'){
                        return '{r}';
                    }else if(e=='\n'){
                        return '{n}';
                    }else{
                        return '{t}';
                    }
                }  
            if(f){
                //这里处理新增加的函数机制，用xxx:xxx()实现
            	var ss = g.replace(/^(\w+):(\w+)/,"API.$1.$2");
                ss = ss.replace(/^(\w+):(\(\s*[^\(\)]*\s*\))/,"API.$1$2");
                return '\'+('+ss.replace(r,'\'')+')+\'';
            }  
            }).replace(/((\{r\})|(\{n\})|(\{t\}))*?\{\|\}/g,'{|}');  
			
        	return sRet;  
    	};
		parserTemplate.parsing = function(s){  
			var sTmp,aTmp,sFL,sEl,aList,aStm = ['var data = arguments[0];','var API = arguments[1];','var aRet = [];'];  
			aList = s.split(/\{\|\}/);  
			while(aList.length){  
				sTmp = aList.shift();  
				if(!sTmp){
					continue;
				}  
				sFL = sTmp.charAt(0);  
				if(sFL!=='$'){
					sTmp = '\''+sTmp+'\'';
					aStm.push('aRet.push('+sTmp+');');
				}else{
					sTmp = sTmp.substring(1);
					aStm.push(sTmp)
					};
			}  
			aStm.push('return aRet.join(\'\');');
			//alert(aStm);
			return aStm.join('').replace(/\{[rnt]\}/g,function(a){
				return '\\' + a.charAt(1);
			});  
		};
		
		var f = parserTemplate(pTemplate); //解析模板 返回数据执行函数
		
		if (/string/i.test(typeof(f))){
			return f;
		}
		return f(pObjNames,pAPI); //输出解析后的模板字符串给返回对象的parser属性
	};
	if (_win.APICtr && _win.APICtr.addAPI){
		_win.APICtr.addAPI(_result);
	}else{
		module.exports = _api;	
	}
})