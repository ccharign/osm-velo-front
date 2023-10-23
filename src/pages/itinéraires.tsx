import Base from "../../src/layouts/base"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carte from "../composants/carte.tsx";
import { useState } from "react";
import L from "leaflet";
import FormItinéraires from "../composants/forms/itinéraires.tsx";
import FormContribuer from "../composants/forms/contribuer.tsx";
import { Lieu } from "../classes/lieux.ts";




////////////////////////////////////////
/* Page principale de l’appli.*/
////////////////////////////////////////



export default function Itinéraires() {

    const [carte, setCarte] = useState<L.Map | null>(null);
    const [zone, setZone] = useState("");
    const [toutes_les_étapes, setToutesLesÉtapes] = useState<Lieu[]>([]);
    const [iti_en_chargement, setItiEnChargement] = useState(false);
    const [marqueurs,] = useState(new L.LayerGroup());
    const [itinéraires,] = useState(new L.LayerGroup());

    return (
        <Base>

            <Container>
                <Row className="my-3">

                    <Col md={9} >
                        <Carte carte={carte} setCarte={setCarte} layers_groups={[marqueurs, itinéraires]} />
                    </Col>

                    <Col>
                        {carte !== null
                            ? <FormItinéraires
                                marqueurs={marqueurs}
                                carte={carte}
                                itinéraires={itinéraires}
                                zone={zone}
                                setZone={setZone}
                                toutes_les_étapes={toutes_les_étapes}
                                setToutesLesÉtapes={setToutesLesÉtapes}
                                setItiEnChargement={setItiEnChargement}
                                  iti_en_chargement={iti_en_chargement}
                            />
                            : null}
                    </Col>

                </Row>
                <Row className="my-3">
                    {toutes_les_étapes.length > 2 && !iti_en_chargement ?
                        <FormContribuer
                            toutes_les_étapes={toutes_les_étapes}
                            zone={zone}
                        />
                        : null}
                </Row>
            </Container>


        </Base>
    )
}
