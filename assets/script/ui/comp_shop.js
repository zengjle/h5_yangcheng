let ui_window = require("ui_window");
let constant = require("constant");
let ui = require("ui");


cc.Class({
    extends: require("view_cell"),

    properties: {
        lbl_integral: cc.Label,
        list_commodity: cc.Node,
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
        net.on("enter_shop_ret", this.init_comp.bind(this));
        net.on("buy_commodity_ret", (_msg) => {
            ui.open("popup_reward_layer", _msg.commodity);
        }, this.node);
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    init_comp: function (_msg) {
        this.node.active = true;
        this.lbl_integral.string = _msg.integral;
        this.list_commodity.getComponent("comp_tableview").init(_msg.commodity.length, (_idx, _item) => {
            _item.getComponent("comp_food_info").init_item(_msg.commodity[_idx]);
        })
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },

});
