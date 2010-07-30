Ext.ns("Ext.ux");

/*!
 * Copyright(c) 2010, http://www.mcdconsultingllc.com
 * 
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 * @author Sean McDaniel <sean@mcdconsulting.com>
 */

/**
 * @class Ext.ux.TabbedPanelBlind
 * @extends Ext.TabPanel
 * A tab based blind for panels.
 * @constructor
 * Creates a new TabbedPanelBlind
 * @param {Object} config Configuration options. Note that you can pass in any TapPanel configuration options.  Note that the following
 * options will be ignored: {renderTo, width, cls, tabPosition, autoHeight, collapsed, collapseEl}
 */
Ext.ux.TabbedPanelBlind = Ext.extend(Ext.TabPanel, {		         
    /**
     * @cfg {Boolean} mask Should mask host panel when expanded (defaults to false)
     */
    mask: true,

    /**
     * @cfg {Boolean} resizeTabs Should resize tabs (defaults to true)
     */
    resizeTabs: true,

    initComponent: function() {
	     var panel = this.panel;
	     Ext.apply(this, {
		    renderTo: panel.body.insertFirst({tag: 'div'}),
		    width: panel.getWidth(),
		    cls: 'ux-blind',
		    tabPosition: 'bottom',
		    autoHeight: true,
		    collapsed: true,
		    collapseEl: 'body'
	     });
	
	    panel.on('resize', this.adjustWidth, this);	
		this.on('afterlayout', this.adjustStripWidth);
	
	    Ext.ux.TabbedPanelBlind.superclass.initComponent.call(this);	
    },

    adjustStripWidth: function(c) {
	    c.strip.setWidth(c.stripWrap.getWidth() - 2);
    },

    adjustWidth: function(panel, width, height) {
	   var collapsed = this.collapsed;
	   this.setWidth(width);
	   this.collapsed = false;
	   this.syncSize();
	   this.collapsed = collapsed;
    },

    afterCollapse: function(anim) {
	    Ext.ux.TabbedPanelBlind.superclass.afterCollapse.call(this, anim);
	    this.clearMonitor();
	    if (this.mask) {
	        this.panel.enable();
	    }
    },

    collapseIf: function(e) {
	    if(!e.within(this.el)){
            this.collapse();
        }
    },

    onStripMouseDown: function(e) {
	    var t = this.findTargets(e);
	    var itemClicked = t.item;
	
	    var currentlyActive = this.activeTab;
	    Ext.ux.TabbedPanelBlind.superclass.onStripMouseDown.call(this, e);
	    if (this.collapsed && itemClicked) {
		    this.expand();
	    } else {
		    if ((t.item && t.item == currentlyActive) || !t.item) {
			    this.collapse();
			}
	    }
    },

    clearMonitor: function(){
        Ext.getDoc().un("mousedown", this.collapseIf, this);
    },

    expand: function(anim) {
	    if (this.mask) {
	        this.panel.disable();
	    }
	
	    Ext.getDoc().on("mousedown", this.collapseIf, this);	
	    return Ext.ux.TabbedPanelBlind.superclass.expand.call(this, anim);
    }
});


/**
 * @class Ext.ux.TabbedPanelBlindPlugin
 * @extends Ext.util.Observable
 * A plugin for tab based blind for panels.
 * @constructor
 * Creates a new TabbedPanelBlindPlugin
 * @param {Object} config Configuration options. Note that you can pass in any TapPanel configuration options.  Note that the following
 * options will be ignored: {renderTo, width, cls, tabPosition, autoHeight, collapsed, collapseEl}
 */
Ext.ux.TabbedPanelBlindPlugin = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
	    Ext.apply(this, config);	
	},
	
    init: function(panel) {
	    this.panel = panel;
		panel.on('afterrender', this.onAfterPanelRender, this, {single: true});
    },

    onAfterPanelRender: function() {
	    new Ext.ux.TabbedPanelBlind(this);
    }
});