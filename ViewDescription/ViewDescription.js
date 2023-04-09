import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Button, Modal, Row, Col } from 'reactstrap';
import viewBook from "./viewBook.jpeg";
import "./ViewDescription.css";

function ViewDescription(props) {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const externalCloseBtn = (
        <button
            type="button"
            className="close"
            style={{ position: 'absolute', top: '15px', right: '15px' }}
            onClick={toggle}
        >
            &times;
        </button>
    );
    return (
        <div>
            <Button color="danger" onClick={toggle}>
                Click Me
            </Button>
            <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn} className="modal-lg">

                <Row>
                    <Col md='4' className="leftCol">
                    </Col>
                    <Col className='box overlay'>
                        <img alt="Book card image"
                            src={viewBook}
                            top
                            height="100%" width="80%" />
                    </Col>
                    <Col md='6' className="rightCol">
                            <div className="bookTitle">
                                Forty Rules of Love
                            </div>
                            <div className="text">
                                Description:
                            </div>
                            <div className="text">
                                The Forty Rules of Love is a novel written by the Turkish author Elif Shafak.
                                Her interest in writing this book was influenced by the degree she received in Gender and Women’s Studies.
                                The book was published in March 2009. It is about Maulana Jalal-Ud-Din, known as Rumi and his companion Shams Tabrizi.
                            </div>
                            <Button color="secondary" onClick={toggle} className="gradient-button">
                                Close
                            </Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

export default ViewDescription;