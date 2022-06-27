const currentbtn = document.querySelectorAll(".button");
const currentDiv = document.querySelectorAll(".fade");
const checkBoxes = document.querySelector(".checkBoxDiv");
const rightPaneTop = document.querySelector(".right-pane-top");
const rightPaneBottom = document.querySelector(".right-pane-bottom");
const checkbox = document.querySelectorAll(".checkBox");
const container = document.querySelector("#container");
const draggable = document.querySelector(".right-pane-top");
// const dragArea = document.querySelector(".file-upload")
const dragArea = document.querySelector(".dragArea");
const fileInput = document.querySelector(".fileInput");
const dateInput = document.querySelector(".dateInput");
const startDate = document.querySelector(".startDate");
const palette = document.querySelector("#palette")
const gamma = document.querySelector("#gamma")
const colorInput = document.querySelector(".colorInput")
const gammaSlider = document.querySelector(".gammaSlider")
const radios = document.querySelectorAll(".radios")
const visualizationBtn = document.querySelector(".visualizationBtn")
const showRangeDiv = document.querySelector(".showRangeDiv")
const switchCheckBox = document.querySelectorAll(".switchCheckbox")
const switchCheck = document.querySelectorAll(".switch")
const radioBox = document.querySelectorAll(".radioBox")
const colshow = document.querySelector(".colshow")
const leftPaneBtn = document.querySelector(".left-pane-btn")
const toggle = document.querySelector(".toggleShow")
const leftPane = document.querySelector("#left-pane")

let smallScreen = false

let isSmallWindow = () => window.innerWidth <= 428

const setButtonMode = () => {
  if(isSmallWindow()){
    if(!smallScreen){
      leftPaneBtn.style.display = "block"
      smallScreen = true
    }
  }else {
    leftPaneBtn.style.display = "none"
    smallScreen = false
  }
}

window.addEventListener("resize",setButtonMode)
window.addEventListener("load",setButtonMode)

leftPaneBtn.addEventListener("click",() => {
  toggle.classList.toggle("toggleShow")


})

const showRadio = (e) => {
  // console.log(e)
  if(e.target.type !== "radio")
  return;

  // radioBox.forEach(radio => {
  //   radio.addEventListener("click",(e) => {
  //    console.log(e.target.childNodes[0].nodeValue === "Gamma")
  //    if(e.target.childNodes[0].nodeValue === "Gamma"){
       
  //    }

  //   })
  // })

  if(e.target.id === "gamma"){
    gammaSlider.style.display = e.target.checked ? "block" : "none"
    colshow.style.display = "none"
  }else {
    colshow.style.display = e.target.checked ? "block" : "none"
    gammaSlider.style.display = "none"
  }
}

radioBox.forEach(box => {
  box.addEventListener("click",showRadio)
})

const toggleCheckBox = () => {
  switchCheckBox.forEach(box => {
    box.checked = !box.checked
  })
}

switchCheck.forEach(item => {
  item.addEventListener("click",toggleCheckBox)
})

let colors = []

currentbtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // console.log(e.currentTarget);
    currentbtn.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.toggle("active");
  });
});

currentbtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentDiv.forEach((div) => div.classList.remove("show"));
    currentDiv.forEach((div) => div.classList.remove("active"));
    let targetDivId = e.target.getAttribute("data-bs-target").substring(1);
    toggleShow(document.getElementById(targetDivId));
  });
});

const toggleShow = (e) => {
  e.classList.toggle("show");
  e.classList.toggle("active");
};

const showHide = (e) => {
  if (e.target.type !== "checkbox") return;

  if (e.target.name === "legend")
    rightPaneTop.style.display = e.target.checked ? "block" : "none";
  else rightPaneBottom.style.display = e.target.checked ? "block" : "none";
};

checkbox.forEach((box) => {
  box.addEventListener("click", showHide);
});

let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === draggable) {
    active = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  if (active) {
    e.preventDefault();

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, draggable);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

//   file upload drag and drop
dragArea.ondragover = dragArea.ondragenter = function (evt) {
  evt.preventDefault();
};

dragArea.ondrop = function (evt) {
  console.log("file drop");
  // pretty simple -- but not for IE :(
  fileInput.files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  dT.items.add(evt.dataTransfer.files[3]);
  fileInput.files = dT.files;
  console.log(dT);

  evt.preventDefault();
};
