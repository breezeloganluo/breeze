define(function(require, exports, module) {
    var JSTest = {};
    JSTest.name_testContent_div = 'testContent_div';
    JSTest.name_resultContent_table = 'resultContent_table';

    /**
     *一个初始化函数
     *主要是在主测试页面中，增加对应的测试HTML对象
     */
    JSTest.init = function () {
        //在body上创建两个控件

        //首先是div控件，用于容纳测试的专用控件
        var divObj = document.createElement('div');
        divObj.setAttribute('id', JSTest.name_testContent_div); //类型
        document.body.appendChild(divObj);

        //创建table
        var tableObj = document.createElement('table');
        tableObj.setAttribute('border', '1');
        document.body.appendChild(tableObj);

        //IE独有的，必须有tbody才能显示
        var tabodyObj = document.createElement('tbody');
        tabodyObj.setAttribute('id', JSTest.name_resultContent_table); //类型
        tableObj.appendChild(tabodyObj);

    }
    /**
     *添加测试结果到页面上
     */
    JSTest.appendResult = function (name, result, isSucc) {
        var tableObj = document.getElementById(JSTest.name_resultContent_table);
        var trObj = document.createElement('tr');
        if (isSucc != null && !isSucc) {
            trObj.setAttribute('bgColor', '#ff0000');
        }

        var tdObj_name = document.createElement('td');
        tdObj_name.innerHTML = name;

        var tdObj_result = document.createElement('td');
        //如果成功，结果处变成绿色
        if (isSucc == null || isSucc) {
            result = '<font color="#00ff00">' + result + '</font>';
        }
        tdObj_result.innerHTML = result;

        tableObj.appendChild(trObj);
        trObj.appendChild(tdObj_name);
        trObj.appendChild(tdObj_result);

    }
    //记录当时正在测试的测试对象信息
    JSTest.currentTest = null;
    JSTest.currentTestResult = true;

    JSTest.assertEquals = function (p1, p2, msg) {
        if (!JSTest.currentTestResult) {
            //如果已经错误，那么跳过，不用再测试了
            return;
        }
        var tips = (msg == null) ? '' : msg + ':';
        var result = null;
        var isSucc = p1 == p2;
        if (!isSucc) {
            result = tips + 'expect ' + p1 + ' but ' + p2 + ' is found!';
            JSTest.appendResult(JSTest.currentTest, result, isSucc);
            //记录当前失败状态
            JSTest.currentTestResult = false;
            return;
        }
    }

    JSTest.assertNotNull = function (p1, msg) {
        if (!JSTest.currentTestResult) {
            //如果已经错误，那么跳过，不用再测试了
            return;
        }
        var tips = (msg == null) ? '' : msg + ':';
        var result = null;
        var isSucc = p1 != null;
        if (!isSucc) {
            result = tips + 'null is found';
            JSTest.appendResult(JSTest.currentTest, result, isSucc);
            //记录当前失败状态
            JSTest.currentTestResult = false;
            return;
        }
    }

    JSTest.assertNull = function (p1, msg) {
        if (!JSTest.currentTestResult) {
            //如果已经错误，那么跳过，不用再测试了
            return;
        }
        var tips = (msg == null) ? '' : msg + ':';
        var result = null;
        var isSucc = p1 == null;
        if (!isSucc) {
            result = tips + 'Not null is found';
            JSTest.appendResult(JSTest.currentTest, result, isSucc);
            //记录当前失败状态
            JSTest.currentTestResult = false;
            return;
        }
    }

    JSTest.fail = function (msg) {
        if (!JSTest.currentTestResult) {
            //如果已经错误，那么跳过，不用再测试了
            return;
        }
        var tips = (msg == null) ? '' : msg + ':';
        var result = null;
        var isSucc = false;
        if (!isSucc) {
            result = tips + 'JTest fail assert';
            JSTest.appendResult(JSTest.currentTest, result, isSucc);
            //记录当前失败状态
            JSTest.currentTestResult = false;
            return;
        }
    }

    JSTest.testObj = {};
    JSTest.addTest = function ($name,$obj) {
        JSTest.testObj[$name] = $obj;
    }
    //设置桩相关的函数
    JSTest.stubNameArray = null;
    JSTest.stubObjArray = null;
    

    JSTest.runTest = function () {
        $(function(){
            JSTest.init();
            for (var objStr in JSTest.testObj) {
                var obj = JSTest.testObj[objStr];
                for (pp in obj) {
                    //获取所有以test打头           
                    if (/^test.*/i.test(pp) && typeof(obj[pp]) == 'function') {
                        //这个是目标程序了，将名称记录下来
                        JSTest.currentTest = objStr + '.' + pp;
                        //运行里面的函数，测试函数
                        try {
                            obj[pp]();                        
                            //一个函数测试结束，如果是全部成功，那么给出一个总体结果   
                            if (JSTest.currentTestResult) {
                                JSTest.appendResult(JSTest.currentTest, 'ok', true);
                            }
                        } catch (e) {
                            JSTest.appendResult(JSTest.currentTest, e.name + ':' + e.message, false);
                        }

                    }
                    //标志位复位
                    JSTest.currentTestResult = true;
                }
            }
        });
    }
    return JSTest;
});