/**
 * Created by Laurent on 21/01/14.
 */
var canvas = {
    //Faire une sous variable VARIABLES
    id: 'canvas',
    width:600,
    height:400,
    contentCanvas: document.getElementById('container_draw'),
    canvasElt: document.createElement('canvas'),
    swipeButton: document.getElementById("swipe"),
    context: null,
    trace:false,
    clickX: [],
    clickY: [],
    clickDrag: [],
    default_properties:{
        color:"#aaaaaa",
        lineWidth: 5,
        lineJoin: "round",
        swipe_icon:"swipe",
        pencil_icon:"pencil"
    },
    color:"#aaaaaa",
    lineWidth: 5,
    lineJoin: "round",
    drawEnabled:true,
    createCanvas: function(){
        this.canvasElt.setAttribute('width', this.width);
        this.canvasElt.setAttribute('height', this.height);
        this.canvasElt.setAttribute('id', this.id);
        this.canvasElt.setAttribute('class','pencil');
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
        canvas.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop - 140,false);
    },
    mouseMove: function(e){
        if(canvas.trace){
            var pageX = e.pageX;
            var pageY = e.pageY;
            canvas.draw(pageX - this.offsetLeft,pageY - this.offsetTop - 140);
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
        if(canvas.drawEnabled){
            //Si on peut dessiner on envoi via socket.io !!!QUE!!! le dernier déplacement
            socketEvents_send.draw({
                x:x,
                y:y,
                dragging:dragging,
                color:this.color,
                lineWidth: this.lineWidth
            });
        }
    },
    draw:function(newX,newY){
        this.context.strokeStyle = this.color;
        this.context.lineJoin = this.lineJoin;
        this.context.lineWidth = this.lineWidth;
        if(this.clickX.length>0){
            var oldX = this.clickX[this.clickX.length-1];
            var oldY = this.clickY[this.clickY.length-1];
            this.context.beginPath();
            this.context.moveTo(oldX, oldY);
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
        canvas.lineWidth = this.default_properties.lineWidth;
    },
    changeColor:function(elt,color){
        canvas.color = color;
        canvas.lineWidth = this.default_properties.lineWidth;
        canvas.canvasElt.setAttribute('class',this.default_properties.pencil_icon);
    },
    changeColorSwipe:function(elt){
        canvas.color = "#FFF";
        canvas.lineWidth = 20;
        canvas.canvasElt.setAttribute('class',this.default_properties.swipe_icon);
    },
    toggleEventDraw:function(){
        console.log('disabled draw');
        document.getElementById(canvas.id).removeEventListener('mousedown', canvas.mouseDown);
        document.getElementById(canvas.id).removeEventListener('mouseup', canvas.mouseUp);
        document.getElementById(canvas.id).removeEventListener('mouseout', canvas.mouseOut);
        document.getElementById(canvas.id).removeEventListener('mousemove', canvas.mouseMove);
        canvas.drawEnabled=false;
    }
}

canvas.createCanvas();
document.getElementById(canvas.id).addEventListener('mousedown', canvas.mouseDown);
document.getElementById(canvas.id).addEventListener('mouseup', canvas.mouseUp);
document.getElementById(canvas.id).addEventListener('mouseout', canvas.mouseOut);
document.getElementById(canvas.id).addEventListener('mousemove', canvas.mouseMove);
canvas.swipeButton.addEventListener('click',socketEvents_send.swipe);
//window.addEventListener('resize', canvas.resizeCanvas, false);