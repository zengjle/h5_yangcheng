let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");
let net             = require("net");


cc.Class({
    extends: require("view_cell"),

    properties:{
        item_constont:cc.Node,
        node_list:cc.Node,
        lbl_no_food_tips:cc.Node,
    },

    onLoad:function () {


    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler: function () {
        net.on("enter_friend_home_ret",(_msg)=>{

        },this.node);
    },

    _unregister_handler:function () {

    },

    init_friend:function(_bag_info){
        
    },

    on_choose_food:function(_, _prop_id){

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
