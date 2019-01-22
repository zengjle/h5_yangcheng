let ui_window = require("ui_window");
let constant = require("constant");
let net = require("net");
let data = require("data");

cc.Class({
    extends: ui_window,

    properties: {
        window_type :constant.WINDOW_TYPE.UI,

        node_shop_info:cc.Node,
        node_daily_question_answer:cc.Node,
        node_food_info:cc.Node,

        btn_question_answer:cc.Button,
        atals_food:cc.SpriteAtlas,


        node_results:cc.Node,
        node_answer_ing:cc.Node,
        spriteFrame_answer:[cc.SpriteFrame],
        spriteFrame_reward_btn:[cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
    },
    
    start: function () {
        net.emit("enter_old_town");

    },

    onEnable:function () {
        this._super();
    },

    onDisable:function(){
        this._super();
    },
    
    _register_handler:function () {
        net.on("enter_old_town_ret",this.init_ui.bind(this));

       net.on("daily_question_answer_ret",(_msg)=>{
        this.question_id = _msg.question_answer_id;
        let _question_info = data.question.info[_msg.question_answer_id];
        let node_question_ing = this.node_daily_question_answer.getChildByName("node_answer_ing");
        node_question_ing.getChildByName("btn_anwser_1").getChildByName("Label").getComponent(cc.Label).string = _question_info.option[0];
        node_question_ing.getChildByName("btn_anwser_2").getChildByName("Label").getComponent(cc.Label).string = _question_info.option[1];
        this.node_daily_question_answer.getChildByName("lbl_food_detials").getComponent(cc.Label).string = _question_info.subject;
        this.node_daily_question_answer.active = true;
        node_question_ing.active = true;
        this.node_results.active = false;
       },this.node);

       net.on("get_daily_question_answer_reward_ret",(_msg)=>{
        net.emit("enter_old_town");
        this.node_daily_question_answer.getChildByName("node_answer_ing").active = false;
        this.node_results.active = true;
        let _img_answer = this.node_results.getChildByName("img_answer");
        let _reward_light = this.node_results.getChildByName("comp_reward_light");
        _img_answer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame_answer[_msg.prop[0] === 6?0:1];
        _reward_light.getComponent("comp_reward_light").init_comp(_msg.prop);
        _reward_light.scale = 0;
        this.scheduleOnce(()=>{
            _reward_light.runAction(cc.scaleTo(0.1, 1, 1));
        },0.1)
       },this.node);

       net.on("get_old_town_food_ret",(_msg)=>{
           this.shop_info = _msg.shop_info;
           this.init_shop_info(this.shop_id);
        ui.open("popup_reward_layer",_msg.shop_info)
       },this.node);
    },
    
    init_ui:function(_msg){
        this.shop_info = _msg.shop_info;
        this.btn_question_answer.node.active = !_msg.question;
    },

    init_shop_info:function(_shop_id){
        this.shop_id = _shop_id;
        if(!!this.shop_info[_shop_id]){
            this.node_shop_info.getChildByName("node_food_details").getChildByName("lbl_food_details").getComponent(cc.Label).string = data.shop[_shop_id].detalis;
            this.node_shop_info.getChildByName("lbl_food_name").getComponent(cc.Label).string = data.shop[_shop_id].title;
            this.node_shop_info.getChildByName("img_food_icon").getComponent(cc.Sprite).spriteFrame = this.atals_food.getSpriteFrame("bag_food_" + _shop_id);
            this.node_shop_info.getChildByName("node_show_get_time").active = this.shop_info[_shop_id][0] === 2;
            let _btn_be_get = this.node_shop_info.getChildByName("btn_get_food");
            _btn_be_get.active = this.shop_info[_shop_id][0] !== 2;
            _btn_be_get.getComponent(cc.Button).enabled = !this.shop_info[_shop_id][0];
            _btn_be_get.getComponent(cc.Sprite).spriteFrame = this.spriteFrame_reward_btn[!this.shop_info[_shop_id][0]?0:1]
            _btn_be_get.getChildByName("Label").getComponent(cc.Label).string = !this.shop_info[_shop_id][0]?"领取":"已领取";
        }
    },

    _unregister_handler:function () {
        net.off(this.node);
    },

    on_choose_shop:function(_,_shop_id){
        if (!!this.shop_info[_shop_id]) {
            this.node_shop_info.scale = 0;
            this.init_shop_info(_shop_id);
            this.node_shop_info.active = true;
            this.node_shop_info.runAction(cc.scaleTo(0.1, 1, 1))
        }
        !this.shop_info[_shop_id] && tips.show("暂未解锁该商店!请提升锦鲤等级!");
    },

    on_close: function () {
        ui.close();
    },

    on_close_answer: function () {
        this.node_daily_question_answer.active = false;
    },

    on_close_reward_bar:function(){
        this.node_shop_info.active = false;
    },

    on_choose_answer:function(_,_answer_id){
        let answer = data.question.answer[this.question_id];
        answer === parseInt(_answer_id);
        net.emit("get_daily_question_answer_reward",{answer : answer === parseInt(_answer_id)?1:0});
    },

    on_daily_question_answer:function(){
        net.emit("daily_question_answer");

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },
});
