var fs = require('fs');
var path = require('path');
var Jimp = require("jimp");
var piexifjs = require('piexifjs');
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
        localStorage.setItem(oldname,0);
        var directorytemp = os.tmpdir() + path.sep;
        var newfile = directorytemp + new Date().getTime() + '_' + oldname;
        //Conversion de l'image en binary
        var jpeg = fs.readFileSync(file);
        var data = jpeg.toString("binary");
        var newdata = data;
        try {
            newdata = piexifjs.remove(data);
        }
        catch(err) {
            console.log(oldname + ' Image ne présentant pas de EXIF');
        }
        var newJpeg = new Buffer(newdata, "binary");
        fs.writeFileSync(newfile, newJpeg);
        if(os.platform() == 'linux' || os.platform() == 'darwin'){
            newfile= 'file://' + newfile;
            directory_picture = 'file://' + directory_picture;
        }
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
                                <button type="button" class="btn btn-default psave" disabled>\
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
    result = getname(file);
    localStorage.removeItem(result);
    if(os.platform() == 'linux' || os.platform() == 'darwin'){
        file = file.replace('file://', '');
    }
    fs.unlink(file);
    $(this).parent().parent().remove();
});
// rotation de l"image dans le sens inverse de l'aiguille d'une montre 90°
$("body").on("click", ".protor90", function(){
    var div = $(this).parent().parent().find("img");
    var button= $(this).parent();
    rotation(270, div, button);
});
// rotation de l"image dans le sens des aiguilles d'une montre 90°
$("body").on("click", ".protorm90", function(){
    var div = $(this).parent().parent().find("img");
    var button= $(this).parent();
    rotation(90, div, button);
});
// rotation de l"image dans le sens des aiguilles d'une montre 180°
$("body").on("click", ".protor180", function(){
    var div = $(this).parent().parent().find("img");
    var button= $(this).parent();
    rotation(180, div, button);
});
// Enregistrement de l'image
$("body").on("click", ".psave", function(){
    var image = $(this).parent().parent().find("img").attr('src');
    var button = $(this).parent();
    OffButton(button);
    var destination = $(this).parent().parent().find("span.hidden").text();
    result = getname(image);
    nomfichier= result;
    nomgenerer=destination + nomfichier;
    if(os.platform() == 'linux' || os.platform() == 'darwin'){
        image = image.replace('file://', '');
        nomgenerer = nomgenerer.replace('file://', '');
    }
    fs.createReadStream(image).pipe(fs.createWriteStream(nomgenerer));
    button.find('.pclose').prop('disabled', false);
});
//fonction qui permet la rotation de l'image
function rotation(angle, div, button)
{
    if(angle == 90){ var sens = 1}else if(angle == 180){ var sens = 2}else if (angle==270){ var sens = -1}
    var that = div;
    fichier = that.attr('src');
    dategenerer = new Date().getTime();
    nomfichier = getname(fichier);
    base = os.tmpdir() + path.sep;
    nouveaufichiercreer = base + dategenerer + '_' + nomfichier;
    if(os.platform() == 'linux' || os.platform() == 'darwin'){
        fichier = fichier.replace('file://','');
    }
    OffButton(button);
    updateLs(nomfichier, sens, button);
    Jimp.read(fichier).then(function (file) {
        file
            .rotate(angle)
            // set rotation
            .write(nouveaufichiercreer, function(){ //save
                fs.unlink(fichier);
                if(os.platform() == 'linux' || os.platform() == 'darwin'){
                    nouveaufichiercreer = 'file://' + nouveaufichiercreer;
                }
                that.attr('src', nouveaufichiercreer);
                //reactiver les boutons
                OnButton(button);
                updateLs(nomfichier, 0, button);
            });
    }).catch(function (err) {
        console.error(err);
    });
}
//fonction getname
function getname(fichier){
    tableau = fichier.split(path.sep);
    result = tableau[tableau.length-1];
    name = result;
    regex = /([0-9]{13}_)(.*)/gmi;
    result = regex.exec(name);
    console.log(result[result.length-1]);
    return result[result.length-1];
}
//fonction update localStorage
function updateLs(namefile, sens, button){
    newvalue = parseFloat(localStorage.getItem(namefile)) + parseFloat(sens);
    if(newvalue == 4 || newvalue == -4 || newvalue == 0){
        newvalue = 0;
        button.find('.psave').prop('disabled', true);
    }
    localStorage.setItem(namefile, newvalue);
}
//fonction pour afficher tout les boutons
function OnButton(button){
    button.find('button').each(function(){
        $(this).prop('disabled', false);
    });
}
function OffButton(button){
    button.find('button').each(function(){
        $(this).prop('disabled', true);
    });
}