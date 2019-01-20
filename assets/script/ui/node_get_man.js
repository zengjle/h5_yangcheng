
cc.Class({
    extends: cc.Component,

    properties: {
        touch: cc.Node,
        node_bowl: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.Anima_bowl = this.node_bowl.getComponent(cc.Animation);
        this.touch.on("touchmove", this.touchmoves, this);

    },
    touchmoves(event) {
        this.node.x += event.getDelta().x;
        if (this.node.x >= 360) {
            this.node.x = 360;
        }
        if (this.node.x <= -360) {
            this.node.x = -360;
        }
    },
    onCollisionEnter: function (other, self) {
        cc.vv.ui_mission.score += other.node._score;
        cc.vv.ui_mission.label_score.string = cc.vv.ui_mission.score;
        other.node.runAction(cc.scaleTo(0.1, 0));
        this.Anima_bowl.play("bowl");
        if (other.node._score === 0){
            cc.vv.ui_mission.gameOver();
        }
    },
    // update (dt) {},
});
