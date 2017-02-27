"use strict"

var canvas=document.getElementById("canvas");
var context=canvas.getContext('2d');
var image=new Image();
image.onload=function(){
    context.drawImage(image,0,0,canvas.width,canvas.height);
};
image.src="../assets/img/rgb_circle_full_1000_1000.png";