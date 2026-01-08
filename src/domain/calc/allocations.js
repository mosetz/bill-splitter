/**
 * This part use to assign item to people based on item.splitMode and assignedTo
 * - ASSIGNED : entire item goes to assigned person
 *  - SHARED : item cost is divided equally across people
 */

export function allocateItemsToPeople( {bill, items, people, grandTotal} ) {

    const n = people.length;
    if (n === 0 || items.length === 0){
        return {perPerson: []};
    }

    // Compute subtotal again (food-only)
    const subTotal = items.reduce((sum, it) => {
        return sum + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0); 
    },0)

    if (subTotal === 0){
        return {
            perPerson : people.map((p) => ({
                personId: p.id,
                name: p.name,
                amountExact: 0,
            })),
        };
    }

    // Create buckets for each person
    const buckets = [];
    for (const p of people){
        buckets[p.id] = {
            personId: p.id,
            name: p.name,
            amountExact: 0,
        };
    }

    //Allocate each item
    for (const item of items) {
        const unit = Number(item.unitPrice) || 0;
        const qty = Number(item.qty) || 0;
        const itemBase = unit * qty;

        if (itemBase <= 0) continue;

        /**
         * This line of code find a proportion like how big it is compare to other thing
         * to find how big it was we need the price of that item / subtotal (no vat/service) * grandTotal (vat/service) include 
         * this will give how big it was compare to other thing 
         */
        const itemFinalCost = ( itemBase / subTotal ) * grandTotal; 

        if (bill.splitMode === "EQUAL") {
             // everyone shares everything
            const share = itemFinalCost / n;
            for (const p of people){
                buckets[p.id].amountExact += share;
            }
        } else {
            // BY_ITEM
            if (item.splitMode === "ASSIGNED" && item.assignedTo && buckets[item.assignedTo]) {
                buckets[item.assignedTo].amountExact += itemFinalCost;
            } else {
                //SHARED or missing assignment -> shared fallback
                const share = itemFinalCost / n;
                for (const p of people){
                    buckets[p.id].amountExact += share
                }
            }
        }
    }

    return {
        perPerson: Object.values(buckets),
    }
       
}