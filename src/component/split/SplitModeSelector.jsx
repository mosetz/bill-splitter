import { useDispatch, useSelector } from "react-redux";
import { setSplitMode } from "../../features/bill/billSlice";

export default function SplitModeSelector () {

    const dispatch = useDispatch;
    const splitMode = useSelector((state) => state.bill.splitMode);

    return (
        <section className="rounded-2xl border p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Split Mode</h2>

            <div className="space-y-2">
                <label className="flex items-center gap-2">
                    <input 
                        type="radio"
                        checked={splitMode === "EQUAL"} 
                        onChange={() => dispatch(setSplitMode("EQUAL"))}
                    />
                    <span>Split equally</span>
                </label>

                <label className="flex items-center gap-2">
                    <input 
                        type="radio"
                        checked={splitMode === "BY_ITEM"} 
                        onChange={() => dispatch(setSplitMode("BY_ITEM"))}
                    />
                    <span>Split by item</span>
                </label>
            </div>
        </section>
    )
}