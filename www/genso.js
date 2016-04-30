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

var level=1;
var isreverse=0;
var timer=-1;
var itemheight=23;
var dummypheight=1000;


function funcDummyScrl(){
  var scrl=$('#dummy').scrollTop();
  
  var curi=Math.floor(scrl/itemheight);
  
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


$(function() {
	$(".btnshoot").on("touchenter",shoot);
	$(".btnshoot").on("mousedown",shoot);
	
	itemheight=$(window).height()*0.9*0.5/9;
	console.log(itemheight);
	
	$("#dummy").scroll(function() { 
	  funcDummyScrl();
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
	      $(".shootbar").css("top","85%");
	      $(".shootbar").css("height","3%");
	      $(".card").css("top","50%");
	      drawFooter();
	      setCardItem();
	      gstatus=1;
	    break;
	   
	    case 1://落ちる途中
	  
	      if(shootindex==-1){
	        if(t%10==0){//落ちる動き
		      $(".card").css("top",""+(50+2*carditemy)+"%");
		      carditemy++;
		    }
		  }
		  else{
		    //バー上昇
		    $(".shootbar").css("top",""+(88-(15*shootindex))+"%");
		    $(".shootbar").css("height",""+(15*shootindex)+"%");
		    if(wmove==0 && (88-(15*(shootindex-1)))>(50+2*carditemy) && (88-(15*shootindex))<=(50+2*carditemy)){
		      wmove=1;
		    }
		    if(wmove==1){
		        //バーとカードが一緒に上昇
		        $(".card").css("top",""+(88-(15*shootindex)-5)+"%");
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
  var qatext=$(".qatext"+level).text();
  var qas=qatext.split("\n");
  titlestr=qas[0].substring(3);
  
  
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
  dummypheight=itemheight*(aary.length+9);
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
  $('p','.header').eq(0).html(titlestr+"　👆　");
}

function changeLevel(){

  switch(level){
    case 1:level=2;
    break;
    case 2:level=3;
    break;
    case 3:level=1;
    break;
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

function loadTextAjax(fname,id){
	
	$.ajax({
		url:fname,
		success: function(data){
			$(id).text(data);
		}
	});
	
}



function init(){
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
	  $(".qatext"+1).css("display","none");
	  $(".qatext"+2).css("display","none");
	  $(".qatext"+3).css("display","none");
	  $(".qatext"+level).css("display","block");
	  $(".qa").css("display","block");
   }
   else{
       $(".qa").css("display","none");
   }
   init();
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
