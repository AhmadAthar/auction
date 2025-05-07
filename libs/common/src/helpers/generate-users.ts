import { faker } from "@faker-js/faker";
import { IUser } from "../interfaces";

export function generateUsers(count: number): Partial<IUser>[] {
    return Array.from({ length: count }, () => {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };
    });
}