var fs = require('fs');
var path = require('path');
var Jimp = require("jimp");
var piexifjs = require('piexifjs');
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
        var directory = path.dirname(file) + path.sep;
        var oldname = path.basename(file);
        //Conversion de l'image en binary
        var jpeg = fs.readFileSync(file.rotate(90));
        var data = jpeg.toString("binary");
        try {
            piexifjs.remove(data);
        }
        catch(err) {
            console.log(oldname + ' Image ne présentant pas de EXIF');
        }
        var newJpeg = new Buffer(data, "binary");
        fs.writeFileSync(file, newJpeg);
        html = '<div class="row slide">\
                    <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12">\
                        <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12 thumbnail">\
                            <div class="action" style="text-align: center;height: 80px;"><br />\
                                <button type="button" class="btn btn-default protor90">\
                                    <span class="fa fa-1x fa-undo" aria-hidden="true">&nbsp;90°</span>\
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default protorm90">\
                                    <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;90°</span>\
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default protor180">\
                                    <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;180°</span>\
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default pclose">\
                                    <span class="fa fa-1x fa-times-circle-o" aria-hidden="true">&nbsp;Fermer</span>\
                                </button>\
                                <div class="clearfix"></div>\
                            </div>\
                            <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12 thumbnail imagetraitement">\
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
// rotation de l"image dans le sens inverse de l'aiguille d'une montre
$("body").on("click", ".protor90", function(){
    fichier = $(this).parent().parent().find("img").attr('src');
    Jimp.read(fichier).then(function (file) {
        file
            .rotate(270)                 // set rotation
            .write(fichier); // save
    }).catch(function (err) {
        console.error(err);
    });
    $(this).parent().parent().remove();
});
$("body").on("click", ".protorm90", function(){
    fichier = $(this).parent().parent().find("img").attr('src');
    Jimp.read(fichier).then(function (file) {
        file
            .rotate(90)                 // set rotation
            .write(fichier); // save
    }).catch(function (err) {
        console.error(err);
    });
    $(this).parent().parent().remove();
});
$("body").on("click", ".protor180", function(){
    fichier = $(this).parent().parent().find("img").attr('src');
    Jimp.read(fichier).then(function (file) {
        file
            .rotate(180)                 // set rotation
            .write(fichier); // save
    }).catch(function (err) {
        console.error(err);
    });
    $(this).parent().parent().remove();
});