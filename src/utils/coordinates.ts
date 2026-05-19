import type { LocationRead, Shipment } from "../types/shipment";

export function hasValidCoordinates(location: LocationRead | null | undefined) {
  if (!location || location.latitude === null || location.longitude === null) {
    return false;
  }

  if (location.latitude === 0 && location.longitude === 0) {
    return false;
  }

  return Math.abs(location.latitude) <= 90 && Math.abs(location.longitude) <= 180;
}

export function getMappableShipments(shipments: Shipment[]) {
  return shipments.filter((shipment) => hasValidCoordinates(shipment.current_location));
}
