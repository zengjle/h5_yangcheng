/**生成和管理动作
 *
 */
const ActionMgr = (function () {
    'use strict';
    function ActionMgr() {
        this.updateCallBack = [];
    };

    const _p = ActionMgr.prototype;

    _p.init = function () {
        Global.getNewId(this);
        cc.director.getScheduler().scheduleUpdateForTarget(this);
    };

    /**创建动作并执行
     *
     * @param name          动作函数名字
     * @param target        目标节点
     * @param param         参数列表,以数组的形式
     * @param loop_num      循环次数
     * @param is_loop       是否循环
     * @param cb            结束的时候回调
     */
    _p.create = function (name, target, param, loop_num = 1, is_loop, cb, is_run = true) {
        var action = this._create(name, param);

        is_run && this._runAction(action, target, loop_num, is_loop, cb);

        return action;
    };

    _p._create = function (name, param) {
        return this[name].apply(this, param || []);
    };

    /**创建顺序动作
     *
     * @param data  {name:'',param:[]}
     */
    _p.sequence = function (data) {
        var action = [];
        for (let i in data) {
            action.push(this._create(data[i].name, data[i].param));
        }
        return cc.sequence.apply(cc.sequence, action);
    };

    /**颤抖
     *
     */
    _p.tremble = function () {
        return cc.sequence(
            cc.moveBy(0.02, cc.p(0, 10)),
            cc.moveBy(0.02, cc.p(0, 10)),
            cc.moveBy(0.02, cc.p(0, 6)),
            cc.moveBy(0.02, cc.p(0, -12)),
            cc.moveBy(0.02, cc.p(0, 10)),
            cc.moveBy(0.02, cc.p(0, -16)),
            cc.moveBy(0.02, cc.p(0, -20)),
            cc.moveBy(0.02, cc.p(0, 20)),
            cc.moveBy(0.02, cc.p(0, -16))
        );
    };

    /**缩放指定倍数
     *
     * @param x         x缩放
     * @param y         y缩放
     */
    _p.scaleTo = function (x, y) {
        return cc.scaleTo(0.2, x, y);
    };

    /**跳跃到某个地方
     *
     * @param xOrV2     x或者cc.Vec2
     * @param y         y
     */
    _p.jumpTo = function (xOrV2, y) {
        if (typeof xOrV2 === 'object') {
            y = xOrV2.y;
            xOrV2 = xOrV2.x;
        }
        return cc.jumpTo(0.2, xOrV2, y, 300, 1);
    };

    /**飘动效果
     *
     */
    _p.flutter = function () {
        return cc.sequence(
            cc.moveBy(0.8, 0, 20),
            cc.moveBy(1.6, 0, -40),
            cc.moveBy(0.8, 0, 20)
        );
    };

    /**进度条前进
     *
     * @param progress      进度条组件或他的节点
     * @param percentage    要前进到多少
     * @param num           升多少级
     */
    _p.progress = function (progress, percentage, num) {
        if (percentage > 1)
            percentage /= 100;
        if (progress.$ProgressBar)
            progress = progress.$ProgressBar;
        var fn = (function () {
            progress.progress += 0.01;
            if (progress.progress >= 1) {
                progress.progress = 0;
                num--;
            }
            if ((num < 1 && progress.progress >= percentage) || num <= -1) {
                progress.progress = percentage;
                this.updateCallBack.splice(this.updateCallBack.indexOf(fn), 1);
                fn = null;
                progress = null;
                percentage = null;
                num = null;
            }
        }.bind(this));
        return cc.callFunc(function () {
            this.updateCallBack.push(fn);
        }, this);
    };

    _p._runAction = function (action, target, loop_num, is_loop, cb) {
        if (is_loop) {
            if (!loop_num) {
                action = cc.repeatForever(action);
            } else {
                action = cc.repeat(action, loop_num);
            }
        }
        if (cb) {
            action = cc.sequence(action, cc.callFunc(cb));
        }
        target.runAction(action);
    };

    //每帧更新
    _p.update = function (dt) {
        this.updateCallBack.forEach((fn) => {
            fn(dt);
        });
    };

    return ActionMgr;
}());
module.exports = ActionMgr;