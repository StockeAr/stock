import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg ==="" || arg.length < 2) return value;

    const resultado=[];
    for(const i of value){
      if(i.username.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultado.push(i);
      }
    }
    return resultado;
  }

}
