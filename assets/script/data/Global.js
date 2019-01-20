'use strict';
if (!CC_EDITOR) {
    require('jQuery');
    require('generater-Id');

    var $data = require('data');

    var d = require('DataMgr');
    var DataMgr = new d();

    var h = require('HTTP');
    var HTTP = new h();

    var o = require('Observer');
    var Observer = new o();

    var u = require('UserMgr');
    var UserMgr = new u();

    var f = require('FishMgr');
    var FishMgr = new f();

    window.config = { data: $data };
    document.cookie = "agent=Web";
    window.Global = {
        DEBUG: true,
        DataMgr: DataMgr,
        HTTP: HTTP,
        Observer: Observer,
        UserMgr: UserMgr,
        FishMgr: FishMgr,

        /**初始化
         *
         */
        init() {
            Global.init_time();
            Global.initgetset();
            Global.initMgr();
            Global.online();
            Global.onPopstate();
            UserMgr.login();
        },

        /**初始化时间
         *
         */
        init_time: function () {
            Global.getNetworkTime();
            Global.schedule(Global.getNetworkTime, Global, 10);     //每10秒更新一次网络时间
            Global.schedule(Global._updateTime, Global, 1);         //每秒加一
        },

        /**更新事件
         *
         * @private
         */
        _updateTime: function () {
            Global._time++;
        },

        /**初始化管理者
         *
         */
        initMgr: function () {
            DataMgr.init();
            FishMgr.init();
        },

        /**获取url中的参数值
         *
         * @param name  参数名
         */
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },

        /**获取uuid
         *
         * @returns {string} uuid
         */
        getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },

        /**是否是食物领取时间
         *
         */
        is_food_collection_time: function () {
            var date = new Date(Global.time * 1000),
                hour = date.getHours();
            if (hour === 9 || hour === 12 || hour === 18) {
                return true;
            }
            return false;
        },

        /**给对象添加一个_id或uuid属性
         *
         * @param target    需要添加的对象
         */
        getNewId: function (target) {
            !target._id && (target._id = cc.IdGenerater.getNewId());
            !target.uuid && (target.uuid = target._id);
        },

        /**初始化getset事件
         *
         */
        initgetset: function () {
            cc.js.get(Global, 'time', function () {                 //获取1970年到现在的秒数
                return Global._time || cc.sys.now();
            });
        },

        /**获取本地数据
         *
         * @param key   存储的键
         * @param value 如果本地没有数据则返回该值
         */
        getData: function (key, value) {
            let val = cc.sys.localStorage.getItem(key);
            if (typeof val === 'undefined' || val === null || val === '' || (typeof val === 'number' && isNaN(val)))
                return value;
            return val;
        },

        /**设置本地数据
         *
         * @param key   存储的键
         * @param value 存储的值
         */
        setData: function (key, value) {
            cc.sys.localStorage.setItem(key, value);
        },

        /**定时器
         *
         * @param callback  回调
         * @param target    指定对象
         * @param interval  间隔
         * @param repeat    让定时器触发 repeat + 1 次
         * @param delay     延迟多长时间开始触发
         * @param paused    值为 true，那么直到 resume 被调用才开始计时
         */
        schedule: function (callback, target, interval, repeat, delay, paused) {
            Global.getNewId(target);
            return cc.director.getScheduler().schedule(callback, target, interval || 0, repeat, delay, paused);
        },

        /**只执行一次的定时器
         *
         */
        scheduleOnce: function (callback, target, interval) {
            Global.schedule(callback, target, interval, 0, 0, 0);
        },

        /**监听返回操作
         *
         */
        onPopstate: function () {
            $(function () {
                pushHistory();
                window.addEventListener("popstate", function (e) {
                    DataMgr.set_game_info();
                }, false);
                function pushHistory() {
                    var state = {
                        title: "title",
                        url: "#"
                    };
                    window.history.pushState(state, "title", "#");
                }
            });
        },

        /**监听网络状态
         *
         */
        online: function () {
            window.ononline = function () {
                Global.log("链接上网络了");
            };
            window.onoffline = function () {
                Global.log("网络链接已断开");
            };
        },

        /**获取网络时间
         *
         */
        getNetworkTime: function () {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("HEAD", location.href, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    var date = new Date(xhr.getResponseHeader("Date"));
                    Global._time = Math.round(date.getTime() / 1000);
                }
            };
            xhr.send(null);
        },

        /**获取随机数
         * 
         * @param min 最小值
         * @param max 最大值
         */
        getRandomNum: function (min, max) {
            return Math.random() * (max - min) + min;
        },

        /**获取随机数并按照指定方式取整
         *
         * @param min   最小值
         * @param max   最大值
         * @param mode  取整方式(<0向下取整,0四舍五入,>0向上取整)
         */
        getRandomNum_Round: function (min, max, mode) {
            if (mode < 0) {
                return Math.floor(Global.getRandomNum(min, max));
            } else if (mode == 0) {
                return Math.round(Global.getRandomNum(min, max));
            } else if (mode > 0) {
                return Math.ceil(Global.getRandomNum(min, max));
            }
        },

        /**获取一个数组中最大最小的xy的随机值
         *
         * @param arr   包含位置数组
         */
        getMaxAndMinByPointArr: function (arr) {
            var x = [];
            for (let i = 0, len = arr.length; i < len; i++) {
                x.push(arr[i].x);
            }
            var y = [];
            for (let i = 0, len = arr.length; i < len; i++) {
                y.push(arr[i].y);
            }
            return {
                maxX: Math.max.apply(Math, x),
                minX: Math.min.apply(Math, x),
                maxY: Math.max.apply(Math, y),
                minY: Math.min.apply(Math, y)
            }
        },

        /**打印消息
         *
         */
        log: function () {
            console.log.apply(console, arguments);
        }
    };
    Global.init();
}