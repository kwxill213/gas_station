CREATE TABLE `fuel_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`station_id` int NOT NULL,
	`fuel_type_id` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `fuel_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fuel_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	`octane_number` int,
	CONSTRAINT `fuel_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gas_stations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`address` varchar(255) NOT NULL,
	`latitude` decimal(10,6) NOT NULL,
	`longitude` decimal(10,6) NOT NULL,
	`working_hours` varchar(100) NOT NULL,
	`amenities` json,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `gas_stations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`card_number` varchar(20) NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`issued_at` timestamp DEFAULT (now()),
	CONSTRAINT `loyalty_cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyalty_cards_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `loyalty_cards_card_number_unique` UNIQUE(`card_number`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`station_id` int,
	`discount_value` decimal(5,2),
	`is_active` boolean DEFAULT true,
	`image_url` varchar(255),
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`station_id` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` text,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL DEFAULT 'Пользователь',
	`phone` varchar(20),
	`role_id` int NOT NULL DEFAULT 3,
	`avatar` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `fuel_prices` ADD CONSTRAINT `fuel_prices_station_id_gas_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `gas_stations`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `fuel_prices` ADD CONSTRAINT `fuel_prices_fuel_type_id_fuel_types_id_fk` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `loyalty_cards` ADD CONSTRAINT `loyalty_cards_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_station_id_gas_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `gas_stations`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_station_id_gas_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `gas_stations`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE cascade;