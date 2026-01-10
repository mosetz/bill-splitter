import { useMemo } from "react";
import { useSelector} from 'react-redux'
import { computeBill } from "../../domain/calc/index";

function money (n, currency = "THB") {
    const num = Number(n) || 0
    return `${num.toFixed(2)} ${currency}`
}

export default function ResultPanel() {
    const bill = useSelector((state) => state.bill);
    const items = useSelector((state) => state.items.list);
    const people = useSelector((state) => state.people.list);


    /**
     * This hook change every time when state in redux change (bill, items, people)
     * computeBill (index.js) is a pure function which for calculate thing such as subTotal, grandTotal
     * if return a object contain subtotal, discount, service, vat, grandTotal and so on
     */
    const preview = useMemo(() => {
        return computeBill({bill, items, people});
    },[bill, items, people]);

    const {totals, perPerson, meta} = preview;

    return (
        <section className="rounded-2xl border p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Result</h2>

            {/*Warning */}
            {meta.warnings?.length > 0 && (
                <div className="mb-3 rounded-xl border px-3 py-2 text-sm">
                    <ul className="list-disc pl-5">
                        {meta.warnings.map((w) => (
                            <li key={w}>{w}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Totals */}
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="opacity-70">Subtotal</span>
                    <span>{money(totals.subtotal, meta.currency)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="opacity-70">Service</span>
                    <span>{money(totals.service, meta.currency)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="opacity-70">VAT</span>
                    <span>{money(totals.vat, meta.currency)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Grand Total</span>
                    <span>{money(totals.grandTotal, meta.currency)}</span>
                </div>
            </div>

            {/* Per person */}
            <div className="mt-4">
                <h3 className="font-medium mb-2">Who pays</h3>

                {perPerson?.length ? (
                    <div className="space-y-2">
                        {perPerson.map((p) => (
                            <div
                                key={p.personId}
                                className="flex items-center justify-between rounded-xl border px-3 py-2"
                            >
                                <span className="truncate">{p.name}</span>
                                <span className="font-medium">
                                    {money(p.amountRounded ?? p.amountExact, meta.currency)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm opacity-60">Add people and items to see results.</p>
                )}
            </div>
        </section>
    );
}