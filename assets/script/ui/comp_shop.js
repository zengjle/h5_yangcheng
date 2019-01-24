let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");


cc.Class({
    extends: require("view_cell"),

    properties:{
        lbl_integral:cc.Label,
        list_commodity:cc.Node,
    },

    onLoad:function () {
        net.emit("enter_shop");
    },

    onEnable:function () {
        this._super();
    },

    _register_handler:function () {
      net.on("enter_shop_ret",init_comp.bind(this));
    },

    _unregister_handler:function () {

    },

    init_comp:function(_msg){
    this.lbl_integral.string = _msg.integral;
    this.list_commodity.getComponent("tableView").i
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
