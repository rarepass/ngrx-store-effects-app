// comunicate by http 
import { Injectable } from '@angular/core';
// Actions is obserbable
import { Effect, Actions } from '@ngrx/effects'
import { of } from 'rxjs/Observable/of'
import { map, switchMap, catchError } from 'rxjs/operators';

import * as toppingActions from '../actions/toppings.action';
import * as fromServices from '../../services';

@Injectable()
export class ToppingsEffects {
    constructor(
        private action$: Actions,
        private toppingService: fromServices.ToppingsService
    ) {
        
    }

    // listen obserbable actions
    //@Effect( {dispatch: false }) // dispatchが不要な場合
    @Effect()
    loadToppings$ = this.action$.ofType(toppingActions.LOAD_TOPPINGS)
    .pipe(
        switchMap(() => {
            // obserbableなのでpipeをつける(new streamを生成)
            return this.toppingService.getToppings().pipe(
                map(toppings => new toppingActions.LoadToppingsSuccess(toppings)),
                catchError(error => of(new toppingActions.LoadToppingsFail(error)))
        )})
    );//pipe
}