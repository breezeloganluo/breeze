/**
* @namespace
* @name classMod 
* @description  这个类是一个classMode的内部操作类
*实际的模型控制类
*由text创建的时候，很多结构代码直接写入到textMod中，
*后续优化的时候再处理
*不过这个类结构，还必须暴露出来，至少在解析的时候，其他的几个操作类都必须直接读取的
*这里仅仅是尽量封装吧  
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    var formatJS = require("breeze/framework/js/tools/formatJS");
    FW.register({
        "name": "classMod",
        "param": {
            /**
            *@memberOf classMod
            *@name classStruct
            *@description class的类结构，其结构为：
            * {
            *  name:'',
            * 	include:[
            * 		{
            * 			vName:'',
            * 			vDir:''
            * 		}
            * 	],
            * 	extends:[],
            * 	comments:'',//注释
			*   version:[
			*      {
			*         version:"str",
			*         author:"作者",
			*         description:"描述"
			*      }
			*   ]
            * 	attributeFragment:[
            * 		{
            * 			name:'变量名',
            * 			content:'初始内容'
            * 			comments:'注释'
            * 		}
            * 	],
            *  functionFragment:{
            *  	函数名:{
            *  		type:'',//public,FireEvent,TrigerEvent,private,onCreate
            *  		name:'',//函数名
            *  		comments:{
            *              param:{
            *					'参数名':'参数值'
            *              },
            *				description:'描述',
            *              return:'返回值',
            *              example:'样例'
            *			}
            *  		parameters:[
            *  			paramName
            *  		],
            *  		fragments:[
            *  			{
            *  				type:'',//normal,branchList,branchBlock,cycle,block---另外子注释的情况，后续补充上去// --这种情况，这种用于注释的换行处理
            *  				command:'',//注释
            *                  subCommand:[{//子注释
            *                     type:"++/--",
            *                     content:""
            *                  }],
            *  				code:'',//代码
            *  				subList:[]
            *  			}
            *  		],
            *  	}
            *  }
            * }
            */
            "classStruct": ""
        },
        "public": {
            /**
            *@function
            *@memberOf classMod
            *@name getMod
            *@description 获取内部模型对象，模型结构参见成员变量classStruct
            *@return 模型对象classStruct
            */
            "getMod": function() {
                return this.param.classStruct;
            },
            /**
            *@function
            *@memberOf classMod
            *@name setMod
            *@description 直接设置结构对象classStruct
            *@param c 对象结构classStruct
            */
            "setMod": function(c) {
                this.param.classStruct = c;
            }
        }
    });
    return FW;
});