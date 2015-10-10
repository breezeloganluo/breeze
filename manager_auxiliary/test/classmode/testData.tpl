/**
*我的注释
*这是我写的程序，大家看看有什么问题
*/

define(function(require, exports, module) {
	var FW = require("../../../breeze/framework/js/BreezeFW");
	require("./testData.aaa");
	var testStr = require("./testData.tpl");
	
	FW.register({
		"name": "classMod",
		"extends":['a','b'],
		/**
			 * 根据传入的gadget字符串，将字符串解析成class类结构
			 */
		param: {
		    /**
			*sd
			*/
			a:"good"
		},
		/**
		*@param a aaaaa
		*@description dddddd
		*/
		onCreate:function(a,b){
			//while(true){循环把下面内容搞定
			   while(true){
			   //这个要很长很长很长很长的注释来测试一下乐，看看看行不行啊 啊啊啊啊啊 啊啊
			   //--这个是儿子
			   xxxx
				//if(aaa){执行body
				//--这个也是儿子
				if(dccc){
				   body
				   }
				//}
				//else{
					//干活啊
					//--我就不敢活！
				//}
				}
			//}
			
		},
		public:{
		    /**
			*@return rrrrr
			*@example xxxx
			*ccccc
			*/
			p1:function(){
				//if(aaa){sddd
				//}else{
				//}
			},
			/**
			*@return rrrrr
			*@example xxxx
			*ccccc
			*/
			p2:function(){
			}
		}
	});
	return FW;
});