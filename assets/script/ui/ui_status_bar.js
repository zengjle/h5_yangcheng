let constant = require("constant");
let ui_window = require("ui_window");
let ui = require("ui");
let utils = require("utils");
let data = require("data");
let net = require("net");
cc.Class({
    extends: ui_window,

    properties: {
        node_mission_bar: cc.Node,
        node_mission_mask: cc.Node,

        title_icon: cc.Sprite,
        lbl_bar_title: cc.Label,
        icon_head: cc.Sprite,
        atlas_title_icon: cc.SpriteAtlas,
        atlas_head: cc.SpriteAtlas,
        progressbar_fish_exp: cc.ProgressBar,
        img_food: cc.Sprite,
        lbl_fish_lv: cc.Label,
        lbl_user_lv: cc.Label,
        lbl_integral: cc.Label,
        lbl_feed_tips: cc.Label,

        spriteatlas_food: cc.SpriteAtlas,

        node_friend: cc.Node,
        node_mission: cc.Node,
        node_bag: cc.Node,
        node_shop: cc.Node,
        node_head_info: cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        this.node_mission_bar.active = false;
        this.node_mission_mask.active = false;
        this.node_bag.active = false;
        this.node_friend.active = false;
        this.node_mission.active = false;
        this.node_shop.active = false;
        this.node_head_info.active = false;
    },

    start: function () {
        net.emit("create_fish_data");
    },

    _init_data: function (_info) {
        this.title_icon.SpriteFram = this.atlas_title_icon.getSpriteFrame(info[0]);
    },

    onDisable: function () {
        this._super();
    },

    onEnable: function () {
        this._super();
    },

    _register_handler: function () {
        ui.on("choose_food", (_msg) => {
            this.img_food.node.scale = 1;
            this.food = [_msg.prop_id, 1, data.prop[_msg.prop_id].addition, 1];
            this.lbl_feed_tips.string = "喂食";
            this.img_food.spriteFrame = this.spriteatlas_food.getSpriteFrame("bag_food_" + _msg.prop_id);
            this.on_chick_active_bar(null, false);
        }, this.node),
            net.on("create_fish_data_ret", this.init_bar.bind(this));
        net.on("get_daily_mission_reward_ret", (_msg) => {
            this.on_chick_active_bar(null, false);
            ui.open("popup_reward_layer", _msg.prop);
        }, this.node);
        net.on("feed_fish_ret", (_msg) => {
            ui.emit("touch_enable", true);
            var pos = Global.getNodeAToNodeBPoint(cc.vv.fish, this.img_food.node.parent);
            Global.ActionMgr.create('sequence', this.img_food.node, [[{
                name: 'jumpTo',
                param: [pos]
            }, {
                name: 'scaleTo',
                param: [0]
            }
            ]
            ], 0, false, function () {
                tips.show("福缘 + " + (_msg.integral - this.integral));
                ui.emit("touch_enable", false);
                if (+_msg.fish.lv > this.cur_lv && this.cur_lv === 29 || this.cur_lv === 59 || this.cur_lv === 89) {
                    ui.emit("change_fish_image", { lv: _msg.fish.lv });
                }
                Global.ActionMgr.create('tremble', cc.vv.fish, [], 0, false);
                if (Global.DataMgr.prop[this.food[0]].num < 1) {
                    tips.show( data.prop[this.food[0]].name + "已经没有啦,看看有没有别的食物可以喂养锦鲤。");
                } else {
                    this.img_food.node.scale = 1;
                    this.lbl_feed_tips.string = "喂食";
                    this.img_food.node.setPosition(cc.p(0, 0));
                    this.img_food.spriteFrame = this.spriteatlas_food.getSpriteFrame("bag_food_" + this.food[0]);
                }
                this.init_bar(_msg);
            }.bind(this));
            //
            // Global.ActionMgr.create('jumpTo', this.img_food.node, [pos], 0, false, function () {
            //
            // }.bind(this));
        });
        net.on("buy_commodity_ret", (_msg) => {
            this.lbl_integral.string = _msg.integral;
        }, this.node);
        net.on("enter_bag_ret", (_msg) => {
            this.lbl_bar_title.string = "库存";
            this.node_bag.active = true;
            this.node_bag.getComponent("comp_bag").init_bag(_msg);
            this.show_bar();
        }, this.node);
        net.on("enter_mission_ret", (_msg) => {
            this.lbl_bar_title.string = "任务";
            this.node_mission.active = true;
            this.node_mission.getComponent("comp_mission").init_mission(_msg.mission_info);
            this.show_bar();

        }, this.node);
        net.on("enter_friend_ret", (_msg) => {
            this.lbl_bar_title.string = "好友";
            this.node_friend.active = true;
            this.node_friend.getComponent("comp_friend").init_friend(_msg.friend_info);
            this.show_bar();
        })
        net.on("use_props_ret", (_msg) => {
            ui.open("popup_reward_layer", _msg.info);
            this.on_chick_active_bar(null, false);
        }, this.node);

        net.on("save_user_info_ret", (_msg) => {
            this.icon_head.spriteFrame = this.atlas_head.getSpriteFrame("head_" + _msg.head_id);
        }, this.node);

        ui.on("close_bar", () => {
            this.on_chick_active_bar(null, false);
        }, this.node);
    },

    _unregister_handler: function () {
        ui.off(this.node);
        net.off(this.node);
    },
    status_bar_active: function (_visiable) {
        this.node.active = _visiable;
    },

    init_bar: function (_msg) {

        var _fish = _msg.fish;
        this.integral = _msg.integral;
        this.lbl_integral.string = _msg.integral;
        this.lbl_fish_lv.string = "lv." + _fish.lv;
        this.cur_lv = +_fish.lv;
        this.lbl_user_lv.string = _fish.lv;
        !!_msg.user_info  && (this.icon_head.spriteFrame = this.atlas_head.getSpriteFrame("head_" + _msg.user_info.head_id));
        
        
        if (_msg.level_up || _msg.level_up === 0) {
            var psbar_fish_exp = this.progressbar_fish_exp;
            Global.ActionMgr.create('progress', psbar_fish_exp.node, [psbar_fish_exp, _fish.exp / _fish.max_exp, _msg.level_up], 0, false);
        } else {
            this.progressbar_fish_exp.progress = _fish.exp / _fish.max_exp;
        }
        if( !this.food || Global.DataMgr.prop[this.food[0]].num < 1){
            this.lbl_feed_tips.string = "选择食物";
            this.food = null;
            this.img_food.spriteFrame = null;
        }
    },
    
    init_plate: function (_id) {

    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName, 0);
    },

    on_open_shop: function () {
        this.node_shop.active = true;
        net.emit("enter_shop");
    },

    on_close_shop: function () {
        this.node_shop.active = false;
    },

    show_bar: function () {
        this.node_mission_bar.active = true;
        let _bar_move_to = cc.moveTo(0.3, cc.v2(0, 406));
        this.node_mission_mask.active = true;
        this.node_mission_bar.runAction(cc.sequence(_bar_move_to, cc.callFunc(() => {
            ui.emit("touch_enable", false);
        }, this)));
    },

    on_choose_sys: function (_, _uiName) {
        this.on_chick_active_bar(null, false, () => {
            ui.open(_uiName);
        });
    },

    on_open_map:function(){
        ui.open("ui_map");
    },

    on_feed_fish: function () {
        this.img_food.node.setPosition(cc.v2(0,0));
        !this.food && this.on_chick_active_bar(null, 3)
        !!this.food && net.emit("feed_fish", { food: this.food });
    },

    on_chick_user_head: function () {
        this.node_head_info.active = true;
        this.node_head_info.getComponent("comp_user_info").init_comp(Global.DataMgr.user_info);
    },

    on_close_user_head: function () {
        this.node_head_info.active = false;
    },

    on_chick_active_bar(_event, state, _cb) {
        let _bar_move_to;
        let _state = parseInt(state);
        // if (_state === 1) {
        //     tips.show('暂未开放，敬请期待');
        //     return;
        // }
        ui.emit("touch_enable", true);
        if (_state) {
            net.emit("enter_" + constant.BAR_ID[_state]);
            this.title_icon.spriteFrame = this.atlas_title_icon.getSpriteFrame("icon_" + constant.BAR_ID[_state]);
        } else {
            _bar_move_to = cc.moveTo(0.3, cc.v2(0, -640));
            this.node_mission_bar.runAction(cc.sequence(_bar_move_to, cc.callFunc(() => {
                this.node_mission_bar.active = false;
                this.node_mission_mask.active = false;
                this.node_bag.active = false;
                this.node_friend.active = false;
                this.node_mission.active = false;
                ui.emit("touch_enable", false);
            }, this)));
        }
        !!_cb && _cb();
    },
});
