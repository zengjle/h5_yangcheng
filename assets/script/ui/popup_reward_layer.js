let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");


cc.Class({
    extends: require("view_cell"),

    properties:{
        window_type :constant.WINDOW_TYPE.POPUP,

        node_reward_light:cc.Node,
        lbl_tips:cc.Label,
    },

    onLoad:function () {
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, 1, 1),cc.callFunc(()=>{
        if(this.args.length > 1){
            this.lbl_tips.node.active = true;            
            this.init_comp(this.args[0],this.args[1]);
        }else{
            this.lbl_tips.node.active = false;
            this.init_comp(this.args[0]);
        }
    })))
    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler:function () {
      
    },

    _unregister_handler:function () {

    },

    init_comp:function(_food,_tips_str){
        this.lbl_tips.string = _tips_str;
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
