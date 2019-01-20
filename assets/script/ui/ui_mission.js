let ui_window = require("ui_window");
let constant = require("constant");
cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,
        node_get_man: cc.Node,
        layer_food: cc.Node,
        prefab_fall_food: cc.Prefab,
        label_score: cc.Label,
        ui_gameStart: cc.Node,
        label_gameTime: cc.Label,
        node_gameOver: cc.Node,
        label_Label: [cc.Label],
        over_score: cc.Label,
        label_topScore: cc.Label,
        node_ui_again: cc.Node,
        node_comp_reward_light:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.ui_mission = this;

        this.gameinit();
        this.foodPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let food = cc.instantiate(this.prefab_fall_food);
            this.foodPool.put(food);
        }
    },

    start: function () {
        net.emit("enter_mission_page");

    },
    //游戏初始化
    gameinit() {
        this.garbage = config.data.ui_mission[6].speed;
        this.score = 0;
        this.gameTime = 15;
        this.mission_action = true;
        this.label_gameTime.string = this.gameTime;
        this.label_score.string = this.score;
        this.node_gameOver.scale = 0;
        this.node_gameOver.active = false;
    },
    //开始游戏
    gameStart: function () {
        this.node_get_man.active = true;
        this.add_food();
        this.schedule(this.add_food, 0.5);
        this.schedule(this.mission_gameTime, 1);
        this.ui_gameStart.active = false;
    },
    //游戏倒计时
    mission_gameTime: function () {
        this.gameTime--;
        this.garbage /= 1.02;
        if (this.gameTime <= 0) {
            this.gameOver();
            return;
        }
        this.label_gameTime.string = this.gameTime;
    },
    //游戏结束
    gameOver: function () {
        this.unschedule(this.add_food);
        this.unschedule(this.mission_gameTime);
        for (let i = this.layer_food.children.length-1; i >= 0; i--) {
            this.layer_food.children[i].stopAllActions();
            this.foodPool.put(this.layer_food.children[i]);
            
        }
        
        this.node_gameOver.active = true;
        this.node_gameOver.runAction(cc.scaleTo(0.2, 1));
        this.node_get_man.active = false;
        this.over_score.string = this.score;
        net.emit("get_mission_reward", { mission_score: this.score })
    },
    //再来一局
    gameAgain() {
        this.gameinit();
        this.gameStart();
    },
    //添加食物
    add_food: function () {
        let food = null;
        if (this.foodPool.size() > 0) {
            food = this.foodPool.get();
        }
        else {
            food = cc.instantiate(this.prefab_fall_food);
        }
        let x = parseInt(600 * Math.random() + 64);
        let y = 1280;
        food.setPosition(x, y);

        food.getComponent('comp_fall_food').init();

        this.layer_food.addChild(food);
    },
    onEnable: function () {
        this._super();

    },

    _register_handler: function () {
        net.on("enter_mission_page_ret", (_msg) => {
            this.label_topScore.string = "历史最高：" + _msg.max_mission_score;
            if (_msg.action_num <= 0) {
                this.node_gameOver.active = true;
                this.ui_gameStart.active = false;
                this.node_gameOver.runAction(cc.scaleTo(0.2, 1));
                this.label_Label[0].string = "历史最高";
                this.label_Label[1].string = "";
                this.over_score.string = _msg.max_mission_score;
                this.node_ui_again.active = false;
                this.node_comp_reward_light.active = false;
                this.label_Label[2].string = "";
            }

        });

        net.on("get_mission_reward_ret", (_msg) => {
            !!_msg.max_mission_score && (this.label_topScore.string = "历史最高：" + _msg.max_mission_score);
            if (_msg.action_num <= 0) {
                this.node_ui_again.active = false;
                this.label_Label[2].string = "今日奖励已达上线";
            }
            //次数未用完
            else {
                this.label_Label[3].string = "";
            }
            cc.vv.comp_reward_lightCom.init_comp(_msg.reward_prop[0]);
        })
        //     this.node.on('touchstart', function (event) {
        //         let clickPos = event.getLocation();
        //         let node_get_manBoundingBox = this.node.getBoundingBox();
        //         if (node_get_manBoundingBox.contains(clickPos)) {
        //             this.node_get_man.canMove = true;
        //         }
        //     }, this),
        //         this.node.on('touchmove', function (event) {
        //             let pos = event.getLocation();
        //             this.node_get_man.x = pos.x;
        //         }, this)
    },
    ui_close() {
        ui.close("ui_mission");
    },
    init_ui: function (_action_state) {

    },

    // add_food: function () {
    //     var index = Math.floor(Math.random() * 3);
    //     var enemy = cc.instantiate(this.arrayEnemy[index]);//选择要克隆的预制
    //     enemy.name = "enemy";
    //     this.node.addChild(enemy);//挂载克隆的预制
    //     var winSize = cc.director.getWinSize();
    //     var posX = 25 + Math.random() * 270;
    //     enemy.setPosition(cc.v2(posX, winSize.height + 50));//控制飞机出现的位置
    //     var id = 2001 + index;
    //     var enemyCom = enemy.getComponent("enemy");
    //     enemyCom.enemyData = {};
    //     // var allEnemyFrameData = cc.dataMgr.enemyDataMgr.getDataById(id);//取得敌人图形的data

    //     var allEnemyData = this.gameCome.allData.enemy.getDataByID(id);
    //     this.changeSpritenFrame(allEnemyData, enemy);
    //     enemy.addComponent(allEnemyData.enemyMove);
    //     enemy.getComponent(allEnemyData.enemyMove).initWithData(allEnemyData.enemyMoveData);
    //     enemyCom.initWithData(allEnemyData);

    //     // var moveBy = cc.moveBy(3.0,cc.p(0,-550));
    //     // var seq = cc.sequence(moveBy,cc.removeSelf());
    //     // enemy.runAction(seq);
    // },
    _unregister_handler: function () {

    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },
});
