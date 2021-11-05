import {Modal, Container, Row, Col, Button, Form} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';


const FormModal = (props) => {
    const [state, setState] = useState(props.inputbook());
    const handleChange = (evt) => {
            setState({ ...state, [evt.target.id]: evt.target.value });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log('STATE',state);
        props.bookfacade.editBook(state.id,state);
        props.setbook(state);
        props.onHide();
        //setState(props.inputbook());
    }


    useEffect(() => {
        setState(props.inputbook());
      },[props.inputbook()]);

    return (
      <Modal show={props.show}
      aria-labelledby="contained-modal-title-vcenter" 
    // centered //Try these 2 settings out
    // fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
          <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={state.title} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="info">
                        <Form.Label>Info</Form.Label>
                        <Form.Control type="text" value={state.info} onChange={handleChange} />
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={
              ()=>{
                  setState(props.inputbook());
                  props.onHide()
              }}>Close
              </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default FormModal;