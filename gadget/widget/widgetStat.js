/**
* @namespace
* @name widgetStat 
* @version 0.01 赵洪庆 创建初始版本
* @description  该gadget是一个显示类型的gadget它按一定格式访问服务端，读取一个数据，该数据将被显示出来，并按照一定的格式显示，同时他也会被一天记录一次，每次都会显示和上次比较上升或下降的次数 
*/
define(function(require, exports, module) {
    var FW = require("breeze/framework/js/BreezeFW");
    FW.register({
        "name": "widgetStat",
        "param": {
            /**
            *@memberOf widgetStat
            *@name icon
            *@description 前面显示的图标类型，可以是框架样式来表示图标，如：icon-comments，或者是某个图标的具url路径
            */
            "icon": "",
            /**
            *@memberOf widgetStat
            *@name servervice
            *@description 请求后台服务的名称package.service的形式
            */
            "servervice": "",
            /**
            *@memberOf widgetStat
            *@name color
            *@description 整体周边的颜色，用框架样式的颜色表示，如：infobox-blue,infobox-green,infobox-pink,infobox-red,infobox-orange2,infobox-blue2
            */
            "color": "blue",
            /**
            *@memberOf widgetStat
            *@name up
            *@description 右上角图标的类型，true为阳文，false是阴文
            */
            "up": ""
        },
        /**
        *@function
        *@memberOf widgetStat
        *@name onCreate$onCreate
        */
        "onCreate": function() {
            //调用公有方法进行显示
            this.show();
        },
        "public": {
            /**
            *@function
            *@memberOf widgetStat
            *@name public$show
            *@description 读取服务器服务，并将内容显示到页面上，
            *服务器上需要的参数包括：
            *number  对比的数据
            *xxx         对应的描述
            */
            "show": function() {
                //block(块){初始化相关的变量
                //声明图标类型 标识
                var iconFlag = true;
                //if (参数的图标值中有.){为图片类型
                if (this.param.icon.indexOf(".") != -1) {
                    //设置成图片类型
                    iconFlag = false;
                }
                //}
                //分解服务参数
                var serviceInfo = this.param.servervice.split(".");
                //初始化本地比较参数
                var info = {
                    localDate: "",
                    localCount: "",
                    stat: ""
                };
                //从本地存储中获取比较值
                var localKey = "widgetStat_" + this.id
                var localData = FW.use().load(localKey, true);
                //}
                //block(回调){doServer进行查询数据，并互调结果
                this.API.doServer(serviceInfo[1], serviceInfo[0], null,
                function(code, data) {
                    //if(如果是图标类型){将显示属性设置入返回的data中
                    if (iconFlag) {
                        //设置成样式的图标类型
                        data[0].icon = '<i class="' + this.param.icon + '"></i>';
                    }
                    //}
                    //else{
                    else {
                        //设置成图片的图标类型
                        data[0].icon = '<img  src="' + this.param.icon + '" />';
                    }
                    //}
                    //if(颜色参数不为空){设置颜色
                    if (this.param.color != "") {
                        //设置颜色
                        data[0].boxclass = "infobox infobox-" + this.param.color;
                    }
                    //}
                    //if (up参数为true){设置成阳形上升图标
                    if (this.param.up == "true") {
                        //设置图标类型
                        data[0].statclass = "stat stat-success";
                    }
                    //}
                    //else{设置成阴形图标
                    else {
                        //设置图标类型
                        data[0].statclass = "stat stat-important";
                    }
                    //}
                    //if(本地存没有数据){
                    if (localData == null) {
                        //if(返回没有状态){设成默认值
                        if (data[0].stat == null) {
                            //默认设100
                            data[0].stat = 100;
                        }
                        //}
                        //设置各种默认值
                        localData = info;

                        localData.localDate = this.API.private("now");
                        localData.localCount = data[0].number;
                        localData.localStat = data[0].stat;
                        //设置到本地存储
                        FW.use().save(localKey, localData, true);
                    }
                    //}
                    //else{
                    else {
                        //设置计算状态比的初始值
                        var count = data[0].number;
                        var localCount = localData.localCount;
                        //计算状态比
                        var stat = localData.localStat;
                        data[0].stat = stat;
                        //获取当前时间
                        var now = this.API.private("now");
                        //if(上次存储时间不是当天){存入本地存储
                        if (now != localData.localDate) {
                            data[0].stat  = stat = (Math.round((count - localCount) / localCount * 10000) / 100.00);
                            localData.localDate = now;
                            localData.localCount = data[0].number;
                            localData.localStat = stat;
                            FW.use().save(localKey, localData, true);
                        }
                        //}
                    }
                    //}
                    //显示视图
                    this.API.show("view_info", data);
                });
                //}
            }
        },
        "private": {
            /**
            *@function
            *@memberOf widgetStat
            *@name private$now
            *@description 获取年月日信息并返回
            */
            "now": function() {
                //获取年月日信息
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();
                //返回
                return year + "-" + month + "-" + date;
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
            view_info:'<ul class="chat" id="view_info"><li class="left clearfix"><span class="pull-left"><button type="button" class="btn btn-default btn-circle btn-lg">${data[0].icon}</button></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">${data[0].number}</strong><small class="pull-right text-muted">${data[0].content}</small></div><br><p id="stat">${data[0].stat}%</p></div></li></ul>'
        }
    });
    return FW;
});