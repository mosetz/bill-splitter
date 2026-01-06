/**
 * This part use to assign item to people based on item.splitMode and assignedTo
 * - ASSIGNED : entire item goes to assigned person
 *  - SHARED : item cost is divided equally across people
 */

export function allocateItemsToPeople( {bill, items, people, grandTotal} ) {

    const n = people?.length ?? 0;

    const perPerson = 
    n === 0
    ? []
    : people.map((p) => ({
        personId: p.id,
        name: p.name,
        amountExact: grandTotal / n
    }));

    //This will be implement on phase 3
    return { perPerson }
       
}