let ui_window = require("ui_window");
let constant = require("constant");
let net = require("net");
cc.Class({
    extends: ui_window,

    properties: {
        window_type :constant.WINDOW_TYPE.UI,

        node_shop_info:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        net.emit("enter_mission",this.init_ui.bind(this));
    },
    
    onEnable:function () {
        this._super();
    },

    onDisable:function(){
        this._super();
    },
    
    _register_handler:function () {
       
    },
    
    init_ui:function(_action_state){

    },

    _unregister_handler:function () {

    },

    on_choose_shop:function(_,_shop_id){

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },
});
