//元素記号ゲームのJavaScript

var titlestr="";
var qary=new Array();
var aary=new Array();
var cardary=new Array();
var haiteiary=new Array();

var aindex=0;
var cardindex=0;
var carditemy=0;
var gstatus=0;
var t=0;
var shootindex=-1;
var wmove=0;
var scrlheight=230;
var seikai=0;
var fuseikai=0;

var levelnum=1;
var level=1;
var isreverse=0;
var timer=-1;

var width,height;

	
var itemheight=23;
var dummypheight=1000;

var cvsw,cvsh;
var scrlspeed=3.0;

function funcDummyScrl(){
  var scrl=$('#dummy').scrollTop();
  
  var curi=Math.floor(scrl/((itemheight)*scrlspeed));
  
  //console.log("scrl="+scrl+" curi="+curi);
  if(curi<0){
    curi=0;
  }
  if(curi>aary.length-1){
   	  curi=aary.length-1;
  }
  aindex=curi;
  //  console.log(aindex);
  setAItems(); 
  
}

var mdwn=false;
var cy=0;
var scrltop;
function aScrlDown(e){
	mdwn=true;
	scrltop=$('#dummy').scrollTop();
	cy=e.clientY;
}

function aScrlUp(){
	mdwn=false;
}

function aScrlMove(e){
	if(mdwn){
		
		var y=e.clientY;
		
		var mv=cy-y;
		
		$('#dummy').scrollTop(scrltop+(mv*scrlspeed));
		
	}
}


$(function() {
	console.log("jquery init");
	width=$(window).width();
	height=$(window).height();
	cvsw=width*0.8;
	cvsh=height*0.9;
	$("#dummy").on("mousedown",aScrlDown);
	$("#dummy").on("mousemove",aScrlMove);
	$("#dummy").on("mouseup",aScrlUp);
	$("#dummy").on("mouseleave",aScrlUp);
	$(".btnshoot").on("touchenter",shoot);
	$(".btnshoot").on("mousedown",shoot);
	
	itemheight=$(window).height()*0.9*0.5/9;
	console.log(itemheight);
	
	$("#dummy").scroll(function() { 
	  funcDummyScrl();
	});
	
	$("body").keydown(function(e){
	    console.log(e.keyCode);
		var mv=itemheight;
		if(e.shiftKey){
			console.log("shift");
			mv=mv*5;
		}
		var scrltop=$('#dummy').scrollTop();

        switch(e.keyCode){

 			case 32: // space
 			console.log("shoot");
 				shoot();
 			break;
 			
            case 38: // ↑
            $('#dummy').scrollTop(scrltop+(-mv*scrlspeed));
            break;
 
            case 40: // ↓
            $('#dummy').scrollTop(scrltop+(mv*scrlspeed));
            break;
        }
    });		     
});

function setAItems(){
   var i;

   for(i=1;i<=9;i++){
   	 $(".scrlitem"+i).css("top",""+((i-1)*itemheight-2)+"px");
   	 $(".scrlitem"+i).css("height",(itemheight)+"px");
     if(aindex-5+i>=0 && aindex-5+i<aary.length){
	    $("p",".scrlitem"+i).html(aary[aindex-5+i]);
	 }
	 else{
	    $("p",".scrlitem"+i).html("");
	 }
   }

}

function setCardItem(){
	$("p",".card").html(cardary[cardindex]);
	
}
function shoot(){
  shootindex=0;
}

function drawFooter(){
 $('.footer').html("No."+(cardindex+1)+"/"+aary.length+"　　〇:　"+seikai+"　　×:　"+fuseikai);
}

function frame(){
    var sec=100;
    t++;

    switch(gstatus){
    	case 0://開始
    	  $('div#hantei').css("z-index","0");
	      shootindex=-1;
	      wmove=0;
	      carditemy=0;
	      renzoku=0;
	      $(".shootbar").css("top",""+(cvsh*0.85)+"px");
	      $(".shootbar").css("height",""+(cvsh*0.03)+"px");
	      $(".card").css("top",""+(cvsh*0.5)+"px");
	      drawFooter();
	      setCardItem();
	      gstatus=1;
	    break;
	   
	    case 1://落ちる途中
	  
	      if(shootindex==-1){
	        if(t%10==0){//落ちる動き
		      $(".card").css("top",""+(cvsh*(0.5+0.02*carditemy))+"px");
		      carditemy++;
		    }
		  }
		  else{
		    //バー上昇
		    $(".shootbar").css("top",""+(cvsh*(0.88-(0.15*shootindex)))+"px");
		    $(".shootbar").css("height",""+(cvsh*(0.15*shootindex))+"px");
		    if(wmove==0 && (88-(15*(shootindex-1)))>(50+2*carditemy) && (88-(15*shootindex))<=(50+2*carditemy)){
		      wmove=1;
		    }
		    if(wmove==1){
		        //バーとカードが一緒に上昇
		        $(".card").css("top",""+(cvsh*(0.88-(0.15*shootindex)-0.05))+"px");
		    }
		    shootindex++;
		    if(shootindex==5){//上がり切った
				gstatus=4;
		    }
		  }
	      if(wmove==0){
			   
	           if(carditemy==17){//下がり切った
	               gstatus=2;
	           }
	      }
	    break;
	    
	    case 2://下がり切った
	      haiteiary[cardindex]=0;//はずれ
	      gstatus=6;
	    break;
	    
	    case 4://上がり切った

	      if(qary[aindex]==cardary[cardindex]){
	        haiteiary[cardindex]=1;//あたり
	        gstatus=5;
	      }
	      else{
	        haiteiary[cardindex]=0;//はずれ
	        gstatus=6;
	      }
	      
	    break;
	    
	    case 5://あたり
	      $("p",'div#hantei').html("〇<br/>"+cardary[cardindex]+"<br/>"+aary[aindex]);

	      $('div#hantei').css("background-color","royalblue");
	      $('div#hantei').css("border-color","blue");
	      $('div#hantei').css("z-index","30");
	      sec=1000;
	      seikai++;
	      drawFooter();
	      gstatus=7;

	    break;
	    
	    case 6://はずれ
	      var ai=0;
	      for(ai=0;ai<aary.length;ai++){
	        if(qary[ai]==cardary[cardindex]){
	           break;
	        }
	      }
	      $("p",'div#hantei').html("×<br/>"+cardary[cardindex]+"<br/>"+aary[ai]);

	      $('div#hantei').css("background-color","hotpink");
	      $('div#hantei').css("border-color","red");
	      $('div#hantei').css("z-index","30");
	      sec=1000;
	      fuseikai++;
	      drawFooter();
	      gstatus=7;
	    break;
	    
	    case 7://next
	      cardindex++;
	      if(cardindex<cardary.length){
	        gstatus=0;
	      }
	      else{
	        gstatus=10;
	        console.log("end");
	      }
	    break;
	    
     }

  if(gstatus!=10){
     timer=setTimeout('frame()',sec);
  }
  else{
    clearTimeout(timer);
    timer=0;
    gameend();
  }
}
function initHantei(){
  var i;
  for(i=0;i<haiteiary.length;i++){
     haiteiary[i]=0;
  }
}

function gameend(){
  $('div#hantei').css("z-index","0");
  $(".btnend").css("display","table");
  console.log("gameend");
}

function gamestart(){
  if(timer>0){
    clearTimeout(timer);
    timer=0;
  }
  $(".btnstart1").css("display","none");
  $(".btnstart2").css("display","none");
  t=0;
  seikai=0;
  fuseikai=0;
  cardindex=0;
  aindex=0;
  carditemy=0;
  gstatus=0;
  setAItems();
  setCardItem();
  initHantei();
  setTimeout('frame()',100);
}

function start1(){
  isreverse=0;
  readcard();
  initqa();
  gamestart();


}

function start2(){
  isreverse=1;
  readcard();
  initqa();
  gamestart();

}

function shuffleArray(ary) {
  var length = ary.length;
  while(length){
    var k = Math.floor(Math.random()*length);
    var temp = ary[--length];
    ary[length] = ary[k];
    ary[k] = temp;
  }
  return ary;
}
function readcard(){
  var qatext=$(".qatext").eq(level-1).text();
  var qas=qatext.split("\n");

  
  
  qary.length=0;
  aary.length=0;
  cardary.length=0;
  haiteiary.length=0;

  var i;
  for(i=2;i+1<qas.length;i=i+2){
    if(qas[i].length>0 && qas[i+1].length>0){
  	  qary.push(qas[i]);
  	  aary.push(qas[i+1]);
  	  
  	}
  }
  dummypheight=itemheight*(aary.length*scrlspeed+9);
  console.log("itemheight="+itemheight+" length="+aary.length+" dummypheight="+dummypheight+"px");
  $('#dummyp').css("height",""+dummypheight+"px");
  $('#dummy').scrollTop(0);
}

function initqa(){
  var i;
  if(isreverse==1){
    var tmp=qary;
    qary=aary;
    aary=tmp;
  }
  for(i=0;i<qary.length;i++){
      haiteiary.push(0);
      cardary.push(qary[i]);
  }
  cardary=shuffleArray(cardary);
 
}

function drawHeader(){
  var qatext=$(".qatext").eq(level-1).text();
  var qas=qatext.split("\n");
  titlestr=qas[0].substring(3);
  
  $('p','.header').eq(0).html(titlestr+"　👆　");
}

function changeLevel(){

   if(level+1<=levelnum){
  	  level++;
   }
   else{
  	  level=1;
   }

   init();
   initqa();
   
   var dsp=$(".qa").css("display");
   if(dsp!="none"){
     $(".qa").css("display","none");
     dispQA();
   }
   
}

function loadTextGet(fname,id){

 	$.get(fname, function(data){
		$(id).text(data);
	});
	
}

function loadTextAjax(fname,i){
	var nostr=('00'+(i+1)).slice(-3);
	var fullfname=(fname+nostr)+".sqa";
	$.ajax({
		type: 'GET',
		dataType: 'text',
		url:fullfname,
		success: function(data){
			var qatext= $('<textarea class="qatext">\n'+data+'\n</textarea>');
			$(".qa").append(qatext);
			i++;
			loadTextAjax(fname,i);
		},
		error: function(){
			var qatextitem=$(".qatext");

            levelnum=qatextitem.length;
            
            console.log("levelnum="+levelnum);
   
			init();
		}
		
	});
	
}

function initBody(){
	loadTextAjax("qatext",0);
}


function init(){
	console.log("javascript init");
	setWHLT();
 //andjs.makeToast("test");
  t=0;
  seikai=0;
  fuseikai=0;
  cardindex=0;
  aindex=0;
  carditemy=0;
  gstatus=0;
    readcard();
    drawHeader();
    drawFooter();
    
	  if(timer>0){
	    clearTimeout(timer);
	    timer=0;
	  }
	  $(".btnstart1").css("display","table");
	  $(".btnstart2").css("display","table");
	  $(".btnend").css("display","none");
	  console.log("init done");
}

function dispQA(){

  var dsp=$(".qa").css("display");
  if(dsp=="none"){
  	  $(".qatext").css("display","none");
  	  $(".qatext").eq(level-1).css("display","block");
	  $(".qa").css("display","block");
   }
   else{
       $(".qa").css("display","none");
   }

}

function funcShowMsg(msg){
  var dsp=$(".qa").css("display");
  if(dsp!="none"){
  		dispQA();
  }
  else{
  	andjs.funcExit();
  }
}

function setWHLT(){
	//name : [width,height,left,top]

	var whlt=
	{	 ".header":[width*1.0,height*0.05,0,0]
			,".notebtn":[width*1.0*1.0*0.1,height*0.05*0.8,width*1.0*0.85,height*0.05*0.05]

		,".leftside":[width*0.1,height*0.9,0,height*0.05]


		,".rightside":[width*0.1,height*0.9,width*0.9,height*0.05]


		,".footer":[width*1.0,height*0.05,0,height*0.95]


		,".cvs":[cvsw,cvsh,width*0.1,height*0.05]
			,"#dummy":[cvsw*1.0,cvsh*0.5,0,0]
				,"#dummyp":[cvsw*0.001,1000,0,0]
	
		,".scrlbox":[cvsw*1.0,cvsh*0.5,0,0]
			,"#scrlmk1l":[cvsw*0.1,cvsh*0.5*0.2,0,cvsh*0.5*0.28]
			,"#scrlmk1r":[cvsw*0.1,cvsh*0.5*0.2,cvsw*0.9,cvsh*0.5*0.28]
			,"#scrlmk2l":[cvsw*0.1,cvsh*0.5*0.2,0,cvsh*0.5*0.4]
			,"#scrlmk2r":[cvsw*0.1,cvsh*0.5*0.2,cvsw*0.9,cvsh*0.5*0.4]
			,"#scrlmk3l":[cvsw*0.1,cvsh*0.5*0.2,0,cvsh*0.5*0.53]
			,"#scrlmk3r":[cvsw*0.1,cvsh*0.5*0.2,cvsw*0.9,cvsh*0.5*0.53]
				,".mk":[cvsw*0.1,cvsh*0.5*0.2,0,0]

			,".panel":[cvsw*0.8,cvsh*0.5*0.11,cvsw*0.1,-1]
			,".scrlitem1":[-1,-1,-1,0]
			,".scrlitem2":[-1,-1,-1,cvsh*0.5*0.11]
			,".scrlitem3":[-1,-1,-1,cvsh*0.5*0.22]
			,".scrlitem4":[-1,-1,-1,cvsh*0.5*0.33]			
			,".scrlitem5":[-1,-1,-1,cvsh*0.5*0.44]
			,".scrlitem6":[-1,-1,-1,cvsh*0.5*0.55]
			,".scrlitem7":[-1,-1,-1,cvsh*0.5*0.66]
			,".scrlitem8":[-1,-1,-1,cvsh*0.5*0.77]
			,".scrlitem9":[-1,-1,-1,cvsh*0.5*0.88]	
				
		,"#hantei":[cvsw*0.8,cvsh*0.2,cvsw*0.1,cvsh*0.15]


		,".card":[cvsw*0.8,cvsh*0.05,cvsw*0.1,cvsh*0.45]


		,".shootbar":[cvsw*0.1,cvsh*0.03,cvsw*0.45,cvsh*0.85]
		
		,".btnshoot":[cvsw*0.8,cvsh*0.1,cvsw*0.1,cvsh*0.875]

		
		,".btnstart1":[cvsw*0.4,cvsh*0.4,cvsw*0.1,cvsh*0.3]

		
		,".btnstart2":[cvsw*0.4,cvsh*0.4,cvsw*0.5,cvsh*0.3]


		,".btnend":[cvsw*0.8,cvsh*0.6,cvsw*0.1,cvsh*0.2]
		,".qa":[cvsw,cvsh,width*0.1,height*0.05]
		,".qa textarea":[cvsw,cvsh*0.9,0,0]
	};

	for (var obj in whlt) {
		console.log(obj);
		console.log(whlt[""+obj][0]);
		if(whlt[""+obj][0]>=0){
			$(""+obj).css("width",""+whlt[""+obj][0]+"px");
		}
		if(whlt[""+obj][1]>=0){
			$(""+obj).css("height",""+whlt[""+obj][1]+"px");
		}
		if(whlt[""+obj][2]>=0){
			$(""+obj).css("left",""+whlt[""+obj][2]+"px");
		}
		if(whlt[""+obj][3]>=0){
			$(""+obj).css("top",""+whlt[""+obj][3]+"px");
		}
		
	}
	$(".qa").css("padding-top",""+(cvsh*0.05)+"px");
	$(".qa").css("padding-bottom",""+(cvsh*0.05)+"px");
	
	$("*").css("border-width",""+(height*0.003)+"px");
}
