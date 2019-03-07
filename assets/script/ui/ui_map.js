let ui_window = require("ui_window");
let constant = require("constant");
let net = require("net");
let data = require("data");
var SCALE_MAX = 3,
    SCALE_MIN = 0.7,
    SCALE = 1,
    WIN_WIDTH,
    WIN_HEIGHT,
    WIN_WIDTH_HALF,
    WIN_HEIGHT_HALF,
    BG_WIDTH,
    BG_HEIGHT,
    MAX_X,
    MIN_X,
    MAX_Y,
    MIN_Y;
cc.Class({
    extends: ui_window,

    properties: {
        window_type: constant.WINDOW_TYPE.UI,
        bg: cc.Node,
        node_scene: cc.Node,
        camera: cc.Node,                        //摄像机
    },

    // use this for initialization
    onLoad: function () {
        this.initCameraVar();
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.cameraMove, this);
    },

    start: function () {
       
    },

    onEnable: function () {
        this._super();
    },

    onDisable: function () {
        this._super();
    },

    _register_handler: function () {

    },

    init_ui: function (_msg) {

    },

    _unregister_handler: function () {
        net.off(this.node);
    },

    on_close: function () {
        ui.close();
    },

    on_open_sys: function (_, _uiName) {
        ui.open(_uiName);
    },
    /**摄像机移动
     *
     */
    cameraMove(event) {
        var touches = event.getTouches();
        if (touches.length >= 2) {                                                  //缩放
            var touch1 = touches[0],
                touch2 = touches[1],
                delta1 = touch1.getDelta(),
                delta2 = touch2.getDelta(),
                touchPoint1 = touch1.getLocation(),
                touchPoint2 = touch2.getLocation(),
                distance = cc.pSub(touchPoint1, touchPoint2),
                delta = cc.pSub(delta1, delta2),
                scale = 1;
            if (Math.abs(distance.x) > Math.abs(distance.y)) {                      //缩小
                scale = (distance.x + delta.x) / distance.x * SCALE;
            }
            else {                                                                  //放大
                scale = (distance.y + delta.y) / distance.y * SCALE;
            }
            scale = scale > SCALE_MAX ? SCALE_MAX : scale < SCALE_MIN ? SCALE_MIN : scale;
            this.camera.Camera.zoomRatio = SCALE = scale;
            this.updateCameraScale();
        } else {                                                                    //移动
            var camera_v2 = this.camera.getPosition();
            camera_v2 = cc.pSub(camera_v2, this.pDivision(event.touch.getDelta(), SCALE));
            this.updateCameraPoint(camera_v2);
        }
    },
    /**初始化变量信息
     *
     */
    initCameraVar() {
        const winSize = cc.director.getWinSizeInPixels();
        WIN_WIDTH = winSize.width;
        WIN_HEIGHT = winSize.height;
        WIN_WIDTH_HALF = WIN_WIDTH >> 1;
        WIN_HEIGHT_HALF = WIN_HEIGHT >> 1;
        BG_WIDTH = this.bg.width;
        BG_HEIGHT = this.bg.height;
        MAX_X = BG_WIDTH - WIN_WIDTH_HALF / SCALE;
        MIN_X = WIN_WIDTH_HALF / SCALE;
        MAX_Y = BG_HEIGHT - WIN_HEIGHT_HALF / SCALE;
        MIN_Y = WIN_HEIGHT_HALF / SCALE;
        SCALE_MIN = Math.max(WIN_WIDTH / BG_WIDTH, WIN_HEIGHT / BG_HEIGHT);
        this.updateCameraPoint(this.camera.getPosition());
    },
    /**向量除法
     *
     * @param v2        向量
     * @param num       倍数
     */
    pDivision(v2, num) {
        v2.x /= num;
        v2.y /= num;
        return v2;
    },
    /**更新坐标
     *
     * @param pos   坐标
     */
    updateCameraPoint(pos) {
        pos.x = pos.x > MAX_X ? MAX_X : pos.x < MIN_X ? MIN_X : pos.x;
        pos.y = pos.y > MAX_Y ? MAX_Y : pos.y < MIN_Y ? MIN_Y : pos.y;
        this.camera.setPosition(pos);
    },
});
