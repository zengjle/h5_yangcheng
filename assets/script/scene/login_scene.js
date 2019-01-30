cc.Class({
    extends: cc.Component,

    start () {
        require('Global')();
        this.init_user_info();
        cc.director.preloadScene('game');
    },

    init_user_info(){
        Global.HTTP.send('POST','',{
            module:'UserService.userstate'
        },function(res){
            var data = res.data;
            if(!data){
                tips.show(res.msg);
                Global.DEBUG = true;
                Global.UserMgr.login();
                return;
            }
            var tel = String(data.tel)
            cc.js.get(Global.UserMgr, 'id', function () { return tel; });
            Global.Observer.emit('login', tel);
        },function(){
            tips.show('获取信息失败，请退出重新登入');
        });
    },

    start_game(){
        this.node.getChildByName('start_game').destroy();
        this.node.getChildByName('loading').active = true;
        Global.AudioMgr.play('main_bg', 1, true, 'BGM');                   //背景音乐
        cc.director.loadScene('game');
    }
});