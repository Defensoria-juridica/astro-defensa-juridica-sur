import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    height?: string;
}

export default function LeafletMap({
    latitude,
    longitude,
    zoom = 16,
    height = "450px",
}: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // Solo inicializar si no existe el mapa y el ref está disponible
        if (!mapRef.current || mapInstanceRef.current) return;

        // Crear el mapa
        const map = L.map(mapRef.current).setView([latitude, longitude], zoom);

        // Agregar tiles de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Crear un ícono personalizado con SVG del MapPin de Lucide
        const customIcon = L.divIcon({
            html: `
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="#c18f59"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"
                >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            `,
            className: "custom-map-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        // Agregar marcador con popup
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Montserrat Variable', sans-serif;">
                <strong style="color: #c18f59; font-size: 14px;">Estudio Jurídico</strong>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #212529;">
                    O'higgins 167, Edificio Plaza<br/>
                    Oficina 706, Puerto Montt
                </p>
            </div>
        `);

        mapInstanceRef.current = map;

        // Cleanup al desmontar
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, zoom]);

    return (
        <div
            ref={mapRef}
            style={{
                height: height,
                width: "100%",
                borderRadius: "8px",
                zIndex: 1,
            }}
        />
    );
}
