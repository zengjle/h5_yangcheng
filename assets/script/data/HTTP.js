/**网络请求
 *
 */
const URL = "http://cccx.ltd";
const GET_URL = '/open/get';
const POST_URL = '/open/post';
const HTTP = (function () {
    'use strict';
    function HTTP() {
    };

    HTTP.prototype.send = function (mode, path, data, callback, remedyCallback, extraUrl = URL) {
        var fn = function (data, status, xhr) {
            if (status === 'success') {
                console.log("http res:", data)
                var ret = data;
                try {
                    if (typeof data === 'string')
                        ret = JSON.parse(data);
                } catch (e) {
                    remedyCallback && remedyCallback(ret, xhr);
                }
                if (ret.state == '000') {
                    callback && callback(ret, xhr);
                    return;
                }
                remedyCallback && remedyCallback(ret, xhr);
            } else {
                remedyCallback && remedyCallback(data, xhr);
            }
        };
        if (mode === 'GET') {
            $.get(extraUrl + GET_URL, data, fn);
        } else {
            $.post(extraUrl + POST_URL, data, fn);
        }
    };

    return HTTP;
}());
module.exports = HTTP;