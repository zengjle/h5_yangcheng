/**网络请求
 *
 */
const URL = "http://cccx.ltd";
const GET_URL = '/get';
const POST_URL = '/post';
const HTTP = (function () {
    'use strict';
    function HTTP() {
        cc.js.get(this, 'URL', function () {
            return URL;
        });
    };

    HTTP.prototype.send = function (mode, path, data, callback, remedyCallback, extraUrl = URL + '/open') {
        // var fn = function (data, status, xhr) {
        //     if (status === 'success') {
        //         console.log("http res:", data)
        //         var ret = data;
        //         try {
        //             if (typeof data === 'string')
        //                 ret = JSON.parse(data);
        //         } catch (e) {
        //             remedyCallback && remedyCallback(ret, xhr);
        //         }
        //         if (ret.state == '000') {
        //             callback && callback(ret, xhr);
        //             return;
        //         }
        //         remedyCallback && remedyCallback(ret, xhr);
        //     } else {
        //         remedyCallback && remedyCallback(data, xhr);
        //     }
        // };
        var ajax_Data;
        const fn = function (xhr, status) {
            if (status === 'success') {
                // Global.log("http res json:", xhr.responseText);
                var ret = null;
                try {
                    ret = JSON.parse(xhr.responseText);
                    // Global.log("http res obj:", ret);

                } catch (e) {
                    Global.log(ajax_Data);
                    Global.log("http res json:", xhr.responseText);
                    remedyCallback && remedyCallback(xhr.responseText);
                }
                if (ret.state == '000') {
                    callback && callback(ret);
                    return;
                }
                Global.log(ajax_Data);
                Global.log("http res obj:", ret);
                remedyCallback && remedyCallback(ret);
            } else {
                Global.log(ajax_Data);
                Global.log("http res json:", xhr.responseText);
                remedyCallback && remedyCallback(xhr.responseText);
            }
        };
        ajax_Data = {
            url: extraUrl + (mode === 'GET' ? GET_URL : POST_URL),
            type: mode,
            data: data,
            dataType: 'json',
            // xhrFields: {
                // withCredentials: true
            // },
            // contentType: "application/json",
            // crossDomain: true,
            complete: fn
        };
        $.ajax(ajax_Data);
        // $.ajax({
        //     url: extraUrl + (mode === 'GET' ? GET_URL : POST_URL),
        //     type: mode,
        //     data: data,
        //     headers: {
        //         cookie: document.cookie
        //     },
        //     complete: fn
        // });
        // if (mode === 'GET') {
        //     $.get(extraUrl + GET_URL, data, fn);
        // } else {
        //     $.post(extraUrl + POST_URL, data, fn);
        // }
    };

    return HTTP;
}());
module.exports = HTTP;