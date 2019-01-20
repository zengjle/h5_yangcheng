/**生成和管理动作
 *
 */
const ActionMgr = (function () {
    'use strict';
    function ActionMgr() {
    };

    const _p = ActionMgr.prototype;

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
     */
    _p.progress = function () {

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

    return ActionMgr;
}());
module.exports = ActionMgr;