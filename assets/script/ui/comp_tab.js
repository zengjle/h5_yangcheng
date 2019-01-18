var Tab = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Tab',
    },

    properties: {
        /**
         * !#en When this value is true, the check mark component will be enabled, otherwise
         * the check mark component will be disabled.
         * !#zh 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
         * @property {Boolean} isChecked
         */
        isChecked: {
            default: true,
            override: true,
            notify: function () {
                this._updateCheckMark();
            },
            tooltip: "如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。"
        },

        /**
         * !#en The image used for the checkmark.
         * !#zh Tab 处于选中状态时显示的图片
         * @property {Sprite} checkMark
         */
        checkMark: {
            default: null,
            override: true,
            type: cc.Sprite,
            tooltip: "Tab 处于选中状态时显示的图片"
        },

        tab_stat: [cc.Node],
    },

    onEnable: function () {
        if (!CC_EDITOR) {
            this._registerTabEvent();
        }
        if (this.tabGroup && this.tabGroup.enabled) {
            this.tabGroup.addTab(this);
        }
    },

    onDisable: function () {
        if (!CC_EDITOR) {
            this._unregisterTabEvent();
        }
        if (this.tabGroup && this.tabGroup.enabled) {
            this.tabGroup.removeTab(this);
        }
    },

    _updateCheckMark: function () {
        if (this.checkMark) {
            this.checkMark.node.active = !!this.isChecked;
        }
        if (this.tab_stat.length > 0) {
            for (let _checkMark of this.tab_stat) {
                _checkMark.active = !!this.isChecked;
            }
        }
    },

    _registerTabEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.tab, this);
    },

    _unregisterTabEvent: function () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.tab, this);
    },

    tab: function (event) {
        var group = this.tabGroup || this._tabContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = !this.isChecked;

        this._updateCheckMark();

        if (group && group.enabled) {
            group.updateTabs(this);
        }

        cc.log('tab')
    },

    /**
     * !#en Make the tab button checked.
     * !#zh 使 tab 按钮处于选中状态
     * @method check
     */
    check: function () {
        var group = this.tabGroup || this._tabContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = true;

        if (group && group.enabled) {
            group.updateTabs(this);
        }
    },

    /**
     * !#en Make the tab button unchecked.
     * !#zh 使 tab 按钮处于未选中状态
     * @method uncheck
     */
    uncheck: function () {
        var group = this.tabGroup || this._tabContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = false;
    }
});

cc.Tab = module.exports = Tab;

cc.js.get(Tab.prototype, '_tabContainer',
    function () {
        var parent = this.node.parent;
        if (cc.Node.isNode(parent)) {
            return parent.getComponent(cc.TabContainer);
        }
        return null;
    }
);

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event tab
 * @param {Event.EventCustom} event
 * @param {Tab} event.detail - The Tab component.
 */
