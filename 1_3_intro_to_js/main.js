console.log('hello world');

const label = document.getElementById("grocery-label")

let groceryItem = 0;
let veggieItem = 0;
let proteinItem = 0; 

function printMessage() {
  return "Your grocery bag now has : " + String(groceryItem) + " items"  
  + " in which " + String(veggieItem)+ " are vegetables and " + String(proteinItem) 
  + " are proteins."

}

function addVegetableClick() {
  groceryItem += 1
  veggieItem += 1
  label.innerText = printMessage()
  
}

function addProteinClick(){
  groceryItem += 1
  proteinItem += 1
  label.innerText = printMessage()
   
}