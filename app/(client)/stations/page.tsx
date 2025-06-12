'use client';

import { useState, useRef } from 'react';
import StationsMap from '@/components/client/stations/StationsMap';
import FuelPricesSection from '@/components/client/stations/FuelPricesSection';
import PromotionsSection from '@/components/client/stations/PromotionsSection';
import ReviewsSection from '@/components/client/stations/ReviewsSection';
import FuelCalculator from '@/components/client/stations/FuelCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StationsPage() {
  const [selectedStation, setSelectedStation] = useState<{ id: number; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('prices');
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleStationSelect = (station: { id: number; name: string } | null) => {
    setSelectedStation(station);
    if (station) {
      setActiveTab('reviews');
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Наши АЗС</h1>
      
      <div className="mb-12">
        <StationsMap onStationSelect={handleStationSelect} />
      </div>

      <div className="mb-12">
        <FuelCalculator />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" ref={tabsRef}>
        <TabsList>
          <TabsTrigger value="prices">Цены на топливо</TabsTrigger>
          <TabsTrigger value="promotions">Акции</TabsTrigger>
          {selectedStation && (
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          )} 
        </TabsList>

        <TabsContent value="prices">
          <div className="bg-card rounded-lg border p-6">
            <FuelPricesSection />
          </div>
        </TabsContent>

        <TabsContent value="promotions">
          <div className="bg-card rounded-lg border p-6">
            <PromotionsSection />
          </div>
        </TabsContent>

        {selectedStation && (
          <TabsContent value="reviews">
            <div className="bg-card rounded-lg border p-6">
              <ReviewsSection
                stationId={selectedStation.id.toString()}
                stationName={selectedStation.name}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}