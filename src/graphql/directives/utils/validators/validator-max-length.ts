import { GraphQLError } from "graphql";
import { ValidatorStrategyOptions, ValidatorStrategy } from "./validator";

export class ValidatorMaxLengthStrategy implements ValidatorStrategy {
  argName = "maxLength";
  execute(data: ValidatorStrategyOptions<string>): void {
    const { value, type, args } = data;
    const argValue = args[this.argName];
    const success = argValue && value.length <= argValue;

    if (!success) {
      throw new GraphQLError(`Expected length ${value} <= ${argValue}`);
    }
  }
}
