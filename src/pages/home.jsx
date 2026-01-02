import { useMemo, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { addPerson, removePerson } from "../features/people/peopleSlice";
import { addItem, removeItem, incrementQty, decrementQty } from "../features/items/itemSlice";

export default function Home() {
    
    const dispatch = useDispatch()
    const people = useSelector((state) => state.people.list);
    const items = useSelector((state) => state.items.list);

    //people form
    const  [personName, setPersonName] = useState('');

    //item form
    const [itemName, setItemName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [qty, setQty] = useState(1);

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
        return nameOk && Number.isFinite(priceNum) && priceNum >= 0 && Number.isFinite(qtyNum) && qtyNum >= 0;
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
        setPersonName('');
        setQty('');
    }
    
    return (
        <>
            <div>
                <h1>This is a test</h1>
                <p>test test</p>
            </div>
        </>
    );
}



