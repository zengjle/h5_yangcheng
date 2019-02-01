let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");


cc.Class({
    extends: require("view_cell"),

    properties: {
        item_constont: cc.Node,
        node_list: cc.Node,
        editbox_search:cc.EditBox,
        lbl_no_friend_tips:cc.Label,
    },

    onLoad: function () {

    },

    start: function () {

    },

    onEnable: function () {
        this._super();
    },

    onDisable:function(){
        this._super();
    },

    _register_handler: function () {
        net.on("enter_friend_home_ret", (_msg) => {
            ui.open("ui_friend_home", _msg);
        }, this.node);

        net.on("search_friend_ret",(_msg)=>{
            this.init_friend(_msg.friend_info);
        },this.node);

        net.on("add_friend_ret",(_msg)=>{
            this.init_friend(_msg);
            tips.show("好友添加成功!");
        },this.node);
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_friend: function (_bag_info) {
        this.lbl_no_friend_tips.node.active = _bag_info.length <= 0;
        this.node_list.getComponent("comp_tableview").init(_bag_info.length, (_idx, _item) => {
            let friend_tag =  _bag_info[_idx].tag || 0;
            _item.getComponent("comp_user_info").init_item(_bag_info[_idx],friend_tag);
        })
    },

    on_search_friend: function () {
        net.emit("search_friend",{friend_id : this.editbox_search.string});
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
