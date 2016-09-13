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
        var el = document.getElementById('carousel-inner');
        div_item = document.createElement('div');
        div_carrousel = document.createElement('div');
        image = document.createElement('img');
        image.src=file;
        image.className = "img-responsive";
        div_carrousel.className = "carousel-page slide-" + i;
        div_item.className= "item";
        if(i == 0)
        {
            div_item.className="active";
        }
        div_carrousel.appendChild(image);
        div_item.appendChild(div_carrousel);
        el.appendChild(div_item);
    }
    this.innerHTML= "Traitement fini";
};