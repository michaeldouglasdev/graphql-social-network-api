export interface ValidatorStrategy {
  argName: string;
  execute(data: ValidatorStrategyOptions): void;
}

export interface ValidatorStrategyOptions<T = any> {
  value: T;
  type: string;
  args: any;
}

export class Validators {
  validators = new Map<string, ValidatorStrategy>();

  add(validator: ValidatorStrategy) {
    this.validators.set(validator.argName, validator);
  }

  get(arg: string): ValidatorStrategy | undefined {
    return this.validators.get(arg);
  }
}
