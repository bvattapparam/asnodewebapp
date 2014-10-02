/**
 * Created by susavla on 4/25/14.
 */
(function($) {
    $.widget("pp.openWindow", {
        options: {
            name: null,
            width: null,
            height: null,
            left: null,
            top: null,
            scrollbars: 1,
            resizable: 1,
            menubar: 0,
            toolbar: 0,
            location: 0,
            status: 1,
            link: null, // link from tag or jsp
            size: 'm'//default size
        },
        _init : function(){
            var self = this, elem = this.element; var opts = this.options;
            //setting click event if its anchor or any other html tag which should have link param
            if((elem.get(0).tagName=='A') || (opts.link)){
                elem.click( function(e){ self.showPopUpWindow(e); } );
            }
        },
        showPopUpWindow : function(e){
            var opts = this.options, elem = this.element;
            //prevent default only for anchor to prevent href action in parent window
            if(elem.get(0).tagName=='A'){
                e.preventDefault();
            }
            //setting dimensions - if no custom height/width is passed, it uses the passed size(s,m,l) or default size
            if(!opts.width || !opts.height){
                sizes= [["s",400,300],["m",440,450],["l",560,450],["xl",1000,500]];
                for (var j = 0, len = sizes.length; j < len; j++ ){
                    if (opts.size == sizes[j][0]) {
                        opts.width = sizes[j][1];
                        opts.height = sizes[j][2];
                        break;
                    }
                }
            }
            //setting random name if not provided
            if(!opts.name){
                opts.name = "autoWin"+ Math.round(Math.random() * 10000);
            }
            //concatenating all the properties
            var specs="";
            for (var prop in opts) {
                if(prop!='name' && prop!='size' && prop!='disabled' && opts[prop]!=null){
                    specs += prop +"="+ opts[prop] +",";
                }
            }
            //triggering the popup
            if(opts.link){
                window.open(opts.link, opts.name, specs)
            }else{
                window.open(elem.attr('href'), opts.name, specs);
            }
        }
    });
})(jQuery);