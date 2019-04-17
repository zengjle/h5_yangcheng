let ui_window = require("ui_window");
let constant = require("constant");
let net = require("net");
let data = require("data");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,

        node_light : cc.Node,
        node_pray : cc.Node,

        btn_pray : cc.Node,
        btn_practise:cc.Node,
        node_practise:cc.Node,
        node_practise_fall:cc.Node,
        back_wood:cc.SpriteFrame,
        positive_wood:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
    },

    start: function () {
        net.emit("enter_wen_temple");
        this.init_light();
        this.node_pray.active = false;
    },

    onEnable: function () {
        this._super();
    },

    onDisable: function () {
        this._super();
    },

    _register_handler: function () {
        net.on("wen_temple_pray_ret", (_msg) => {
            ui.emit("touch_enable",false);
            ui.open("popup_reward_layer", _msg.pray_reward);
        }, this.node);

        net.on("wen_divination_ret", (_msg) => {
            this.node_practise.active = false;
            this.btn_practise.active = false;
            let _str = "";
            let wood_one = this.back_wood;
            let wood_two = this.back_wood;
            if(_msg.divination_result[0] === 1){
            _str = "圣杯!恭喜您获得大量!(可继续掷珓次数为"+_msg.divination_result[2] +")";
                wood_one = this.positive_wood;
                wood_two = this.back_wood;
            }else if(_msg.divination_result[0] === 2){
                _str = "笑杯!恭喜您获得福缘!";
                wood_one = this.positive_wood;
                wood_two = this.positive_wood;
            }else if(_msg.divination_result[0] === 3){
                wood_one = this.back_wood;
                wood_two = this.back_wood;
                _str = "阴杯,获取少量福缘!";
            }
            let practise_callback = ()=>{
                ui.emit("touch_enable",false);
                if(_msg.divination_result[0] === 1 && _msg.divination_result[2] > 0){
                    this.btn_practise.active = true;
                }
                this.node_practise.active = false;
                ui.open( "popup_reward_layer",Global.DataMgr.get_info_by_id(9,_msg.divination_result[1]),_str);
            };
           
            this.node_practise.children[0].getComponent(cc.Sprite).spriteFrame = wood_one;
            this.node_practise.children[1].getComponent(cc.Sprite).spriteFrame = wood_two;
            this.node_practise_fall.active = true;
            this.node_practise_fall.y = 0;
            this.node_practise.active = true;
            this.node_practise.opacity = 0;
            let _practise_action = cc.sequence(
                cc.moveBy(1, cc.p(0,-300)),
                    cc.fadeOut(0.5),
                cc.callFunc(() => {
                    this.node_practise.runAction(cc.sequence(cc.fadeIn(1),
                        cc.delayTime(1),
                        cc.callFunc(() => {
                            practise_callback();
                        }))
                    );
                }
                )
            )
            this.node_practise_fall.runAction(_practise_action);
        });

        net.on("enter_wen_temple_ret",this.init_ui.bind(this));
    },

    init_ui: function (_msg) {
        this.btn_pray.active = !_msg.pray_state;
        this.btn_practise.active = !!_msg.practise_state;
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_light: function () {
        for(let _light of this.node_light.children){
            let _random = Math.floor(Math.random()*3) + 1;
            Global.ActionMgr.create("fade",_light,[_random],0,true);
        }
    },
    pray_callback:function(){
        this.btn_pray.active = false;
        this.node_pray.active = false;
        net.emit("wen_temple_pray");
    },

    on_pray: function () {
        this.node_pray.active = true;
        this.node.getComponent(cc.Animation).play("pray");
        ui.emit("touch_enable",true);
        
    },
    on_practise:function(){
        ui.emit("touch_enable",true);
        net.emit("wen_divination");
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName, 3);
    },
});
