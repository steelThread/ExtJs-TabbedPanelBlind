Ext.ns("Ext.ux");

/**
 */
Ext.ux.TabbedPanelBlind = Ext.extend(Ext.TabPanel, {
    mask: true,
    initComponent: function() {
	     var panel = this.panel;
	     var el = panel.body.insertFirst({
             tag: 'div'
	     });
	
		 // Default values
	     Ext.apply(this, {
		    renderTo: el,
		    cls: 'ux-blind',
	        resizeTabs: true, 
	        forceLayout: true,
	        minTabWidth: 115,
	        tabWidth: 140,
	        collapsed: true,
	        width: panel.getWidth(),
	        autoHeight: true,
	        defaults: {autoScroll: true},
	        tabPosition: 'bottom',
	        collapseEl: 'body',
			listeners: {
				afterlayout: function(c) {
					c.strip.setWidth(c.stripWrap.getWidth() - 2);
				}
			}	         
	     });
	
	    panel.on('resize', this.adjustWidth, this);
	    Ext.ux.TabbedPanelBlind.superclass.initComponent.call(this);	
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
	    var currentlyActive = this.activeTab;
	
	    Ext.ux.TabbedPanelBlind.superclass.onStripMouseDown.call(this, e);
	    if (this.collapsed) {
		    this.expand();
	    } else {
		    var t = this.findTargets(e);		   
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

Ext.reg("tabbedpanelblind", Ext.ux.TabbedPanelBlind);