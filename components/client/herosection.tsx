import { Button } from '../ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Заправляйтесь выгодно с нашей сетью АЗС
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Лучшие цены на топливо, акции и программа лояльности для наших клиентов
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-background text-primary hover:bg-background/90 px-8 py-4 text-lg">
            <Link href="/stations">
              Найти АЗС
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg">
            <Link href="/promotions">
              Узнать акции
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}