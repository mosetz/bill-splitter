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
                    value={bill.setVatRate}
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
                            checked={bill.setVatMode === "INCLUDED"}
                            onChange={() => dispatch(setVatMode("INCLUDED"))}
                        />
                        <span className="text-sm">Included</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="vatMode"
                            checked={bill.setVatMode === "ADDED"}
                            onChange={() => dispatch(setVatMode("ADDED"))}
                        />
                        <span className="text-sm">Added</span>
                    </label>
                </div>
            </div>
        </section>
    )

}