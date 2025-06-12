import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">АЗС Сеть</h3>
            <p className="text-muted-foreground">
              Крупнейшая сеть автозаправочных станций в регионе
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Телефон: +7 (XXX) XXX-XX-XX</li>
              <li>Email: info@azs-network.ru</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Главная</Link></li>
              <li><Link href="/stations" className="text-muted-foreground hover:text-foreground">АЗС и цены</Link></li>
              <li><Link href="/promotions" className="text-muted-foreground hover:text-foreground">Акции</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Подписаться</h4>
            <p className="text-muted-foreground mb-4">
              Будьте в курсе наших акций и новостей
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} АЗС Сеть. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}