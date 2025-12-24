# deno-fn / somefn

[![JSR @zsqk/somefn](https://jsr.io/badges/@zsqk/somefn)](https://jsr.io/@zsqk/somefn)
<a href="https://deno.land/x/somefn"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fsomefn%2Fmod.ts" alt="somefn latest /x/ version" /></a>

A collection of utility functions for Deno

**This project is still under development, and the parameters of the functions are subject to change.**

## Generic JS Functions (Browser Environment Compatible)

### Cryptography & Hashing

- Hash Functions
  - SHA1
  - SHA256
  - SHA512
- HMAC
  - SHA256
  - SHA512
- RSA Data Signing
- Uint8Array to Hex String Utilities

### String Processing

- Text BOM Addition (for legacy Windows software)
- Random String Generation (using Web API `crypto`)
- LZ-string Compression/Decompression
- Unicode String Decoding

### Calculation & Logic

- Field Calculation (supports arithmetic operations)
- Logic Calculation (supports various comparison operators)
- Precise Decimal Calculation

### Data Processing

- UA Parser
- URL Parser
- Environment Variable Parser
- IP Address Utilities
- Date/Time Utilities
- Object/Array Operations

## Deno-specific Functions

### Git Operations

- Repository Cloning
- Change Detection
- Status Checking

### File System

- File Copying with Mapping
- Directory Operations

### System

- Command Execution
- SSH Operations
- Computer Info Retrieval

## External Dependencies

- CSV: Use Deno standard library <https://deno.land/std@0.217.0/csv/mod.ts>
- XML: Recommended to use `npm:fast-xml-parser`
- Uint8Array to HEX: <https://deno.land/std@0.217.0/encoding/hex.ts>

## Usage Examples

```ts
import { hashString } from "@zsqk/somefn/js/hash";
import { fieldCalculate } from "@zsqk/somefn/js/calculate-field";
import { logicCalculate, LogicOperator } from "@zsqk/somefn/js/calculate-logic";
import { getWeekday } from "@zsqk/somefn/js/date";

// Hash calculation example
const hash = await hashString("hello world", "SHA-256");
console.log(hash); // Outputs SHA-256 hash value

// Field calculation example
const data = { price: 100, quantity: 2 };
const total = fieldCalculate(data, "price * quantity".split(" "));
console.log(total); // Output: 200

// Logic calculation example
const logicData = { age: 25, name: "John" };
const result = logicCalculate(logicData, {
  condition: "AND",
  rules: [
    { field: "age", operator: LogicOperator.greaterThan, value: 18 },
    { field: "name", operator: LogicOperator.equals, value: "John" },
  ],
});
console.log(result); // Output: true

// Date calculation example
const before = new Date("2024-01-01");
const after = new Date("2024-01-31");
const weekdays = getWeekday(before, after);
console.log(weekdays); // Outputs weekday statistics
```

## Testing

```sh
deno test --allow-run --coverage=./.coverage

deno coverage ./.coverage --lcov --output=cov.lcov # Generates lcov report
deno coverage ./.coverage --html # Generates HTML report
```

## License

MIT
