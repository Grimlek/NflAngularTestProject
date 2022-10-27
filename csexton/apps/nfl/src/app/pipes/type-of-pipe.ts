import {Pipe, PipeTransform} from '@angular/core';

//
// Class is used for debugging purposes only and useful for development with templating.
//
@Pipe({
  name: 'typeof'
})
export class TypeOfPipe implements PipeTransform {

  transform(value: any): any {
    console.log("Pipe works ", typeof value);
    return typeof value;
  }

}
