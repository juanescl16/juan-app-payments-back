export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    private _value?: T;
  
    private constructor(isSuccess: boolean, error?: string, value?: T) {
      if (isSuccess && error) {
        throw new Error("A result cannot be successful and contain an error");
      }
      if (!isSuccess && !error) {
        throw new Error("A failing result needs to contain an error message");
      }
  
      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.error = error;
      this._value = value;
    }
  
    public getValue(): T {
      if (!this.isSuccess) {
        throw new Error("Cannot get the value of an error result");
      }
      return this._value as T;
    }
  
    public static ok<U>(value?: U): Result<U> {
      return new Result<U>(true, undefined, value);
    }
  
    public static fail<U>(error: string): Result<U> {
      return new Result<U>(false, error);
    }
  }
  