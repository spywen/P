/**
 * Created by Laurent on 21/01/14.
 */

var canvas = {
    //Faire une sous variable VARIABLES
    id: 'canvas',
    width:600,
    height:400,
    contentCanvas: document.getElementById('salle'),
    canvasElt: document.createElement('canvas'),
    swipeButton: document.getElementById("swipe"),
    context: null,
    trace:false,
    clickX: [],
    clickY: [],
    clickDrag: [],
    color:"#aaaaaa",
    lineWidth: 5,
    lineJoin: "round",
    createCanvas: function(){
        this.canvasElt.setAttribute('width', this.width);
        this.canvasElt.setAttribute('height', this.height);
        this.canvasElt.setAttribute('id', this.id);
        this.contentCanvas.appendChild(this.canvasElt);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(this.canvasElt);
        }
        this.context = this.canvasElt.getContext("2d");
        //this.resizeCanvas();
    },
    resizeCanvas: function() {
        canvas.canvasElt.width = window.innerWidth-50;
        canvas.canvasElt.height = window.innerHeight-200;
        canvas.canvasElt.style.margin = 'auto';
        canvas.redraw();
    },
    mouseDown: function(e){
        canvas.trace = true;
        canvas.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop,false);
    },
    mouseMove: function(e){
        if(canvas.trace){
            canvas.draw(e.pageX - this.offsetLeft,e.pageY - this.offsetTop);
        }
    },
    mouseUp: function(){
        canvas.trace = false;
    },
    mouseOut: function(){
        canvas.trace = false;
    },
    addClick: function(x,y,dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },
    draw:function(newX,newY){
        this.context.strokeStyle = this.color;
        this.context.lineJoin = this.lineJoin;
        this.context.lineWidth = this.lineWidth;
        if(this.clickX.length>0){
            this.context.beginPath();
            this.context.moveTo(this.clickX[this.clickX.length-1], this.clickY[this.clickY.length-1]);
            this.context.lineTo(newX, newY);
            this.context.closePath();
            this.context.stroke();
        }
        this.addClick(newX, newY,true);
    },
    redraw:function(){
        this.context.strokeStyle = "#CCC";
        this.context.lineJoin = "bevel";
        this.context.lineWidth = 3;
        for(var i=0; i < this.clickX.length; i++) {
            this.context.beginPath();
            if(this.clickDrag[i] && i){
                this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
            }else{
                this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.context.lineTo(this.clickX[i], this.clickY[i]);
            this.context.closePath();
            this.context.stroke();
        }
        this.context.strokeStyle = this.color;
        this.context.lineJoin = this.lineJoin;
        this.context.lineWidth = this.lineWidth;
    },
    swipe:function(){
        canvas.context.clearRect(0, 0, canvas.context.canvas.width, canvas.context.canvas.height);
        canvas.clickX = [];
        canvas.clickY = [];
        canvas.lineWidth = 5;
    },
    changeColor:function(elt,color){
        canvas.color = color;
        canvas.lineWidth = 5;
    },
    changeColorSwipe:function(elt){
        canvas.color = "#FFF";
        canvas.lineWidth = 20;
    }
}

canvas.createCanvas();
document.getElementById(canvas.id).addEventListener('mousedown', canvas.mouseDown);
document.getElementById(canvas.id).addEventListener('mouseup', canvas.mouseUp);
document.getElementById(canvas.id).addEventListener('mouseout', canvas.mouseOut);
document.getElementById(canvas.id).addEventListener('mousemove', canvas.mouseMove);
canvas.swipeButton.addEventListener('click',canvas.swipe);
//window.addEventListener('resize', canvas.resizeCanvas, false);