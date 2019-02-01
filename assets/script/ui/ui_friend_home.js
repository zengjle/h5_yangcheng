let ui_window = require("ui_window");
let net = require("net");
cc.Class({
    extends: ui_window,

    properties: {
        progressbar_fish_exp: cc.ProgressBar,
        lv: cc.Label,
        steal: cc.Node,
        nickname_label: cc.Label,
        user_lv_label: cc.Label,
        food_sprite: cc.Sprite,
        food_atlas: cc.SpriteAtlas,
        icon_hand: cc.Node
    },
    onLoad: function () { },
    start: function () {
        this.init(this.args[0]);
    },
    init(info) {
        var fish = info.friend_info.fish;
        this.progressbar_fish_exp.progress = fish.exp / fish.max_exp;
        this.lv.string = 'lv.' + fish.lv;

        if (info.get_prop_state) {
            this.steal.active = true;
            net.emit('get_friend_food');
        } else {
            tips.show('他的仓库空空如也,换个人看看吧~');
        }

        var user_info = info.user_info;
        this.nickname_label.string = user_info.nickname;
        this.user_lv_label.string = fish.lv;
    },

    get_friend_food: function () {
        ui.emit("touch_enable", true);
        this.icon_hand.runAction(cc.sequence(cc.moveTo(0.3, this.icon_hand.node.getPosition()), cc.callFunc(() => {
            net.emit('add_props', { id: this.food_info[0], num: 1 });
            this.steal.active = false;
            ui.emit("touch_enable", false);
        })));
    },

    _register_handler: function () {
        net.on("get_friend_food_ret", (_msg) => {
            this.this.food_info = _msg;
            this.food_sprite.spriteFrame = this.food_atlas.getSpriteFrame('bag_food_' + _msg.info[0]);
        }, this.node);
    },
});
