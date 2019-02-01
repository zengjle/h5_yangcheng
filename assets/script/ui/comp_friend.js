let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");
let net = require("net");


cc.Class({
    extends: require("view_cell"),

    properties: {
        item_constont: cc.Node,
        node_list: cc.Node,
        editbox_search: cc.EditBox,
        lbl_no_friend_tips: cc.Label,
    },

    onLoad: function () {

    },

    start: function () {

    },

    onEnable: function () {
        this._super();
    },

    onDisable: function () {
        this._super();
    },

    _register_handler: function () {
        net.on("enter_friend_home_ret", (_msg) => {
            ui.open("ui_friend_home", _msg);
        }, this.node);

        net.on("search_friend_ret", (_msg) => {
            this.init_friend([_msg.friend_info.user_info]);
        }, this.node);

    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_friend: function (_bag_info) {
        if (typeof _bag_info.length === 'undefined') {
            _bag_info = [_bag_info];
        }
        if (!_bag_info.length) {
            this.lbl_no_friend_tips.node.active = false;
            return;
        }
        this.node_list.getComponent("comp_tableview").init(1, (_idx, _item) => {
            let friend_tag = _bag_info[_idx].tag || 0;
            _item.getComponent("comp_friend_item").init_item(_bag_info[_idx], friend_tag);
        })
    },

    on_search_friend: function () {
        net.emit("search_friend", { friend_id: this.editbox_search.string });
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
