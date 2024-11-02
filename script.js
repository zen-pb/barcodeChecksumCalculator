const input = document.getElementById("input");
const button = document.getElementById("button");
const answer = document.getElementById("answer");

//Constants
const MULTIPLIER = 3;
const MODULO_CONSTANT = 10;

/*
Handles the addition of numbers.
startIndex determines if it is even or odd.
If startIndex is 1, then it is even.
If startIndex is 0, then it is odd.
*/
const sumDigits = (barcode, startIndex) => {
  let sum = 0;
  let length = 0;
  for (let i = startIndex; i < barcode.length; i += 2) {
    sum += Number(barcode[i]);
    length++;
  }
  return [sum, length];
};

const validateBarcode = (barcode) => {
  let errorMessages = [];

  if (barcode.length !== 11 && barcode.length !== 12) {
    errorMessages.push("UPC is 11 digits and EAN is 12 digits");
  }

  if (!/^\d+$/.test(barcode)) {
    errorMessages.push("Must contain only numerical digits");
  }

  if (errorMessages.length > 0) {
    throw new Error(`Please enter a valid barcode: ${errors.join(", ")}!`);
  }
};

const calculateCheckDigit = (barcode) => {
  const [evenSum, evenLength] = sumDigits(barcode, 1);
  const [oddSum, oddLength] = sumDigits(barcode, 0);

  /*
  baseSum determines whether the evenSum or oddSum should be multiplied by 3.
  I noticed that if the length of the even and odd are the same, the one that
  is multiplied to 3 is always the evenSum, else it would be the oddSum. 
  */
  const baseSum = evenLength === oddLength ? evenSum : oddSum; 

  //If the sum used in baseSum is evenSum, then oddSum should be used to the other one, vice versa.
  const otherSum = baseSum === evenSum ? oddSum : evenSum; 

  //Get the last digit from the baseSum then multiply it by 3.
  let multiplyResult = MULTIPLIER * (baseSum % MODULO_CONSTANT);

  //Get the last digit of the two then add.
  const sumResult =
    (multiplyResult % MODULO_CONSTANT) + (otherSum % MODULO_CONSTANT);

  //Return zero if sumResult is equal 0 and 10, else get the last digit of the sumResult then minus that to 10.
  return sumResult === 0 || sumResult === 10
    ? 0
    : MODULO_CONSTANT - (sumResult % MODULO_CONSTANT);
};

button.addEventListener("click", () => {
  let barcode = input.value.replace(/\s+/g, ""); //Replace any whitespace present with an empty string

  try {
    validateBarcode(barcode);

    let checkDigit = calculateCheckDigit(barcode);

    answer.textContent = `Barcode Check Digit: ${checkDigit}`;
  } catch (error) {
    answer.textContent = error.message;
  }
});
