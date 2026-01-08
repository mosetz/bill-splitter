import { describe, it, expect } from "vitest";
import { computeBill } from "./index";

function baseBill (override = {}) {
    return {
        vatRate: 7,
        vatMode: "ADDED",
        serviceRate: 10,
        calculationPreset: "DISC_FIRST",
        currency: "THB",
        splitMode: "EQUAL",
        ...override
    };
}

describe("computeBill VAT", () => {

    it("VAT ADDED: adds vat on top", () => {
        const people = [
            {id: "p1", name: "Alice"},
        ];

        const items = [{id: 'i1', unitPrice: 100, qty: 1}];

        const res = computeBill({
            bill: baseBill({vatMode: "ADDED", serviceRate: 0}),
            people,
            items,
        });

        expect(res.totals.subtotal).toBeCloseTo(100);
        expect(res.totals.vat).toBeCloseTo(7);
        expect(res.totals.grandTotal).toBeCloseTo(107);

    });

    it("VAT INCLUDED: vat already include in side each item", () => {

        const people = [{id: "p1", name: 'Bob'}];
        const items = [{id: "i1", name: "pizza", unitPrice: 107, qty: 1}];

        const res = computeBill({
            bill: baseBill({vatMode: "INCLUDED", serviceRate: 0}),
            people,
            items,
        });

        expect(res.totals.subtotal).toBeCloseTo(107);
        expect(res.totals.vat).toBeCloseTo(7);
        expect(res.totals.grandTotal).toBeCloseTo(107);
    });

    it("VAT ADDED: with service charge", () => {
        const people = [{id: "p1", name: "Bob"}];
        const items = [{id:"i1", name:"pizza", unitPrice: 100, qty: 1}];

        const res = computeBill({
            bill: baseBill({vatMode: "ADDED", serviceRate: 10}),
            people,
            items
        });

        expect(res.totals.subtotal).toBeCloseTo(100);
        expect(res.totals.vat).toBeCloseTo(7.7);
        expect(res.totals.service).toBeCloseTo(10);
        expect(res.totals.grandTotal).toBeCloseTo(117.7);
    });
})