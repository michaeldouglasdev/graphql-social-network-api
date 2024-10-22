import { GraphQLError } from "graphql";
import { ValidatorStrategyOptions, ValidatorStrategy } from "./validator";

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidatorIsEmailStrategy implements ValidatorStrategy {
  argName = "isEmail";
  execute(data: ValidatorStrategyOptions<string>): void {
    const { value, type, args } = data;
    const argValue: string = args[this.argName];
    const success = argValue && regexEmail.test(value);

    if (!success) {
      throw new GraphQLError(`Expected email, but received ${value}`);
    }
  }
}
