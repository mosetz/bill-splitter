import { useMemo, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { addPerson, removePerson } from "../features/people/peopleSlice";
import { addItem, removeItem, incrementQty, decrementQty, setItemSplitMode, assignItemToPerson } from "../features/items/itemSlice";
import BillSetting from "../component/bill/BillSetting";
import SplitModeSelector from "../component/split/SplitModeSelector";
export default function Home() {
    
    const dispatch = useDispatch()
    const people = useSelector((state) => state.people.list);
    const items = useSelector((state) => state.items.list);
    const billSplitMode = useSelector((state) => state.bill.splitMode)

    //people form
    const  [personName, setPersonName] = useState('');

    //item form
    const [itemName, setItemName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [qty, setQty] = useState("1");

    const canAddPerson = personName.trim().length > 0;

    /**
     * This hook use for control wether the button should be disable or enable
     * It check if the input form is current valid if "true" it enable if "false" it disable
     * If one of these state are not valid it always return false 
     */
    const canAddItem = useMemo(() => {
        const nameOk = itemName.trim().length > 0;
        const priceNum = Number(unitPrice);
        const qtyNum = Number(qty);
        return nameOk && Number.isFinite(priceNum) && priceNum > 0 && Number.isFinite(qtyNum) && qtyNum >= 1;
    }, [itemName, unitPrice, qty])

    const handleAddPerson = () => {
        if (!canAddPerson) return
        dispatch(addPerson(personName.trim()));
        setPersonName('');
    };

    const handleAddItem = () => {
        if (!canAddItem) return
        dispatch(addItem({
                name: itemName.trim(),
                unitPrice: Number(unitPrice),
                qty: Number(qty)
            })
        );
        setItemName('');
        setUnitPrice('');
        setQty('1');
    }

    const handleRemovePerson = (id) => {
        dispatch(removePerson(id));
    }

    const handleRemoveItems = (id) => {
        dispatch(removeItem(id))
    }

    const handleIncreaseQty = (id) => {
        dispatch(incrementQty(id))
    }

    const handleDecrementQty = (id) => {
        dispatch(decrementQty(id))
    }
    
    return (
        
            <div className="min-h-screen p-4 md:p-8 ">     
                <div className="mx-auto max-w-6xl">
                    <header className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold">Bill Splitter</h1>
                        <p className="text-sm opacity-70">Add people and item first. We'll calculate split totals next.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* People Section*/}
                        <section className="rounded-2xl border p-4 shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">People</h2>

                            <div className="flex gap-2">
                                <input type="text" 
                                    className="w-full rounded-xl border px-4 py-2"
                                    placeholder="e.g. John"
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") handleAddPerson();
                                    }}
                                />
                                <button 
                                    className="rounded-xl border px-3 py-2 font-medium disabled:opacity-40"
                                    disabled={!canAddPerson}
                                    onClick={handleAddPerson}
                                >
                                    Add
                                </button>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                                {people.length === 0 ? (
                                    <p className="text-sm opacity-60">No people yet</p>
                                ) : (
                                    people.map((p) => (
                                        <div key={p.id} className="flex item-center justify-between rounded-xl border px-3 py-2">
                                            <span className="truncate">{p.name}</span>
                                            <button
                                                className="text-sm underline opacity-80 hover:opacity-100"
                                                onClick={() => handleRemovePerson(p.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Item section */}
                        <section className="rounded-2xl border p-4 shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">Items</h2>

                            <div className="space-y-2">
                                <input type="text" 
                                    className="w-full rounded-xl border px-3 py-2"
                                    placeholder="Item name (e.g. Pizza)"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    <input type="text" 
                                        className="w-1/2 rounded-xl border px-3 py-2"
                                        placeholder="Price"
                                        inputMode="decimal"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(e.target.value)}
                                    />

                                    <input type="number" 
                                        className="w-1/2 rounded-xl border px-3 py-2"
                                        placeholder="Qty"
                                        inputMode="numeric"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                </div>
                                
                                <button 
                                    className="w-full rounded-xl border px-3 py-2 font-medium disabled:opacity-40"
                                    disabled={!canAddItem}
                                    onClick={handleAddItem}
                                >
                                    Add Item
                                </button>
                            </div>

                            <div className="mt-2 space-y-2">
                                {items.length === 0 ? (
                                    <p className="text-sm opacity-60">No Items yet.</p>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="rounded-xl border px-3 py-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{item.name}</p>
                                                    <p className="text-sm opacity-70">
                                                        {item.unitPrice.toFixed(2)} THB x {item.qty}
                                                    </p>
                                                </div>
                                                <button
                                                    className="text-sm underline opacity-80 hover:opacity-100"
                                                    onClick={() => handleRemoveItems(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Split mode section */}
                                            {billSplitMode === "BY_ITEM" && (
                                                <div className="mt-2 space-y-2">
                                                    <select
                                                        className="w-full rounded-xl border px-3 py-2"
                                                        value={item.splitMode}
                                                        onChange={(e) => dispatch(setItemSplitMode({id: item.id, splitMode: e.target.value}))}
                                                    >
                                                        <option value="SHARED" name="itemSplitMode">Shared by everyone</option>
                                                        <option value="ASSIGNED" name="itemSplitMode">Assigned to one person</option>
                                                    </select>

                                                    {item.splitMode === "ASSIGNED" && (
                                                        <select
                                                            className="w-full rounded-xl border px-3 py-2"
                                                            value={item.assignedTo ?? ""}
                                                            onChange={(e) => dispatch(assignItemToPerson({itemId: item.id, personId: e.target.value}))}
                                                        >
                                                            <option value="" disabled>Select person</option>
                                                            {people.map((p) => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    className="rounded-xl border px-3 py-1"
                                                    onClick={() => handleDecrementQty(item.id)}
                                                >
                                                    -
                                                </button>
                                                <span className="min-w-8 text-center">{item.qty}</span>
                                                <button
                                                    className="rounded-xl border px-3 py-1"
                                                    onClick={() => handleIncreaseQty(item.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </section>

                        {/* Result placeholder */}
                        <BillSetting />
                        <SplitModeSelector />
                    </div>
                </div>
            </div>
    );
}




