import {createStore,compose,combineReducers,applyMiddleware} from 'redux';

import thunkMiddleware from 'redux-thunk';
import {messengerReducer} from './reducers/messengerReducer';

const rootReducer = combineReducers({
     messenger : messengerReducer
})

const middleware = [thunkMiddleware];

const store = createStore(rootReducer,compose(applyMiddleware(...middleware),

));

export default store;