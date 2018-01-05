import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';
import { FORMERR } from 'dns';

export const GO = '[Router] Go';
export const BACK = '[Router] BAack';
export const FORWARD = '[Router] Forward';


export class Go implements Action {
    readonly type = GO;
    constructor(
        public payload: {
            path: any[];
            query?: object;
            extras?: NavigationExtras;
        }
    ){}
}

export class Back implements Action {
    readonly type = BACK;
}


export class Forward implements Action {
    readonly type = FORWARD;
}

export type Actions = Go | Back | Forward;