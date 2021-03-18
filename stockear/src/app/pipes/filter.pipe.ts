import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any, label: any): any {
    if (arg === "" || arg.length < 2) return value;
    const resultado = [];

    /* En el switch lo que evaluo es el parametro label, el cual es un segundo parametro que espera recibir algun criterio que este dentro
    de la propiedad del objeto JSON que se aplica el pipe, esta modiicacion se realizo para que este pipe pueda ser usado con varios Object JSON
    de tipos como los que se encuentran dentro de la carpeta models, los cuales son representaciones de entidades del proyecto */

    /* esta el valor default para la busqueda de los usuarios, el resto de los case se iran agregando o eliminando segun se necesiten */
    for (const i of value) {
      switch (label) {
        case 'descrip': {
          if (i.descripcion.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
            resultado.push(i);
          }
          break;
        }
        default: {
          if (i.username.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
            resultado.push(i);
          }
          break;
        }
      }
    }
    return resultado;
  }

}
