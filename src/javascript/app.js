Ext.define("PiAncestorFilterBroadcaster", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [{
        id: Utils.AncestorPiAppFilter.RENDER_AREA_ID,
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'middle',
            defaultMargins: '0 10 10 0',
        }
    }, {
        xtype: 'rallybutton',
        style: { 'float': 'right' },
        cls: 'secondary rly-small',
        frame: false,
        itemId: 'export-menu-button',
        iconCls: 'icon-export'
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
                labelWidth: 150,
                margin: 10
            },
            listeners: {
                scope: this,
                ready: function(plugin) {
                    plugin.addListener({
                        scope: this,
                        select: function() {
                            this._runApp();
                        }
                    });
                    this._runApp();
                },
            }
        });
        this.addPlugin(this.ancestorFilterPlugin);


    },

    onTimeboxScopeChange: function(timebox) {
        this.callParent(arguments);
        this._runApp();
    },

    // There is a subtle  bug on timebox
    // scoped pages where the milestone timebox is not correctly restored after a settings change.
    // 1. Set page as milestone timebox scoped
    // 2. Pick a non-null milestone timebox
    // 3. Open app settings and save (no change needed)
    // 4. Timebox will be 'milestone' in the window.location.href instead of 'milestone/12345'.
    // See getSdkInfo() in the SDK for how the timebox is restored.
    // This only seems to occur the first time after the page is made timebox scoped and goes away once
    // the page is reloaded once.
    _runApp: function() {
        var timeboxScope = this.getContext().getTimeboxScope()

        var filters = null;

        if (timeboxScope) {
            filters = timeboxScope.getQueryFilter();
        }
        /*
        var artifactType; // TODO
        var ancestorFilter = this.getPlugin('ancestorFilterPlugin').getFilterForType(artifactType);
        if (ancestorFilter) {
            filters = filters.and(ancestorFilter);
        }
        var config = {};
        if (this.searchAllProjects()) {
            config.context = {
                project: null
            };
        }
        */
        this.ancestorFilterPlugin.notifySubscribers();
    },

    isMilestoneScoped: function() {
        var result = false;

        var tbscope = this.getContext().getTimeboxScope();
        if (tbscope && tbscope.getType() == 'milestone') {
            result = true;
        }
        return result
    },

    searchAllProjects: function() {
        var searchAllProjects = this.getSetting('searchAllProjects');
        return this.isMilestoneScoped() && searchAllProjects;
    },

    getSettingsFields: function() {
        return [{
            id: 'searchAllProjects',
            name: 'searchAllProjects',
            fieldLabel: 'Scope Across Workspace',
            labelAlign: 'left',
            xtype: 'rallycheckboxfield',
            labelWidth: 150,
            margin: 10,
            hidden: !this.isMilestoneScoped()
        }]
    }
});
