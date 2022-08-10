let username: string = "John";
let age: number = 22;
let mail: boolean = true;
// let bigNum: bigint = 12345n;
let girlfriend: null = null;
let girlfriendsName: undefined = undefined;
let sym: symbol = Symbol("id");
let userinfo: {
  address: string;
  phoneNumber: number;
} = {
  address: "123 Main St",
  phoneNumber: 1234567890,
};
let id: string | number = 123;

function compare(a: number, b: number): 1 | 0 | -1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
