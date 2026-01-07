import { describe, it, expect } from "vitest";
import { allocateItemsToPeople } from "./allocations";

function bill(override = {}) {
    
    return {
        splitMode: "EQUAL",
        ...override,
    };
}

describe("allocateItemsToPeople", () => {

    it("returns empty when no people", () =>{
        const res = allocateItemsToPeople({
            bill: bill({splitMode: "EQUAL"}),
            people: [],
            items: [{id:"i1", unitPrice: 100, qty: 1}],
            grandTotal: 100,
        });
        expect(res.perPerson).toEqual([]);
    });

    it("EQUAL split: everyone pays grandTotal / n", () => {
        const people = [
            {id: "p1", name: "Alice"},
            {id: "p2", name: "Bob"},
        ];

        const res = allocateItemsToPeople({
            bill: bill({splitMode: "EQUAL"}),
            people,
            items: [{id: "i1", unitPrice: 200, qty: 1}],
            grandTotal: 300,
        });

        // exact math (rounding happens later)
        expect(res.perPerson.find((p) => p.personId === "p1").amountExact).toBeCloseTo(150);
        expect(res.perPerson.find((p) => p.personId === "p2").amountExact).toBeCloseTo(150);

    });

    it("BY_ITEM + ASSIGNED: assigned person gets the item share", () => {
        const people = [
            {id: "p1", name: "Alice"},
            {id: "p2", name: "Bob"},
        ];

        /**
         * two items: 200 and 100 => subTotal 300
         * grandTotal 330 ( tax/service added already )
         * items shared:
         * 200/300 * 330 = 220
         * 100/300 * 330 = 110
         */

        const items = [
            {id: "i1", name: "Pizza", unitPrice: 200, qty: 1, splitMode: "SHARED"},
            {id: "i2", name: "Beer", unitPrice: 100, qty: 1, splitMode: "ASSIGNED" , assignedTo: "p2"},
        ];

        const res = allocateItemsToPeople({
            bill: bill({splitMode: "BY_ITEM"}),
            people,
            items,
            grandTotal: 330,
        });

        const alice = res.perPerson.find(p => p.personId === "p1").amountExact;
        const bob = res.perPerson.find(p => p.personId === "p2").amountExact;

        //Pizza shared => 220/2 = 110 each
        //Beer assigned to Bob => + 110
        expect(alice).toBeCloseTo(110);
        expect(bob).toBeCloseTo(220);
    });

    it("BY_ITEM missing assignedTo falls back to Shared", () => {
        const people = [
            {id: "p1", name: "Alice"},
            {id: "p2", name: "Bob"},
        ];

        const items = [
            {id: 'i1', unitPrice: 100, qty: 1, splitMode: "ASSIGNED"}, //missing assignedTo
        ];

        const res = allocateItemsToPeople({
            bill: bill({splitMode: "BY_ITEM"}),
            people,
            items,
            grandTotal: 100,
        });

        const a = res.perPerson.find(p => p.personId === "p1").amountExact;
        const b = res.perPerson.find(p => p.personId === "p2").amountExact;

        expect(a).toBeCloseTo(50);
        expect(b).toBeCloseTo(50);

    });

});