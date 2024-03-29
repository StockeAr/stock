import { Injectable, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({ providedIn: 'root' })

export class BaseErrorMessage {

    //private isValidEmail = /\S+@\S+\.\S+/;
    private errorMessage: any;
    base: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    isValidField(field: string): boolean {
        //console.log("field: ",field);
        //this.getErrorMessage(field);
        return (
            this.base.get(field)!.touched || this.base.get(field)!.dirty && !this.base.get(field)!.valid
        )
    }

    getErrorMessage(field: string): string {

        const { errors } = this.base.get(field);
        //console.log("errors -> ",errors);

        if (errors) {
            const minlength = errors?.minlength?.requiredLength;
            const maxlength = errors?.maxlength?.requiredLength;
            const min = errors?.min?.min;
            const messages: any = {
                required: 'Campo obligatorio',
                pattern: `No es un ${field} valido`,
                minlength: `Campo de minimo ${minlength} caracteres`,
                maxlength: `Campo de maximo ${maxlength} caracteres`,
                min: `Campo con valor minimo  de ${min}`,
            };

            const errorKey = Object.keys(errors).find(Boolean);

            this.errorMessage = messages[errorKey];
        } else {
            this.errorMessage = "";
        }
        return this.errorMessage;
    }
}
