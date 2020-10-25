import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions'

export interface State {
  isAutenthicated: boolean;
}

const initialState = {
  isAutenthicated: false
}

export function authReducer(state = initialState, action: AuthActions) {
  switch(action.type){
    case SET_AUTHENTICATED:
      return {
        isAutenthicated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        isAutenthicated: false
      };
    default:{
      return state;
    }
  }

}

export const getIsAuthenticated = (state: State) => state.isAutenthicated;
