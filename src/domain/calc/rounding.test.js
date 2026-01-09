import { describe, it, expect } from "vitest";
import { roundedAndDistribute } from "./rounding";

function sumRounded (rows) {
    return rows.reduce((s, r) => s + r.amountRounded, 0)
}

describe("roundedAndDistribute", () => {
    it("rounds to 2dp for each person", () => {
        const input = [
            {perPersonId: "p1", amountExact: 10.129},
            {perPersonId: "p2", amountExact: 20.555},
        ];

        const out = roundedAndDistribute(input);

        expect(out.find(p => p.perPersonId === "p1").amountRounded).toBeCloseTo(10.13);
        expect(out.find(p => p.perPersonId === 'p2').amountRounded).toBeCloseTo(20.56);
    });

    it("distributes leftover cent so totals match the rounded grand total", () => {
        //exact total = 100.00 but naive rounding give 99.99
        const input = [
            {personId: 'p1', amountExact: 33.3333},
            {personId: 'p2', amountExact: 33.3333},
            {personId: 'p3', amountExact: 33.3333},
        ];

        const out = roundedAndDistribute(input);


        expect(sumRounded(out)).toBeCloseTo(100.0);
    });

    it("dose not change total when rounding already matches", () => {
        const input = [
            {personId: "p1", amountExact: 50.0},
            {personId: "p2", amountExact: 50.0},
        ];

        const out = roundedAndDistribute(input);
      

        expect(sumRounded(out)).toBeCloseTo(100.0);
    });

    it("add 1 cent to person with the largest remainder (classic 99.99 => 100.00)", () => {
        const input = [
            {personId: 'p1', name: "Alice", amountExact: 33.3333},
            {personId: 'p2', name: 'Bob', amountExact: 33.3333},
            {personId: 'p3', name: "Chris", amountExact: 33.3334},
        ];

        const out = roundedAndDistribute(input);
        expect(out.map(x => x.amountRounded)).toEqual([33.33, 33.33, 33.34]);

        expect(sumRounded(out)).toBeCloseTo(100.0)
    });

    it("distribute multiple leftover cents fairly across people", () => {
        //totalExact = 0.05
        //floor cents -> [0,0,0] sum = 0
        //totalCents = 5
        //left over = 5 cents -> should distribute 2,2,1 in some fair order

         const input = [
        {personId: "p1", amountExact: 0.019}, //1.9 cents
        {personId: "p2", amountExact: 0.019}, //1.9 cents
        {personId: "p3", amountExact: 0.012}, //1.2 cents
    ];

        const out = roundedAndDistribute(input);

        expect(sumRounded(out)).toBeCloseTo(0.05);

        //each is rounded to 2dp
        out.forEach(r => {
            expect(Number.isFinite(r.amountRounded)).toBe(true);
            expect(Math.round(r.amountRounded * 100)).toBeCloseTo(r.amountRounded * 100);
        });
    });


    it("does nothing when rounding already matches exactly", () => {
        const input = [
            {personId: "p1", amountExact: 50.0},
            {personId: "p2", amountExact: 50.0},
        ];

        const out = roundedAndDistribute(input);

        expect(out.map(x => x.amountRounded)).toEqual([50.0, 50.0]);
        expect(sumRounded(out)).toBeCloseTo(100.0);
    });
   
})