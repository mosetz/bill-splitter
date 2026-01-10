/**
 * This use for rounding pennies or changes it rounded per-person total to 2dp and distribute left over pennies fairly 
 * Input : [{personId, amountExact}]
 * Output: [{personId, amountRounded}]
 */

export function roundedAndDistribute (perPerson) {

    /**
     * perPerson is a array pass from allocation it contain object that look like this
     * {personId, "p1", name: "alice" , amountExact: 0}
     */


    //First check if array exist or not
    const rows = Array.isArray(perPerson) ? perPerson : [];
    if(rows.length === 0) return [];

    //Helper: convert to cents safely
    const toCents = (x) => Math.round((Number(x) + Number.EPSILON) * 100);

    //Total cents (rounded)
    const totalExact = rows.reduce((s,r) => s + (Number(r.amountExact) || 0), 0);
    const totalCents = toCents(totalExact);

    //For each person: exact cents (not rounded), floor cents, remainder
    const enriched = rows.map((r, idx) => {
        const exact = Number(r.amountExact) || 0;
        const exactCentsFloat = exact * 100;
        const floorCents = Math.floor(exactCentsFloat + 1e-9);
        const remainder = exactCentsFloat - floorCents;

        return {
            ...r,
            __idx: idx,
            __floorCents: floorCents,
            __remainder: remainder
        };
    });

    const sumFloor = enriched.reduce((s,r) => s + r.__floorCents, 0);
    let leftover = totalCents - sumFloor;

    //Sort by remainder desc, stable by original index
    const order = [...enriched].sort((a, b) => {
        if (b.__remainder !== a.__remainder) return b.__remainder - a.__remainder
        return a.__idx - b.__idx;
    });

    //Give + 1 cent to top 'leftover' people
    const bonus = new Map();
    for (let i = 0; i < order.length; i++) bonus.set(order[i].personId, 0);

    //leftover can be 0..N typically if negative, we'd remove cents (rare)
    if (leftover > 0) {
        for(let i = 0; i < leftover; i++) {
            const personId = order[i % order.length].personId;
            bonus.set(personId, (bonus.get(personId) || 0) + 1);
        }
    } else if (leftover < 0) {
        //If we somehow overshot, remove cents from smallest remainder;
        const asc = [...order].reverse();
        for(let i = 0; i < Math.abs(leftover); i++){
            const personId = asc[i % asc.length].personId;
            bonus.set(personId, (bonus.get(personId)|| 0) - 1);
        }
    }

    return enriched.map((r) => {
        const cents = r.__floorCents + (bonus.get(r.personId) || 0);
        return {
            ...r,
            amountRounded: cents / 100,
        }
    })
}