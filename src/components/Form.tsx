import { Dispatch, useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { categories } from "../data/categories"
import { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activityReducer"
import { useActivity } from "../hooks/useActivity"



const initialState: Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
};

export default function Form() {

    const { state,dispatch } = useActivity()
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if (state.activeId) {
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category', 'calories'].includes(e.target.id);

        setActivity({
            ...activity, [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })

    }

    const isValidActivity = () => {
        const { name, calories } = activity;
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({ type: 'save-activity', payload: { newActivity: activity } })
        setActivity({ ...initialState, id: uuidv4() })
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow p-10 rounded-lg">
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categoria:</label>
                <select className="border border-slate-300 p-2 rounded-lg w-full bg-white" id="category"
                    value={activity.category} onChange={handleChange}>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input id="name" onChange={handleChange} value={activity.name} type="text" className="border border-slate-50-300 p-2 rounded-lg" placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"></input>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias:</label>
                <input id="calories" onChange={handleChange} value={activity.calories} type="number" className="border border-slate-50-300 p-2 rounded-lg" placeholder="Calorias. Ej. 300 o 500"></input>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <input type="submit" className="bg-gray-800 disabled:opacity-10 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer"
                    disabled={!isValidActivity()}
                    value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}></input>
            </div>
        </form>
    )
}
