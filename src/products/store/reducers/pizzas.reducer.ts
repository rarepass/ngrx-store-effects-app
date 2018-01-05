import * as fromPizzas from '../actions/pizzas.action';
import { Pizza } from '../../models/pizza.model';

export interface PizzaState {
    entities: { [id: number] : Pizza},
    loaded: boolean,
    loading: boolean
}

// data. name,toppings
export const initialState: PizzaState = {
    entities: {},
    loaded: false,
    loading: false
}

export function reducer (
    state = initialState,
    action: fromPizzas.PizzasAction
): PizzaState {
    console.log(action.type);
    switch(action.type) {
        case fromPizzas.LOAD_PIZZAS: {
            return {
                ...state,
                loading: true
            };
        }
        case fromPizzas.LOAD_PIZZAS_SUCESS: {
            const pizzas = action.payload;

            const entities = pizzas.reduce(
                (entities: { [id: number]: Pizza }, pizza: Pizza) => {
                    return {
                        ...entities,
                        [pizza.id]: pizza 
                    };
                },
                {
                    ...state.entities
                }
            );

            return {
                ...state,
                loading: false,
                loaded: true,
                entities,
            };

        }
        case fromPizzas.LOAD_PIZZAS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false
            };
        }

        // update,createは同じ行動をする
        case fromPizzas.UPDATE_PIZZA_SUCCESS:
        case fromPizzas.CREATE_PIZZA_SUCCESS: {
            const pizza = action.payload;
            const entities = {
                ...state.entities, //now
                [pizza.id]: pizza //newid; newvalue
            }
            return {
                ...state, //initialstate
                entities
            };
        }

        case fromPizzas.REMOVE_PIZZA_SUCCESS: {
            const pizza = action.payload;
            
            const { [pizza.id]: removed, ...entities } = state.entities;
            console.log(removed);

            return {
                ...state,
                entities,
            }
        }


    }
    return state;
}

export const getPizzasEntities = (state: PizzaState) => state.entities;
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;