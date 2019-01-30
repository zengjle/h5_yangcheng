cc.Class({
    extends: cc.Component,

    properties: {
        loading_node: cc.Node,
        start_game_node: cc.Node
    },

    start() {
        require('Global')();
        this.start_game_node.active = false;
        tips.show(document.cookie);
        this.scheduleOnce(this.init_user_info, 1);
        cc.director.preloadScene('game');
    },

    init_user_info() {
        $.post('http://api.cccx.ltd/post', {
            module: 'UserService.userstate'
        }, function (data, status, xhr) {
            this.start_game_node.active = true;
            this.loading_node.active = false;
            if (status === 'success') {
                var ret = data;
                try {
                    if (typeof data === 'string')
                        ret = JSON.parse(data);
                } catch (e) {
                    tips.show('获取信息失败，请退出重新登入');
                }
                var data = ret.data;
                if (!data) {
                    tips.show(ret.msg);
                    Global.DEBUG = true;
                    Global.UserMgr.login();
                    return;
                }
                var tel = String(data.tel);
                cc.js.get(Global.UserMgr, 'id', function () { return tel; });
                Global.Observer.emit('login', tel);
            } else {
                tips.show('获取信息失败，请退出重新登入');
            }
        }.bind(this));
    },

    start_game() {
        this.start_game_node.destroy();
        this.loading_node.active = true;
        Global.AudioMgr.play('main_bg', 1, true, 'BGM');                   //背景音乐
        cc.director.loadScene('game');
    }
});