

import React from "react";
import { Alert } from "react-bootstrap";
import { NotificacionesExamenProps } from "../../../types/ExamenesTypes";

export const NotificacionesExamen = ({
  error,
  setError,
  exito,
  setExito,
}: NotificacionesExamenProps) => {
  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {exito && (
        <Alert variant="success" dismissible onClose={() => setExito(null)}>
          {exito}
        </Alert>
      )}
    </>
  );
};
