/**观察者
 *
 */
const Observer = (function () {
    'use strict';
    function Observer() {
        this.event = {};
        this.event['all'] = [];
        this.existenceEvent = [];
    };

    const _p = Observer.prototype;

    /**监听事件
     *
     * @param eventName 事件名
     * @param callback  回调函数
     * @param target    指定对象
     * @param param     回调的时候携带的参数
     */
    _p.on = function (eventName, callback, target, param) {
        this.event[eventName] = this.event[eventName] || [];
        this.add(eventName, callback, target, param);
    };

    /**监听事件,回调一次后删除自身
     *
     * @param eventName 事件名
     * @param callback  回调函数
     * @param target    指定对象
     * @param param     回调的时候携带的参数
     */
    _p.once = function (eventName, callback, target, param) {
        this.event[eventName] = this.event[eventName] || [];
        var onceWrapper;
        onceWrapper = function () {
            Global.Observer.off(eventName, onceWrapper, target);
            callback.apply(this, arguments);
        };
        this.add(eventName, onceWrapper, target, param);
    };

    /**添加监听事件
     *
     * @param eventName 事件名
     * @param callback  回调函数
     * @param target    指定对象
     * @param param     回调的时候携带的参数
     */
    _p.add = function (eventName, callback, target, param) {
        this.event[eventName].push({
            callback: callback,
            target: target,
            param: param
        });
    };

    /**销毁事件
     *
     * @param eventName 事件名
     * @param callback  回调函数
     * @param target    指定对象
     */
    _p.off = function (eventName, callback, target) {
        const event = this.event[eventName] || [];
        for (let i = 0; i < event.length; i++) {
            if (event[i].target === target && event[i].callback === callback) {
                event.splice(i, 1);
                return;
            }
        }
    };

    /**发射事件
     *
     * @param eventName 事件名
     * @param param     携带参数
     */
    _p.emit = function (eventName, param) {
        this.existenceEvent.push(eventName);
        var event = this.event[eventName], events;
        if (event) {
            for (let i = event.length - 1; i >= 0; i--) {
                events = event[i];
                events.callback.call(events.target, param, events.param);
                events = null;
            }
        }
        event = null;
        event = this.event['all'];
        for (let i = event.length - 1; i >= 0; i--) {
            events = event[i];
            events.callback.call(events.target, eventName, events.param);
            events = null;
        }
    };

    return Observer;
}());
module.exports = Observer;