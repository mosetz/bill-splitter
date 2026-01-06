import { allocateItemsToPeople } from './allocations'
import { roundedAndDistribute } from './rounding'

function percentToDecimal(rate) {
    return rate/100;
}

/**
 * Main entry later:
 * computeBill(billSettings, items, people) -> per-person breakdown
 */
export function computeBill({bill, items, people}) {

    const warnings = [];

    if (!people?.length) warnings.push("No people added yet");
    if (!items?.length) warnings.push("No items added yet");

    //base subtotal
    const subtotal = (items ?? []).reduce((sum, it) => {
        const unit = Number(it.unitPrice) || 0;
        const qty = Number(it.qty) || 0;
        return sum + unit * qty
    },0)

    /**
     * On this phase which is not phase 2c we don't calculate discount or vat or service yet
     * Just carry a place holder so the output contract is stable
     * 
    */
    const discount = 0;
    const service = subtotal * percentToDecimal(bill.serviceRate ?? 0);
    const vat = 0;
    const grandTotal = subtotal + service;


    //allocation step
    const allocation = allocateItemsToPeople({bill, items, people, grandTotal});


    //rounding step
    const perPersonRounded = roundedAndDistribute(allocation.perPerson ?? []);


    return {
        totals: {subtotal, discount, service, vat, grandTotal},
        perPerson: perPersonRounded,
        meta: {warnings, currency: bill.currency ?? "THB"},
    };

}