if (!CC_EDITOR) {
    //添加widget
    cc.Widget.prototype.start = function () {
        Global.widget.push(this);
    };

    //移除widget
    cc.Widget.prototype.onDestroy = function () {
        var index = Global.widget.indexOf(this);
        if (index !== -1) {
            Global.widget.splice(index, 1);
        }
    };

    if (!cc.sys.isNative) {
        cc.view.setResizeCallback(function () {
            Global.widget.forEach(element => {
                element.updateAlignment();
            });
        }.bind(this));
    }
}