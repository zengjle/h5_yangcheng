let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");

cc.Class({
    extends: require("view_cell"),
    properties: {
        lbl_nickname: cc.Label,
        lbl_manifesto: cc.Label,
        img_tag: cc.Sprite,
        lbl_click_btn: cc.Label,
        img_head :cc.Sprite,

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
        net.on("add_friend_ret", (_msg) => {
            tips.show("好友添加成功!");
            this._tag = 0;
            var user_info = Global.all_user_game_data[_msg.friend_id].user_info;
            this.img_head.spriteFrame = this.head_atals.getSpriteFrame("head_"+ user_info.head_id);
            this.lbl_click_btn.string = !this._tag?"拜访":"添加";
        }, this.node);
    },

    _unregister_handler: function () {

    },

    init_item: function (_msg, _tag) {
        this.user_id = _msg.user_id;
        this.lbl_nickname.string = _msg.nickname,
        this.lbl_manifesto.string = _msg.manifesto,
        this.img_tag.spriteFrame = this.friend_tag[_tag];
        this._tag = _tag;
        this.img_head.spriteFrame = this.head_atals.getSpriteFrame("head_"+ _msg.head_id);
        if(this.user_id === Global.DataMgr.data.id){
            this.lbl_click_btn.node.parent.active = false;
        }
        this.lbl_click_btn.string = !this._tag?"拜访":"添加";

    },

    on_click: function () {
        if(!this._tag){
            net.emit("enter_friend_home",{friend_id:this.user_id});
        }else{
            net.emit("add_friend",{friend_id : this.user_id})
        }
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
