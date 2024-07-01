export interface RestResponse<T> {
    code: string;
    message: string;
    data: T;
  }
  