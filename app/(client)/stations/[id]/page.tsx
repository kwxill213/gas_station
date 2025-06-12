import db from '@/drizzle';
import { gasStations } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import ReviewsSection from '@/components/client/stations/ReviewsSection';

interface StationPageProps {
  params: {
    id: string;
  };
}

export default async function StationPage({ params }: StationPageProps) {
  const stationId = parseInt((await params).id);

  const [station] = await db
    .select()
    .from(gasStations)
    .where(eq(gasStations.id, stationId))
    .limit(1);

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">АЗС не найдена</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{station.name}</h1>
      <p className="text-muted-foreground mb-8">{station.address}</p>
      <div className="grid gap-8">
        <ReviewsSection stationId={station.id.toString()} />
      </div>
    </div>
  );
} 