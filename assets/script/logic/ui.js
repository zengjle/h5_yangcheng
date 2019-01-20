let ui = cc.Class({

    extends: require("logic"),

    ctor: function () {

    },

    init: function () {
        //includes ui_nodes & popup_nodes
        this.ui_stack = [];
        this.ui_mode = null;
    },

    open: function (window_name, ...args) {
        this.emit("open", window_name, ...args);
    },

    close: function (...args) {
        if (this.ui_stack.length <= 0) {
            cc.log("场景中已经没有窗口了");
            return;
        }
        this.emit("close", this.ui_stack[this.ui_stack.length - 1].window_name, ...args);
    },

    close_all: function () {
        while (this.ui_stack.length > 0) {
            this.emit("close");
        }
    },

    push: function (window_info) {
        this.ui_stack.push(window_info);
    },

    get_last_window_info: function () {
        if (this.ui_stack.length <= 0) {
            return;
        }
        return this.ui_stack[this.ui_stack.length - 1];
    },

    get_ui_amount: function () {
        return this.ui_stack.length;
    },

    pop: function () {
        return this.ui_stack.pop();
    },

    set_ui_mode: function (_mode) {
        // 不再显示主城，暂时关闭
        // this.ui_mode = _mode;
    }
});

module.exports = new ui();