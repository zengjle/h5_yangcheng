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

    init_mission:function(_mission_info){
        this.node_list.getComponent("comp_tableview").init(Object.keys(_mission_info).length,(_idx,item)=>{
            item.getComponent("comp_bar_item").init_item(_mission_info[_idx + 1],_idx);
        })
    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },

});
