class Car {
    color: string;
    model: number;

    constructor(color: string, model: number) {
        this.color = color;
        this.model = model;
    }

    drive(): void {
        console.log(`The ${this.color} car is driving.`);
    }

    stop(): void {
        console.log(`The ${this.color} car has stopped.`);
    }

}

export default Car;

const bmw = new Car("red", 2020);
bmw.drive();
bmw.stop();

const audi = new Car("blue", 2021);
audi.drive();
audi.stop();