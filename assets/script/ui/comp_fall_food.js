const PROBABILITY = [40,20,15,10,5,5,5];
cc.Class({
    extends: cc.Component,

    properties: {
        SpriteFrame: {
            type: cc.SpriteFrame,
            default: []
        },
    },

    init() {
        this.node.scale = 1;
        this.time = null;
        this.spriteFrameNum = null;
        let num = Math.random()*100;
        var probability = 0;
        for(let i = 0,len= PROBABILITY.length;i<len;i++){
            probability+=PROBABILITY[i];
            if(num<=probability){
                this.endow(i+1);
                if(i >= 5){
                    this.time = cc.vv.ui_mission.garbage;
                }
                break;
            }
        }
      
        moveTo = cc.moveTo(this.time, this.node.x, 0);
        let fun = cc.callFunc(function () {
            this.node.stopAllActions();
            cc.vv.ui_mission.foodPool.put(this.node);
        }, this)
        let seq = cc.sequence(moveTo, fun);
        this.node.getComponent(cc.Sprite).spriteFrame = this.SpriteFrame[this.spriteFrameNum];
        this.node.runAction(seq);
    },
    endow(num) {
        this.time = config.data.ui_mission[num].speed;
        this.spriteFrameNum = num - 1;
        this.node._score = config.data.ui_mission[num].score;
    },
    putPool(){
        this.node.stopAllActions();
        cc.vv.ui_mission.foodPool.put(this.node);
    }

    // update (dt) {},
});
