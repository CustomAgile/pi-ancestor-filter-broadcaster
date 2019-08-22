Ext.define("PiAncestorFilterBroadcaster", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [{
        id: Utils.AncestorPiAppFilter.RENDER_AREA_ID,
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'middle',
            defaultMargins: '0 10 10 0',
        }
    }, {
        id: 'applyFilterBtnContainer',
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'middle',
            defaultMargins: '0 10 10 0',
        }
    }, {
        id: Utils.AncestorPiAppFilter.PANEL_RENDER_AREA_ID,
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'middle',
            defaultMargins: '0 10 10 0',
        }
    }],

    config: {
        defaultSettings: {
            searchAllProjects: false
        }
    },

    launch: function () {
        this.ancestorFilterPlugin = Ext.create('Utils.AncestorPiAppFilter', {
            ptype: 'UtilsAncestorPiAppFilter',
            pluginId: 'ancestorFilterPlugin',
            btnRenderAreaId: 'applyFilterBtnContainer',
            publisher: true,
            filtersHidden: false,
            settingsConfig: {
                labelWidth: 200,
                margin: 10
            },
            listeners: {
                scope: this,
                ready: function (plugin) {
                    plugin.addListener({
                        scope: this,
                        select: function () { this._notifySubscribers('ancestor'); },
                        change: this._onFilterChange
                    });

                    this.down('#applyFilterBtnContainer').add({
                        xtype: 'rallybutton',
                        itemId: 'applyFiltersBtn',
                        handler: this._applyFilters,
                        text: 'Apply filters to apps',
                        cls: 'apply-filters-button',
                        disabled: true
                    });

                    this._notifySubscribers('ancestor');
                },
            }
        });
        this.addPlugin(this.ancestorFilterPlugin);
    },

    _notifySubscribers: function (changeType) {
        this.ancestorFilterPlugin.notifySubscribers(changeType);
    },

    _onFilterChange: function () {
        this.down('#applyFiltersBtn').setDisabled(false);
    },

    _applyFilters: function (btn) {
        btn.setDisabled(true);
        Rally.getApp()._notifySubscribers('filters');
    },

    /**
     * Must return a non-zero list of settings to allow the ancestorFilter plugin to
     * insert its settings. The SDK decides if an app should have a settings menu option
     * *before* initializing app plugins created in app.launch()
     */
    getSettingsFields: function () {
        return [{
            xtype: 'container'
        }];
    }
});
