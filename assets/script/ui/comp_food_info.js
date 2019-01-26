let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");
let data = require("data");
let tips = require("tips");

cc.Class({
    extends: require("view_cell"),
    properties: {
        node_icon:cc.Sprite,
        lbl_exchange_intrgral:cc.Label,
        lbl_name:cc.Label,
        atlas_icon:cc.SpriteAtlas
},

    onLoad: function () {
       

    },

    start:function(){
      
    },

    onEnable: function () {
        this._super();
    },

    _register_handler: function () {

    },

    _unregister_handler: function () {

    },

    init_item: function (_info) {
        this.info = _info
        this.node_icon.spriteFrame = this.atlas_icon.getSpriteFrame("bag_food_" + _info[0][0]);
        this.lbl_name.string = data.prop[_info[0][0]].name;
        this.lbl_exchange_intrgral.string = "价格:" + _info[4];
    },

    on_click: function () {
        if(this.info[4]< Global.DataMgr.integration_num){
            net.emit("buy_commodity",{prop_id : this.info[0][0],exchange_integral :this.info[1]});
        }else{
            tips.show("您的福缘不足以兑换该商品!");
        }
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
