import { NgModule } from '@angular/core';
import { TypeOfPipe } from "../pipes/type-of-pipe";


@NgModule({
  declarations:   [TypeOfPipe],
  exports:        [TypeOfPipe],
})
export class PipeModule { }
