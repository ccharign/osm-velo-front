import { FormEvent, useContext, useEffect, useState } from "react";
import ChoixZone from "../molécules/choixZone";
import AutoComplèteDistant from "../molécules/autoComplèteDistant"
import { Étape, Lieu } from "../../classes/lieux";
import { ÉtapeClic } from "../../classes/ÉtapeClic";
import {  tClefTiroir } from "../../classes/types";
//import SwapVertIcon from '@mui/icons-material/SwapVert';

import L from "leaflet";
import { Container, Row, Col } from "react-bootstrap";
import { iconeFa } from "../../classes/iconeFa";
import { contexte_iti } from "../contextes/page-itinéraire";
import BoutonEnvoi from "../molécules/BoutonEnvoi";


export type propsFormItinéraires = {
    setZone: React.Dispatch<React.SetStateAction<string>>,
    setToutesLesÉtapes: React.Dispatch<React.SetStateAction<Étape[]>>,
    setItiEnChargement: React.Dispatch<React.SetStateAction<boolean>>,
    iti_en_chargement: boolean,
}



export default function FormItinéraires(
    { setZone, setToutesLesÉtapes, setItiEnChargement, iti_en_chargement }:
        propsFormItinéraires) {

    const { zone, carte } = useContext(contexte_iti);

    const [étapes_clic, setÉtapesClic] = useState<ÉtapeClic[]>([]);  // étapes créées par clic
    const [départ, setDépart] = useState<Étape | undefined>(undefined);
    const [arrivée, setArrivée] = useState<Étape | undefined>(undefined);
    const [étapes_pas_clic, setÉtapePasClic] = useState<Étape | undefined>(undefined);
    const [données_modifiées, setDonnéesModifiées] = useState(true); // Indique si des modifs ont été faites depuis le dernier calcul d’itinéraire







    // Change l’icone pour le départ
    useEffect(
        () => {
            if (départ instanceof Lieu && départ.leaflet_layer instanceof L.Marker) {
                départ.leaflet_layer.setIcon(iconeFa("bicycle"));
            }
        }
    )


    // Lance la gestion des clics
    // TODO sans doute simplifiable !
    useEffect(
        () => {
            if (carte && départ instanceof Lieu && arrivée instanceof Lieu && étapes_pas_clic === undefined) {
                carte.off("click");
                carte.on(
                    "click",
                    e => {
                        setDonnéesModifiées(true);
                        new ÉtapeClic(
                            e.latlng,
                            [départ, ...étapes_clic, arrivée],
                            setÉtapesClic,
                            carte,
                            setDonnéesModifiées
                        );
                    },
                )
            } else if (carte) {
                carte.off("click");
            }
        },
        [carte, étapes_clic] // étapes change dès que départ ou arrivée change -> inutile de mettre ceux-ci dans les déps
    )



    /* function inverseÉtapes(_event: any): void {
*     setDépart(arrivée);
*     setArrivée(départ);
*     setÉtapes(prev=> {
*         prev.reverse();
*         màjNumérosÉtapes(prev);
*         return prev;
*     });
* }
     */

    const propsDesAutocomplètes = {
        étapes_clic: étapes_clic,
        setÉtapesClic: setÉtapesClic,
        setDonnéesModifiées: setDonnéesModifiées,
    }

    return (
        <form >
            <Container>


                <Row className="my-3">
                    <Col>
                        <ChoixZone
                            setZone={setZone}
                            zone={zone}
                        />
                    </Col>
                </Row>


                <Row className="my-3">


                    <AutoComplèteDistant
                        {...propsDesAutocomplètes}
                        étape={départ}
                        setÉtape={setDépart}
                        label="Départ"
                        placeHolder="2 rue bidule, mon café, ..."
                    />

                    {/* <IconButton
                            onClick={inverseÉtapes}
                        >
                            <SwapVertIcon />
                        </IconButton> */}

                    <AutoComplèteDistant
                        {...propsDesAutocomplètes}
                        étape={arrivée}
                        setÉtape={setArrivée}
                        label="Arrivée"
                        placeHolder="une boulangerie, 3 rue truc, ..."
                    />

                </Row>


                <Row className="my-3">
                    <Col >
                        <BoutonEnvoi
                            disabled={!départ || !arrivée || !données_modifiées}
                            texte=" C’est parti !"
                        />
                    </Col>
                </Row>

                <Row>
                    <AutoComplèteDistant
                        {...propsDesAutocomplètes}
                        étape={étapes_pas_clic}
                        setÉtape={setÉtapePasClic}
                        label="(Option) passer par un(e):"
                        placeHolder="Essayer 'boulangerie', 'lieu où', ..."
                    />
                </Row>

            </Container>
        </form>
    );
}
