define(function(require, exports, module) {
	var FW = require("../breeze/framework/js/BreezeFW");
	require("../breeze/framework/js/tools/DateTime")(FW);
	require("./ProductListBaseList");
	FW.register({
		param: {
			isAppend: false,
			//视图初始化位置
			view: null,
			//视图显示位置
			viewLocation: null,
			//起始位置
			startIdx:0,
			//长度
			count:8,
			//是否直接显示
			display:false
		},
		extends: ["ProductListBaseList"],
		onCreate:function(){
			if (this.param.display){
				this.showList();
			}
		},
		name: "ProductListCommList",		
		private: {
			showLogic: function(data) {
				//将特殊价格转换成json格式
				for(var i=0;i<data.length;i++){
					if(data[i].vipPrice&&data[i].vipPrice.length){
						data[i].vipPrice = FW.use().evalJSON(data[i].vipPrice);
					}
				}

				if (this.param.isAppend && this.startIdx != 0) {
					if (this.param.view) {
						if (this.param.viewLocation) {
							this.API.append(this.param.view, data, this.param.viewLocation);
						} else {
							this.API.append(this.param.view, data);
						}
					}
				} else {
					if (this.param.view) {
						if (this.param.viewLocation) {
							this.API.show(this.param.view, data, this.param.viewLocation);
						} else {
							this.API.show(this.param.view, data);
						}
					}
				}
			}
		},
		FireEvent: {
			//切换排序
			changeOrders: function(orders) {
				this.setOrderBy(orders);
				this.showList();
			}
		},
		TrigerEvent: {
			
		}
	});
	return FW;
});