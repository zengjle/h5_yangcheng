let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");
let data            = require("data");

cc.Class({
    extends: require("view_cell"),

    properties:{
        window_type :constant.WINDOW_TYPE.POPUP,

        lbl_introduced:cc.Label,
    },

    onLoad:function () {
       this.init_comp(this.args[0]);
    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler:function () {
      
    },

    _unregister_handler:function () {

    },

    init_comp:function(_scene_id){
       this.lbl_introduced.string = data.introduced[_scene_id].label;
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
