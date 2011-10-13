//////////////////////////////////////////////////////////
// Larch tree extension
// Desc: Turns a standard unordered list into a
//      collapsable tree view
//////////////////////////////////////////////////////////


(function ($) {
    $.fn.treeView = function (options) {
        var defaults = {
            multiSelect: false
        };

        var options = $.extend(defaults, options);

        return this.each(function () {
            var treeRoot = $(this);
            var rootItems;
            //var childRoots = rootItem.next("ul").children("li").children("h3");

            //if(showRoot){
            initTree(treeRoot);

            rootItems = $(this).find(">li>h3");
            collapseAllNodes(rootItems);

            treeRoot.delegate("h3", "click", function (e) {
                handleItemClick($(this));

                e.PreventDefault;
                return false;
            });
        });

        function initTree(treeRoot) {
            //var treeClone = treeRoot.clone();
            //treeRoot.detach();
            treeRoot.children("li").each(function () {
                formatNode($(this));
            });
            //treeRoot.before(treeClone).remove();
        }
        function formatNode(node) {
            var subList = node.children("ul");
            var subListItems = subList.children("li");
            var nodeParent = node.parent();

            subListItems.each(function () {
                formatNode($(this));
            });

            if (subList.length > 0) {
                // Wrap in actionable HTML.  This needs optimized later.
                var newAnchor = "<a href=\"#\" class=\"toggle\"></a>";
                var newText = $.trim(node.contents().filter(function () {
                    return this.nodeType === 3;
                }).first().text());

                var newLine = "<h3>" + newAnchor + newText + "</h3>";
                node.contents().filter(function () {
                    return this.nodeType === 3;
                }).first().replaceWith(newLine);

            }
            // Wrap endpoint nodes
            else {

                // Wrap in actionable HTML.  This needs optimized later.
                var newText = $.trim(node.contents().filter(function () {
                    return this.nodeType === 3;
                }).first().text());
                var newAnchor = "<a href=\"#\">" + newText + "</a>";

                node.contents().filter(function () {
                    return this.nodeType === 3;
                }).first().replaceWith(newAnchor);
                if (options.multiSelect) {
                    node.prepend($("<input type=\"checkbox\" \>"));
                }
            }

        }
        function handleItemClick(node) {
            toggleChildVisibility(node);
        }
        function toggleChildVisibility(node, makeVisible) {
            var childNodeTree = node.next("ul");

            childNodeTree.toggle(makeVisible);


            var isVisible = childNodeTree.is(":visible");
            if (!isVisible) {
                collapseAllNodes(node);
            }
            else {
                node.parent().toggleClass("collapsed");
            }
        }
        function collapseAllNodes(node) {
            var subList = node.next("ul");
            var subListItems = subList.children("li");
            var nodeParent = node.parent();
            subListItems.children("h3").each(function () {
                collapseAllNodes($(this));
            });

            if (!nodeParent.hasClass("collapsed")) {
                nodeParent.addClass("collapsed");
            }
            subList.hide();
        }
    };

})(jQuery);
