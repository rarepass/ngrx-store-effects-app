import {
    createSelector
} from '@ngrx/store'

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers/index';
import * as fromPizzas from '../reducers/pizzas.reducer';
import * as fromToppings from './toppings.selectors';

import { Pizza } from '../../models/pizza.model';
import { getSelectedToppings, getToppingsEntities } from 'src/products/store';

// pizza state
export const getPizzaState = createSelector(
    fromFeature.getProductsState, 
    (state: fromFeature.ProductsState ) => state.pizzas
);

export const getPizzasEntities = createSelector(
    getPizzaState,
    fromPizzas.getPizzasEntities
);

export const  getSelectedPizza = createSelector(
    getPizzasEntities,
    fromRoot.getrouterState,
    (entities, router): Pizza => {
        return router.state 
        && entities[router.state.params.pizzaId];
    }
);

export const getAllPizzas = createSelector(
    getPizzasEntities,
    (entities) => {
        return Object.keys(entities)
        .map(id => entities[parseInt(id, 10)]); //obj to array
    }
)

export const getPizzasLoaded = createSelector(
    getPizzaState,
    fromPizzas.getPizzasLoaded
);

export const getPizzasLoading = createSelector(
    getPizzaState,
    fromPizzas.getPizzasLoading
);

export const getPizzaVisualise = createSelector(
    getSelectedPizza,
    fromToppings.getToppingsEntities,
    fromToppings.getSelectedToppings,
    (pizza, getToppingsEntities, selectedToppings) => {
        const toppings = selectedToppings.map(
            id => getToppingsEntities[id]
        )
        return { ...pizza, toppings }; //dispatchした時にeverytime returnする
    }
);
