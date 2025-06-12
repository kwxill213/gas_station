import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">О компании</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Наша миссия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Мы стремимся обеспечить наших клиентов качественным топливом и отличным сервисом на каждой заправке.
              Наша цель - сделать процесс заправки максимально удобным и безопасным для каждого клиента.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Наши преимущества</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Качественное топливо от проверенных поставщиков</li>
              <li>Современное оборудование и регулярное обслуживание</li>
              <li>Удобное расположение АЗС</li>
              <li>Программа лояльности для постоянных клиентов</li>
              <li>Профессиональный персонал</li>
              <li>Круглосуточная работа большинства АЗС</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>История компании</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Наша компания начала свою деятельность в 2010 году с открытия первой АЗС.
              За это время мы выросли в крупную сеть, обслуживающую тысячи клиентов ежедневно.
              Мы постоянно развиваемся, внедряем новые технологии и улучшаем качество обслуживания.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Наши ценности</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Качество и безопасность превыше всего</li>
              <li>Клиентоориентированность</li>
              <li>Ответственность перед обществом и экологией</li>
              <li>Непрерывное развитие и инновации</li>
              <li>Честность и прозрачность в работе</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 