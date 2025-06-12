'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управление настройками системы
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
              <CardDescription>
                Настройки основного функционала системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Название сайта</Label>
                <Input id="siteName" defaultValue="АЗС" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Описание сайта</Label>
                <Input id="siteDescription" defaultValue="Сеть автозаправочных станций" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance">Режим обслуживания</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>
                Управление системой уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="emailNotifications" defaultChecked />
                <Label htmlFor="emailNotifications">Email уведомления</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smsNotifications" />
                <Label htmlFor="smsNotifications">SMS уведомления</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="pushNotifications" defaultChecked />
                <Label htmlFor="pushNotifications">Push уведомления</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
              <CardDescription>
                Управление безопасностью системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Таймаут сессии (минуты)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="twoFactor" />
                <Label htmlFor="twoFactor">Двухфакторная аутентификация</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="ipRestriction" />
                <Label htmlFor="ipRestriction">Ограничение по IP</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );
} 