function decreaseQuantity(button) {
  console.log("decrease ");
  const input = button.parentNode.querySelector("input[type=number]");
  if (input.value > 0) {
    console.log("Value : ", input.value);
    input.stepDown();
  }
}

function increaseQuantity(button) {
  console.log("increase ");
  const input = button.parentNode.querySelector("input[type=number]");
  console.log("Value : ", input.value);
  input.stepUp();
}
