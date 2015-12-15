define(function(require, exports, module) {
	var FW = require("breeze/framework/js/BreezeFW");
	FW.register(
		{
			param:{
				/**				
				*@name displayName
				*@memberOf cmsMgrNodeTreeGadget
				*@description 栏目树显示的栏目字段名 默认为displayName	格式{"xxxalias":"fieldName"};
				*/
				displayName:{}
			},
			name:"treeMod",
			onCreate:function(){
				this.API.show("viewNodeTree");
				//一下这段代码是从fuelux.tree.min.js中抄录过来，因为这段封装的不好，其中包含了
				//--关于菜单树点击后的事件处理，这个处理没有封装出去，而原先这个函数
				//--仅仅是针对原来伟光管理端的做法，trigerEvent到一个指定地方，这样做非常不灵活，因此
				//--这里移植过来再做调整
				(function(a, c) {
					var b = function(e, d) {
						this.$element = a(e);
						this.options = a.extend({},
						a.fn.tree.defaults, d);
						this.$element.on("click", ".tree-item", a.proxy(function(f) {
							if(!$(f.currentTarget).hasClass("tree-selected")){
								this.selectItem(f.currentTarget);
								//--------------这就是写死的代码
								FW.trigerEvent('trigerChangeClass',$(f.currentTarget).find("div[cid]").attr("cid"),$(f.currentTarget).find("div[cid]").attr("ctalias"));
							}
						},
						this));
						// this.$element.on("click", ".tree-folder-name", a.proxy(function(f) {
						// 	$(f.currentTarget).parent().addClass("tree-selected");
						// },
						// this));
						this.$element.on("click", ".tree-folder-header>i", a.proxy(function(f) {
							this.selectFolder($(f.currentTarget).parent()[0]);
							// alert();
						},
						this));
						this.render()
					};
					b.prototype = {
						constructor: b,
						render: function() {
							this.populate(this.$element)
						},
						populate: function(f) {
							var e = this;
							var d = f.parent().find(".tree-loader:eq(0)");
							d.show();
							this.options.dataSource.data(f.data(),
							function(g) {
								d.hide();
								a.each(g.data,
								function(h, j) {
									var i;
									if (j.type === "folder") {
										i = e.$element.find(".tree-folder:eq(0)").clone().show();
										i.find(".tree-folder-name").attr("cid",h).attr("ctalias",j.ctalias).html(j.name);
										i.find(".tree-loader").html(e.options.loadingHTML);
										var k = i.find(".tree-folder-header");
										k.data(j);
										if ("icon-class" in j) {
											k.find('[class*="icon-"]').addClass(j["icon-class"])
										}
									} else {
										if (j.type === "item") {
											i = e.$element.find(".tree-item-item:eq(0)").clone().show();
											i.find(".tree-item-name").attr("cid",h).attr("ctalias",j.ctalias).html(j.name);
											i.data(j)
										}
									}
									if (f.hasClass("tree-folder-header")) {
										f.parent().find(".tree-folder-content:eq(0)").append(i)
									} else {
										f.append(i)
									}
								});
								e.$element.trigger("loaded")
							})
						},
						selectItem: function(e) {
							if (this.options.selectable == false) {
								return
							}
							var d = a(e);
							var g = this.$element.find(".tree-selected");
							var f = [];
							if (this.options.multiSelect) {
								a.each(g,
								function(i, j) {
									var h = a(j);
									if (h[0] !== d[0]) {
										f.push(a(j).data())
									}
								})
							} else {
								if (g[0] !== d[0]) {
									g.removeClass("tree-selected").find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"]);
									f.push(d.data())
								}
							}
							if (d.hasClass("tree-selected")) {
								d.removeClass("tree-selected");
								d.find("i").removeClass(this.options["selected-icon"]).addClass(this.options["unselected-icon"])
							} else {
								d.addClass("tree-selected");
								d.find("i").removeClass(this.options["unselected-icon"]).addClass(this.options["selected-icon"]);
								if (this.options.multiSelect) {
									f.push(d.data())
								}
							}
							if (f.length) {
								this.$element.trigger("selected", {
									info: f
								})
							}
						},
						selectFolder: function(e) {
							var d = a(e);
							var f = d.parent();
							if (d.find("." + this.options["close-icon"]).length) {
								if (f.find(".tree-folder-content").children().length) {
									f.find(".tree-folder-content:eq(0)").show()
								} else {
									this.populate(d)
								}
								f.find("." + this.options["close-icon"] + ":eq(0)").removeClass(this.options["close-icon"]).addClass(this.options["open-icon"]);
								this.$element.trigger("opened", d.data())
							} else {
								if (this.options.cacheItems) {
									f.find(".tree-folder-content:eq(0)").hide()
								} else {
									f.find(".tree-folder-content:eq(0)").empty()
								}
								f.find("." + this.options["open-icon"] + ":eq(0)").removeClass(this.options["open-icon"]).addClass(this.options["close-icon"]);
								this.$element.trigger("closed", d.data())
							}
						},
						selectedItems: function() {
							var e = this.$element.find(".tree-selected");
							var d = [];
							a.each(e,
							function(f, g) {
								d.push(a(g).data())
							});
							return d
						}
					};
					a.fn.tree = function(e, g) {
						var f;
						var d = this.each(function() {
							var j = a(this);
							var i = j.data("tree");
							var h = typeof e === "object" && e;
							if (!i) {
								j.data("tree", (i = new b(this, h)))
							}
							if (typeof e === "string") {
								f = i[e](g)
							}
						});
						return (f === c) ? d: f
					};
					a.fn.tree.defaults = {
						multiSelect: false,
						loadingHTML: "<div>Loading...</div>",
						cacheItems: true
					};
					a.fn.tree.Constructor = b
				})(window.jQuery);
			},
			public:{
				setClassMod : function(c){
					this.MY.classMod = c;
				},
				/**
				*根据class的结构，将其转化成树结构，然后再输出
				*其树结构如下：
				*{
				*  t_cid:{
				*    name:t_displayName,
				*    type:'item'/'folder',
				*    cid:t_cid,
				*    additionalParameters:{
				*      children:{
				*         t_cid:xxxx
				*      }
				*    }
				*  }
				*  其中t_cid必须是classMod类结构的访问路径，否则后续无法访问
				*  树的节点触发是在文件fuelux.tree.min.js中，这个尽量移植过来
				*/
				showClass : function(){
					this.API.show("viewNodeTree");
					var classMod = this.MY.classMod.getMod();
					//转化格式
					tree_data = {};
					//基本信息
					tree_data["base"] = {
						name:"基本信息",
						type:"item",
						cid:"base"
					}
					//clude部分
					if (classMod.attributeFragment && classMod.attributeFragment.length>0){
						tree_data["attribute"] = {
							name:"属性",
							type:"folder",
							cid:"data.attributeFragment",
							additionalParameters:{
								children:{}
							}
						};
						var c = tree_data["attribute"].additionalParameters.children;
						var attributeFragment = classMod.attributeFragment;
						for (var i = 0 ; i < attributeFragment.length; i++){
							c["data.attributeFragment["+i+"]"] = {
								name:attributeFragment[i].name,
								type:'item',
								cid:"data.attributeFragment["+i+"]"
							}
						}
					}
					//显示函数部分,要求按照类型进行分类
					if (classMod.functionFragment && classMod.functionFragment){
						tree_data["method"] = {
							name:"方法",
							type:"folder",
							cid:"data.functionFragment",
							additionalParameters:{
								children:{}
							}
						};
						var c = tree_data["method"].additionalParameters.children;
						//显示onCreate
						if (classMod.functionFragment.onCreate){
							c["data.functionFragment.onCreate"] = {
								name:"onCreate",
								type:"item",
								cid:"data.functionFragment.onCreate"
							}
						}
						//循环按照类型处理剩下的函数
						var tmpC = {};
						for (var n in classMod.functionFragment){
							if (n == "onCreate"){
								continue;
							}
							var f = classMod.functionFragment[n];
							//判断这个类型是否存在
							var cc = tmpC[f.type];
							if (cc == null){
								cc = tmpC[f.type] = {
									name:f.type,
									type:"folder",
									cid:f.type,
									additionalParameters:{
										children:{}
									}
								}
							}
							ccc = cc.additionalParameters.children;
							var cccName = n.replace(/^[\+-~\$]/,"");
							if (cccName.length > 13){
								cccName = cccName.substr(0,10)+"...";
							}
							ccc["data.functionFragment['"+n+"']"] = {
								name:cccName,
								type:"item",
								cid:"data.functionFragment['"+n+"']"
							}
						}
						//要按顺序安装，先是public
						if (tmpC.public){
							c["public"] = tmpC.public;
						}
						//private
						if (tmpC.private){
							c["private"] = tmpC.private;
						}
						//FireEvent
						if (tmpC.FireEvent){
							c["FireEvent"] = tmpC.FireEvent;
						}
						//TrigerEvent
						if (tmpC.TrigerEvent){
							c["TrigerEvent"] = tmpC.TrigerEvent;
						}
					}
					
					//显示视图部分
					//基本信息
					tree_data["view"] = {
						name:"视图",
						type:"item",
						cid:"view"
					}
					
					//显示类的树数据
					var DataSourceTree = function(options) {
						this._data 	= options.data;
						this._delay = options.delay;
					}

					DataSourceTree.prototype.data = function(options, callback) {
						var self = this;
						var $data = null;

						if(!("name" in options) && !("type" in options)){
							$data = this._data;//the root tree
							callback({ data: $data });
							return;
						}
						else if("type" in options && options.type == "folder") {
							if("additionalParameters" in options && "children" in options.additionalParameters)
								$data = options.additionalParameters.children;
							else $data = {}//no data
						}
						
						if($data != null)//this setTimeout is only for mimicking some random delay
							setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
					}
					var treeDataSource = new DataSourceTree({data: tree_data});

					//栏目树生成
					this.API.find('#nodeTree').ace_tree({
						dataSource: treeDataSource ,
						multiSelect:false,
						loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
						'open-icon' : 'icon-minus',
						'close-icon' : 'icon-plus',
						'selectable' : true,
						'selected-icon' : 'icon-ok',
						'unselected-icon' : 'icon-remove~'
					});
				}
			},
			FireEvent:{
				
			},
			TrigerEvent:{
				trigerReShowNodeTree:function(){
					this.MY.showNodeTree();
				}
			}
		}
	);
	return FW;
});

