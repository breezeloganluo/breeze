/**
* @namespace
* @name widgetTask 
* @version 0.01 赵洪庆 创建初始版本
* @description  该gadget是一个显示类型的gadget它按一定格式访问服务端，读取一个数据，该数据将被显示出来，并按照一定的格式显示，同时他也会被一天记录一次，每次都会显示和上次比较上升或下降的次数 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "widgetTask",
        "param":{
            "servervice":null
        },
        /**
        *@function
        *@memberOf widgetTask
        *@name onCreate$onCreate
        */
        "onCreate": function() {
            //调用公有方法进行显示
            this.show();
        },
        "public": {
            /**
            *@function
            *@memberOf widgetTask
            *@name public$show
            *@description 读取服务器服务，并将内容显示到页面上，
            *服务器上需要的参数包括：
            *number  对比的数据
            *xxx         对应的描述
            */
            "show": function() {
                var serviceInfo = this.param.servervice.split(".");
                var data = this.API.doServer(serviceInfo[1],serviceInfo[0],{});
                this.API.show("view_info",data.data);
            }
        },
        view:{
            /*
            *页面所需要的参数：
            * boxclass: 参数配置，就是颜色，用样式表示
            * icon: 配置的图标，用样式和图片url都可以
            * number:数据，后台服务器查询
            * content:显示内容，后台服务器查询
            * stat:状态，计算得来
            */
            view_info:require("./widgetTask.tpl")
        }
    });
    return FW;
});