let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");

cc.Class({
    extends: require("view_cell"),

    properties: {
        lbl_user_id: cc.Label,
        atlas_head:cc.SpriteAtlas,
        editbox_nickname:cc.EditBox,
        editbox_manifesto:cc.EditBox,
        btn_head:cc.Button,

        list_career: cc.Node,
    },

    onLoad: function () {

    },

    onEnable: function () {
        this._super();
    },

    onDisable: function () {
        this._super();

    },
    _register_handler: function () {

    },
    
    _unregister_handler: function () {
        net.off(this.node);
    },
    
    init_comp: function (_msg) {
        let user_info = _msg.user_info;
        // 0.玩家id,1.玩家昵称,2.玩家宣言,3.玩家头像id,4.玩家生涯信息[["进入游戏,2019-2-1"]...]
        this.editbox_nickname.string = user_info[1];
        this.editbox_manifesto.string = user_info[2];
        this.lbl_user_id.string = "id:" + user_info[0]; 
        this.btn_head.node.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("head_"+user_info[3]);
        this.list_career.getComponent("comp_tableview");
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
