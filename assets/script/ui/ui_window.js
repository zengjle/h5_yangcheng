let ui = require("ui");

let ui_window = cc.Class({

    extends: cc.Component,

    properties: {
        args: [],
    },

    onEnable: function () {
        ui.emit("ui_load_over");
        this._register_handler && this._register_handler();
        if(!this.is_swallow_touched) {
            this.scheduleOnce(() => {
                this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                    event.stopPropagation();
                });
            });
            this.is_swallow_touched = true;
        }
    },

    onDisable: function () {
        this._unregister_handler && this._unregister_handler();
    },

    swallow_enable:function (cb) {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
            cb && cb();
        });
    },
});

module.exports = ui_window;