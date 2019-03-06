cc.Class({
    extends: cc.Component,

    properties: {
        tel_editbox: cc.EditBox,
        code_editbox: cc.EditBox,
        send_code_btn_label: cc.Label,
        node_mask: cc.Node,
        node_editbox: cc.Node,
    },

    start() {
        require('Global')();

        if (Global.DEBUG) {
            Global.UserMgr.login();
            cc.director.loadScene('game');
        } else {
            Global.Observer.once('DataMgr_init_data_ok', function () {
                cc.director.loadScene('game');
            }, this);

            Global.Observer.once('login', function () {
                this.node_mask.active = true;
            }, this);

            var id = Global.getData('14325', null);
            var token = Global.getData('136533', null);
            if (id && token) {
                Global.UserMgr.init_storage_data(id, token);
                return;
            }

            window.bindUI.init(this.node);
            cc.director.preloadScene('game');

            Global.Observer.on('send_code_success', function () {
                this.count_down(this.send_code_btn_label);
            }, this);
        }
    },

    /**验证码倒计时60秒
     *
     * @param label
     */
    count_down(label) {
        var count = 61;
        label.node.parent.$Button.interactable = false;
        var fn = (function () {
            count--;
            label.string = count + '秒后可重新发送验证码';
            if (count <= 0) {
                label.node.parent.$Button.interactable = true;
                label.string = '发送验证码';
            }
        });
        fn();
        this.schedule(fn, 1, 60);
    },

    on_input_began() {
        this.node_editbox.y = 0;
    },

    on_input_end() {
        this.node_editbox.y = 400;
    },


    send_code() {
        Global.UserMgr.send_code(this.tel_editbox.string);
    },

    login() {
        Global.UserMgr.login(this.tel_editbox.string, this.code_editbox.string);
    }
});