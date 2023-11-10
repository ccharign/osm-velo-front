import Base from "../../src/layouts/base"
import { useState } from "react";
import L from "leaflet";
import FormItinéraires from "../composants/forms/FormItinéraires.tsx";
import FormContribuer from "../composants/forms/FormContribuer.tsx";
import { Lieu, Étape } from "../classes/lieux.ts";
import { Nav } from "react-bootstrap";
import { tClefTiroir, tTiroir, tTiroirOuvert } from "../classes/types.ts";
import CarteItinéraires from "../composants/organismes/CarteItinéraire.tsx";
import { contexte_iti } from "../composants/contextes/page-itinéraire.ts";
import { Itinéraire } from "../classes/Itinéraire.ts";
import Tiroir from "../composants/atomes/Tiroir.tsx";


////////////////////////////////////////
/* Page principale de l’appli.*/
////////////////////////////////////////


type propsItinéraires = {
    fouine?: boolean
};

/* type pourAutocomplète = {
*     value: LieuJson | null,
*     setValue: React.Dispatch<React.SetStateAction<LieuJson | null>>,
*     inputVAlue: string,
*     setInputValue: React.Dispatch<React.SetStateAction<string>>,
*     étape: Étape | undefined,
*     setÉtape: React.Dispatch<React.SetStateAction<Étape | undefined>>,
* }
*  */

const clefs_tiroirs: tClefTiroir[] = ["recherche", "contribuer", "stats"];

type tTiroirs = {
    recherche: tTiroir,
    contribuer: tTiroir,
    stats: tTiroir,
}


const tiroirs: tTiroirs =
{
    recherche: { nom: "Modifier la recherche", ancre: "left", contenu: "" },
    contribuer: { nom: "Contribuer", ancre: "top", contenu: "" },
    stats: { nom: "Stats", ancre: "right", contenu: "Un jour il y aura ici les stats sur les itinéraires proposés" },
}

const itinéraires: Itinéraire[] = [];






export default function Itinéraires({ fouine }: propsItinéraires) {

    const [carte, setCarte] = useState<L.Map | null>(null);
    const [zone, setZone] = useState<string>("");
    const [toutes_les_étapes, setToutesLesÉtapes] = useState<Étape[]>([]);
    const [iti_en_chargement, setItiEnChargement] = useState(false);
    const [tiroir_ouvert, setTiroirOuvert] = useState<tTiroirOuvert>(
        new Map(clefs_tiroirs.map(clef => [clef, clef === "recherche"]))  // Initialement, seule la barre de recherche est ouverte.
    );


    // Renvoie la fonction qui ouvre ou ferme le tiroir associé à la clef
    function toggleTiroir(clef: tClefTiroir): () => void {
        return () =>
            setTiroirOuvert(
                prev => new Map(prev.set(clef, !prev.get(clef)))
            )
    }

    function setTiroir(clef: tClefTiroir, ouvert: boolean) {
        setTiroirOuvert(
            prev => new Map(prev.set(clef, ouvert))
        )
    }


    // Le tiroir « Recherche »
    tiroirs.recherche.contenu =
        carte &&
        <FormItinéraires
            setZone={setZone}
            setToutesLesÉtapes={setToutesLesÉtapes}
            setItiEnChargement={setItiEnChargement}
            iti_en_chargement={iti_en_chargement}
            setTiroir={setTiroir}
        />;


    // Le tiroir « Contribuer »
    tiroirs.contribuer.contenu =
        toutes_les_étapes.length > 1 && toutes_les_étapes.every(é => é instanceof Lieu) &&
        // Affichage de la partie « Contribuer » ssi départ et arrivée remplis
        <FormContribuer
        />;



    // La barre pour ouvrir et fermer les tiroirs
    const barreTiroirs =
        <Nav fill>
            {
                clefs_tiroirs.map(
                    clef =>
                        <Tiroir
                            key={clef}
                            clef={clef}
                            tiroir={tiroirs[clef]}
                            toggleTiroir={toggleTiroir}
                            tiroir_ouvert={tiroir_ouvert}
                            contenu={tiroirs[clef].contenu}
                        />

                )
            }
        </Nav >;

    const contexte = {
        carte: carte,
        itis: itinéraires,
        zone: zone,
        toutes_les_étapes: toutes_les_étapes,
        itinéraires: itinéraires,
    }

    return (

        <Base>
            <contexte_iti.Provider
                value={contexte}
            >

                {barreTiroirs}

                <CarteItinéraires
                    setCarte={setCarte}
                />

            </contexte_iti.Provider>
        </Base >
    )
}
