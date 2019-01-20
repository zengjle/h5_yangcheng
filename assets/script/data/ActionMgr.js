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

    /**创建动作
     *
     * @param name          动作函数名字
     * @param target        目标节点
     * @param param         参数列表,以数组的形式
     * @param loop_num      循环次数
     * @param is_loop       是否循环
     * @param cb            结束的时候回调
     */
    _p.create = function (name, target, param, loop_num = 1, is_loop, cb) {
        var action = this[name].apply(this, param);

        this._runAction(action, target, loop_num, is_loop, cb);
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
        if (progress.ProgressBar)
            progress = progress.ProgressBar;
        var fn = (function () {
            progress.progress += 0.01;
            if (progress.progress >= 1) {
                progress.progress = 0;
                num--
            }
            if (num < 1 && progress.progress >= percentage) {
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