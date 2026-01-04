import { useSelector, useDispatch } from "react-redux";
import { setVatMode, setVatRate, setServiceRate, setCalculationPreset } from "../../features/bill/billSlice";

export default function BillSetting() {

    const dispatch = useDispatch();
    const bill = useSelector((state) => state.bill);

    const onVatRateChange = (e) => {
        const value = Number(e.target.value);
        if(!Number.isFinite(value)) return;
        dispatch(setVatRate(Math.max(0, value)))
    }
    
    const onServiceRateChange = (e) => {
        const value = Number(e.target.value);
        if(!Number.isFinite(value)) return;
        dispatch(setServiceRate(Math.max(0, value)));
    }


    return (
        <section className="rounded-2xl border p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Bill Setting</h2>

            {/* VAT RATE */}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">VAT rate (%)</label>
                <input 
                    className="w-full rounded-xl border px-3 py-2"
                    type="number" 
                    min="0"
                    step="0.1"
                    value={bill.vatRate}
                    onChange={onVatRateChange}
                />
            </div>

            {/* VAT MODE */}
            <div className="mb-3">
                <p className="block text-sm font-medium mb-1">Vat Mode</p>
                <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                        <input 
                            type="radio"
                            name="vatMode"
                            checked={bill.vatMode === "INCLUDED"}
                            onChange={() => dispatch(setVatMode("INCLUDED"))}
                        />
                        <span className="text-sm">Included</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="vatMode"
                            checked={bill.vatMode === "ADDED"}
                            onChange={() => dispatch(setVatMode("ADDED"))}
                        />
                        <span className="text-sm">Added</span>
                    </label>
                </div>
            </div>

            {/* Service */}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Service Charge (%)</label>
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    type="number"
                    min="0"
                    step="0.1"
                    value={bill.serviceRate}
                    onChange={onServiceRateChange}
                />
            </div>

            {/* order preset */}
            <div>
                <label className="block text-sm font-medium mb-1">Calculate order</label>
                <select 
                    className="w-full rounded-xl border px-3 py-2"
                    value={bill.calculationPreset}
                    onChange={(e) => dispatch(setCalculationPreset(e.target.value))}
                >
                    <option value="DISC_FIRST">Discount → Service → VAT </option>
                    <option value="SERVICE_FIRST">Service → Discount → VAT </option>

                </select>

                <p className="mt-2 text-xs opacity-70">
                     Different restaurants apply discounts differently. This lets you match the receipt.
                </p>
            </div>
        </section>
    );

}