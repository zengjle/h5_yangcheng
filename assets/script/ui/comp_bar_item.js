let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");

cc.Class({
    extends: require("view_cell"),
    properties: {
        lbl_item_title: cc.Label,
        lbl_item_info: cc.Label,
        lbl_progress: cc.Label,
        node_light:cc.Node,
        btn_get: cc.Button,

        node_light_spriteFrame:[cc.SpriteFrame],
        spriteFrame_bg: [cc.SpriteFrame],
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

    init_item: function (_msg, _idx) {
        //0."任务名",1. "任务内容",2.当前任务次数 ,3.'任务最多次数',
        //4.是否已领取奖励(0已领取,1未领取),5.场景ID(0为没有场景ID),6.该任务奖励
        this.state = _msg.info[4];
        this.mission_id = _idx+1;
        this.get_rewrad_stare = false;
        this.btn_get.node.active = true;
        this.node_light.active = false;
        this.scene_id = 0;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrame_bg[_idx % 2];
        let lbl_btn = this.btn_get.node._$Label;
        this.lbl_item_title.string = _msg.info[0];
        this.lbl_item_info.string = _msg.info[1];
        if (+this.state) {//未领取奖励
            let btn_color = _idx % 2 ? cc.hexToColor("#d2b182") : cc.hexToColor("#82a0d2");
            lbl_btn.setColor(btn_color);
            if (_msg.info[2] < _msg.info[4]) {
                if(_msg.info[5]) {
                    this.scene_id = _msg.info[5];
                }else{
                    this.btn_get.node.active = false;
                }
                this.lbl_progress.string = _msg.info[2] + "/" + _msg.info[3];
            } else {
                this.lbl_progress.string = "已完成";
                lbl_btn.getComponent(cc.Label).string = "领取";
                this.node_light.active = true;
                this.node_light.getComponent(cc.Sprite).spriteFrame = this.node_light_spriteFrame[_idx];
                this.node.getComponent(cc.Animation).play("bar_item");
                this.state && (this.get_rewrad_stare = true);
            }
            this.mission_reward = _msg.info[6];
        } else {
            this.lbl_progress.string = "已完成";
            this.btn_get.node.active = false;
            this.node_light.active = false;
        }


    },

    on_click: function () {
        if (+this.scene_id) {
            ui.emit("close_bar");
            ui.open(constant.SCENE_ID[this.scene_id]);
        } else {
            net.emit("get_daily_mission_reward",{mission_id:this.mission_id});
        }
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
