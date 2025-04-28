

import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { ModalDesinscripcionProps } from "../../../types/ExamenesTypes";

export const ModalDesinscripcion = ({
  mostrarConfirmacion,
  setMostrarConfirmacion,
  inscripcionAEliminar,
  handleDesinscripcion,
  cargando,
}: ModalDesinscripcionProps) => {
  const cerrarModal = () => setMostrarConfirmacion(false);

  return (
    <Modal show={mostrarConfirmacion} onHide={cerrarModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar desinscripción</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro que deseas desinscribirte de{" "}
        <strong>{inscripcionAEliminar?.materiaNombre}</strong> -{" "}
        {inscripcionAEliminar?.mesaNombre}?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cerrarModal}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleDesinscripcion}
          disabled={cargando}
          className="d-flex align-items-center"
        >
          {cargando ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              <span>Procesando...</span>
            </>
          ) : (
            "Confirmar desinscripción"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
