define(function(require, exports, module) {
	var JSTest = require("breeze/framework/js/JSTest");
	var FW = require("breeze/framework/js/BreezeFW");
	require("s");
	
	JSTest.addTest("s", {
		/**
		 * @title 测试标题1
		 * @desc 测试描述1
		 * @simulation 模拟描述1
		 * @input 输入项描述1
		 * @assert 校验内容描述1
		 */
		testPublicLoan_checkLessInves2: function() {
			var a = 1;
			var b = 2;
			var d = 3;
		},
		/**
		 * @title 测试标题2
		 * @desc 测试描述2
		 * @simulation 模拟描述2
		 * @input 输入项描述2
		 * @assert 校验内容描述2
		 */
		testPublicLoan_checkLessInves1: function() {

		},
		/**
		 * @title 测试标题3
		 * @desc 测试描述3
		 * @simulation 模拟描述3
		 * @input 输入项描述3
		 * @assert 校验内容描述3
		 */
		testPublicLoan1_checkLessInves2: function() {

		}
	});
	return JSTest;
});