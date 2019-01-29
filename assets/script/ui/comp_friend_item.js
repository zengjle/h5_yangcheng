let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");

cc.Class({
    extends: require("view_cell"),
    properties: {
        lbl_nickname: cc.Label,
        lbl_manifesto: cc.Label,
        img_tag: cc.img_tag,
        btn_goto: cc.Button,

        friend_tag:[cc.SpriteFrame],
        head_atals: cc.SpriteAtlas,
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

    init_item: function (_msg, _tab) {
        this.user_id = _msg.user_id;
        this.lbl_nickname.string = _msg.nickname,
        this.lbl_manifesto.string = _msg.manifesto,
        this.img_tag.spriteFrame = this.friend_tag[_tab];


    },

    on_click: function () {
        net.emit("enter_friend_home",{friend_id:this.user_id});
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
