var fs = require('fs');
var path = require('path');
var Jimp = require("jimp");
var piexifjs = require('piexifjs');
var mkdirp = require('mkdirp');
var imagepreloader = require('image-preloader');
const os = require('os');
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
        var directory_picture = path.dirname(file) + path.sep;
        var oldname = path.basename(file);
        var directorytemp = os.tmpdir() + path.sep;
        var newfile = directorytemp + new Date().getTime() + '_' + oldname;
        //Conversion de l'image en binary
        var jpeg = fs.readFileSync(file);
        var data = jpeg.toString("binary");
        try {
            piexifjs.remove(data);
        }
        catch(err) {
            console.log(oldname + ' Image ne présentant pas de EXIF');
        }
        var newJpeg = new Buffer(data, "binary");
        fs.writeFileSync(newfile, newJpeg);
        html = '<div class="row slide">\
                    <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12">\
                        <div class="col-lg-6 col-xs-12 col-sm-12 col-md-6 thumbnail">\
                            <div class="action" style="text-align: center;height: 80px;"><br />\
                                <button type="button" class="btn btn-default protor90">\
                                    <span class="fa fa-1x fa-undo" aria-hidden="true">&nbsp;90°</span>\
                                </button>&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default protorm90">\
                                    <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;90°</span>\
                                </button>&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default protor180">\
                                    <span class="fa fa-1x fa-repeat" aria-hidden="true">&nbsp;180°</span>\
                                </button>&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default psave">\
                                    <span class="fa fa-1x fa-floppy-o" aria-hidden="true">&nbsp;Enregistrer</span>\
                                </button>&nbsp;&nbsp;\
                                <button type="button" class="btn btn-default pclose">\
                                    <span class="fa fa-1x fa-times-circle-o" aria-hidden="true">&nbsp;Fermer</span>\
                                </button>\
                                <div class="clearfix"></div>\
                            </div>\
                            <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12 thumbnail imagetraitement">\
                                <img src="' + newfile + '" />\
                                <span class="hidden">' + directory_picture + '</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>';
        ActionImage = document.getElementById('ActionImage');
        ActionImage.innerHTML += html;
    }
    this.innerHTML= "Déposez votre photo";
};
//gère la fermeture de la photo choisi
$("body").on("click", ".pclose", function(){
    var file = $(this).parent().parent().find("img").attr('src');
    fs.unlink(file);
    $(this).parent().parent().remove();
});
// rotation de l"image dans le sens inverse de l'aiguille d'une montre 90°
$("body").on("click", ".protor90", function(){
    var div = $(this).parent().parent().find("img");
    rotation(270, div);
});
// rotation de l"image dans le sens des aiguilles d'une montre 90°
$("body").on("click", ".protorm90", function(){
    var div = $(this).parent().parent().find("img");
    rotation(90, div);
});
// rotation de l"image dans le sens des aiguilles d'une montre 180°
$("body").on("click", ".protor180", function(){
    var div = $(this).parent().parent().find("img");
    rotation(180, div);
});
// Enregistrement de l'image
$("body").on("click", ".psave", function(){
    var image = $(this).parent().parent().find("img").attr('src');
    var destination = $(this).parent().parent().find("span.hidden").text() + path.sep;
    regex = /([0-9a-zA-Z\-~:_\ \\]*)([\\])([0-9]*)([_])([0-9a-zA-Z\-_.]*)/ig;
    var result = regex.exec(image);
    nomfichier=result[5];
    fs.rename(image, destination + nomfichier);
});
//fonction qui permet la rotation de l'image
function rotation(angle, div)
{
    var that = div;
    fichier = that.attr('src');
    regex = /([0-9a-zA-Z\-~:_\ \\]*)([\\])([0-9]*)([_])([0-9a-zA-Z\-_.]*)/ig;
    var result = regex.exec(fichier);
    dategenerer = new Date().getTime();
    nomfichier=result[5];
    base=result[1] + path.sep;
    nouveaufichiercreer = base + dategenerer + '_' + nomfichier;
    Jimp.read(fichier).then(function (file) {
        file
            .rotate(angle)                 // set rotation
            .write(nouveaufichiercreer, function(){ //save
                fs.unlink(fichier);
                that.attr('src', nouveaufichiercreer);
            });
    }).catch(function (err) {
        console.error(err);
    });
}