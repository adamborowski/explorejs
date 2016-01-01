import {SAVE_FUEL_SAVINGS, CALCULATE_FUEL_SAVINGS} from '../constants/ActionTypes';
import calculator from '../businessLogic/fuelSavingsCalculator';
import dateHelper from '../businessLogic/dateHelper';

const initialState = {
    newMpg: 25,
    tradeMpg: 20,
    newPpg: 2.00,
    tradePpg: 2.10,
    milesDriven: null,
    milesDrivenTimeframe: 'week',
    displayResults: false,
    dateModified: null,
    necessaryDataIsProvidedToCalculateSavings: false,
    savings: {
        monthly: 0,
        annual: 0,
        threeYear: 0
    }
};

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
//Note that I'm using Object.assign to create a copy of current state
//and update values on the copy.
export default function fuelSavings(state = initialState, action) {
	switch (action.type) {
		case SAVE_FUEL_SAVINGS:
			//in a real app we'd trigger an AJAX call here. For this example, just simulating a save by changing date modified.
			return Object.assign({}, state, { dateModified: dateHelper.getFormattedDateTime(new Date()) });

		case CALCULATE_FUEL_SAVINGS:
			let newState = Object.assign({}, state);
			newState[action.fieldName] = action.value;
			let calc = calculator();
			newState.necessaryDataIsProvidedToCalculateSavings = calc.necessaryDataIsProvidedToCalculateSavings(newState);
			newState.dateModified = dateHelper.getFormattedDateTime(new Date());

			if (newState.necessaryDataIsProvidedToCalculateSavings) {
				newState.savings = calc.calculateSavings(newState);
			}

			return newState;

		default:
			return state;
	}
}
