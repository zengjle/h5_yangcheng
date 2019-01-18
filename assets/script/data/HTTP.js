/**网络请求
 *
 */
const URL = "http://cccx.ltd/open/get";
const HTTP = (function () {
    'use strict';
    function HTTP() {
    };

    HTTP.prototype.send = function (mode, path, data, callback, remedyCallback, extraUrl = URL) {
        const fn = function (data, status, xhr) {
            if (status === 'success') {
                console.log("http res:", data)
                var ret = data;
                try {
                    if (typeof data === 'string')
                        ret = JSON.parse(data);
                } catch (e) {
                    remedyCallback && remedyCallback(ret);
                }
                if (ret.state == '500') {
                    remedyCallback && remedyCallback(ret);
                    return;
                }
                callback && callback(ret);
            } else {
                remedyCallback && remedyCallback(data);
            }
        };
        if (mode === 'GET') {
            $.get(extraUrl + path, data, fn);
        } else {
            $.post(extraUrl + path, data, fn);
        }
    };

    return HTTP;
}());
module.exports = HTTP;