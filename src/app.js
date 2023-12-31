
//Displays the original image after being uploaded
function displayOriginalImage(event) {
  if (event.files.length != 0) {
    if (checkFileName(event.files[0].name)) {
      document.getElementById("inputImage").src = window.URL.createObjectURL(event.files[0]);
      document.getElementById("originalImage").style.display = "initial";
      document.getElementById("transformation").style.display = "initial";
      document.getElementById("result").style.display = "none";
    }
  }
}

//Makes sure the uploaded file is a png or jpg image 
function checkFileName(fileName) {
  if (fileName == "") {
    alert("Browse to upload a valid File with png or jpg extension");
    return false;
  }
  else if (fileName.split(".")[1].toUpperCase() == "PNG" || fileName.split(".")[1].toUpperCase() == "JPG")
    return true;
  else {
    alert("File with " + fileName.split(".")[1] + " is invalid. Upload a valid file with png or jpg extensions");
    return false;
  }
}

//Displays the corresponding form to the selected transformation and hides the other forms
function showTransformForm() {
  const increaseBrightnessForm = document.getElementById("increaseBrightnessForm");
  const decreaseBrightnessForm = document.getElementById("decreaseBrightnessForm");
  //Write your code here for the other forms
  const increaseContrastForm = document.getElementById("increaseContrastForm");
  const decreaseContrastForm = document.getElementById("decreaseContrastForm");


  const mylist = document.getElementById("myList");

  //Storing the type chosen in a variable
  transformType = mylist.options[mylist.selectedIndex].text;

  //Displaying to the user the type he chose by changing the text element of id= transformType to the selected type
  document.getElementById("transformType").value = mylist.options[mylist.selectedIndex].text;

  if (transformType == "Increase Brightness") {
    document.getElementById("increaseBrightnessInputs").style.display = "initial";
    document.getElementById("decreaseBrightnessInputs").style.display = "none";
    document.getElementById("increaseContrastInputs").style.display = "none";
    document.getElementById("decreaseContrastInputs").style.display = "none";

  } 
  else if (transformType == "Decrease Brightness") {
    document.getElementById("increaseBrightnessInputs").style.display = "none";
    document.getElementById("decreaseBrightnessInputs").style.display = "initial";
    document.getElementById("increaseContrastInputs").style.display = "none";
    document.getElementById("decreaseContrastInputs").style.display = "none";

  } 
  else if (transformType == "Increase Contrast") {
    document.getElementById("increaseBrightnessInputs").style.display = "none";
    document.getElementById("decreaseBrightnessInputs").style.display = "none";
    document.getElementById("increaseContrastInputs").style.display = "initial";
    document.getElementById("decreaseContrastInputs").style.display = "none";

  } 
  else if (transformType == "Decrease Contrast") {
    document.getElementById("increaseBrightnessInputs").style.display = "none";
    document.getElementById("decreaseBrightnessInputs").style.display = "none";
    document.getElementById("increaseContrastInputs").style.display = "none";
    document.getElementById("decreaseContrastInputs").style.display = "initial";

  } 
  else  {
    inverse();
  }
  

  // Listener to the event of submiting the increase brightness form
  increaseBrightnessForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var ib = document.getElementById("ib").value
    increaseBrightness(Number(ib))
  });
  //Write your code here for EventListeners for the other forms using the constants you will create in the transform function

  decreaseBrightnessForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var db = document.getElementById("db").value
    decreaseBrightness(Number(db))
  });

  increaseContrastForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var originalBrightestDark = document.getElementById("originalBrightestDark").value
    var originalDarkestBright = document.getElementById("originalDarkestBright").value
    var TransformedBrightestDark = document.getElementById("TransformedBrightestDark").value
    var TransformedDarkestBright = document.getElementById("TransformedDarkestBright").value
    changeContrast( Number(originalBrightestDark), Number(originalDarkestBright), Number(TransformedBrightestDark), Number(TransformedDarkestBright) );
  }); 
  decreaseContrastForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var originalBrightestDark = document.getElementById("originalBrightestDark0").value
    var originalDarkestBright = document.getElementById("originalDarkestBright0").value
    var TransformedBrightestDark = document.getElementById("TransformedBrightestDark0").value
    var TransformedDarkestBright = document.getElementById("TransformedDarkestBright0").value
    changeContrast( Number(originalBrightestDark), Number(originalDarkestBright), Number(TransformedBrightestDark), Number(TransformedDarkestBright) );
  });

 


  //Applies pixel-wise transformations to increase brightness
  function increaseBrightness(ib) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    //Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      val = rgba[i] + ib;
      if (val > 255) {
        val = 255;
      }
      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);

  }

  function decreaseBrightness(db) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    //Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      val = rgba[i] - db;
      if (val < 0) {
        val = 0;
      }
      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);

  }

  function changeContrast(originalBrightestDark, originalDarkestBright, transformedBrightestDark, transformedDarkestBright) {

    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;    
    //Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
        //val = rgba[i] - db;
        
        if (rgba[i] > 0 && rgba[i] < originalBrightestDark) {
            val = (transformedBrightestDark / originalBrightestDark) * rgba[i];
        }
        else if (rgba[i] >= originalBrightestDark && rgba[i] < originalDarkestBright) {
            val = ((rgba[i] - originalBrightestDark) * ((transformedDarkestBright - transformedBrightestDark) / (originalDarkestBright - originalBrightestDark))   ) + transformedBrightestDark;
        }
        else {
            val = ( ( (255 - transformedDarkestBright) / (255 - originalDarkestBright) ) * (rgba[i] - 255) ) + 255;
        }

        if (val < 0) {
            val = 0;
        }
        if (val > 255) {
            val = 255;
        }
        transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);
}

  function inverse() {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    //Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      val = 255- rgba[i];
      if (val>255){
        val=255;
      }
      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);

  }

  //Write your code here for three more functions for the other transformations



  //Extracts rgba 1D array of all the pixels in the original image
  function getRGBAValues(img, canvas, ctx) {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    var rgba = ctx.getImageData(
      0, 0, img.width, img.height
    ).data;
    return rgba;
  }

  //Displays the transformed image
  function displayResultImage(img, transformedImage, ctx) {
    //Get a pointer to the current location in the image.
    var palette = ctx.getImageData(0, 0, img.width, img.height); //x,y,w,h
    //Wrap your array as a Uint8ClampedArray
    palette.data.set(new Uint8ClampedArray(transformedImage)); // assuming values 0..255, RGBA, pre-mult.
    //Repost the data.
    ctx.putImageData(palette, 0, 0);
    document.getElementById("result").style.display = "initial";
  }
}  