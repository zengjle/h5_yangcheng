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
        this.lbl_name.string = _info.name;
        this.lbl_exchange_intrgral.string = "价格:" + _info.need_integral;
        this.node_icon.spriteFrame = this.atlas_icon.getSpriteFrame(_info.sample);
        if(!this.node_icon.spriteFrame){
            Global.Loader.changeSpriteFrame('food/'+_info.sample,this.node_icon);
        }
    },

    on_click: function () {
        if(this.info.need_integral< Global.DataMgr.integration_num){
            net.emit("buy_commodity",{info:this.info});
        }else{
            tips.show("您的福缘不足以兑换该商品!");
        }
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
