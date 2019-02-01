let ui_window = require("ui_window");
let net = require("net");
let constant = require("constant");

cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,
        progressbar_fish_exp: cc.ProgressBar,
        lv: cc.Label,
        steal: cc.Node,
        nickname_label: cc.Label,
        user_lv_label: cc.Label,
        food_sprite: cc.Sprite,
        food_atlas: cc.SpriteAtlas,
        icon_hand: cc.Node,
        fish_honor: cc.Sprite,
        img_fish: cc.Sprite,
        fish_body: [cc.SpriteFrame],
        fish_honor_frame: [cc.SpriteFrame],
        spriteatlas_head: cc.SpriteAtlas,
        img_head: cc.Sprite,
    },
    onLoad: function () {
        cc.vv.fish = this.node._$node_fish;
        Global.ActionMgr.create('flutter', this.node._$node_fish, null, 0, true);
    },
    start: function () {
        this.init(this.args[0]);
    },
    init(info) {
        var fish = info.friend_info.fish;
        this.progressbar_fish_exp.progress = fish.exp / fish.max_exp;
        this.lv.string = 'lv.' + fish.lv;
        let _lv = fish.lv;
        let _fish_image_id = 1;
        if (_lv >= 30 && _lv < 60) {
            _fish_image_id = 2;
        } else if (_lv >= 60) {
            _fish_image_id = 3;
        }
        this.img_fish.spriteFrame = this.fish_body[_fish_image_id - 1];
        this.fish_honor.spriteFrame = this.fish_honor_frame[_fish_image_id - 1];

        if (info.get_prop_state) {
            this.steal.active = true;
            net.emit('get_friend_food', { friend_id: info.friend_id });
        } else {
            tips.show('他的仓库空空如也,换个人看看吧~');
        }

        var user_info = info.friend_info.user_info;
        this.nickname_label.string = user_info.nickname + "的家";
        this.user_lv_label.string = fish.lv;
    },

    get_friend_food: function () {
        ui.emit("touch_enable", true);
        this.icon_hand.runAction(cc.sequence(cc.moveTo(0.3, this.food_sprite.node.getPosition()), cc.callFunc(() => {
            net.emit(' wang', { id: this.food_info[0], num: 1 });
            this.steal.active = false;
            ui.emit("touch_enable", false);
        })));
    },

    _register_handler: function () {
        net.on("get_friend_food_ret", (_msg) => {
            this.food_info = _msg.info;
            this.food_sprite.spriteFrame = this.food_atlas.getSpriteFrame('bag_food_' + _msg.info[0]);
        }, this.node);
    },

    on_close() {
        ui.close();
    },
});
