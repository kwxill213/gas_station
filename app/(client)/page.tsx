'use client';
import HeroSection from "@/components/client/herosection";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, Shield, Percent } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useData } from "@/lib/hooks/useData";

interface Promotion {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stationId: number | null;
  discountValue: number | null;
  isActive: boolean;
  imageUrl: string | null;
  station?: {
    name: string;
    address: string;
  };
}

export default function Home() {
  const { data: promotions } = useData<Promotion>({ endpoint: 'promotions' });

  const activePromotions = promotions?.filter(promo => promo.isActive).slice(0, 3) || [];

  const features = [
    {
      icon: <Fuel className="h-8 w-8 text-primary" />,
      title: "Широкий выбор топлива",
      description: "АИ-92, АИ-95, АИ-98, ДТ, Газ и другие виды топлива"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Круглосуточная работа",
      description: "Большинство наших АЗС работают 24/7"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Гарантия качества",
      description: "Все топливо проходит строгий контроль качества"
    },
    {
      icon: <Percent className="h-8 w-8 text-primary" />,
      title: "Выгодные акции",
      description: "Регулярные скидки и специальные предложения"
    }
  ];

  return (
    <div className="pb-12">
      <HeroSection />
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему выбирают нас?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наша сеть АЗС предлагает лучшие условия для автомобилистов
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {activePromotions.length > 0 && (
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Актуальные акции</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Специальные предложения и скидки на наших АЗС
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromotions.map((promo) => (
                <Card key={promo.id} className="overflow-hidden">
                  {promo.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={promo.imageUrl}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{promo.title}</CardTitle>
                    <CardDescription>
                      {promo.discountValue && (
                        <span className="text-primary font-semibold">
                          Скидка {promo.discountValue}%
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/promotions">
                <Button size="lg">
                  Все акции
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Наша сеть АЗС</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Более 50 автозаправочных станций по всему региону с лучшими ценами и сервисом
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/stations">
              <Button className="px-8 py-4 text-lg">
                Посмотреть все АЗС
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}