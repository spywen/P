/**
 * Created by Laurent on 21/01/14.
 */
var colors = [
    "#FFF",
    "#333",
    "#666",
    "#999",
    "#70AAE9",
    "#2F65A0",
    "#A02F61",
    "#2FA073",
    "#2FA038",
    "#FFD632",
    "#FF9D32",
    "#000",
    "#B5FF32",
]
var tools = document.getElementById("tools");
(function(){
    for(var i =0 ; i<colors.length;i++){
        var buttonColor = document.createElement("a");
        buttonColor.setAttribute("class","btn btn-default");

        var iconColor = document.createElement("span");
        if(colors[i]=="#FFF"){
            buttonColor.setAttribute("onclick","canvas.changeColorSwipe(this)");
            iconColor.setAttribute("class","glyphicon glyphicon-tint");
        }
        else{
            buttonColor.setAttribute("onclick","canvas.changeColor(this,'"+colors[i]+"')");
            iconColor.setAttribute("class","glyphicon glyphicon-pencil color");
            iconColor.style.color = colors[i];
        }
        buttonColor.appendChild(iconColor);
        tools.appendChild(buttonColor);
    }
})();
