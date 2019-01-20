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
        atlas_title_icon: cc.SpriteAtlas,
        progressbar_fish_exp: cc.ProgressBar,
        img_food: cc.Sprite,
        lbl_fish_lv: cc.Label,
        lbl_user_lv: cc.Label,
        lbl_integral: cc.Label,
        lbl_feed_tips:cc.Label,

        spriteatlas_food: cc.SpriteAtlas,

        node_friend: cc.Node,
        node_mission: cc.Node,
        node_bag: cc.Node,

    },

    // use this for initialization
    onLoad: function () {

    },

    start:function(){
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
            this.food = [_msg.prop_id, 1, data.prop[_msg.prop_id].addition, 1];
            this.lbl_feed_tips.string = "喂食";
            this.img_food.spriteFrame = this.spriteatlas_food.getSpriteFrame("bag_food_" + _msg.prop_id);
            this.on_chick_active_bar(null, false);
        }, this.node)
        net.on("create_fish_data_ret",this.init_bar.bind(this));
        net.on("feed_fish_ret", this.init_bar.bind(this));
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
    },

    _unregister_handler: function () {

    },
    status_bar_active: function (_visiable) {
        this.node.active = _visiable;
    },

    init_bar: function (_msg) {
        let _fish = _msg.fish;
        this.lbl_integral.string = _msg.integral;
        this.progressbar_fish_exp.progress = _fish.exp / _fish.max_exp;
        this.lbl_fish_lv.string = "lv." + _fish.lv;
        this.lbl_user_lv.string = _fish.lv;
        this.img_food.spriteFrame = null;
        this.lbl_feed_tips.string = "选择食物";
        this.food = null;

    },

    init_plate: function (_id) {

    },

    init_friend_bar: function () {

    },

    init_mission_bar: function () {

    },

    init_bag_bar: function () {

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
        ui.open(_uiName);
    },

    on_feed_fish: function () {
        !this.food && this.on_chick_active_bar(null, 3)
        !!this.food && net.emit("feed_fish", {food: this.food });
    },

    on_chick_active_bar(_, state) {
        let _bar_move_to;
        let _state = parseInt(state);
        ui.emit("touch_enable", true);
        if (_state) {
            if(_state === 1){
                tips.show("好友功能暂未开启!");
                ui.emit("touch_enable", false);
                return;
            }
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
    },
});
