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
                        change: function () { this._notifySubscribers('filters'); }
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
