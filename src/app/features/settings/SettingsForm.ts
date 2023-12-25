import { FormControl } from "@angular/forms";

export interface SettingsForm {
  image: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
}
