let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");
let net             = require("net");


cc.Class({
    extends: require("view_cell"),

    properties:{
        item_constont:cc.Node,
        node_list:cc.Node,
        lbl_no_food_tips:cc.Node,
    },

    onLoad:function () {


    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler: function () {
        net.on("enter_friend_home_ret",(_msg)=>{

        },this.node);
    },

    _unregister_handler:function () {

    },

    init_friend:function(_bag_info){
        let _all_prop_items = this.item_constont.children;
        let _idx = 1;
        this.lbl_no_food_tips.active = true;
        for(let _prop_item of _all_prop_items){
            let _node_num = _prop_item.getChildByName("node_food_num");
            if(_bag_info[_idx].num <= 0){
                _prop_item.active = false;
            }else{
                _prop_item.active = true;
                this.lbl_no_food_tips.active = false;
                _node_num.getChildByName("Label").getComponent(cc.Label).string = _bag_info[_idx].num;
            }
            _idx++;
        }
        
    },

    on_choose_food:function(_, _prop_id){
        if(+_prop_id < 6){
            ui.emit("choose_food",{prop_id:_prop_id})
            }else{
            net.emit("use_props",{prop:[_prop_id,2,0,1]});
        }

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
