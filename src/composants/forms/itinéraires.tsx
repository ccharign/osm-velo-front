//import { Lieu } from "../../classes/Lieu.1";
import { useState } from "react";
import ChoixZone from "../molécules/choixZone";

export default function FormItinéraires(){

    const [zone, setZone] = useState("");

    

    
    function changeDépart(event: React.SyntheticEvent<HTMLDivElement, Event>):void {
        console.log("Valeur obtenue pour le départ", event.target)

    }

    return (
        <ChoixZone/>
    )
}
