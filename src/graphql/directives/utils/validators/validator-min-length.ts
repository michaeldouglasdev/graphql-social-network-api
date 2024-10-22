import { GraphQLError } from "graphql";
import { ValidatorStrategyOptions, ValidatorStrategy } from "./validator";

export class ValidatorMinLengthStrategy implements ValidatorStrategy {
  argName = "minLength";
  execute(data: ValidatorStrategyOptions<string>): void {
    const { value, type, args } = data;
    const argValue = args[this.argName];
    const success = argValue && value.length >= argValue;

    if (!success) {
      throw new GraphQLError(`Expected length ${value} >= ${argValue}`);
    }
  }
}
