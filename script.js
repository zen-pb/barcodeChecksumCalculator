const input = document.getElementById("input");
const button = document.getElementById("button");
const answer = document.getElementById("answer");
const text = document.getElementById("text");

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
    throw new Error(
      `Please enter a valid barcode: ${errorMessages.join(", ")}!`
    );
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

  //checkDigit will be zero if sumResult is equal 0 and 10, else get the last digit of the sumResult then minus that to 10.
  const checkDigit =
    sumResult === 0 || sumResult === 10
      ? 0
      : MODULO_CONSTANT - (sumResult % MODULO_CONSTANT);

  return {
    checkDigit,
    evenSum,
    oddSum,
    baseSum,
    otherSum,
    multiplyResult,
    sumResult,
  };
};

const outputCalculation = (barcode) => {
  const isEAN = barcode.length === 12;
  console.log(isEAN);

  const span = printSpan(barcode, isEAN);

  return `<p>

  ${isEAN ? "Odd digits (EAN Barcode)" : "Even digits (UPC Barcode)"}
  <br/>

  Separate:
  ${span.sequenceSum}  
  <br /><br />

  Operate: <br />
  ${isEAN ? span.sequenceSumOdd : span.sequenceSumEven}
  <br />
  ${isEAN ? span.sequenceSumEven : span.sequenceSumOdd}
  <br /><br />

  Calculate: <br />
  ${span.multiplySequence}
  <br />
  ${span.sumSequence}
  <br />

  ${span.moduloSequence}
<br />

${span.checkDigit}
  </p>`;
};

const printSpan = (barcode, whatBarcode) => {
  const result = calculateCheckDigit(barcode);
  const barcodeChar = barcode.split("");

  let sumOdd = result.oddSum.toString();
  sumOdd =
    sumOdd.length > 1
      ? `${sumOdd[0]}<span class="lastOdd">${sumOdd[1]}</span>`
      : `<span class="lastOdd">${sumOdd}</span>`;

  let sumEven = result.evenSum.toString();
  sumEven =
    sumEven.length > 1
      ? `${sumEven[0]}<span class="lastEven">${sumEven[1]}</span>`
      : `<span class="lastEven">${sumEven}</span>`;

  let multiplyResult = result.multiplyResult.toString();
  multiplyResult =
    multiplyResult.length > 1
      ? `${multiplyResult[0]}<span class="lastMultiply">${multiplyResult[1]}</span>`
      : `<span class="lastMultiply">${multiplyResult}</span>`;

  let sumResult = result.sumResult.toString();
  sumResult =
    sumResult.length > 1
      ? `${sumResult[0]}<span class="lastAdd">${sumResult[1]}</span>`
      : `<span class="lastAdd">${sumResult}</span>`;

  let sequenceSum = barcodeChar
    .map((digit, index) => {
      return `<span class="${index % 2 === 0 ? "odd" : "even"} ${
        index === barcodeChar.length - 1 ? "modulo" : ""
      }">${digit}</span>`;
    })
    .join("");

  let sequenceSumOdd =
    barcodeChar
      .map((digit, index) =>
        index % 2 === 0
          ? `<span class="odd">${digit}</span>${
              index === barcodeChar.length - 2 ? " = " : " + "
            }`
          : ""
      )
      .join("") + sumOdd;

  let sequenceSumEven =
    barcodeChar
      .map((digit, index) =>
        index % 2 !== 0
          ? `<span class="even">${digit}</span>${
              index === barcodeChar.length - 1 ? " = " : " + "
            }`
          : ""
      )
      .join("") + sumEven;

  let lastMultiplyResult = result.multiplyResult.toString().slice(-1);
  let lastSumEven = result.evenSum.toString().slice(-1);
  let lastSumOdd = result.oddSum.toString().slice(-1);
  let lastSumResult = result.sumResult.toString().slice(-1);

  let multiplySequence = `<span class="constant">3</span> x <span class="lastEven">${
    whatBarcode ? lastSumEven : lastSumOdd
  }</span> = ${multiplyResult}`;

  let sumSequence = `<span class="lastMultiply">${lastMultiplyResult}</span> + <span class="lastOdd">${
    whatBarcode ? lastSumOdd : lastSumEven
  }</span> = ${sumResult}`;

  let moduloSequence = `<span class="modulo"></span> + <span class="lastAdd">${lastSumResult}</span> = <span class="constant">10</span>`;

  let checkDigit = `<span class="modulo"></span> <span class="checkDigit">= ${result.checkDigit}</span>`;

  return {
    sequenceSum,
    sequenceSumEven,
    sequenceSumOdd,
    multiplySequence,
    sumSequence,
    moduloSequence,
    checkDigit,
  };
};

button.addEventListener("click", () => {
  let barcode = input.value.replace(/\s+/g, ""); //Replace any whitespace present with an empty string

  try {
    validateBarcode(barcode);

    let result = calculateCheckDigit(barcode);

    answer.textContent = `Barcode Check Digit: ${result.checkDigit}`;

    text.innerHTML =
      `<p class="description">
        This is the process to arrive at the check digit:
      </p>` + outputCalculation(barcode);
  } catch (error) {
    answer.textContent = error.message;
  }
});
