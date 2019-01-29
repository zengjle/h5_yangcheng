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
        node_head_change_bar:cc.Node,
        list_head_change:cc.Node,
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
        net.on("save_user_info_ret",(_msg)=>{
            tips.show("保存成功!");
        });


    },
    
    _unregister_handler: function () {
        net.off(this.node);
    },
    
    init_comp: function (_msg) {
        let user_info = _msg;
        // 0.玩家id,1.玩家昵称,2.玩家宣言,3.玩家头像id,4.玩家生涯信息[["进入游戏,2019-2-1"]...]
        this.editbox_nickname.string = user_info.nickname;
        this.editbox_manifesto.string = user_info.manifesto;
        this.lbl_user_id.string = "id:" + user_info.user_id; 
        this.btn_head.node.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("head_"+user_info[3]);
        // this.list_career.getComponent("comp_tableview").init(user_info.career.length,(_idx,_item)=>{
        //     _item.active = true;
        //     _item.getChildByName("lbl_info").getComponent(cc.Label).string = user_info.career[_idx][0];
        //     _item.getChildByName("lbl_time").getComponent(cc.Label).string = user_info.career[_idx][1];
        // });
    },

    init_head_bar:function(){
        let arr_head_frames = this.atlas_head.getSpriteFrames();
        this.list_head_change.getComponent("comp_tableview").init(arr_head_frames.length,(_idx,_item)=>{
            _item.active = true;
            _item.position = cc.p(0,0);
            _item.name = "btn_choose_head_" + arr_head_frames[_idx].name.split("head_")[0];
        });
        this.node_head_change_bar.active = true;
    },

    on_close: function () {
        ui.close();
    },

    on_close_head_bar: function () {
        this.node_head_change_bar.active = false;
    },

on_open_head_bar:function(){
    this.init_head_bar();
},

    on_save_user_info:function(){
        net.enit("save_user_info",{
            nickname:this.editbox_nickname.string,
            head_id:this.head_id,
            manifesto:this.editbox_manifesto.string,
        })
    },

    on_choose_head:function(_event){
        this.head_id = +(_event.target.name.split("btn_choose_head_")[0]);
        this.btn_head.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("head_" + this.head_id);
        this.on_close_head_bar();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
