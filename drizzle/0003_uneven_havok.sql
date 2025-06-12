CREATE TABLE `support_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_id` int NOT NULL,
	`user_id` int,
	`message` text NOT NULL,
	`is_internal` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `support_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`subject` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'new',
	`priority` varchar(20) NOT NULL DEFAULT 'normal',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reviews` ADD `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `reviews` ADD `is_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `reviews` ADD `response` text;--> statement-breakpoint
ALTER TABLE `reviews` ADD `response_date` timestamp;--> statement-breakpoint
ALTER TABLE `support_responses` ADD CONSTRAINT `support_responses_ticket_id_support_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `support_responses` ADD CONSTRAINT `support_responses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;