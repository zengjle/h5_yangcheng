let ui_window = require("ui_window");
let constant = require("constant");
let net = require("net");
let data = require("data");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,

        node_scene:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    start: function () {
        for(let _scenes of this.node_scene.children){
            let _node_title = _scenes.getChildByName("map_title_bg");
            Global.ActionMgr.create('flutter',_node_title, null, 0, true);
        }
    },

    onEnable: function () {
        this._super();
    },

    onDisable: function () {
        this._super();
    },

    _register_handler: function () {

    },

    init_ui: function (_msg) {
       
    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },
});
