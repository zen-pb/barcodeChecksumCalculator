# UPC/EAN Barcode Checksum Calculator

This program calculates the check digit of UPC/EAN barcodes.

## Formula Used

The following formula is used to calculate the check digit for UPC and EAN barcodes.

![Formula for EAN and UPC Barcode](https://github.com/user-attachments/assets/1f27c239-bb39-46ca-9ab1-bd287c188848)

## Code

The code consists of three main functions:

- sumDigits()
- validateBarcode()
- calculateCheckDigit()

### Functions

This section explains the use of each function.

- sumDigits() - This function adds numbers at even and odd positions, determined by the startIndex parameter.

```javascript
const sumDigits = (barcode, startIndex) => {
  let sum = 0;
  let length = 0;
  for (let i = startIndex; i < barcode.length; i += 2) {
    sum += Number(barcode[i]);
    length++;
  }
  return [sum, length];
};
```

- validateBarcode() - This function validates the barcode by checking its length and ensuring it contains only numerical digits.

```javascript
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
```

- calculateCheckDigit() - This function calculates the check digit of the barcode and contains multiple processing steps, which I will break down below.

```javascript
const calculateCheckDigit = (barcode) => {
  const [evenSum, evenLength] = sumDigits(barcode, 1);
  const [oddSum, oddLength] = sumDigits(barcode, 0);

  const baseSum = evenLength === oddLength ? evenSum : oddSum;

  const otherSum = baseSum === evenSum ? oddSum : evenSum;

  let multiplyResult = MULTIPLIER * (baseSum % MODULO_CONSTANT);

  const sumResult =
    (multiplyResult % MODULO_CONSTANT) + (otherSum % MODULO_CONSTANT);

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
```

~ This calculates the sum of digits located at even and odd indices of the barcode.

```javascript
const [evenSum, evenLength] = sumDigits(barcode, 1);
const [oddSum, oddLength] = sumDigits(barcode, 0);
```

~ This decides which sum (even or odd) will be multiplied by 3 based on their lengths.

```javascript
const baseSum = evenLength === oddLength ? evenSum : oddSum;
const otherSum = baseSum === evenSum ? oddSum : evenSum;
```

- If the number of even and odd digits is the same, baseSum is set to evenSum. Otherwise, it takes the value of oddSum.
- otherSum is then assigned the opposite sum of baseSum.

~ This multiplies the last digit of baseSum by a predefined constant (MULTIPLIER). It calculates multiplyResult, which is used in the final step to compute the check digit.

```javascript
let multiplyResult = MULTIPLIER * (baseSum % MODULO_CONSTANT);
```

~ This calculates the final sum by adding multiplyResult and otherSum.

```javascript
const sumResult =
  (multiplyResult % MODULO_CONSTANT) + (otherSum % MODULO_CONSTANT);
```

~ This checkDigit is based on the calculated sumResult.

```javascript
const checkDigit =
  sumResult === 0 || sumResult === 10
    ? 0
    : MODULO_CONSTANT - (sumResult % MODULO_CONSTANT);
```

~ Finally, the function returns the variables to be used in other functions.

```javascript
return {
  checkDigit,
  evenSum,
  oddSum,
  baseSum,
  otherSum,
  multiplyResult,
  sumResult,
};
```
