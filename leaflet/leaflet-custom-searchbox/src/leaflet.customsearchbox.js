function getControlHrmlContent(){

    var controlHtmlContent = "<div id=\"controlbox\" ><div id=\"boxcontainer\" class=\"searchbox searchbox-shadow\" > <div class=\"searchbox-menu-container\"><button aria-label=\"Menu\" id=\"searchbox-menubutton\" class=\"searchbox-menubutton\"><\/button> <span aria-hidden=\"true\" style=\"display:none\">Menu<\/span> <\/div><div><input id=\"searchboxinput\" type=\"text\" style=\"position: relative;\"\/><\/div><div class=\"searchbox-searchbutton-container\"><button aria-label=\"search\" id=\"searchbox-searchbutton\" class=\"searchbox-searchbutton\"><\/button> <span aria-hidden=\"true\" style=\"display:none;\">search<\/span> <\/div><\/div><\/div><div class=\"panel\"> <div class=\"panel-header\"> <div class=\"panel-header-container\"> <span class=\"panel-header-title\"><\/span> <button aria-label=\"Menu\" id=\"panelbutton\" class=\"panel-close-button\"><\/button> <\/div><\/div><div class=\"panel-content\"> <\/div><\/div>";
    return controlHtmlContent;
}

function generateHtmlContent(menuItems){
    var content = '<ul class="panel-list">';
    for (i = 0; i < menuItems.Items.length;i++)
    {
        var item = menuItems.Items[i];
        content += '<li class="panel-list-item"><div>';
        if (item.type == 'link') {
            content += '<span class=\"panel-list-item-icon '  + item.icon+ '\" ></span>';
            content += '<a href=\"' + item.href + '\">' + item.name + '</a>';
        }
        else if (item.type == 'button') {
            content += '<span class=\"panel-list-item-icon ' + item.icon + '\" ></span>';
            content += '<button onclick=\"' + item.onclick + '\">' + item.name + '</button>';

        }
        content += '</li></div>';
    }
    content += '</ul>';
    return content;
}

function createSearchboxControl(){

    var searchboxControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        initialize: function(options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div');
            container.id = "controlcontainer";
            var headerTitle = this._sideBarHeaderTitle;
            var menuItems = this._sideBarMenuItems;
            var searchCallBack = this._searchfunctionCallBack;

            $(container).html(getControlHrmlContent());
            setTimeout(function () {
                
                $("#searchbox-searchbutton").click(function () {
                    var searchkeywords = $("#searchboxinput").val();
                    searchCallBack(searchkeywords);
                });
                if (menuItems){
                    var htmlContent = generateHtmlContent(menuItems);
                    $(".panel-content").html(htmlContent);       
                }
            }, 1);

            L.DomEvent.disableClickPropagation(container);
            return container;
        }
    });
    return searchboxControl;
}