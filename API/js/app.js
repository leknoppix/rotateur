require('nw.gui').Window.get().showDevTools();
/***********************************
 **
 **        Gestion du Drag and Drop
 **
 ************************************/
window.ondragover = window.ondrop = function (e) {
    e.preventDefault();
    return false;
};
var el = document.querySelector("#drop");
el.ondragover = function () {
    this.className = "hover";
    this.innerHTML= "Lachez le fichier";
    return false;
};
el.ondragleave = function () {
    this.className = "";
    this.innerHTML= "Déposez votre photo";
    return false;
};
el.ondrop = function(e){
    e.preventDefault();
    this.innerHTML= "Traitement en cours";
    for (var i=0; i< e.dataTransfer.files.length; ++i){
        var file= e.dataTransfer.files[i].path;
        html = '<div class="row slide">\
                <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12">\
                    <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12 thumbnail">\
                        <div class="action" style="text-align: center;height: 80px;"><br />\
                            <button type="button" class="btn btn-default">\
                                <span class="fa fa-1x fa-undo" aria-hidden="true">&nbsp;90°</span>\
                            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                            <button type="button" class="btn btn-default">\
                                <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;90°</span>\
                            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                            <button type="button" class="btn btn-default">\
                                <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;180°</span>\
                            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                            <button type="button" class="btn btn-default pclose">\
                                <span class="fa fa-1x fa-times-circle-o" aria-hidden="true">&nbsp;Fermer</span>\
                            </button>\
                            <div class="clearfix"></div>\
                        </div>\
                        <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12 thumbnail">\
                            <img src="' + file + '"/>\
                        </div>\
                    </div>\
                </div>\
            </div>';
        ActionImage = document.getElementById('ActionImage');
        ActionImage.innerHTML += html;
    }
    this.innerHTML= "Traitement fini";
};
//gère la fermeture de la photo choisi
$("body").on("click", ".pclose", function(){
    $(this).parent().parent().remove();
});