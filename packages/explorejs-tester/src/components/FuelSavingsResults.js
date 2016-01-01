import React, {PropTypes} from 'react';
import NumberFormatter from '../businessLogic/numberFormatter';

//This is a stateless functional component. (Also known as pure or dumb component)
//More info: https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components
//And https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d
//And starter kit with more examples here: https://github.com/ericelliott/react-pure-component-starter
let FuelSavingsResults = (props) => {
    let savingsExist = NumberFormatter.scrubFormatting(props.savings.monthly) > 0;
    let savingsClass = savingsExist ? 'savings' : 'loss';
    let resultLabel = savingsExist ? 'Savings' : 'Loss';

    //You can even exclude the return statement below if the entire component is
    //composed within the parenthesies. Return is necessary here because some 
    //variables are set above.
    return (
        <table>
            <tbody>
                <tr>
                    <td className="fuel-savings-label">{resultLabel}</td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Monthly</td>
                                    <td>1 Year</td>
                                    <td>3 Year</td>
                                </tr>
                                <tr>
                                    <td className={savingsClass}>{props.savings.monthly}</td>
                                    <td className={savingsClass}>{props.savings.annual}</td>
                                    <td className={savingsClass}>{props.savings.threeYear}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

//Note that this odd style is utilized for propType validation for now. Must be defined *after* 
//the component is defined, which is why it's separate and down here.
FuelSavingsResults.propTypes = {
    savings: PropTypes.object.isRequired
};

export default FuelSavingsResults;