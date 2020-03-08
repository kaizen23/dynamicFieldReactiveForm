import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { SelectComponent } from '../select/select.component';
import { DateComponent } from '../date/date.component';
import { RadiobuttonComponent } from '../radiobutton/radiobutton.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

const componentMapper = {
  input: InputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnChanges {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  @Input() index: number;
  componentRef: any;
  type: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnChanges() {
      let done = 0;
      let total = 10;

      this.type = new (function() {
        this[
          done > 0 && total === 0 ? 'InputComponent' : 'undef'
        ] = InputComponent;
        this[
          done === 0 && total > 0 ? 'ButtonComponent' : 'undef'
        ] = ButtonComponent;

        delete this.undef;
      })();
      this.deleteElementFromContainer();
      const factory = this.resolver.resolveComponentFactory(
         componentMapper[this.field.type]
        // this.a[Object.keys(this.a).join(",")]
      );
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.field = this.field;
      this.componentRef.instance.group = this.group;
  }
  private deleteElementFromContainer(): void {
    if (this.container.length > 0) {
      this.container.remove(this.index);
    }
  }
}
