/**
* @namespace
* @name CMSMgrModSingleControl 
* @version 1.01 FrankCheng 模型详情控制器初始版本
* @description  模型详情控制器                                                   
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    require("./CMSMgrDefaultSingleControl");
    FW.register({
        "name": "CMSMgrModSingleControl",
        "extends": ["CMSMgrDefaultSingleControl"],
        "public": {
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name public$handleMetaDataBefore
            *@description 重写方法 专用于模型使用
            *@param __data 数据
            */
            "handleMetaDataBefore": function(__data) {
                if (__data.cmsmetadata.alias != "channel") {
                    var metadata = eval("(" + __data.cmsmetadata.dataDesc + ")");
                    if (!metadata.cid) {
                        metadata.cid = {
                            type: "Hidden"
                        }
                    }
                    this.MY.metadata = __data.cmsmetadata;
                    return metadata;
                }

                var metadata = {
                    "displayName": {
                        "title": "模型名称",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "dataRemarks": {
                        "title": "备注描述",
                        "type": "TextArea",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "configuration": {
                        "title": "扩展配置",
                        "type": "Info",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "extended": {
                        "title": "模型继承",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "alias": {
                        "title": "模型别名",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "tableName": {
                        "title": "表名",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "1",
                        "order": "50"
                    },
                    "parentAlias": {
                        "title": "挂接模型",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "dataRefresh": {
                        "title": "数据刷新",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "dataDesc": {
                        "title": "数据描述",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "20480",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "0",
                        "issearch": "0",
                        "order": "50"
                    },
                    "dataOwnerSet": {
                        "title": "数据权限设置",
                        "type": "Text",
                        "fieldType": "varchar",
                        "ourterLink": "",
                        "fieldLen": "128",
                        "dataExt": "",
                        "valueRange": "",
                        "desc": "",
                        "width": "",
                        "fieldtmp": "",
                        "islist": "1",
                        "issearch": "0",
                        "order": "50"
                    },
                    "roleSetting": {
                        "title": "权限设置",
                        "type": "CheckBox",
                        "valueRange": [{
                            "内容添加": "0",
                            "内容修改": "1",
                            "内容删除": "2",
                            "内容查询": "3"
                        },
                        {
                            "节点添加": "4",
                            "节点修改": "5",
                            "节点删除": "6",
                            "节点查询": "7"
                        }],
                        "islist": "0",
                        "desc": "* 这张表是否需要配置功能权限"
                    },
                    "outAlias": {
                        "title": "外部alias引用",
                        "type": "Text",
                        "valueRange": "",
                        "islist": "0",
                        "desc": "外部引用，当是一个独立alias时，表示用这个alias进行批量添加，当是[{alias1:true}{alias2:true}]时表示过滤子alias"
                    }
                };
                //处理cid
                if (!metadata.cid) {
                    metadata.cid = {
                        type: "Hidden"
                    }
                }
                //这里处理在数据描述的地方改成列表类型
                delete metadata.dataDesc;
                metadata.apply2DB = {
                    "title": "是否创建独立表",
                    "type": "Text",
                    "fieldType": "varchar",
                    "ourterLink": "",
                    "fieldLen": "128",
                    "dataExt": "",
                    "valueRange": "",
                    "desc": "填写对应alias则共用其表并自动填写数据描述，不填则是正常模式",
                    "width": "",
                    "fieldtmp": "",
                    "islist": "1",
                    "issearch": "0",
                    "order": "50"
                };
                metadata.isMuliTab = {
                	"title": "是否为多表模式",
                	"type": "Select",
                	"filedType": "varchar",
                	"ourterLink": "",
                	"fieldLen": "128",
                    "dataExt": "",
                    "valueRange": [{
                    	"否": 0
                    },{
                    	"是": 1
                    }],
                    "desc": "填写对应alias则共用其表并自动填写数据描述，不填则是正常模式",
                    "width": "",
                    "fieldtmp": "",
                    "islist": "1",
                    "issearch": "0",
                    "order": "50"
                };
                //2015-12-07 FrankCheng 隐藏该字段列表显示
                metadata.checkField = {
                	"title": "表单校验",
                    "type": "TextArea",
                    "fieldType": "varchar",
                    "ourterLink": "",
                    "fieldLen": "1024",
                    "dataExt": "",
                    "valueRange": "",
                    "desc": "",
                    "width": "",
                    "fieldtmp": "",
                    "islist": "0",
                    "issearch": "0",
                    "order": "50"
                };
                metadata.dataDesc = {
                    title: "字段描述",
                    type: "List",
                    desc: "用于描述该模型对应表结构的数据描述",
                    valueRange: [{
                        fieldname: {
                            title: "fieldname",
                            type: "Text",
                            islist: "1",
                            width: "80px"
                        },
                        title: {
                            title: "字段名称",
                            type: "Text",
                            islist: "1",
                            width: "80px"
                        },
                        type: {
                            title: "显示类型",
                            type: "TextArea",
                            width: "100px",
                            islist: "1"
                        },
                        fieldType: {
                            title: "字段类型",
                            type: "Select",
                            islist: "1",
                            width: "90px",
                            valueRange: [{
                                "varchar": "varchar"
                            },
                            {
                                "int": "int"
                            },
                            {
                                "long": "bigint"
                            },
                            {
                                "ourterField": "ourterField"
                            },
                            {
                                "Text": "Text"
                            }]
                        },
                        ourterLink: {
                            title: "外联描述",
                            type: "Text",
                            islist: "1",
                            width: "50px"
                        },
                        fieldMemo: {
                            title: "字段备注",
                            type: "TextArea",
                            islist: "1",
                            width: "50px"
                        },
                        fieldLen: {
                            title: "字段长度",
                            type: "Text",
                            islist: "1",
                            width: "50px"
                        },
                        dataExt: {
                            title: "字段扩展",
                            type: "Text",
                            islist: "1",
                            width: "50px"
                        },
                        valueRange: {
                            title: "描述&验证",
                            islist: "1",
                            type: "TextArea",
                            width: "70px"
                        },
                        desc: {
                            title: "desc",
                            type: "Text",
                            islist: "1",
                            width: "50px"
                        },
                        width: {
                            title: "width",
                            type: "Text",
                            islist: "1",
                            width: "40px"
                        },
                        fieldtmp: {
                            title: "转换函数",
                            type: "Text",
                            islist: "1",
                            width: "50px"
                        },
                        islist: {
                            title: "islist",
                            type: "Select",
                            islist: "1",
                            valueRange: [{
                                "是": "1"
                            },
                            {
                                "否": "0"
                            }],
                            width: "60px"
                        },
                        issearch: {
                            title: "查询条件",
                            type: "Select",
                            islist: "1",
                            valueRange: [{
                                "否": "0"
                            },
                            {
                                "是": "1"
                            }],
                            width: "60px"
                        },
                        order: {
                            title: "排序",
                            type: "Text",
                            valueRange: [{
                                "checkers": ["\\d+"],
                                "failTips": "排序只能输入数字"
                            }],
                            islist: "1",
                            width: "30px"
                        },
                        orderBy: {
                            title: "默认排序",
                            type: "Select",
                            valueRange: [{
                                "否": "0"
                            },
                            {
                                "升序": "asc"
                            },
                            {
                                "降序": "desc"
                            }],
                            islist: "1",
                            width: "30px"
                        },
                        mobileShow: {
                            title: "手机配置",
                            type: "Select",
                            valueRange: [{
                                "隐藏": "0"
                            },
                            {
                                "显示": "1"
                            }],
                            islist: "1",
                            width: "30px"
                        }
                    }]
                };;
                FW.use().save("descMetadata", metadata.dataDesc.valueRange[0]);
                this.MY.metadata = __data.cmsmetadata;
                for (var i in metadata.dataDesc.valueRange[0]) {
                    switch (i) {
                    case "desc":
                    case "width":
                    case "dataExt":
                    case "valueRange":
                    case "fieldtmp":
                    case "islist":
                    case "issearch":
                    case "order":
                    case "orderBy":
                    case "mobileShow":
                        metadata.dataDesc.valueRange[0][i].type = "Hidden_" + metadata.dataDesc.valueRange[0][i].type;
                        break;
                    default:
                        break;
                    }
                }
                //2015年3月19日11:19:35 FrankCheng 加入按钮数据
                metadata.dataDesc.valueRange[0].openMask = {
                    title: "修改",
                    type: "Button",
                    valueRange: "修改",
                    islist: "1",
                    width: "30px"
                }

                return metadata;
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name public$handleDataAfter
            *@description 重写handleDataAfter方式 为模型定制
            */
            "handleDataAfter": function(__data) {
                if (!__data.dataDesc) {
                    return __data;
                }
                var dataDesc = __data.dataDesc;
                var resultDescObj = {};
                for (var i = 0; i < dataDesc.length; i++) {
                    var oneData = dataDesc[i];
                    resultDescObj[oneData.fieldname] = oneData;
                    var isFun = false;
                    try {
                        eval("(" + oneData.valueRange + ")");
                        isFun = true;
                    } catch(e) {

                    }
                    if (oneData.valueRange && oneData.valueRange != '' && isFun) {
                        oneData.valueRange = eval("(" + oneData.valueRange + ")");
                        //将数值校验转换成字符串
                        for (var j = 0; j < oneData.valueRange.length; j++) {
                            if (!/String/i.test(typeof(oneData.valueRange[j].checkers))) {
                                oneData.valueRange[j].checkers = FW.use().toJSONString(oneData.valueRange[j].checkers);
                            }
                        }
                    }
                    delete oneData.fieldname;
                }
                var resultDesc = FW.use().toJSONString(resultDescObj);
                __data.dataDesc = resultDesc;
                var dataRemarks = __data.dataRemarks;
                var configuration = __data.configuration;
                var extended = __data.extended;
                var _fd = [];
                if (dataRemarks) {
                    _fd.push({
                        "type": "desc",
                        "desc": dataRemarks
                    });
                }
                if (configuration) {
                    for (var i in configuration) {
                        configuration[i] = FW.use().evalJSON(configuration[i]);
                    }
                    configuration = FW.use().toJSONString(configuration);
                    _fd.push({
                        "type": "aliasCfg",
                        "desc": configuration
                    });
                }
                if (extended) {
                    _fd.push({
                        "type": "super",
                        "desc": extended
                    });
                }
                if (_fd.length > 0) {
                    __data.dataMemo = FW.use().toJSONString(_fd);
                }
                delete __data.dataRemarks;
                delete __data.configuration;
                delete __data.extended;
                if (__data.roleSetting) {
                    var orgData = eval("(__data.roleSetting)");
                    var tmpData = FW.use().toJSONString(orgData);
                    __data.roleSetting = tmpData
                }

                console.log(FW.use().toJSONString(

                function() {}

                ));
                return __data;
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name public$addNew
            *@description 重写addNew方法
            *@param data 数据
            */
            "addNew": function(data) {
                var service = "addContent"
                if(!this.API.private("checkReservedWord",data)){
                	return 1001;
                }
                if (this.param.queryObj && this.param.parentAlias) {
                    service = "addNode";
                }
                if (this.MY.metadata.alias == "channel") {
                    service = "addCMSType";
                    data = this.handleDataAfter(data);
                    return this.API.doServer(service, "cms", data).code;
                } else {
                    return this.API.doServer(service, "cms", {
                        "alias": this.param.alias,
                        "param": data
                    }).code;
                }
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name public$update
            *@description 重写update方法
            *@param data 数据
            */
            "update": function(data) {
                var service = "modifyContent";
                if(!this.API.private("checkReservedWord",data)){
                	return 1001;
                }
                if (this.param.queryObj && this.param.parentAlias) {
                    if (data.nodeid) {
                        delete data.nodeid;
                    }
                    service = "modifyNode";
                }
                if (this.MY.metadata.alias == "channel") {
                    service = "modifyCMSType";
                    data = this.handleDataAfter(data);
                    return this.API.doServer(service, "cms", data).code;
                } else {
                    return this.API.doServer(service, "cms", {
                        "alias": this.param.alias,
                        "param": data
                    }).code;
                }
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name public$handleDataBefore
            *@description 覆盖父类方法
            *@param __data
            *@param __metadata
            */
            "handleDataBefore": function(__data, __metadata) {
                //要判断一下如果是其他alias，那么要还原原来的方法
                if (__data.cmsmetadata.alias != "channel") {
                    //将里面的json类型进行处理掉
                    if (__data.cmsdata && __data.cmsdata.length) {
                        for (var i = 0; i < __data.cmsdata.length; i++) {
                            for (var j in __metadata) {
                                if (__metadata[j].type == "List" || __metadata[j].type == "Pics" || __metadata[j].type == "CheckBox") {
                                    if (/string/i.test(typeof(__data.cmsdata[i][j]))) {
                                        __data.cmsdata[i][j] = __data.cmsdata[i][j] && FW.use().evalJSON(__data.cmsdata[i][j]);
                                    }
                                }
                            }
                        }
                    };

                    if (this.param.type == "single") {
                        return __data.cmsdata && __data.cmsdata[0];
                    }

                    return __data.cmsdata;
                }

                /*
   				这里要把数据描述里面的对象数据转换成列表值
                */
                if (this.param.type == "single") {
                    if (__data.cmsdata == null || __data.cmsdata.length == 0) {
                        return null;
                    }
                    var orcData = eval("(" + __data.cmsdata[0].dataDesc + ")");
                    __data.cmsdata[0].dataDesc = [];
                    for (var n in orcData) {
                        var oneData = orcData[n];
                        oneData.fieldname = n;
                        if (oneData.valueRange) {
                            //还原转换函数
                            if (!/string/i.test(oneData.valueRange)) {
                                for (var i = 0; i < oneData.valueRange.length; i++) {
                                    if (oneData.valueRange[i].checkers) {
                                        if (/^function/i.test(oneData.valueRange[i].checkers)) {
                                            try {
                                                oneData.valueRange[i].checkers = eval("(" + oneData.valueRange[i].checkers + ")");
                                            } catch(e) {
                                                alert("校验函数：" + oneData.fieldname + " 有语法错:\n" + e);
                                            }

                                        }
                                    }
                                }
                            }
                            oneData.valueRange = FW.use().toJSONString(oneData.valueRange);
                        }
                        __data.cmsdata[0].dataDesc.push(oneData);
                    }
                    //转换dataMeon
                    if (__data.cmsdata[0].dataMemo && __data.cmsdata[0].dataMemo != "") {
                        __data.cmsdata[0].dataMemo = FW.use().evalJSON(__data.cmsdata[0].dataMemo);
                        var __dataMe = __data.cmsdata[0].dataMemo;
                        for (var k = 0; k < __dataMe.length; k++) {
                            if (__dataMe[k].type == "desc") {
                                __data.cmsdata[0].dataRemarks = __dataMe[k].desc;
                            }
                            if (__dataMe[k].type == "aliasCfg") {
                                __data.cmsdata[0].configuration = __dataMe[k].desc;
                            }
                            if (__dataMe[k].type == "super") {
                                __data.cmsdata[0].extended = __dataMe[k].desc;
                            }
                        }
                    }
                    return __data.cmsdata && __data.cmsdata[0];
                }

                if (__data.cmsdata && __data.cmsdata.length) {
                    for (var i = 0; i < __data.cmsdata.length; i++) {
                        for (var j in __metadata) {
                            if (__metadata[j].type == "List" || __metadata[j].type == "CheckBox") {
                                if (__data.cmsdata[i] && __data.cmsdata[i][j] && __data.cmsdata[i][j] != "") {
                                    __data.cmsdata[i][j] = FW.use().evalJSON(__data.cmsdata[i][j]);
                                }
                            }
                        }
                    }
                }
                return __data.cmsdata;
            }
        },
        "private":{
        	/**
        	 * @function 
        	 * @memberOf CMSMgrModSingleControl
        	 * @name private&afterShow
        	 * @description 
        	 * @param data 页面数据
        	 * */
        	"afterShow" : function(data){
        		this.API.father('private.afterShow', data);
        	    $('div[data-value="data.checkField"]').after('<div col-lg-4>表单验证会有一个传入参数data,返回结果true表示验证通过反之不通过。</div>');
        	},
        	/**
        	 * @function 
        	 * @memberOf CMSMgrModSingleControl
        	 * @name private&checkReservedWord
        	 * @description 校验系统保留字
        	 * @param data 页面数据
        	 * */
        	"checkReservedWord" : function(data){
        		var checks = {
    				ADD: "ADD",
    				ALL: "ALL",
    				ALTER: "ALTER",
    				ANALYZE: "ANALYZE",
    				AND: "AND",
    				AS: "AS",
    				ASC: "ASC",
    				ASENSITIVE: "ASENSITIVE",
    				BEFORE: "BEFORE",
    				BETWEEN: "BETWEEN",
    				BIGINT: "BIGINT",
    				BINARY: "BINARY",
    				BLOB: "BLOB",
    				BOTH: "BOTH",
    				BY: "BY",
    				CALL: "CALL",
    				CASCADE: "CASCADE",
    				CASE: "CASE",
    				CHANGE: "CHANGE",
    				CHAR: "CHAR",
    				CHARACTER: "CHARACTER",
    				CHECK: "CHECK",
    				COLLATE: "COLLATE",
    				COLUMN: "COLUMN",
    				CONDITION: "CONDITION",
    				CONNECTION: "CONNECTION",
    				CONSTRAINT: "CONSTRAINT",
    				CONTINUE: "CONTINUE",
    				CONVERT: "CONVERT",
    				CREATE: "CREATE",
    				CROSS: "CROSS",
    				CURRENT_DATE: "CURRENT_DATE",
    				CURRENT_TIME: "CURRENT_TIME",
    				CURRENT_TIMESTAMP: "CURRENT_TIMESTAMP",
    				CURRENT_USER: "CURRENT_USER",
    				CURSOR: "CURSOR",
    				DATABASE: "DATABASE",
    				DATABASES: "DATABASES",
    				DAY_HOUR: "DAY_HOUR",
    				DAY_MICROSECOND: "DAY_MICROSECOND",
    				DAY_MINUTE: "DAY_MINUTE",
    				DAY_SECOND: "DAY_SECOND",
    				DEC: "DEC",
    				DECIMAL: "DECIMAL",
    				DECLARE: "DECLARE",
    				DEFAULT: "DEFAULT",
    				DELAYED: "DELAYED",
    				DELETE: "DELETE",
    				DESC: "DESC",
    				DESCRIBE: "DESCRIBE",
    				DETERMINISTIC: "DETERMINISTIC",
    				DISTINCT: "DISTINCT",
    				DISTINCTROW: "DISTINCTROW",
    				DIV: "DIV",
    				DOUBLE: "DOUBLE",
    				DROP: "DROP",
    				DUAL: "DUAL",
    				EACH: "EACH",
    				ELSE: "ELSE",
    				ELSEIF: "ELSEIF",
    				ENCLOSED: "ENCLOSED",
    				ESCAPED: "ESCAPED",
    				EXISTS: "EXISTS",
    				EXIT: "EXIT",
    				EXPLAIN: "EXPLAIN",
    				FALSE: "FALSE",
    				FETCH: "FETCH",
    				FLOAT: "FLOAT",
    				FLOAT4: "FLOAT4",
    				FLOAT8: "FLOAT8",
    				FOR: "FOR",
    				FORCE: "FORCE",
    				FOREIGN: "FOREIGN",
    				FROM: "FROM",
    				FULLTEXT: "FULLTEXT",
    				GOTO: "GOTO",
    				GRANT: "GRANT",
    				GROUP: "GROUP",
    				HAVING: "HAVING",
    				HIGH_PRIORITY: "HIGH_PRIORITY",
    				HOUR_MICROSECOND: "HOUR_MICROSECOND",
    				HOUR_MINUTE: "HOUR_MINUTE",
    				HOUR_SECOND: "HOUR_SECOND",
    				IF: "IF",
    				IGNORE: "IGNORE",
    				IN: "IN",
    				INDEX: "INDEX",
    				INFILE: "INFILE",
    				INNER: "INNER",
    				INOUT: "INOUT",
    				INSENSITIVE: "INSENSITIVE",
    				INSERT: "INSERT",
    				INT: "INT",
    				INT1: "INT1",
    				INT2: "INT2",
    				INT3: "INT3",
    				INT4: "INT4",
    				INT8: "INT8",
    				INTEGER: "INTEGER",
    				INTERVAL: "INTERVAL",
    				INTO: "INTO",
    				IS: "IS",
    				ITERATE: "ITERATE",
    				JOIN: "JOIN",
    				KEY: "KEY",
    				KEYS: "KEYS",
    				KILL: "KILL",
    				LABEL: "LABEL",
    				LEADING: "LEADING",
    				LEAVE: "LEFT",
    				LIKE: "LIKE",
    				LIMIT: "LIMIT",
    				LINEAR: "LINEAR",
    				LINES: "LINES",
    				LOAD: "LOAD",
    				LOCALTIME: "LOCALTIME",
    				LOCALTIMESTAMP: "LOCALTIMESTAMP",
    				LOCK: "LOCK",
    				LONG: "LONG",
    				LONGBLOB: "LONGBLOB",
    				LONGTEXT: "LONGTEXT",
    				LOOP: "LOOP",
    				LOW_PRIORITY: "LOW_PRIORITY",
    				MATCH: "MATCH",
    				MEDIUMBLOB: "MEDIUMBLOB",
    				MEDIUMINT: "MEDIUMINT",
    				MEDIUMTEXT: "MEDIUMTEXT",
    				MIDDLEINT: "MIDDLEINT",
    				MINUTE_MICROSECOND: "MINUTE_MICROSECOND",
    				MINUTE_SECOND: "MINUTE_SECOND",
    				MOD: "MOD",
    				MODIFIES: "MODIFIES",
    				NATURAL: "NATURAL",
    				NOT: "NOT",
    				NO_WRITE_TO_BINLOG: "NO_WRITE_TO_BINLOG",
    				NULL: "NULL",
    				NUMERIC: "NUMERIC",
    				ON: "ON",
    				OPTIMIZE: "OPTIMIZE",
    				OPTION: "OPTION",
    				OPTIONALLY: "OPTIONALLY",
    				OR: "OR",
    				ORDER: "ORDER",
    				OUT: "OUT",
    				OUTER: "OUTER",
    				OUTFILE: "OUTFILE",
    				PRECISION: "PRECISION",
    				PRIMARY: "PRIMARY",
    				PROCEDURE: "PROCEDURE",
    				PURGE: "PURGE",
    				RAID0: "RAID0",
    				RANGE: "RANGE",
    				READ: "READ",
    				READS: "READS",
    				REAL: "REAL",
    				REFERENCES: "REFERENCES",
    				REGEXP: "REGEXP",
    				RELEASE: "RELEASE",
    				RENAME: "RENAME",
    				REPEAT: "REPEAT",
    				REPLACE: "REPLACE",
    				REQUIRE: "REQUIRE",
    				RESTRICT: "RESTRICT",
    				RETURN: "RETURN",
    				REVOKE: "REVOKE",
    				RIGHT: "RIGHT",
    				RLIKE: "RLIKE",
    				SCHEMA: "SCHEMA",
    				SCHEMAS: "SCHEMAS",
    				SECOND_MICROSECOND: "SECOND_MICROSECOND",
    				SELECT: "SELECT",
    				SENSITIVE: "SENSITIVE",
    				SEPARATOR: "SEPARATOR",
    				SET: "SET",
    				SHOW: "SHOW",
    				SMALLINT: "SMALLINT",
    				SPATIAL: "SPATIAL",
    				SPECIFIC: "SPECIFIC",
    				SQL: "SQL",
    				SQLEXCEPTION: "SQLEXCEPTION",
    				SQLSTATE: "SQLSTATE",
    				SQLWARNING: "SQLWARNING",
    				SQL_BIG_RESULT: "SQL_BIG_RESULT",
    				SQL_CALC_FOUND_ROWS: "SQL_CALC_FOUND_ROWS",
    				SQL_SMALL_RESULT: "SQL_SMALL_RESULT",
    				SSL: "SSL",
    				STRAIGHT: "STRAIGHT",
    				STRAIGHT_JOIN: "STRAIGHT_JOIN",
    				TABLE: "TABLE",
    				TERMINATED: "TERMINATED",
    				THEN: "THEN",
    				TINYBLOB: "TINYBLOB",
    				TINYINT: "TINYINT",
    				TINYTEXT: "TINYTEXT",
    				TO: "TO",
    				TRAILING: "TRAILING",
    				TRIGGER: "TRIGGER",
    				TRUE: "TRUE",
    				UNDO: "UNDO",
    				UNION: "UNION",
    				UNIQUE: "UNIQUE",
    				UNLOCK: "UNLOCK",
    				UNSIGNED: "UNSIGNED",
    				UPDATE: "UPDATE",
    				USAGE: "USAGE",
    				USE: "USE",
    				USING: "USING",
    				UTC_DATE: "UTC_DATE",
    				UTC_TIME: "UTC_TIME",
    				UTC_TIMESTAMP: "UTC_TIMESTAMP",
    				VALUES: "VALUES",
    				VARBINARY: "VARBINARY",
    				VARCHAR: "VARCHAR",
    				VARCHARACTER: "VARCHARACTER",
    				VARYING: "VARYING",
    				WHEN: "WHEN",
    				WHERE: "WHERE",
    				WHILE: "WHILE",
    				WITH: "WITH",
    				WRITE: "WRITE",
    				X509: "X509",
    				XOR: "XOR",
    				YEAR_MONTH: "YEAR_MONTH",
    				ZEROFILL: "ZEROFILL"
    			}
        		
        		function check(value){
        			if(checks[value.toLocaleUpperCase()]){
        				alert(value + "为系统保留字,不可保存！");
        				return false;
        			}else{
        				return true;
        			}
        		}
        		if(data != null){
        			for(var i in data){
        				if(typeof data[i] == "string"){
        					if(!check(data[i])){
        						return false;
        						break;
        					}
        				}else if(i == "dataDesc" && data[i].length > 0){
        					var dataDesc = data[i];
        					for(var j = dataDesc.length; j--;){
        						var fieldname = dataDesc[j].fieldname;
        						var title = dataDesc[j].title;
        						var type = dataDesc[j].type;
        						//2015-12－07 FrankCheng 补全空验证
        						if(!fieldname || fieldname == ''){
        							alert('字段信息fieldname不能为空!');
        							return false;
        							break;
        						}
        						if(/\s/ig.test(fieldname)){
        							alert('字段信息fieldname不能包含空格!');
        							return false;
        							break;
        						}
        						if(!/^[a-zA-Z0-9]+$/ig.test(fieldname)){
        							alert('字段信息fieldname只能由字母和数字组成!');
        							return false;
        							break;
        						}
        						if(!title || title == ''){
        							alert('字段信息字段名称不能为空!');
        							return false;
        							break;
        						}
        						if(/\s/ig.test(title)){
        							alert('字段信息fieldname不能包含空格!');
        							return false;
        							break;
        						}
        						if(!type || type == ''){
        							alert('字段信息字段类型不能为空!');
        							return false;
        							break;
        						}
        						if(/\s/ig.test(type)){
        							alert('字段信息字段类型不能包含空格!');
        							return false;
        							break;
        						}
        						if(!/^[a-zA-Z0-9]+$/ig.test(type)){
        							alert('字段信息字段类型只能由字母和数字组成!');
        							return false;
        							break;
        						}
        						if(!check(fieldname)){
        							return false;
        							break;
        						}
        					}
        				}
        			}
        		}
        		return true;
        	}
        },
        "TrigerEvent": {
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name TrigerEvent$openModMask
            *@description 打开模型编辑
            *@param id 行数
            *@param key 获取所需关键字
            */
            "openModMask": function(id, key) {
                if ($("#mask-modal").length == 0) {
                    $("body").append("<div id='mask-modal' class='modal-backdrop  in'></div>");
                }
                var query = "td[data-list-value^='" + key + "[" + id + "]' ]";
                //获取的数据
                var oneData = {};
                //元数据
                $(query).each(function() {
                    var type = $(this).attr("data-list-type");
                    var _key = $(this).attr("data-list-key");
                    if (type == "Text" || type == "TextArea") {
                        oneData[_key] = $(this).children().val();
                    } else if (type == "Select") {
                        oneData[_key] = $(this).children().find("option:selected").val();
                    }
                });
                var showData = {
                    "data": oneData,
                    "metadata": FW.use().load("descMetadata"),
                    "key": key,
                    "id": id
                };
                if ($("#modListMaskView_CMSMgrControl").length == 0) {
                    $("body").append("<div id='modListMaskView_CMSMgrControl'></div>");
                }
                this.API.show("modListMaskView", showData, "modListMaskView");
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name TrigerEvent$closeModMask
            *@description 关闭Mask
            */
            "closeModMask": function() {
                $("#mask-modal").remove();
                $("#modListMask").remove();
            },
            /**
            *@function
            *@memberOf CMSMgrModSingleControl
            *@name TrigerEvent$saveModMask
            *@description 保存Mask内容 赋值到页面中
            *@param key 赋值字段
            */
            "saveModMask": function(key, id) {
                //获取页面值
                $("label[mod-value^='data.']").each(function() {
                    var query = "td[data-list-value='" + key + "[" + id + "].";

                    var type = $(this).attr("mod-type");
                    if (type == "Text" || type == "TextArea") {
                        var _key = $(this).attr("mod-key");
                        var value = $(this).next().val();
                        $(query + _key + "']").children().val(value);
                    } else if (type == "Select") {
                        var _key = $(this).attr("mod-key");
                        var value = $(this).next().find("option:checked").val();
                        $(query + _key + "']").children().val(value);
                    }
                });
                $("#mask-modal").remove();
                $("#modListMask").remove();
            }
        }
    },module);
    return FW;
});