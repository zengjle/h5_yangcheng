/**
 * Created by xianbei on 18/5/5.
 * */

let constant = require("constant");
let download = require("download");

let tips = {};

tips._tips_arr = [];
tips._total_tip = 0;

tips.get_tip_root = function () {
    if (tips._tip_root) {
        return tips._tip_root;
    }
    let _root_node = new cc.Node();
    _root_node.name = "tips_root_node"
    _root_node.position = cc.p(constant.DESIGN_RESOLUTION.width / 2, constant.DESIGN_RESOLUTION.height * 3 / 5);
    cc.game.addPersistRootNode(_root_node);

    tips._tip_root = _root_node;

    return tips._tip_root;
};

tips._show = function (msg, color, outline, _extNode,_pos) {
    let label_node = new cc.Node();
    label_node.is_move = false;
    label_node.color = color || cc.hexToColor("f3f5f3");
    label_node.zIndex = 99999;
    label_node.width = 600;
    label_node.position = _pos || cc.p(0, 0);
    let _root_node = tips.get_tip_root();
    label_node.parent = _root_node;

    let label = label_node.addComponent(cc.Label);
    label.string = msg || "";
    label.fontSize = 36;
    label.lineHeight = 44;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.overflow = cc.Label.Overflow.NONE;

    let label_outline = label_node.addComponent(cc.LabelOutline);
    label_outline.color = color || cc.Color.BLACK;
    label_outline.width = 2;

    if (_extNode) {
        _extNode.x = -label_node.width / 2 - 10;
        _extNode.parent = label_node
    };

    let delay_time = 0.5;
    let dismiss_time = 0.5;
    let action = cc.sequence(cc.delayTime(delay_time),
        cc.callFunc(() => {
            label_node.is_move = true;
        }),
        cc.spawn(cc.moveBy(dismiss_time, 0, 300), cc.fadeOut(dismiss_time)),
        cc.removeSelf());
    label_node.runAction(action);
};

tips.show = function (msg, color, outline,_pos) {
    let _msg_arr = msg.split("\n");
    for (let _msg of _msg_arr) {
        this._show(_msg, color, outline,null,_pos);
    }
};

tips.show_reward = function (_rewardInfo,_pos,_type_id) {
    let icon_node = new cc.Node();
    icon_node.anchorX = 1;
    if(_rewardInfo.type==="res"){
        icon_node.scale = 2;
    }else{
        icon_node.scale = 0.7;
    }
    
    let icon_spr = icon_node.addComponent(cc.Sprite);
    let icon_frame = download.get_icon(_rewardInfo.type + "_" + _rewardInfo.id);
    icon_spr.spriteFrame = icon_frame;
    if(_type_id === 3){
        this.text = (icon_frame ? "" : _rewardInfo.name + " " + (_rewardInfo.property_name || "")) + "- " + _rewardInfo.num;
    }else{
        this.text = (icon_frame ? "" : _rewardInfo.name + " " + (_rewardInfo.property_name || "")) + "+ " + _rewardInfo.num;
    }    
    this._show(this.text, null, null, icon_node,_pos);
};

tips.show_reward_multi = function (_rewards) {
    for (let i = 0; i < _rewards.length; i++) {
        tips.show_reward(_rewards[i]);
    }
};

tips.no_imp = function () {
    this.show("该功能暂未实现");
};


window.tips = tips;
module.exports = tips;