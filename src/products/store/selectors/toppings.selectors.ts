import {
    createSelector
} from '@ngrx/store'

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers/index';
import * as fromToppings from '../reducers/toppings.reducer';

import { Topping } from '../../models/topping.model';

// pizza state
export const getToppingState = createSelector(
    fromFeature.getProductsState, 
    (state: fromFeature.ProductsState ) => state.toppings
);

export const getToppingsEntities = createSelector(
    getToppingState,
    fromToppings.getToppingsEntities
);

export const getSelectedToppings = createSelector(
    getToppingState,
    fromToppings.getSelectedToppings
);

export const getAllToppings = createSelector(
    getToppingsEntities,
    (entities) => {
        return Object.keys(entities)
        .map(id => entities[parseInt(id, 10)]); //obj to array
    }
);

export const getToppingsLoaded = createSelector(
    getToppingState,
    fromToppings.getToppingsLoaded
);

export const getToppingsLoading = createSelector(
    getToppingState,
    fromToppings.getToppingsLoading
);
/*
export const  getSelectedTopping = createSelector(
    getToppingsEntities,
    fromRoot.getrouterState,
    (entities, router): Topping => {
        return router.state 
        && entities[router.state.params.pizzaId];
    }
);
*/
