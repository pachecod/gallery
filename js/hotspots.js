
  //hotspot script: factboxes, infoboxes, pictureboxes
  //Copyright 2016-2018 Evan Golub (egolub@cs.umd.edu)
  //version 0.5.5
  //non-commercial use allowed as long as these comments are included




  var gazeOuterDefault = "0.010";
  var uri = window.location.href;
  var pos = uri.indexOf('?');
  if (pos!=-1) {
        if (uri.substr(pos+1,6)=='mobile') {
          setOuterGaze(0.020);
          //maybe also  setDistanceAway(distanceAway*1.5);
        }
  }

  function setOuterGaze(val) {
     gazeOuterDefault=val;
  }

  //For now, there is an "extra line at the bottom" issue with
  //   using my own json fonts, so...  compensating...
  var defaultFont = "roboto";
  var defaultFontShader = "msdf";
  var defaultFontSize = 2;
  var defaultFlag = "true";
  function setDefaultFont(fontFile, fontShader, size) {
     defaultFont = fontFile;
     defaultFontShader = fontShader;
     defaultFontSize = size;
     defaultFlag = "false";
  }



  function resetCameraView() {
     var theCamera = document.getElementById('main-camera');
     theCamera.setAttribute('rotation',"0 0 0");
  }

  function prepareLighting() {
     var theScene = document.querySelector('a-scene');
     var theEntity = document.createElement('a-entity');
         theEntity.setAttribute('light',"type: ambient; color: white");
     theScene.appendChild(theEntity);
     theScene.flushToDOM();
  }


  function prepareGazeTargets(gazeColor) {
     var theEntity = document.getElementById('main-camera');

     var theRingBig = document.createElement('a-ring');
         theRingBig.setAttribute('id',"gazeTarget-Big");
         theRingBig.setAttribute('visible',"true");
         theRingBig.setAttribute('radius-outer',gazeOuterDefault);
         theRingBig.setAttribute('radius-inner',"0.005");
         theRingBig.setAttribute('position',"0 0 -0.9");
         theRingBig.setAttribute('material',"color: "+gazeColor+"; shader: flat");
         theRingBig.setAttribute('cursor',"fuse: true;");

     var theRingSmall = document.createElement('a-ring');
         theRingSmall.setAttribute('id',"gazeTarget-Small");
         theRingSmall.setAttribute('visible',"false");
         theRingSmall.setAttribute('radius-outer',"0.003");
         theRingSmall.setAttribute('radius-inner',"0.001");
         theRingSmall.setAttribute('position',"0 0 -0.9");
         theRingSmall.setAttribute('material',"color: "+gazeColor+"; shader: flat");
         theRingSmall.setAttribute('cursor',"fuse: true;");

     theEntity.appendChild(theRingBig);
     theEntity.appendChild(theRingSmall);
     theEntity.flushToDOM();
  }

  function setGazeTargetBig() {
     document.getElementById("gazeTarget-Big").setAttribute('visible', "true");
     document.getElementById("gazeTarget-Small").setAttribute('visible', "false");
  }
  function setGazeTargetSmall() {
     document.getElementById("gazeTarget-Small").setAttribute('visible', "true");
     document.getElementById("gazeTarget-Big").setAttribute('visible', "false");
  }







  var boxPrepPosition="0 0 -160";
  var boxHiddenPosition="0 0 160";

  var distanceAway = 110; //FUTURE: Make this designer-setable (started at 120)
  var distanceNotAsAway = 0;
  var boxPosition = "";
  var circlePosition = "";
  var imagePosition = "";
  updateDistances();

  function updateDistances() {
     distanceNotAsAway = distanceAway-2;
     boxPosition="0 0 -"+distanceAway;
     circlePosition="0 0 -124";
     imagePosition="0 0 -"+distanceNotAsAway;
  }

  function setDistanceAway(newDistanceAway) {
     distanceAway = newDistanceAway;
     updateDistances();
  }

  function prepBoxes() {
     var all = document.querySelectorAll("a-plane");
     for (var x=0; x<all.length; x++){
         theID = all[x].getAttribute("id");
         if (theID.indexOf("factbox")==0) hideBox(1,theID);
         if (theID.indexOf("infobox")==0) hideBox(2,theID);
         if (theID.indexOf("picturebox")==0) hideBox(3,theID);
     }
  }
  function hideBox(type,id) {
     //1:fact, 2:info, 3:picture

     if (type==1) {
        document.getElementById(id+"-text").setAttribute("visible",false);
     }
     else if (type==2) {
        document.getElementById(id+"-text").setAttribute("visible",false);
     }
     else if (type==3) {
        document.getElementById(id+"-top-text").setAttribute("visible",false);
        document.getElementById(id+"-bot-text").setAttribute("visible",false);
        document.getElementById(id+"-image").setAttribute("visible",false);
     }

     document.getElementById(id).setAttribute("position",boxPrepPosition);
     document.getElementById(id+"-icon").setAttribute("visible",true);
     document.getElementById(id).setAttribute("material","opacity",0.0);
     setGazeTargetBig();
  }
  function showBox(type,id) {
     prepBoxes();


     //1:fact, 2:info, 3:picture
     if (type==1) {
        document.getElementById(id+"-text").setAttribute("visible",true);
     }
     else if (type==2) {
        document.getElementById(id+"-text").setAttribute("visible",true);
     }
     else if (type==3) {
        document.getElementById(id+"-top-text").setAttribute("visible",true);
        document.getElementById(id+"-bot-text").setAttribute("visible",true);
        document.getElementById(id+"-image").setAttribute("visible",true);
     }

     document.getElementById(id).setAttribute("position",boxPosition);
     document.getElementById(id+"-icon").setAttribute("visible",false);
     document.getElementById(id).setAttribute("material","opacity",1);
     setGazeTargetSmall();
  }



  function getSceneElement() {
     return document.querySelector('a-scene');
  }

  function createImageElement(name, aspect, image) {
     insertSingleImageAsset("tag-"+image, image);
     var theImage = document.createElement('a-image');
         theImage.setAttribute('id',name+"-image");
         theImage.setAttribute('visible',false);
         theImage.setAttribute('position',imagePosition);
         theImage.setAttribute('height',"20");
         theImage.setAttribute('width',20*aspect);
         theImage.setAttribute('src',"#tag-"+image);
     return theImage;
  }

  function createTextElement(name, colorFore, width, position, text,
                         fontFace, fontShader) {
     var theText = document.createElement('a-text');
         theText.setAttribute('id',name);
         theText.setAttribute('color',colorFore);
         theText.setAttribute('visible',"false");
         theText.setAttribute('align',"center");
         theText.setAttribute('baseline',"center");
         theText.setAttribute('width',(width-2));
         theText.setAttribute('wrap-count',(width-2)/2);
         theText.setAttribute('position',position);
         theText.setAttribute('value',text);

         //For now the font/fontImage must be in folder with pano
         theText.setAttribute('font', fontFace);
         theText.setAttribute('shader', fontShader);
         //theText.setAttribute('negate', "false");
         //maybe https://www.npmjs.com/package/msdf-bmfont-xml to make fnt files

     return theText;
  }

  function createPlaneElement(name, type, colorBack, width, height, position) {
     var thePlane = document.createElement('a-plane');
         thePlane.setAttribute('onMouseLeave',"hideBox("+type+",'"+name+"');");
         thePlane.setAttribute('id',name);
         thePlane.setAttribute('opacity',"0");
         thePlane.setAttribute('color',colorBack);
         thePlane.setAttribute('width',width);
         thePlane.setAttribute('height',height);
         thePlane.setAttribute('depth',"1");
         thePlane.setAttribute('position',"0 0 120");
     return thePlane;
  }

  function createCircleElement(name, type, dotOpacity) {
     if (type==1) symbol="#factboxSymbol";
     else if (type==2) symbol="#infoboxSymbol";
     else if (type==3) symbol="#pictureboxSymbol";

     var theCircle = document.createElement('a-circle');
         theCircle.setAttribute('onMouseEnter',"showBox("+type+",'"+name+"');");
         theCircle.setAttribute('id',name+"-icon");
         theCircle.setAttribute('visible',"false");
         theCircle.setAttribute('src',symbol);
         theCircle.setAttribute('opacity',dotOpacity);
         theCircle.setAttribute('radius',"4");
         theCircle.setAttribute('position',circlePosition);
     return theCircle;
  }

  function createEntityElement(coords) {
     var theEntity = document.createElement('a-entity');
         theEntity.setAttribute('rotation',coords+" 0");
     return theEntity;
  }

  var factboxCounter=0;
  function insertSingleFactBox(
                coords, fact,
                boxWidth, boxHeight,
                colorFore, colorBack,
                dotOpacity,
                fontFace, fontShader, fontSize
  ) {
     var offsetFlag = "false";

     if (boxWidth==null) boxWidth="60";
     if (boxHeight==null) boxHeight="15";
     if (colorFore==null) colorFore="black";
     if (colorBack==null) colorBack="yellow";
     if (dotOpacity==null) dotOpacity="0.75";
     if (fontFace==null) {
        fontFace=defaultFont;
        fontShader=defaultFontShader;
        fontSize=defaultFontSize;
        offsetFlag = defaultFlag;
     }

     var boxname = "factbox"+factboxCounter;
     factboxCounter++;


     var offsetForText = 0;
     if (offsetFlag=="false") {
        offsetForText = -0.5*fontSize;
     }

     var theScene = getSceneElement();
     var theText = createTextElement(boxname+"-text", colorFore, boxWidth, "0 "+offsetForText+" 2", fact, fontFace, fontShader, fontSize);
     var thePlane = createPlaneElement(boxname, 1, colorBack, boxWidth, boxHeight);
     var theCircle = createCircleElement(boxname, 1, dotOpacity);
     var theEntity = createEntityElement(coords);

     thePlane.appendChild(theText);
     theEntity.appendChild(thePlane);
     theEntity.appendChild(theCircle);
     theScene.appendChild(theEntity);
     theScene.flushToDOM();
  }


  var infoboxCounter=0;
  function insertSingleInfoBox(
                coords, heading, bullets,
                boxWidth, boxHeight,
                colorFore, colorBack,
                dotOpacity,
                fontFace, fontShader, fontSize
  ) {
     var offsetFlag = "false";

     if (boxWidth==null) boxWidth="70";
     if (boxHeight==null) boxHeight=6*(2+bullets.length)
     if (colorFore==null) colorFore="black";
     if (colorBack==null) colorBack="beige";
     if (dotOpacity==null) dotOpacity="0.75";
     if (fontFace==null) {
        fontFace=defaultFont;
        fontShader=defaultFontShader;
        fontSize=defaultFontSize;
        offsetFlag=defaultFlag;
     }

     var boxname = "infobox"+infoboxCounter;
     infoboxCounter++;

     var offsetForText = 0;
     if (offsetFlag=="false") {
        offsetForText = -0.5*fontSize;
     }


     var theScene = document.querySelector('a-scene');

     var i;
     var underline = "";
     var linesymbol = "-";
     for (i=0; i<heading.length; i++) underline+=linesymbol;
     var listContents = "";
     for (i=0; i<bullets.length; i++) listContents+=(bullets[i]+"\n");
     var fullContents = heading+"\n"+underline+"\n"+listContents;
     var theText = createTextElement(boxname+"-text", colorFore, boxWidth, "0 "+offsetForText+" 2", fullContents, fontFace, fontShader, fontSize);

     var thePlane = createPlaneElement(boxname, 2, colorBack, boxWidth, boxHeight);
     var theCircle = createCircleElement(boxname, 2, dotOpacity);
     var theEntity = createEntityElement(coords);

     thePlane.appendChild(theText);
     theEntity.appendChild(thePlane);
     theEntity.appendChild(theCircle);
     theScene.appendChild(theEntity);
     theScene.flushToDOM();
  }


  var pictureboxCounter=0;
  function insertSinglePictureBox(
                coords, captionTop, image, captionBot,
                boxWidth, boxHeight,
                colorFore, colorBack,
                dotOpacity,
                fontFace, fontShader, fontSize, lines
  ) {
     var offsetFlag="false";
     if (captionTop==null || captionTop==undefined) captionTop="";
     if (captionBot==null) captionBot="";
     if (boxWidth==null) boxWidth="50";
     if (boxHeight==null) boxHeight="30";
     if (colorFore==null) colorFore="black";
     if (colorBack==null) colorBack="lightblue";
     if (dotOpacity==null) dotOpacity="0.75";
     if (fontFace==null) {
        fontFace=defaultFont;
        fontShader=defaultFontShader;
        fontSize=defaultFontSize;
        offsetFlag=defaultFlag;
     }
     if (lines==null) lines=1;

     var img = new Image();
     img.onload = function() {
                    insertSinglePictureBoxHelper(
                       coords, captionTop,
                       image, this.width/this.height,
                       captionBot,
                       boxWidth, boxHeight,
                       colorFore, colorBack,
                       dotOpacity,
                       fontFace, fontShader, fontSize, offsetFlag,
                       lines
                    );
     }
     img.src = image;
     //NOTE: i-dot will not appear until the image has been loaded
  }
  function insertSinglePictureBoxHelper(
                coords, captionTop, image, aspect, captionBot,
                boxWidth, boxHeight,
                colorFore, colorBack,
                dotOpacity,
                fontFace, fontShader, fontSize, offsetFlag,
                lines
  ) {
     var boxname = "picturebox"+pictureboxCounter;
     pictureboxCounter++;

     var theScene = document.querySelector('a-scene');

     var theImage = createImageElement(boxname, aspect, image);

     var littleMargin = lines;
     var topOffset = 0.5*boxHeight-(fontSize)-littleMargin;
     var bottomOffset = -1*(0.5*boxHeight-littleMargin);
     if (offsetFlag=="true") {
        bottomOffset+=(fontSize*lines);
     }

     var theText01 = createTextElement(boxname+"-top-text", colorFore, boxWidth, "0 "+topOffset+" -"+distanceNotAsAway, captionTop, fontFace, fontShader, fontSize);
     var theText02 = createTextElement(boxname+"-bot-text", colorFore, boxWidth, "0 "+bottomOffset+" -"+distanceNotAsAway, captionBot, fontFace, fontShader, fontSize);
     var thePlane = createPlaneElement(boxname, 3, colorBack, boxWidth, boxHeight);
     var theCircle = createCircleElement(boxname, 3, dotOpacity);
     var theEntity = createEntityElement(coords);

     theEntity.appendChild(theImage);
     theEntity.appendChild(theText01);
     theEntity.appendChild(theText02);
     theEntity.appendChild(thePlane);
     theEntity.appendChild(theCircle);
     theScene.appendChild(theEntity);
     theScene.flushToDOM();

     setTimeout(prepBoxes(), 1000); //so that once the photo loads, the i-dot appears?
  }



  function insertSingleImageAsset(imageTag, imageLocation) {
     var theScene = document.querySelector('a-scene');
     var theAssetsList = document.createElement('a-assets');
     var theImg = document.createElement('img');
         theImg.setAttribute('id',imageTag);
         theImg.setAttribute('src',imageLocation);
     theAssetsList.appendChild(theImg);
     theScene.appendChild(theAssetsList);
     theScene.flushToDOM();
  }




  function setupBoxesHelper(gazeColor) {
     resetCameraView(); //reset the camera's direction
     prepareGazeTargets(gazeColor);
     prepareLighting();
     prepBoxes();

     return true;
  }
  function setupBoxes(gazeColor) {
     setTimeout(setupBoxesHelper.bind(null, gazeColor), 1000);
  }



  function hide360(id) {
     document.getElementById(id).setAttribute("material","opacity",0.00001);
  }
  function show360(id) {
     document.getElementById(id).setAttribute("material","opacity",1);
  }

  function revealTrue360() {
     hide360("loading");
     show360("scene");
  }

  function setupReveal() {
     setTimeout(revealTrue360,1000);
  }
