let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");
let data            = require("data");

cc.Class({
    extends: require("view_cell"),

    properties:{
        img_food_icon:cc.Sprite,
        node_shiny:cc.Node,
        atlas_food:cc.SpriteAtlas,
        lbl_name_sum:cc.Label,
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
        this.img_food_icon.spriteFrame = this.atlas_food.getSpriteFrame("icon_bag_" + _food_id[0]);
        this.lbl_name_sum.string = data.prop[_food[0].name] + "×" + _food[3];
    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
