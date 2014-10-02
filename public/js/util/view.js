/**
 * Created by susavla on 6/3/14.
 */
define(["jquery"], function ($) {

    "use strict";

    return {
        /* select/highlight clicked item can be tab,button,link
        *  item - target item, e.g. e.currentTarget
        *  itemContainer - element that contains item, e.g. '#main'
        * */

        highlightItem: function(item, itemContainer) {
            $(item).closest(itemContainer)
                .find("li")
                .removeClass("active")
                .end()
                .end() // get back to the tab
                .parent()
                .addClass("active");
        }

    };

});