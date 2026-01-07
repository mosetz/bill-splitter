import { allocateItemsToPeople } from './allocations'
import { roundedAndDistribute } from './rounding'

function percentToDecimal(rate) {
    const r = Number(rate);
    return Number.isFinite(r) ? r / 100 : 0;
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

    
    const discount = 0;

    const vatRate = percentToDecimal(bill.vatRate ?? 0);
    const serviceRate = percentToDecimal(bill.serviceRate ?? 0);

    //Step 1 : amount after discount on this phase (let it be 0 for now)
    let afterDiscount = subtotal - discount;
    if (afterDiscount < 0) afterDiscount = 0;

    /**
     * Step 2 : service charge
     * For now, discount is 0 so preset won't change result,
     * but we keep structure ready for when added a discount later
     */
    let service = 0; //Service is like a restaurant tax pay added up from total cost 

    if (bill.calculationPreset === "SERVICE_FIRST") {
        service = subtotal * serviceRate; // discount would happen after service later
    } else {
        service = afterDiscount * serviceRate; //discount first then service
    }

    //Step 3 : amount that VAT is applied to / extracted from
    const preVatAmount = afterDiscount + service;


    //Step 4: Vat by mode
    let vat = 0;
    let grandTotal = 0;

    if (bill.vatMode === "ADDED") {
        vat = preVatAmount * vatRate;
        grandTotal = preVatAmount + vat;
    } else if (bill.vatMode === "INCLUDED"){
         // preVatAmount already includes VAT. Extract the VAT portion.
        if (vatRate > 0) {
            const net = preVatAmount / (1 + vatRate); //Think of total net price 100 government will add 7 unit in to it so it will be 107/100 = 1.07
            vat = preVatAmount - net;
        } else { 
        vat = 0;
        }
        
        grandTotal = preVatAmount;
    }  else {
        vat = 0;
        grandTotal = preVatAmount;
    }

    const allocation = allocateItemsToPeople({ bill, items, people, grandTotal });
    const perPersonRounded = roundedAndDistribute(allocation.perPerson ?? []);


    return {
        totals: {subtotal, discount, service, vat, grandTotal},
        perPerson: perPersonRounded,
        meta: {warnings, currency: bill.currency ?? "THB"},
    };

}