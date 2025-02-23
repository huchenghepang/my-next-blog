/*
  Warnings:

  - You are about to alter the column `category_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[id]` on the table `article_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `category_id`;

-- AlterTable
ALTER TABLE `notes` MODIFY `category_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `category_id` ON `article_categories`(`id`);

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `n_and_category_name` FOREIGN KEY (`category_id`) REFERENCES `article_categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
