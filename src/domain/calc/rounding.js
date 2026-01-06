/**
 * This use for rounding pennies or changes it rounded per-person total to 2dp and distribute left over pennies fairly 
 * Input : [{personId, amountExact}]
 * Output: [{personId, amountRounded}]
 */

export function roundedAndDistribute (perPerson) {

    //TODO implement on phase 3
    return perPerson.map((row) => ({
        ...row,
        amountRounded: Math.round((row.amountExact + Number.EPSILON) * 100) / 100,
    }));
}