import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import * as fromStore from '../../store';

//import { Router, ActivatedRoute } from '@angular/router';

import { Pizza } from '../../models/pizza.model';
//import { PizzasService } from '../../services/pizzas.service';

import { Topping } from '../../models/topping.model';
//import { ToppingsService } from '../../services/toppings.service';

@Component({
  selector: 'product-item',
  styleUrls: ['product-item.component.scss'],
  template: `
    <div 
      class="product-item">
      {{pizza$}}
      <pizza-form
        [pizza]="pizza$ | async"
        [toppings]="toppings$ | async"
        (selected)="onSelect($event)"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (remove)="onRemove($event)">
        <pizza-display
          [pizza]="visualise$ | async">
        </pizza-display>
      </pizza-form>
    </div>
  `,
})
export class ProductItemComponent implements OnInit {
  pizza$: Observable<Pizza>;
  visualise$: Observable<Pizza>;
  toppings$: Observable<Topping[]>;

  constructor(
    private store: Store<fromStore.ProductsState>
  ){}
  /*
  constructor(
    //private pizzaService: PizzasService,
    //private toppingsService: ToppingsService,
    //private route: ActivatedRoute,
    //private router: Router
  ) {}
*/

  ngOnInit(){
    this.pizza$ = this.store.select(fromStore.getSelectedPizza).pipe(
      tap((pizza:Pizza = null) => {
        // '/products/new のときはepmty'
        // https://platform.ultimateangular.com/courses/ngrx-store-effects/lectures/3922946
        const pizzaExists = !!(pizza && pizza.toppings);
        const toppings = pizzaExists 
        // 第一引数: topping: コールバック関数
        ? pizza.toppings.map(topping => topping.id) //'products/1 などの時'
        : [];
        this.store.dispatch(new fromStore.VisualizeToppings(toppings));
      })
    );
    this.toppings$ = this.store.select(fromStore.getAllToppings);
    this.visualise$ = this.store.select(fromStore.getPizzaVisualise);
  }

  onSelect(event: number[]){
    this.store.dispatch(new fromStore.VisualizeToppings(
      event
    ))
  };

  onCreate(event: Pizza){
    this.store.dispatch(new fromStore.CreatePizza(event))
  };

  onUpdate(event: Pizza){ //event callback
    this.store.dispatch(new fromStore.UpdatePizza(event));
  };

  /*
  ngOnInit() {
    this.pizzaService.getPizzas().subscribe(pizzas => {
      const param = this.route.snapshot.params.id;
      let pizza;
      if (param === 'new') {
        pizza = {};
      } else {
        pizza = pizzas.find(pizza => pizza.id == parseInt(param, 10));
      }
      this.pizza = pizza;
      this.toppingsService.getToppings().subscribe(toppings => {
        this.toppings = toppings;
        this.onSelect(toppings.map(topping => topping.id));
      });
    });
  }*/

  /*
  onSelect(event: number[]) {
    let toppings;
    if (this.toppings && this.toppings.length) {
      toppings = event.map(id =>
        this.toppings.find(topping => topping.id === id)
      );
    } else {
      toppings = this.pizza.toppings;
    }
    this.visualise = { ...this.pizza, toppings };
  }*/

  /*
  onCreate(event: Pizza) {
    this.pizzaService.createPizza(event).subscribe(pizza => {
      this.router.navigate([`/products/${pizza.id}`]);
    });
  }*/

  /*
  onUpdate(event: Pizza) {
    this.pizzaService.updatePizza(event).subscribe(() => {
      this.router.navigate([`/products`]);
    });
  }*/

  onRemove(event: Pizza) {
    const remove = window.confirm('Are you sure?');
    if (remove) {
      this.store.dispatch(new fromStore.RemovePizza(event));
      /*
      this.pizzaService.removePizza(event).subscribe(() => {
        this.router.navigate([`/products`]);
      });
      */
    }
  }
}
