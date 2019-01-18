let ui_window       = require("ui_window");
let constant        = require("constant");
let ui              = require("ui");


cc.Class({
    extends: require("view_cell"),

    properties:{
        item_constont:cc.Node,
        node_list:cc.Node,
    },

    onLoad:function () {


    },

    onEnable:function () {
        this._super();
      
    },

    _register_handler:function () {
      
    },

    _unregister_handler:function () {

    },

    init_bag:function(_bag_info){
        let _all_prop_items = this.item_constont.children;
        let _idx = 1;
        for(let _prop_item of _all_prop_items){
            let _node_num = _prop_item.getChildByName("node_food_num");
            if(_bag_info[_idx].num <= 0){
                _node_num.active = false;
            }else{
                _node_num.getChildByName("Label").getComponent(cc.Label).string = _bag_info[_idx].num;
            }
        }
        
    },

    on_choose_food:function(_, _prop_id){
        if(+_prop_id < 6){
            ui.emit("choose_food",{prop_id:_prop_id})
        }else{

        }

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
