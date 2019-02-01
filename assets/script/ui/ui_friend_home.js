let ui_window = require("ui_window");
let net = require("net");
cc.Class({
    extends: ui_window,

    properties: {
        progressbar_fish_exp: cc.ProgressBar,
        lv: cc.Label,
        steal: cc.Node,
        nickname_label: cc.Label,
        user_lv_label: cc.Label
    },
    onLoad: function () { },
    start: function () {
        this.init(this.args[0]);
    },
    init(info) {
        var fish = info.friend_info.fish;
        this.progressbar_fish_exp.progress = fish.exp / fish.max_exp;
        this.lv.string = 'lv.' + fish.lv;

        this.steal.active = !!info.get_num;

        var user_info = info.user_info;
        this.nickname_label.string = user_info.nickname;
        this.user_lv_label.string = fish.lv;
    },

    get_friend_food: function () {
        net.emit('get_friend_food');
    },

    _register_handler: function () {
        net.on("get_friend_food_ret", (_msg) => {

        }, this.node);
    },
});
