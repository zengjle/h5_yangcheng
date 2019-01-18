let ui_window = require("ui_window");
let constant = require("constant");
cc.Class({
    extends: ui_window,

    properties: {
        window_type :constant.WINDOW_TYPE.UI,
        node_get_man:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.mission_action = true;
        this.init_ui(this.mission_action);
    },
    
    onEnable:function () {
        this._super();
        
    },
    
    _register_handler:function () {
        this.node.on('touchstart',function (event) {
             let clickPos = event.getLocation();
             let node_get_manBoundingBox = this.node.getBoundingBox();
             if (node_get_manBoundingBox.contains(clickPos)) {
                this.node_get_man.canMove = true;
            }
          }, this),
          this.node.on('touchmove',function (event) {
            let pos = event.getLocation();
            this.node_get_man.x = pos.x;
          }, this)
    },
    
    init_ui:function(_action_state){

    },

    add_food: function () {
        var index = Math.floor(Math.random() * 3);
        var enemy = cc.instantiate(this.arrayEnemy[index]);//选择要克隆的预制
        enemy.name = "enemy";
        this.node.addChild(enemy);//挂载克隆的预制
        var winSize = cc.director.getWinSize();
        var posX = 25 + Math.random() * 270;
        enemy.setPosition(cc.v2(posX, winSize.height + 50));//控制飞机出现的位置
        var id = 2001 + index;
        var enemyCom = enemy.getComponent("enemy");
        enemyCom.enemyData = {};
 // var allEnemyFrameData = cc.dataMgr.enemyDataMgr.getDataById(id);//取得敌人图形的data
        
        var allEnemyData = this.gameCome.allData.enemy.getDataByID(id);
        this.changeSpritenFrame(allEnemyData,enemy);
        enemy.addComponent(allEnemyData.enemyMove);
        enemy.getComponent(allEnemyData.enemyMove).initWithData(allEnemyData.enemyMoveData);
        enemyCom.initWithData(allEnemyData);

        // var moveBy = cc.moveBy(3.0,cc.p(0,-550));
        // var seq = cc.sequence(moveBy,cc.removeSelf());
        // enemy.runAction(seq);
    },
    _unregister_handler:function () {

    },

    on_open_sys:function (_,_uiName) {
        ui.open(_uiName);
    },
});
