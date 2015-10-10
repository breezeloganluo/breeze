define(function(require, exports, module) {
	var FW = require("../../../breeze/framework/js/BreezeFW");
	require("manager_auxiliary/service/textMod");
	require("manager_auxiliary/service/graphyFunMod");
	var Q = require("breeze/framework/js/tools/qunee-module");
	var testStr = require("./testData.tpl");
	FW.register({
	
		name: "testGadget",
		param: {
			
		},
		onCreate:function(){
		//this.testShow();
		
			var textMod = FW.createApp("textMod", "textMod", this);
			var classMod = textMod.createClassMod(testStr);
			//alert(textMod.getClassStr());
			
			this.API.show("main");
			var cvn = $("#myCanvas");
			var graphyFunMod = FW.createApp("graphyFunMod","graphyFunMod",this);
			graphyFunMod.setClassMod(classMod);
			graphyFunMod.setCanvas(cvn);
			graphyFunMod.showFun("onCreate",function(n,pn){
				var parent = pn && pn.type
				alert("my is:"+n.type + "\nparent is:"+parent);
			});
	
		},
		public:{
			testShow:function(){
				var canvas = $("#myCanvas")[0];
				var graph = new Q.Graph(canvas);
				var hello = graph.createNode("Hello", -100, -50);
				hello.image = Q.Graphs.server;
				var qunee = graph.createNode("Qunee", 100, 50);
				var edge = graph.createEdge("Hello\nQunee", hello, qunee);

				edge.setStyle(Q.Styles.LABEL_OFFSET_Y, -10);
				edge.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);
				edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_BOTTOM);
				edge.setStyle(Q.Styles.LABEL_BORDER, 1);
				edge.setStyle(Q.Styles.LABEL_POINTER, true);
				edge.setStyle(Q.Styles.LABEL_PADDING, new Q.Insets(2, 5));
				edge.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, Q.Gradient.LINEAR_GRADIENT_VERTICAL);
			}
		}
	});
	return FW;
});