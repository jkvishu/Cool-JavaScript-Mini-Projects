const colorPickerBtn = document.querySelector("#color-picker");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]"); //getting all the items from the localStorage of the browser where the item name is picked-colors and parsing it into javascript object or if their are no elements than chossing an empty array

const copyColor = elem => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "copied";
  setTimeout(() => elem.innerText = elem.dataset.color, 1000); //after 1000 ms text will revert back to the color code
}

const showColors = () => {
  //this below function pickedColors.map(color => will traverse each of the elements of the pickedColors array and will execute the function for each of them which will inject that html code into the colorList variable which is targeting the ul in html code
  colorList.innerHTML = pickedColors.map(color => `
      <li class="color">
          <span class="rect" style="background: ${color}; border: 1px solid ${color==="#ffffff" ? "#ccc" : color}"></span>
          <span class="value" data-color="${color}">${color}</span>
      </li>
  `).join(""); //generating li for the picked color from the array and addding it to the colorList
  //Now lets add a method which copy the color help when some one clicks on the color button by adding a event listener for each color element to copy the color code
  document.querySelectorAll(".color").forEach(li => {
    li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild)); //this function will copy the color to the clipboard and the function name is e
  })
}
showColors();


const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper(); //Creating a new eye dropper object .It will be used to select colors from the screen.
      const {
        sRGBHex
      } = await eyeDropper.open(); //eyeDropper.open(); Returns a promise that resolves to an object that gives access to the selected color and we are taking the exact value out of it.
      navigator.clipboard.writeText(sRGBHex); //using this method we can Copy the selected color to the clipboard
      if (!pickedColors.includes(sRGBHex)) { //Taking care of duplicate colors if already exist than do nothing
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors)); //we are storing the picked colors to the localStorage of our browser. In this method picked-colors is the name of the item and second is the value which is parsed into string
        showColors();
      }
    } catch (error) {
      console.log("Sorry the color is not copied!");
    }
    document.body.style.display = "block";
  }, 10);
}

//clearing all picked colors and updating localStorage
const clearAllColors = () => {
  pickedColors.length = 0; //empty the array
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors)); //we are storing the picked colors to the localStorage of our browser. In this method picked-colors is the name of the item and second is the value which is parsed into string
  showColors();
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
