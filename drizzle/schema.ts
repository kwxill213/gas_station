// drizzle/schema.ts
import { mysqlTable, int, varchar, text, timestamp, decimal, json, boolean, datetime } from "drizzle-orm/mysql-core";

export const roles = mysqlTable('roles', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 20 }).notNull().unique(),
    description: text('description'),
});

export const users = mysqlTable('users', {
    id: int('id').autoincrement().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }).notNull().default("Пользователь"),
    phone: varchar('phone', { length: 20 }).unique(),
    roleId: int('role_id').notNull().references(() => roles.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }).default(1),
    avatar: varchar('avatar', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const fuelTypes = mysqlTable('fuel_types', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    description: text('description'),
    octaneNumber: int('octane_number'),
});

export const gasStations = mysqlTable('gas_stations', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 6 }).notNull(),
    longitude: decimal('longitude', { precision: 10, scale: 6 }).notNull(),
    workingHours: varchar('working_hours', { length: 100 }).notNull(),
    amenities: json('amenities'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const fuelPrices = mysqlTable('fuel_prices', {
    id: int('id').autoincrement().primaryKey(),
    stationId: int('station_id').notNull().references(() => gasStations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    fuelTypeId: int('fuel_type_id').notNull().references(() => fuelTypes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const promotions = mysqlTable('promotions', {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description'),
    startDate: datetime('start_date').notNull(),
    endDate: datetime('end_date').notNull(),
    stationId: int('station_id').references(() => gasStations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    discountValue: decimal('discount_value', { precision: 5, scale: 2 }),
    isActive: boolean('is_active').default(true),
    imageUrl: varchar('image_url', { length: 255 }),
});

export const reviews = mysqlTable('reviews', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    stationId: int('station_id').notNull().references(() => gasStations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    rating: int('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    isVerified: boolean('is_verified').default(false),
    response: text('response'),
    responseDate: timestamp('response_date'),
});

export const loyaltyCards = mysqlTable('loyalty_cards', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }).unique(),
    cardNumber: varchar('card_number', { length: 20 }).notNull().unique(),
    points: int('points').notNull().default(0),
    level: int('level').notNull().default(1),
    issuedAt: timestamp('issued_at').defaultNow(),
});

export const transactions = mysqlTable('transactions', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    stationId: int('station_id').notNull().references(() => gasStations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    fuelTypeId: int('fuel_type_id').notNull().references(() => fuelTypes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    volume: decimal('volume', { precision: 10, scale: 2 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(), // цена за литр
    total: decimal('total', { precision: 10, scale: 2 }).notNull(), // итоговая сумма
    pointsUsed: int('points_used').default(0), // использовано баллов
    createdAt: timestamp('created_at').defaultNow(),
});

export const supportTickets = mysqlTable('support_tickets', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id').references(() => users.id, {
        onDelete: 'set null',
        onUpdate: 'cascade'
    }),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    subject: varchar('subject', { length: 200 }).notNull(),
    message: text('message').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('new'),
    priority: varchar('priority', { length: 20 }).notNull().default('normal'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const supportResponses = mysqlTable('support_responses', {
    id: int('id').autoincrement().primaryKey(),
    ticketId: int('ticket_id').notNull().references(() => supportTickets.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    userId: int('user_id').references(() => users.id, {
        onDelete: 'set null',
        onUpdate: 'cascade'
    }),
    message: text('message').notNull(),
    isInternal: boolean('is_internal').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});