import { Test } from "./test.model";

export interface TestResponse extends Test {
  slug: string;
}
