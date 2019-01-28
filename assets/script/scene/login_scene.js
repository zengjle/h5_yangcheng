cc.Class({
    extends: cc.Component,

    start () {
        require('Global')();
        cc.loader.onProgress = function(c,t,i){
            // console.log(i);
            console.log((100 * c / t).toFixed(2));
        }
        cc.director.preloadScene('game');
    },

    start_game(){
        this.node.getChildByName('start_game').destroy();
        Global.AudioMgr.play('main_bg', 1, false, 'BGM');                   //背景音乐
        cc.director.loadScene('game');
    }
});
