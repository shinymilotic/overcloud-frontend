import { ApiValidationError } from "./apivalidationerror.model";

export interface ApiError {
    errors: ApiValidationError[];
  }
  