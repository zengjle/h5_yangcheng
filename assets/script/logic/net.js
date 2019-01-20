// let fish = null;
let net = cc.Class({
    extends: require("logic"),
    // ctor: function () {
    // fish = require("FishMgr")
    // },

    init: function () {
        this.read_query = [];
        this._register_handler();
    },

    init_modules: function () {

    },

    _register_handler: function () {
        this.on("enter_game", this.enter_game.bind(this));
        this.on("enter_mission_page", this.enter_mission_page.bind(this));
        this.on("enter_mission", this.enter_mission.bind(this));
        this.on("enter_friend", this.enter_friend.bind(this));
        this.on("enter_bag", this.enter_bag.bind(this));
        this.on("get_mission_reward", this.get_mission_reward.bind(this));
        this.on("start_mission_game", this.start_mission_game.bind(this));


        this.on("enter_old_town", this.enter_old_town.bind(this));
        this.on("get_old_town_food", this.get_old_town_food.bind(this));
        this.on("get_friend_food", this.get_friend_food.bind(this));


        this.on("feed_fish", this.feed_fish.bind(this));
        this.on("create_fish_data", this.create_fish_data.bind(this));
        this.on("add_props", this.add_props.bind(this));

        this.on("get_dayly_reward", this.get_dayly_reward.bind(this));
        this.on("dayly_question_answer", this.dayly_question_answer.bind(this));
        this.on("get_dayly_question_answer_reward", this.get_dayly_question_answer_reward.bind(this));

        this.on("change_score", this.change_score.bind(this));

    },

    //进入任务界面
    enter_mission: function (_event_name) {
        var emit_msg = _event_name.type + "_ret";
        this.emit(emit_msg, {mission_info: Global.DataMgr.get_mission_data()});
    },

    //进入好友界面
    enter_friend: function (_event_name) {
        var emit_msg = _event_name.type + "_ret";

        Global.UserMgr.get_friend_info(function (info) {
            this.emit(emit_msg, info);
        }.bind(this));
    },

    //背包数据
    enter_bag: function (_event_name) {
        var emit_msg = _event_name.type + "_ret";
        this.emit(emit_msg, Global.DataMgr.prop);
    },

    //进入文昌门
    enter_mission_page: function (msg, _event_name) {
        var emit_msg = _event_name.type + "_ret";
        var index, title;

        if (msg.id === 1) {
            index = 'wen_chang_men_max_source';
            title = '文昌门';
        } else {
            index = 'gu_jie_max_source';
            title = '古街';
        }

        this.emit(emit_msg, {title: title, max_mission_score: Global.DataMgr[index]});
    },

    //开始文昌阁活动
    start_mission_game: function (msg, _event_name) {
        this.enter_mission_page(_event_name, msg);
    },

    //进入古镇
    enter_old_town: function (id, shop_id, _event_name) {
        var data = Global.DataMgr.get_cur_receive_data(),
            emit_msg = _event_name.type + "_ret",
            level = Global.DataMgr.get_lv(),
            is_question = Global.DataMgr.is_question ? 1 : 0;
        this.emit(emit_msg, {shop_info: Global.DataMgr.get_all_is_receive(), level: level, question: is_question});
    },

    //领取古镇福利
    get_old_town_food: function (msg, _event_name) {
        var prop_data = config.prop[msg.shop_id],
            receive_data = Global.DataMgr.get_cur_receive_data(),
            num = receive_data[msg.shop_id];

        Global.DataMgr.update_receive_time(msg.shop_id);
        Global.DataMgr.add_prop(msg.shop_id, num);

        this.emit(_event_name.type + "_ret", {
            info: [msg.shop_id, prop_data.type, prop_data.addition, num],
            shop_info: Global.DataMgr.get_is_receive(msg.shop_id)
        });
    },

    //获取好友食物
    get_friend_food: function (id, shop_id, _event_name) {

    },

    //文昌阁活动结束领取奖励
    get_mission_reward: function (msg, _event_name) {
        Global.DataMgr.wen_chang_men_max_source = msg.mission_score;
        var reward_prop = Global.DataMgr.get_wen_chang_men_reward(msg.mission_score);
        var data = {reward_prop: reward_prop};
        if (Global.DataMgr.wen_chang_men_max_source === msg.mission_score)
            data.max_mission_score = msg.mission_score;
        this.emit(_event_name.type + "_ret", data);
    },

    enter_game: function (_, _event_name) {
        //var user_info = Global.DataMgr.user_info;
        var user_info = "hello";
        var emit_msg = _event_name.type + "_ret";
        this.emit(emit_msg, user_info);
    },

    //初始化鱼信息
    create_fish_data: function (msg, _event_name) {
        var fn = function () {
            var fish = Global.FishMgr.create_fish_data(Global.DataMgr.fish[1]);
            this.emit(_event_name.type + "_ret", {fish: fish});
        }.bind(this);

        if (Global.DataMgr.fish[1]/* && Object.keys(Global.DataMgr.fish)*/) {
            fn.call(this);
        } else {
            Global.Observer.once('DataMgr_init_data_ok', fn, this);
        }
    },

    //喂鱼
    feed_fish: function (_msg, _event_name) {
        var add_exp = _msg.food[2];
        var fish = Global.FishMgr.fish[1];

        fish.exp += add_exp;

        var level_up = 0;
        while (fish.exp >= fish.max_exp) {
            fish.lv += 1;
            fish.exp -= fish.max_exp;
            fish.max_exp = Math.floor(200 * Math.pow(fish.lv, 2));
            level_up++;
        }

        this.emit(_event_name.type + "_ret", {
            lv: fish.lv,
            exp: fish.exp,
            max_exp: fish.max_exp,
            level_up: level_up,
            score: add_exp / 10
        })
    },


    //更改福缘
    change_score: function (msg, _event_name) {
        Global.DataMgr.integration_num += msg.score;
        this.emit(_event_name.type + "_ret", {score: Global.DataMgr.integration_num});
    },

    //使用道具
    use_props: function (_msg, _event_name) {
        var info = [];
        var prop = _msg.prop;
        if (prop[0] == 6 || prop[0] == 7) {
            info = Global.DataMgr.opne_prop(prop[0]);
            var prop_info = config.data.prop[info[0]];
            info.splice(1, 0, prop_info.type);
            info.splice(2, 0, prop_info.addition);
        }
        Global.DataMgr.use_prop(prop[0], 1);
        this.emit(_event_name.type + "_ret", {info: info});
    },

    //添加道具
    add_props: function (_msg, _event_name) {
        Global.DataMgr.add_prop(id, num);
        this.emit(_event_name.type + "_ret")
    },

    //每日领取食袋
    get_dayly_reward: function (_msg, _event_name) {
        var prop = Global.DataMgr.is_sign_in ? [] : [6, 2, 0, 1];
        Global.DataMgr.is_sign_in = true;
        this.emit(_event_name.type + "_ret", {prop: prop})
    },

    //每日问答
    dayly_question_answer: function (_msg, _event_name) {
        var _question_id = Math.floor(Math.random() * data.question.answer.length);
        Global.DataMgr.is_question = true;
        this.emit(_event_name.type + "_ret", {question_answer_id: _question_id})
    },

    //领取每日问答奖励
    get_dayly_question_answer_reward: function (_msg, _event_name) {
        var prop = _msg.answer ? [7, 2, 0, 1] : [6, 2, 0, 1];
        this.emit(_event_name.type + "_ret", {prop: prop})
    },
});

module.exports = window.aaa = new net();