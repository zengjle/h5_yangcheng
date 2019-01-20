let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");


cc.Class({
    extends: require("view_cell"),

    properties:{
        window_type :constant.WINDOW_TYPE.POPUP,

        node_reward_light:cc.Node,
    },

    onLoad:function () {


    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler:function () {
      
    },

    _unregister_handler:function () {

    },

    init_comp:function(_food){
        this.node_reward_light.getComponent("comp_reward_light").init_comp(_food);
        this.node_reward_light.scale = 0;
        this.scheduleOnce(()=>{
        this.node_reward_light.runAction(cc.scaleTo(0.1, 1, 1))
        },0.1);
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
