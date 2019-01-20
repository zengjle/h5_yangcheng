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
        if (!data) {
            var time = Global.time;
            _t.data = null;
            data = _t.data = {
                fish: {},                               //鱼信息
                time: time,                             //离线时间
                mission: {                              //任务
                    1: {
                        id: 1,
                        num: 0,
                        is_receive: 1
                    },
                    2: {
                        id: 2,
                        num: 0,
                        is_receive: 1
                    },
                    3: {
                        id: 3,
                        num: 0,
                        is_receive: 1
                    },
                    4: {
                        id: 4,
                        num: 0,
                        is_receive: 1
                    },
                    5: {
                        id: 5,
                        num: 0,
                        is_receive: 1
                    },
                    6: {
                        id: 6,
                        num: 0,
                        is_receive: 1
                    },
                    7: {
                        id: 7,
                        num: 0,
                        is_receive: 1
                    }
                },
                wen_chang_men_max_source: 0,            //文昌门最高分
                gu_jie_max_source: 0,                   //古街最高分
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
                integration_num: 0,                     //福缘积分
                mission_score_max: 0,                   //任务分数
                last_receive: {},                       //上一次领取奖励的时间
                is_sign_in: false,                      //是否签到
                is_question: false,                     //今日是否已经答题
            };
        } else {
            _t.data = data;
            _t._timing_day_update_data();
        }
        Global.Observer.emit('DataMgr_init_data_ok', data);
    };

    //是否是第二天
    _p._is_tomorrow = function () {
        var day_time = 1000 * 60 * 60 * 24;                             //一天的时间
        var cur_time = Math.floor(Global.time * 1000 / day_time);       //现在的时间
        var last_time = Math.floor(this.time * 1000 / day_time);        //离线时间
        if (cur_time - last_time === 0) {
            return false;
        }
        return true;
    };

    //每天更新一次
    _p._timing_day_update_data = function () {
        if (this._is_tomorrow()) {
            //刷新每天更新的数据
            this.is_sign_in = false;
            this.is_question = false;
        }
    };

    /**返回任务信息
     *
     */
    _p.get_mission_data = function () {
        var mission = config.data.mission;
        for (let i in mission) {
            mission[i].info[2] = this.mission[i].is_receive;
            mission[i].info[3] = this.mission[i].num;
        }
        return mission;
    };

    /**初始化getset事件
     *
     */
    _p.initGetSet = function () {
        //get
        cc.js.get(this, 'fish', function () {       //鱼信息
            return this.data.fish;
        });

        cc.js.get(this, 'mission', function () {    //任务
            return this.data.mission;
        });

        cc.js.get(this, 'prop', function () {       //道具
            return this.data.prop;
        });

        cc.js.get(this, 'lv', this.get_lv);         //鱼的最高等级

        //set

        //getset
        cc.js.getset(this, 'time', function () {    //离线时间
            return this.data.time;
        }, function (val) {
            this.data.time = val;
        });

        cc.js.getset(this, 'last_receive', function () {    //上一次领取奖励的时间
            return this.data.last_receive
        }, function (val) {
            this.data.last_receive = val;
        });

        cc.js.getset(this, 'wen_chang_men_max_source', function () {        //文昌门最高分
            return this.data.wen_chang_men_max_source
        }, function (val) {
            if (val < this.data.wen_chang_men_max_source) {
                return;
            }
            this.data.wen_chang_men_max_source = val;
        });

        cc.js.getset(this, 'gu_jie_max_source', function () {               //古街最高分
            return this.data.gu_jie_max_source
        }, function (val) {
            if (val < this.data.gu_jie_max_source) {
                return;
            }
            this.data.gu_jie_max_source = val;
        });

        cc.js.getset(this, 'is_sign_in', function () {                      //是否签到
            return this.data.is_sign_in
        }, function (val) {
            this.data.is_sign_in = val;
        });

        cc.js.getset(this, 'integration_num', function () {                 //福缘积分
            return this.data.integration_num
        }, function (val) {
            this.data.integration_num = val;
        });

        cc.js.getset(this, 'mission_score_max', function () {               //任务分数
            return this.data.mission_score_max
        }, function (val) {
            if (val < this.data.mission_score_max) {
                return;
            }
            this.data.mission_score_max = val;
        });

        cc.js.getset(this, 'is_question', function () {                     //今日是否已经答题
            return this.data.is_question
        }, function (val) {
            if (val < this.data.is_question) {
                return;
            }
            this.data.is_question = val;
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
        return config.data.receive[this.get_round_lv()];
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

    /**古镇福利是否领取
     *
     */
    _p.get_is_receive = function (shop_id, receive_info) {
        if (!receive_info) {
            receive_info = this.get_cur_receive_data();
        }
        var is_reward = receive_info[shop_id] ? this.is_receive() : 1,
            is_unlock = is_reward === 1 ? 0 : 1;
        return [is_reward, is_unlock, shop_id];
    };

    /**获取所有古镇福利是否领取
     *
     */
    _p.get_all_is_receive = function () {
        var info = [];
        var receive_info = this.get_cur_receive_data();
        var len = Object.keys(config.data.shop).length;
        for (let i = 1; i <= len; i++) {
            info.push(this.get_is_receive(i, receive_info));
        }
        return info;
    };

    /**获得道具
     *
     * @param id    道具id
     * @param num   数量
     */
    _p.add_prop = function (id, num) {
        this.prop[id].num += num;
    };

    /**使用道具
     *
     * @param id    道具id
     * @param num   数量
     */
    _p.use_prop = function (id, num) {
        this.prop[id].num -= num;
    };

    /**获取文昌门活动对应奖励
     *
     */
    _p.get_wen_chang_men_reward = function (score) {
        var wen_chang_men_reward = config.data.wen_chang_men_reward;
        var data = null;
        for (let i = 10; i > 0; i--) {
            if (score >= wen_chang_men_reward[i].score) {
                data = wen_chang_men_reward[i].reward[0];
            }
        }
        var info = config.data.prop[id];
        return [[data.id, info.type, info.addition, data.num]];
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