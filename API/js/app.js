/** Initialisation de la rotation */
var autoRotate = require('exif-image-auto-rotation');
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
        document.getElementById("carousel-inner").innerHTML = document.getElementById("carousel-inner").innerHTML + file;
        // document.getElementsByClassName("carousel-inner").innerHTML = "<div class=\"item\"><div class=\"carousel-page\"><img src=\""+ file+ "\" class=\"img-responsive\" style=\"margin:0px auto;\" /></div></div>";
    }
};