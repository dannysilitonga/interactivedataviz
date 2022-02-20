console.log('hello world');

const label = document.getElementById("grocery-label")

let groceryItem = 0;

function onClick() {
  groceryItem += 1
  console.log(groceryItem)
  console.log(typeof(groceryItem))
  label.innerText = "Your grocery bag now has : " + String(groceryItem) + " items"
  
  
}
