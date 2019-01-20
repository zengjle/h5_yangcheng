cc.Class({
    extends: cc.Component,

    properties: {
        _isCellInit_: false,
        _longClicked_: false,
    },

    //不可以重写
    _cellAddMethodToNode_: function () {
        this.node.clicked = this.clicked.bind(this);
    },
    _cellAddTouch_: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (this.node.active === true && this.node.opacity !== 0) {
                if (!this._longClicked_) {
                    this._longClicked_ = true;
                    this.scheduleOnce(this._longClicked, 1.5);
                }
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.clicked();
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
    },

    _cellInit_: function () {
        if (!this._isCellInit_) {
            this._cellAddMethodToNode_();
            this._cellAddTouch_();
            this._isCellInit_ = true;
        }
    },

    _longClicked: function () {
        this._longClicked_ = false;
        this.node.emit(cc.Node.EventType.TOUCH_CANCEL);
        this.longClicked();
    },

    onLoad() {

    },

    onEnable: function () {
        this._cellInit_();
        this._register_handler && this._register_handler();
        if (!this.is_swallow_touched) {
            this.scheduleOnce(() => {
                this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                    event.stopPropagation();
                });
            });
            this.is_swallow_touched = true;
        }
    },

    onDisable: function () {
        this._unregister_handler && this._unregister_handler();
    },

    //可以重写的方法

    //需要重写的方法
    longClicked: function () {

    },
    //被点击时相应的方法
    clicked: function () {

    },
});