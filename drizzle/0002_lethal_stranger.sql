DROP INDEX "balance_account_name_user_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "category_name_user_id_idx" ON "balance_account" USING btree ("name","user_id");