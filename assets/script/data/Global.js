'use strict';
if (!CC_EDITOR) {
    require('jQuery');
    require('bindUI');
    require('generater-Id');
    cc.vv = {};
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

    var l = require('Loader');
    var Loader = new l();

    var a1 = require('ActionMgr');
    var ActionMgr = new a1();

    var a2 = require('AudioMgr');
    var AudioMgr = new a2();

    cc.vv = {};
    window.config = { data: $data };
    document.cookie = "agent=Web";
    window.Global = {
        DEBUG: false,
        DataMgr: DataMgr,
        HTTP: HTTP,
        Observer: Observer,
        UserMgr: UserMgr,
        FishMgr: FishMgr,
        ActionMgr: ActionMgr,
        Loader: Loader,
        AudioMgr: AudioMgr,

        all_user_game_data: {},      //用户游戏数据

        /**初始化游戏相关功能
         * 
         */
        init_game: function () {
            cc.Button.prototype._click = function () {                          //让每次点击都触发声音
                Global.AudioMgr.play('click', 1, false, 'Effects');
            }
            cc.Button.prototype.onLoad = function () {                          //开启声音
                Global.addClickEvent(this.node, this.node, cc.Button, '_click');
            }
        },

        /**初始化
         *
         */
        init: function () {
            // var i = 5;
            // if (parseInt(Global.getData('!@#$%', i - 1)) !== i) {
            //     Global.setData('!@#$%', i);
            //     Global.setData('game_data', null);
            // }

            Global.init_time();
            Global.initgetset();
            Global.initMgr();
            Global.online();
            Global.onResize();
            Global.onPopstate();
            Global.isIOS();
            Global.init_game();
        },

        isIOS() {
            var isIos = cc.sys.os === cc.sys.OS_IOS,
                multiple = 0.9,
                f = function () {
                    $('#GameCanvas').css('height', `${multiple * 100}%`);
                };
            if (isIos) {
                f();
                cc.view.setResizeCallback(f);

                cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
                    var canvas = cc.find('Canvas').getComponent(cc.Canvas);
                    canvas.fitHeight = isIos;
                    canvas.fitWidth = !isIos;
                    setTimeout(f, 500);
                });

                var eventManager = cc.eventManager,
                    EventType = cc.Node.EventType,
                    _events = [
                        'mouse',
                        'touch',
                        EventType.TOUCH_START,
                        EventType.TOUCH_MOVE,
                        EventType.TOUCH_END,
                        EventType.TOUCH_CANCEL,

                        EventType.MOUSE_DOWN,
                        EventType.MOUSE_ENTER,
                        EventType.MOUSE_MOVE,
                        EventType.MOUSE_LEAVE,
                        EventType.MOUSE_UP,
                        EventType.MOUSE_WHEEL
                    ];
                eventManager._dispatchEvent = eventManager.dispatchEvent;
                eventManager.dispatchEvent = function (e) {
                    var type = e.type,
                        touches = e._touches,
                        len = touches ? touches.length : 0,
                        touch = null;
                    if (-1 !== _events.indexOf(type) && len > 0) {
                        for (let i = len - 1; i >= 0; i--) {
                            touch = touches[i];
                            touch._point.y /= multiple;
                            touch._prevPoint.y /= multiple;
                            touch._startPoint.y /= multiple;
                            touch = null;
                        }
                    }
                    this._dispatchEvent(e);
                }.bind(eventManager);
            }
        },

        /**监听屏幕改变并强制改为竖屏
         *
         */
        onResize() {
            if (!cc.sys.isNative) {
                cc.view.setResizeCallback(function () {
                    if (document.body.scrollWidth > document.body.scrollHeight) {
                        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                    } else {
                        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                    }
                });
            }
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
            AudioMgr.init();
            ActionMgr.init();
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

        /**转换成Unicode编码
         *
         * @param str   需要转换的字符串
         */
        encodeUnicode: function (str) {
            var res = [];
            for (var i = 0; i < str.length; i++) {
                res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
            }
            return "\\u" + res.join("\\u");
        },

        /**Unicode编码转换成UTF-8
         *
         * @param str   需要转换的字符串
         */
        decodeUnicode: function (str) {
            str = str.replace(/\\/g, "%");
            return unescape(str);
        },

        /**转换成html编码
         *
         * @param str   需要转换的字符串
         */
        htmlEncodeByRegExp: function (str) {
            var s = "";
            if (str.length == 0)
                return "";
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        },

        /**html编码转换成
         *
         * @param str   需要转换的字符串
         */
        UTFByHtmlEncode: function (str) {
            var s = "";
            if (str.length == 0)
                return "";
            s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            return s;
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

        /**初始化getset事件         *
         */
        initgetset: function () {
            cc.js.get(Global, 'time', function () {                 //获取1970年到现在的秒数
                return Global._time || Math.floor(cc.sys.now() / 1000);
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

        /**检测对象类型
         * 
         * @param: obj      需要检测的对象
         * @param: type     以大写开头的 JS 类型名
         */
        typeof: function (obj, type) {
            return Object.prototype.toString.call(obj).slice(8, -1) === type;
        },

        /**复制对象
         * 
         * @param: obj      原始对象
         * @param: isDeep   是否为深拷贝
         */
        clone: function (obj, is_deep) {
            let ret = obj.slice ? [] : {}, p, prop;
            if (!is_deep && Global.typeof(obj, 'Array')) return obj.slice();
            for (p in obj) {
                if (!obj.hasOwnProperty(p)) continue;
                prop = obj[p];
                ret[p] = (Global.typeof(prop, 'Object') || Global.typeof(prop, 'Array')) ?
                    Global.clone(prop, is_deep) : prop;
            }
            return ret;
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
                cc.game.on(cc.game.EVENT_HIDE, pushHistory);
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
                DataMgr.set_game_info();
                ui.emit("touch_enable", false);
                Global.log("链接上网络了");
            };
            window.onoffline = function () {
                DataMgr.set_game_info();
                // Global.setData('!$#@$@^%#@!',JSON.stringify(DataMgr.data));
                ui.emit("touch_enable", true);
                tips.show("网络链接已断开,请检查网络,否则会导致游戏数据丢失");
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

        /**节点坐标转成世界坐标
         *
         * @param node  需要转换的节点
         * @param pos   需要转换的坐标
         */
        getNodeToWorldPoint: function (node, pos) {
            return node.convertToWorldSpaceAR(pos || cc.p());
        },

        /**世界坐标转成节点坐标
         *
         * @param node  需要转换的节点
         * @param pos   需要转换的坐标
         */
        getWorldToNodePoint: function (node, pos) {
            return node.convertToNodeSpaceAR(pos || cc.p());
        },

        /**节点A的坐标切换到节点B的坐标
         *
         * @param nodeA
         * @param nodeB
         */
        getNodeAToNodeBPoint: function (nodeA, nodeB, pos) {
            pos = Global.getNodeToWorldPoint(nodeA, pos);
            return Global.getWorldToNodePoint(nodeB, pos);
        },

        /**切换父节点并保持坐标不变
         *
         * @param node     需要切换的节点
         * @param parent   需要切换的父节点
         */
        changeParent: function (node, parent) {
            var pos = Global.getNodeAToNodeBPoint(node, parent);
            node.parent = parent;
            node.setPosition(pos);
        },

        /**添加按钮的点击事件
         *
         * @param node              按钮节点
         * @param target            目标节点
         * @param component         目标组件名
         * @param handler           目标函数名
         * @param customEventData   携带的参数
         */
        addClickEvent: function (node, target, component, handler, customEventData) {
            if (!node.$Button) {
                return;
            }
            var eventHandler = new cc.Component.EventHandler();                                     //创建一个回调事件
            eventHandler.target = target;                                                           //目标节点
            eventHandler.component = component;                                                     //目标组件名
            eventHandler.handler = handler;                                                         //目标函数名
            eventHandler.customEventData = customEventData;                                         //携带的参数

            var clickEvents = node.$Button.clickEvents;                                             //获取节点上的按钮事件
            clickEvents.push(eventHandler);                                                         //把新建事件添加到回调
        },

        /**打印消息
         *
         */
        log: function () {
            console.log.apply(console, arguments);
        }
    };
}
module.exports = window.Global ? Global.init : function () { };