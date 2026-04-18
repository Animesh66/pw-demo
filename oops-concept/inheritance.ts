class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    getName(): string {
        return this.name;
    }

    getAge(): number {
        return this.age;
    }

    setName(name: string): void {
        this.name = name;
    }

    setAge(age: number): void {
        this.age = age;
    }
}

export default Person;

class Employee extends Person {
    private jobTitle: string;

    constructor(name: string, age: number, jobTitle: string) {
        super(name, age);
        this.jobTitle = jobTitle;
    }

    getJobTitle(): string {
        return this.jobTitle;
    }

    setJobTitle(jobTitle: string): void {
        this.jobTitle = jobTitle;
    }
}

export { Employee };