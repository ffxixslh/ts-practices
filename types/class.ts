class Vehicle {
  constructor(public color: string) {}
  protected honk(): void {
    console.log("Honking...");
  }
}

class Car extends Vehicle {
  constructor(public wheels: number, color: string) {
    super(color);
  }
  private drive(): void {
    console.log("Driving a car...");
  }
  startProcessing(): void {
    this.drive();
    this.honk();
  }
}

const car = new Car(4, "orange");
console.log(car.color);
