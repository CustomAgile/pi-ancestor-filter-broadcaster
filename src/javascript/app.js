Ext.define("PiAncestorFilterBroadcaster", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [{
        id: Utils.AncestorPiAppFilter.RENDER_AREA_ID,
        xtype: 'container',
    }],

    config: {
        defaultSettings: {
            searchAllProjects: false
        }
    },

    launch: function() {
        this.ancestorFilterPlugin = Ext.create('Utils.AncestorPiAppFilter', {
            ptype: 'UtilsAncestorPiAppFilter',
            pluginId: 'ancestorFilterPlugin',
            publisher: true,
            settingsConfig: {
                labelWidth: 200,
                margin: 10
            },
            listeners: {
                scope: this,
                ready: function(plugin) {
                    plugin.addListener({
                        scope: this,
                        select: this._notifySubscribers
                    });
                    this._notifySubscribers()
                },
            }
        });
        this.addPlugin(this.ancestorFilterPlugin);


    },

    _notifySubscribers: function() {
        this.ancestorFilterPlugin.notifySubscribers();
    },

    /**
     * Must return a non-zero list of settings to allow the ancestorFilter plugin to
     * insert its settings. The SDK decides if an app should have a settings menu option
     * *before* initializing app plugins created in app.launch()
     */
    getSettingsFields: function() {
        return [{
            xtype: 'container'
        }]
    }
});
