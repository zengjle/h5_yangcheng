let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net  = require("net");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.BASE,

        node_dayly_reward:cc.Node,
    },

    onLoad: function () {
        this.food = [1, 1, 100, 1];
        cc.vv.fish = this.node._$node_fish;

        Global.ActionMgr.create('flutter', this.node._$node_fish, null, 0, true);

    },

    onEnable: function () {
        this._super();
    },

    _register_handler: function () {
        net.on("create_fish_data_ret",(_msg)=>{
            _msg.dayly_reward_state = 0;
            this.node_dayly_reward.parent.active =  !_msg.dayly_reward_state;
            !_msg.dayly_reward_state && this.node_dayly_reward.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, 15),cc.rotateBy(0.2, -30),cc.rotateBy(0.1, 15))))
        },this.node);

        net.on("get_dayly_reward_ret",(_msg)=>{
            ui.open("popup_reward_layer",_msg.prop);
            this.node_dayly_reward.parent.active =  false;
        },this.node);
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_ui: function () {

    },

    update_repoint: function () {

    },

    on_get_dayly_reward_: function () {
        net.emit("get_dayly_reward");
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
