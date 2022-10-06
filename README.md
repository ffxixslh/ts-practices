# TypeScript Concepts

## Basic Concepts

```ts
// primitives: string number boolean
let username: string = "John";
let age: number = 22;
let isMale: boolean = true;

// object
let userinfo: {
  address: string;
  phoneNumber?: number;
} = {
  address: "123 Main St",
};

// array
let hobbies: string[]= ['coding','movie'];

// any
let notSure: any = 4;
// void
function console(msg: string): void {
  console.log(msg)
}
// undefined null
let u: undefined = undefined;
let n: null = null
// never
function error(message: string): never {
  throw new Error(message);
}

// enum
enum Color {Red = 1, Green, Blue};

// union type
let id: string | number = 123；

// tuple
let pocket: [string, number] = ['trigger', 23];

// type alias
type Drink = [string, boolean, number];
type ID = string | number

// interface
interface Point {
  x: number;
  y: number;
}
// The distinction between 'type alias' and 'interface' is:
//     Interface is always extendable.
// Interfaces may only be used to declare the shapes of objects,
// not rename primitives.


// type assertion
let myCanvas =
  document.getElementById("main_canvas") as HTMLCanvasElement;
// which is as same as:
let myCanvas =
  <HTMLCanvasElement>document.getElementById("main_canvas");

// literal type
let hello: "hello" = "hello";
hello = "hi" // error

// Non-null Assertion Operator (Postfix ! )
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## Narrowing

### typeof Type Guard

```ts
function padLeft(padding: number | string, input: string) {
  // With `typeof` type guard,
  // we can let TS knows explicitly what type we want:
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

### Truthiness narrowing

In JavaScript, constructs like `if` first “coerce” their conditions to `boolean`s to make sense of them, and then choose their branches depending on whether the result is `true` or `false`.

```ts
// good
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}

// bad
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

### Equality narrowing

TypeScript also uses `switch` statements and equality checks like `===`, `!==`, `==`, and `!=` to narrow types.

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase();

(method) String.toUpperCase(): string
    y.toLowerCase();

(method) String.toLowerCase(): string
  } else {
    console.log(x);

(parameter) x: string | number
    console.log(y);

(parameter) y: string | boolean
  }
}
```

With equality narrowing, we can easily modify the `printAll` function which didn't handle the `null` condition in section "Truthiness narrowing":

```ts
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    // (*)
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

### The "in" operator narrowing

JavaScript has an operator for determining if an object has a property with a name: the `in` operator. TypeScript takes this into account as a way to narrow down potential types.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal; // animal: Fish | Human
  } else {
    animal; // animal: Bird | Human
  }
}
```

### instanceof narrowing

JavaScript has an operator for checking whether or not a value is an “instance” of another value. More specifically, in JavaScript `x instanceof Foo` checks whether the *prototype chain* of `x` contains `Foo.prototype`. While we won’t dive deep here, and you’ll see more of this when we get into classes, they can still be useful for most values that can be constructed with `new`. As you might have guessed, `instanceof` is also a type guard, and TypeScript narrows in branches guarded by `instanceof`s.

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // (parameter) x: Date
  } else {
    console.log(x.toUpperCase()); // (parameter) x: string
  }
}
```

### Assignments

As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.

```ts
let x = Math.random() < 0.5 ? 10 : "hello world!";
// let x: string | number
x = 1;
console.log(x); // let x: number
x = "goodbye!";
console.log(x); // let x: string
x = true;
// Err: Type 'boolean' is not assignable to type 'string | number'.
console.log(x);
```

### Control Flow Analysis

When TypeScript encounters the `if` block, it will see whether there is a variable that includes one of the given types, then the rest of the body will remove the type from which variable is in the `if` block.

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // padding: number
  }
  return padding + input; // padding: string
}
```

The function `padLeft` returns from within its first `if` block. TypeScript was able to analyze this code and see that the rest of the body (`return padding + input;`) is unreachable in the case where `padding` is a `number`. As a result, it was able to remove `number` from the type of `padding` (narrowing from `string | number` to `string`) for the rest of the function.

This analysis of code based on reachability is called control flow analysis, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments. When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.

### Using type predicates

A predicate takes the form `parameterName is Type`, where `parameterName` must be the name of a parameter from the current function signature.

To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

Any time isFish is called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible.

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

### Discriminated Unions

When every type in a union contains a common property with literal types, TypeScript considers that to be a discriminated union, and can narrow out the members of the union.

```ts
// bad
interface Shape {
  kind: 'circle' | 'square',
  radius?: number,
  sideLength?: number
}

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}



// good
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function handleShape(shape: Shape) {
  switch (shape.kind) {
    case "square":
      return shape.sideLength * shape.sideLength;

    case "circle":
      return Math.PI * shape.radius ** 2;

    default:
      break;
  }
}
```

### The never type

When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a never type to represent a state which shouldn’t exist.
  
```ts
function error(message: string): never {
  throw new Error(message);
}
```

### Exhaustiveness checking

The never type is assignable to every type; however, no type is assignable to never (except never itself). This means you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement.

```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

As if there is no `case` for the new shape, TypeScript will throw an error, because it can’t narrow down the type of `shape` to `never`. In this way, you can ensure that the `getArea` function always exhausts all shape possibilities.
