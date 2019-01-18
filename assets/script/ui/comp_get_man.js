cc.Class({
    extends: cc.Component,

    properties: {

        planeAtlas: {
            type: cc.SpriteAtlas,
            default: null
        },
        lbl_score: cc.Label,

    },

    // use this for initialization
    onLoad: function () {
        this.id = 3001;
        this.beDead = false;
        this.canMove = false;
        this.multiShootTime = 800;
        this.multiShootTimeBk = 800;
        this.state = cc.STATE.PLAYER_STATE_NONE;
        this.anim = this.node.getComponent(cc.Animation);//引入动画
        this.changeState(this.state);
        this.shootSpeed = 18;
        this.bulletMgr = cc.find("Canvas/bulletMgr");
        this.special = cc.find("Canvas/specialMgr").getComponent("specialMgr");
        this.gameCom = cc.find("Canvas").getComponent("game");
        this.node.name = "player";
        this.allPlaneData = cc.dataMgr.playerDataMgr.getDataById(this.id);//通过当前id取得飞机的data

    },
    changeState: function (state) {
        if (state === this.state) {
            return;
        }
        this.state = state;
        this.anim.stop();
        if (cc.STATE.PLAYER_STATE_STRAIGHT === this.state) { //当player的状态为直飞的时候
            this.node.scaleX = 1;
            this.changeSpritenFrame();
        } else if (cc.STATE.PLAYER_STATE_LEFT === this.state) {//当player的状态为左飞的时候
            this.anim.play("flyL");
        } else if (cc.STATE.PLAYER_STATE_RIGHT === this.state) {//当player的状态为右飞的时候
            this.anim.play("flyR");
        }
    },
    fire: function (Angle) {
        var bulletMgrCom = this.bulletMgr.getComponent('bulletMgr');
        // for(var i = 1.57;i > -4.57;i-=0.3){
        // this.allPlaneData.moveDt.Angle -= 0.3;
        this.allPlaneData.moveDt.Angle = Angle;
        bulletMgrCom.addBullet(this.node.position, this.allPlaneData);
        // }
    },
    onCollisionEnter: function (other, self) {
        var playerCom = self.node.getComponent("player");
        if ("enemyBullet" === other.node.name) {
            var enemyOrBulletCom = other.node.getComponent("bullet");
            playerCom.allPlaneData.hp -= enemyOrBulletCom.ack;
            // var hurt = enemyOrBulletCom.ack / playerCom.allPlaneData.maxHp;
        } else if ("enemy" === other.node.name) {
            var enemyOrBulletCom = other.node.getComponent("enemy");
            playerCom.allPlaneData.hp -= enemyOrBulletCom.enemyData.ack;
            // var hurt = enemyOrBulletCom.enemyData.ack/ playerCom.allPlaneData.maxHp ;
        };

        this.hpBar.getComponent(cc.ProgressBar).progress = playerCom.allPlaneData.hp / playerCom.allPlaneData.maxHp;
        if (this.allPlaneData.hp <= 0) {//判断player死亡游戏结束
            this.special.addSpecialBoom(this.node.position);
            this.beDead = true;
            var remove = cc.removeSelf();
            this.node.runAction(remove);
        }

    },
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        console.log('on collision stay');
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
    },
    changeSpritenFrame: function () {
        //更改飞机图片
        //通过id获取飞机管理文件里的img飞机图形
        this.allPlaneData = cc.dataMgr.playerDataMgr.getDataById(this.id);
        //获取当前节点下的精灵节点并赋值给sprite
        var sprite = this.node.getComponent(cc.Sprite);
        //获取飞机的图形将其定义为新的精灵帧
        var newSpriteFrame = this.planeAtlas.getSpriteFrame(this.allPlaneData.img);
        //将新的精灵帧赋值给当前精灵的精灵帧
        sprite.spriteFrame = newSpriteFrame;
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.gameCom.win) {
            this.shootSpeed--;
            this.multiShootTime--;
            if (0 >= this.multiShootTime) {
                this.allPlaneData.multiShoot = false;
                this.allPlaneData.ack = this.allPlaneData.ackBk;
                this.multiShootTime = this.multiShootTimeBk;
            }
            if (this.allPlaneData.hp >= this.allPlaneData.maxHp) {
                this.allPlaneData.hp = this.allPlaneData.maxHp;
            }
            if (this.shootSpeed <= 0) {
                if (!this.beDead) {
                    if (false == this.allPlaneData.multiShoot) {
                        this.fire(1.57);
                    } else if (true == this.allPlaneData.multiShoot) {
                        this.fire(1.57);
                        this.fire(1.77);
                        this.fire(1.37);
                    }
                }
                this.shootSpeed = 18;
            }
        } else {
            var moveBy = cc.moveBy(2.0, cc.p(0, 500));
            this.node.runAction(moveBy);
        }
        //     this.x++;
        //     if(this.x >= 120){
        //         this.hpBar.getComponent(cc.ProgressBar).progress -= 0.1;
        //         this.x = 0;
        //     }
    },
});
