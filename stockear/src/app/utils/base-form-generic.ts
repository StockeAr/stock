import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BaseFormGeneric {

    errorMessage: null;

    constructor(private fb: FormBuilder) { }
    baseForm = this.fb.group({
        descripcion: ['', Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    });

    isValidField(field: string): boolean {
        this.getErrorMessage(field);
        return (
            (this.baseForm.get(field).touched || this.baseForm.get(field).dirty) &&
            !this.baseForm.get(field).valid
        );
    }

    private getErrorMessage(field: string): void {
        const { errors } = this.baseForm.get(field);
        if (errors) {
            const minLength = errors?.minLength?.requiredLength;
            const maxLength=errors?.maxLength?.requiredLength;
            const messages = {
                required: 'Debe introducir un valor',
                minLength: `Este campo requiere un minimo de ${minLength} caracteres`,
                maxLength:`Este campo requiere un maximo de ${maxLength} caracteres`
            };
            const errorKey = Object.keys(errors).find(Boolean);
            this.errorMessage = messages[errorKey];
        }
    }
}