/**管理数据
 *
 */
const DataMgr = (function () {
    'use strict';
    function DataMgr() {
    };

    const _p = DataMgr.prototype;

    /**初始化
     *
     */
    _p.init = function () {
        this.initGetSet();
        Global.Observer.once('login', this.get_game_info, this);                      //监听登入消息        
    };

    /**初始化玩家数据
     *
     * @param data  游戏数据
     */
    _p.init_data = function (data) {
        var _t = this;

        if (typeof data === 'string' && data !== '') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = null;
                console.log('用户信息是字符串，尝试转换成对象失败：', e);
            }
        }
        if (data === '')
            data = null;
        if (!data) {
            var time = Global.time;
            _t.data = null;
            data = _t.data = {
                fish: {},                               //鱼信息
                time: time,                             //离线时间
                mission: {                              //任务
                    1: {
                        id: 1,
                        num: 0
                    },
                    2: {
                        id: 2,
                        num: 0
                    },
                    3: {
                        id: 3,
                        num: 0
                    },
                    4: {
                        id: 4,
                        num: 0
                    },
                    5: {
                        id: 5,
                        num: 0
                    },
                    6: {
                        id: 6,
                        num: 0
                    },
                    7: {
                        id: 7,
                        num: 0
                    }
                },
                wen_chang_men_max_source: 0,            //文昌门最高分
                gu_jie_men_max_source: 0,               //古街最高分
                prop: {                                 //道具
                    1: {        
                        id: 1,
                        num: 1
                    },
                    2: {
                        id: 2,
                        num: 0
                    },
                    3: {
                        id: 3,
                        num: 0
                    },
                    4: {
                        id: 4,
                        num: 0
                    },
                    5: {
                        id: 5,
                        num: 0
                    },
                    6: {
                        id: 6,
                        num: 0
                    },
                    7: {
                        id: 7,
                        num: 0
                    }
                },
                last_receive: {}                        //上一次领取奖励的时间
            };
        } else {
            _t.data = data;
        }
        Global.Observer.emit('DataMgr_init_data_ok', data);
    };

    /**返回任务信息
     *
     */
    _p.get_mission_data = function () {
        var mission = config.data.mission;
        for (let i in mission) {
            mission[i].info[3] = this.mission[i].num;
        }
        return mission;
    };

    /**初始化getset事件
     *
     */
    _p.initGetSet = function () {
        //get
        cc.js.get(this, 'fish', function () {
            return this.data.fish;
        });

        cc.js.get(this, 'mission', function () {
            return this.data.mission;
        });

        cc.js.get(this, 'prop', function () {
            return this.data.prop;
        });

        cc.js.get(this, 'lv', this.get_lv);

        //set

        //getset
        cc.js.getset(this, 'time', function () {
            return this.data.time;
        }, function (val) {
            this.data.time = val;
        });

        cc.js.getset(this, 'last_receive', function () {
            return this.data.last_receive
        }, function (val) {
            this.data.last_receive = val;
        });

        cc.js.getset(this, 'wen_chang_men_max_source', function () {
            return this.data.wen_chang_men_max_source
        }, function (val) {
            this.data.wen_chang_men_max_source = val;
        });

        cc.js.getset(this, 'gu_jie_men_max_source', function () {
            return this.data.gu_jie_men_max_source
        }, function (val) {
            this.data.gu_jie_men_max_source = val;
        });

    };

    /**获取当前最高级
     *
     */
    _p.get_lv = function () {
        var lv = 0,
            fish = this.fish;
        for (let i in fish) {
            if (fish[i].lv > lv) {
                lv = fish[i].lv;
            }
        }
        return lv;
    };

    /**获取取整后的当前最高级
     *
     */
    _p.get_round_lv = function () {
        var lv = this.lv;
        if (lv < 10) {
            return 1;
        }
        return String(lv).substring(0, 1) + '0' - 0;
    };

    /**获取当前可以领取的古镇奖励信息
     *
     */
    _p.get_cur_receive_data = function () {
        return config.receive[this.get_round_lv()];
    };

    /**是否可以领取
     *
     */
    _p.is_receive = function (id) {
        if (!Global.is_food_collection_time())          //时间点不到
            return 1;

        var last_time = this.last_receive[id];

        if (!last_time)                                 //第一次领取
            return 0;

        var last_date = new Date(last_time),            //上一次的时间
            last_year = last_date.getFullYear(),
            last_month = last_date.getMonth() + 1,
            last_day = last_date.getDate(),
            last_hour = last_date.getHours(),

            cur_date = new Date(),                      //现在的时间
            cur_year = cur_date.getFullYear(),
            cur_month = cur_date.getMonth() + 1,
            cur_day = cur_date.getDate(),
            cur_hour = cur_date.getHours();

        //可以领取
        if (last_hour !== cur_hour || last_day !== cur_day || last_month !== cur_month || last_year !== cur_year) {
            return 0;
        }

        return 2;   //领取过了
    };

    /**更新古镇领取时间
     *
     */
    _p.update_receive_time = function (id) {
        this.last_receive[id] = new Date();
    };

    /**获得道具
     *
     * @param id    道具id
     * @param num   数量
     */
    _p.add_prop = function (id, num) {
        var cur_num = this.prop[id] || 0;
        cur_num += num;
        this.prop[id] = cur_num;
    };

    /**获取用户数据
     *
     */
    _p.get_game_info = function () {
        if (Global.DEBUG) {
            this.init_data(Global.getData('game_data', null));
            Global.schedule(this.set_game_info, this, 1);
            return;
        }

        Global.HTTP.send('GET', '', {
            module: 'StorageService.getGameUser',
            userid: Global.UserMgr.id
        }, function (res) {
            this.init_data(res.data);
            Global.schedule(this.set_game_info, this, 60);
        }.bind(this), function () {
            tips.show('获取数据失败');
        });
    };

    /**开启道具
     * 
     * @param id    道具id
     */
    _p.opne_prop = function (id) {
        var info = config.data.prop[id],
            num = Global.getRandomNum_Round(info.openNumMin, info.openNumMax, -1),
            open_info = info.open,
            len = open_info.length,
            random = Math.random() * 100,
            probability = 0;
        for (let i = 0; i < len; i++) {
            probability += open_info[i].probability;
            if (probability > random) {
                return [open_info[i].id, num];  // 食物id     数量                
            }
        }
    };

    /**存储用户数据
     *
     */
    _p.set_game_info = function () {
        if (!this.data)
            return;

        this.time = Global.time;
        if (Global.DEBUG) {
            Global.setData('game_data', JSON.stringify(this.data));
            return;
        }

        cc.vv.HTTP.send("GET", '', {
            module: 'StorageService.updateGameUser',
            userid: Global.UserMgr.id,
            Infojson: JSON.stringify(this.data)
        }, function (res) {
            Global.log('保存数据成功');
        });
    };

    return DataMgr;
}());
module.exports = DataMgr;