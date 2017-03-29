import { FormGroup } from '@angular/forms';

// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields/34582914#34582914
// FORM GROUP VALIDATORS
export function PasswordMatchValidator(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                doesNotMatch: true
            };
        }
    }
}
