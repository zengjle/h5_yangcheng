let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");

cc.Class({
    extends: ui_window,

    properties:{
        window_type: constant.WINDOW_TYPE.BASE,


    },

    onLoad:function () {
    this.food = [1,1,100,1];

    },

    onEnable:function () {
        this._super();
    },

    _register_handler:function () {
      
    },

    _unregister_handler:function () {

    },

    init_ui:function(){

    },

    update_repoint:function () {
       
    },

    on_feed:function(){

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
