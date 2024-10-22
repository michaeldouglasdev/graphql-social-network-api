import { GraphQLError } from "graphql";
import { ValidatorStrategyOptions, ValidatorStrategy } from "./validator";

export class ValidatorMinStrategy implements ValidatorStrategy {
  argName = "min";
  execute(data: ValidatorStrategyOptions): void {
    const { value, type, args } = data;
    const argValue = args[this.argName];
    const success = argValue && value > argValue;

    if (!success) {
      throw new GraphQLError(`Expected ${value} > ${argValue}`);
    }
  }
}
