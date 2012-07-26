var ThemeBot = UTM.extend({
    styleMap: {
    	global: {
    		"font-family": {
    			"selector": "body",
    			"dropEvent": {
    				"color": "invert",
    				"border-color": "30%"  
    			}
    		}, 

    		"max-width": { 
    			"selector": ".container" 
    		}  
    	},
    	header: {
    		"color": {
    			"selector": ".header h1"
    		}, 
    		"background-color": {
    			"selector": ".header",
    			"dropEvent": {
    				"color": "invert",
    				"text-shadow": "30%"
    			}
    		}
    	},
    	banner: {
    		"color": {
    			"selector": ".banner"
    		},
    		"background-color": {
    			"selector": ".banner",
    			"dropEvent": {
    				"color": "invert",
    				"text-shadow": "30%"
    			}
    		}
    	},
    	postHeader: {
    		"color": {
    			"selector": ".post .post-header"
    		}
    	},
    	postBody: {
    		"color": {
    			"selector": ".post, p"
    		}
    	}
    	footer: {
    		"color": {
    			"selector": ".banner.footer"
    		},
    		"background-color": {
    			"selector": ".banner.footer",
    			"dropEvent": {
    				"color": "invert",
    				"text-shadow": "30%"
    			}
    		}
    	}
    } 
});