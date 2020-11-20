import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BaseFormUser {


    private isValidEmail = /\S+@\S+\.\S+/;
    errorMessage: null;

    constructor(private fb: FormBuilder) { }
    baseForm = this.fb.group({
        username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rol: ['', [Validators.required]]
    });



    isValidField(field: string): boolean {
        this.getErrorMessage(field);
        return (
            (this.baseForm.get(field).touched || this.baseForm.get(field).dirty) &&
            !this.baseForm.get(field).valid
        );
    }

    private getErrorMessage(field: string): void {
        const {errors}=this.baseForm.get(field);
        if(errors){
            const minLength=errors?.minLength?.requiredLength;
            const messages={
                required:'Debe introducir un valor',
                pattern:'No es un Email valido',
                minLength:`Este campo requiere un minimo de ${minLength} caracteres`
            };
            const errorKey =Object.keys(errors).find(Boolean);
            this.errorMessage=messages[errorKey];
        }
    }
}