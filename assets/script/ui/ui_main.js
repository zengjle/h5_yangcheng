let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net  = require("net");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.BASE,

        node_daily_reward:cc.Node,
        atlas_ui:cc.SpriteAtlas,
        fish_honor:cc.Sprite,
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
            this.init_ui(_msg.fish.lv);
            this.node_daily_reward.parent.active =  !_msg.daily_reward_state;
            !_msg.daily_reward_state && this.node_daily_reward.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, 15),cc.rotateBy(0.2, -30),cc.rotateBy(0.1, 15))))
        },this.node);

        net.on("get_daily_reward_ret",(_msg)=>{
            ui.open("popup_reward_layer",_msg.prop);
            this.node_daily_reward.parent.active =  false;
        },this.node);

        ui.on("change_fish_image",(_msg)=>{
            this.init_ui(_msg.lv);
        },this.node);
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_ui: function (_lv) {
        let _fish_image_id = 1;
        if(_lv >= 30 && _lv < 60){
            _fish_image_id = 2;
        }else if(_lv >= 60 ){
            _fish_image_id = 3;
        }

        this.fish_honor.sproteFrame = atlas_ui.getSpriteFrame("honor_" + _fish_image_id);
    },

    update_repoint: function () {

    },

    on_get_daily_reward_: function () {
        net.emit("get_daily_reward");
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
