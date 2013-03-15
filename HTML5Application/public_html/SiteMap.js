dojo.provide("SiteMap.widget.SiteMap");
dojo.require("SiteMap.widget.lib.raphael");

mendix.widget.declare("SiteMap.widget.SiteMap", {
	addons: [],
	inputargs: {
        title: ''
    },
	//local variable
	paper: null,
	startX: 10,
    startY: 10,
    lastX: 0,
    lastY: 0,
    font: "Museo",
    fontSize: 16,
    letterSpacing: 0,
    lineSpacing: 5,
    indentSpacing: 10,
	
	//
	postCreate : function() {
        this.startX=10;
        this.startY=10;
        this.lastX=this.startX;
        this.lastY=this.startY;
        
        this.paper=this.intializeCanvas();
		this.getMenuItems(dojo.hitch(this, this.renderMenu));
		this.actRendered();
	},
    intializeCanvas: function(){
        var canvas = mxui.dom.div({'style' : 'height: '+ 600+'px; width: '+ 800+';' });
		canvas.setAttribute("id",'canvas');//set ID
		this.domNode.appendChild(canvas);//add as node
		paper = Raphael(canvas, 800, 600);
        return paper;
    },
	applyContext : function(context, callback){
		callback&&callback();
	},
	renderMenu: function(menu, json){
        var menuTree=[];
        menuTree=json.menu_tree;
        menuTree.forEach(dojo.hitch(this,this.renderMenuItem));
	},
    renderMenuItem: function(menuItem, index, menu){
       for(var item in menuItem){
           menuItem[item]&&(menuItem[item].length)&&menuItem[item].forEach(dojo.hitch(this, this.renderSubItem,item));
       }
    },
    renderSubItem: function(item, subItem ){
        if (!subItem||subItem=='') return null;
        //only draw when subItem is a String or array
        //1. print item
        this.printAndMove(item,false);
        //2. print sub Item
        if (typeof subItem =="string"){
            this.printAndMove(subItem,true);
        }
        else{
            for (var subsubItem in subItem){
                this.printAndMove(subsubItem, false);
            }
        }
    },
    printAndMove: function(text,isSubItem){
        var font={font: "50px "+this.font, opacity: 0.5};
        this.paper.print(this.lastX, this.lastY, text, font, this.fontSize)
                .attr({fill: "#fff"});
        this.increasePosition(isSubItem);
    },
    increasePosition: function(isSubItem){
        if (isSubItem) {
            this.lastX=this.startX+this.indentSpacing;
        }
        else{
            this.lastX=this.startX;
        }
        this.lastY+=(this.lineSpacing+this.fontSize);
    },
	getMenuItems: function(callback){
		mx.server.request({request: {action: "retrieve_menus",params: {type: "menu"}},
									options: {callback: callback,
									preventCache: true,
									useCache: false}});
	},
	uninitialize : function() {
		
	}
});