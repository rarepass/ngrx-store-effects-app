// comunicate by http 
import { Injectable } from '@angular/core';
// Actions is obserbable
import { Effect, Actions } from '@ngrx/effects'
import { of } from 'rxjs/Observable/of'
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromRoot from '../../../app/store/';

import * as pizzaActions from '../actions/pizzas.action';
import * as fromServices from '../../services';

@Injectable()
export class PizzasEffects {
    constructor(
        private actions$: Actions,
        private pizzaService: fromServices.PizzasService
    ) {
        
    }

    // listen obserbable actions
    //@Effect( {dispatch: false }) // dispatchが不要な場合
    @Effect()
    loadPizza$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS)
    .pipe(
        switchMap(() => {
            // obserbableなのでpipeをつける(new streamを生成)
            return this.pizzaService.getPizzas().pipe(
                map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
                catchError(error => of(new pizzaActions.LoadPizzasFail(error)))
        )})
    );

    @Effect()
    createPizza$ = this.actions$
        .ofType(pizzaActions.CREATE_PIZZA)
        .pipe(
            map((action: pizzaActions.CreatePizza) => action.payload),
            switchMap(pizza => {
                return this.pizzaService
                    .createPizza(pizza)
                    .pipe(
                        map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
                        catchError(error => of(new pizzaActions.CreatePizzaFail(error)))
                    );
            })
    );

    @Effect()
    createPizzaSuccess$ = this.actions$
        .ofType(pizzaActions.CREATE_PIZZA_SUCCESS)
        .pipe(
            map((action:pizzaActions.CreatePizzaSuccess) => action.payload),
            map(pizza => {
                new fromRoot.Go({
                    //urlが/newの時、create pizzaすると
                    //products/4 とかにリダイレクトされる
                    path: ['/products', pizza.id],
                });
            })
        );


    @Effect()
    updatePizza$ = this.actions$.ofType(pizzaActions.UPDATE_PIZZA)
    .pipe(
        map((action: pizzaActions.UpdatePizza) => action.payload),
        switchMap((pizza) => {
            return this.pizzaService
                .updatePizza(pizza)
                .pipe(
                    map(pizza => new pizzaActions.UpdatePizzaSuccess(pizza)),
                    catchError(error => of(new pizzaActions.UpdatePizzaFail(error)))
                );
        })
    );

    @Effect()
    removePizza$ = this.actions$.ofType(pizzaActions.REMOVE_PIZZA)
    .pipe(
        map((action: pizzaActions.RemovePizza) => action.payload),
        switchMap(pizza => {
            return this.pizzaService
                .removePizza(pizza)
                .pipe(
                    //noting given back
                    map(() => new pizzaActions.RemovePizzaSuccess(pizza)),
                    catchError(error => of(new pizzaActions.RemovePizzaFail(error)))

                )
        })
    );

    @Effect()
    handlePizzaSuccess$ = this.actions$
        .ofType(
            pizzaActions.UPDATE_PIZZA_SUCCESS,
            pizzaActions.REMOVE_PIZZA_SUCCESS
        )
        .pipe(
            map(pizza => {
                return new fromRoot.Go({
                    path:['/products'],
                });
            })
        );

}