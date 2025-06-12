'use client';

import { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { Fuel } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from '@/lib/api';

type Station = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  workingHours: string;
  amenities: string[];
  fuelPrices: {
    fuelTypeId: number;
    fuelTypeName: string;
    price: string;
  }[];
};

type StationsMapProps = {
  onStationSelect: (station: { id: number; name: string }) => void;
};

export default function StationsMap({ onStationSelect }: StationsMapProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('/stations');
        setStations(response.data);
      } catch (err) {
        setError('Failed to load stations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <YMaps>
          <Map
            defaultState={{
              center: [55.7558, 37.6173], // Москва
              zoom: 10,
            }}
            width="100%"
            height="100%"
          >
            {stations.map((station) => (
                
              <Placemark
                key={station.id}
                geometry={[station.latitude, station.longitude]}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: '/fuel.svg',
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -40],
                }}
                onClick={() => setSelectedStation(station)}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/* Модальное окно с информацией о станции */}
      <Dialog open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
        <DialogContent className="max-w-2xl">
          {selectedStation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Fuel className="h-6 w-6 text-primary" />
                  {selectedStation.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Адрес</h3>
                  <p className="text-muted-foreground">{selectedStation.address}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Часы работы</h3>
                  <p className="text-muted-foreground">{selectedStation.workingHours}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Удобства</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStation.amenities?.map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Цены на топливо</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStation.fuelPrices.map((fuel) => (
                      <div
                        key={fuel.fuelTypeId}
                        className="p-3 bg-secondary rounded-lg"
                      >
                        <p className="font-medium">{fuel.fuelTypeName}</p>
                        <p className="text-2xl font-bold text-primary">
                          {Number(fuel.price).toFixed(2)} ₽/л
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      onStationSelect({ id: selectedStation.id, name: selectedStation.name });
                      setSelectedStation(null);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Смотреть отзывы
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 