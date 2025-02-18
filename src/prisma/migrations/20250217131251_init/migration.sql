/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Permissions` (
    `permission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `permission_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `type` ENUM('route', 'button') NOT NULL,
    `parent_id` INTEGER NULL,
    `can_delete` BOOLEAN NULL DEFAULT true,
    `permission_value` VARCHAR(40) NULL,

    UNIQUE INDEX `permission_name`(`permission_name`),
    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermissions` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    INDEX `permission_id`(`permission_id`),
    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `role_name`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoles` (
    `user_id` VARCHAR(255) NOT NULL,
    `role_id` INTEGER NOT NULL,

    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,
    `level` TINYINT NOT NULL,
    `slug` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `cayegories_name`(`name`),
    INDEX `id`(`id`),
    PRIMARY KEY (`id`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment_likes` (
    `like_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` CHAR(255) NOT NULL,
    `comment_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_id`(`user_id`, `comment_id`),
    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files_info` (
    `file_name` VARCHAR(255) NOT NULL,
    `file_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_path` VARCHAR(255) NOT NULL,
    `file_ext` VARCHAR(10) NOT NULL,
    `upload_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `file_type` VARCHAR(100) NOT NULL,
    `file_size` BIGINT NOT NULL,
    `file_fullname` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NULL,
    `hash` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'inactive', 'deleted') NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note_tags` (
    `note_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    INDEX `tag_id`(`tag_id`),
    PRIMARY KEY (`note_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `file_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_time` DATETIME(0) NOT NULL,
    `is_archive` BOOLEAN NOT NULL DEFAULT false,
    `summary` TEXT NULL,
    `toc` JSON NULL,
    `reading` INTEGER NOT NULL DEFAULT 0,
    `updated_time` DATETIME(0) NULL,
    `comment_count` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `file_id`(`file_id`),
    INDEX `category_id`(`category_id`),
    INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` VARCHAR(128) NOT NULL,
    `expires` INTEGER UNSIGNED NOT NULL,
    `data` MEDIUMTEXT NULL,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_comments` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `comment_id` INTEGER UNSIGNED NOT NULL,
    `liked` ENUM('false', 'true') NOT NULL DEFAULT 'false',
    `report` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `commented` ENUM('true', 'false') NOT NULL,

    INDEX `user_comment_id`(`comment_id`),
    INDEX `user_comment_user_id`(`user_id`),
    PRIMARY KEY (`id`, `user_id`, `comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `comment_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL DEFAULT 0,
    `content` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `status` ENUM('pending', 'approved', 'rejected') NULL DEFAULT 'pending',
    `like_count` INTEGER UNSIGNED NULL DEFAULT 0,
    `reply_count` INTEGER UNSIGNED NULL DEFAULT 0,

    UNIQUE INDEX `comments_comment_id_key`(`comment_id`),
    INDEX `article_id`(`article_id`),
    INDEX `comment_id`(`comment_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`comment_id`, `article_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_info` (
    `index` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL DEFAULT '',
    `account` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `register_datetime` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_login` TINYINT NOT NULL DEFAULT 0,
    `is_delete` TINYINT NOT NULL DEFAULT 0,
    `username` VARCHAR(255) NOT NULL DEFAULT '未知',
    `role` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `signature` VARCHAR(255) NULL,

    UNIQUE INDEX `index`(`index`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Permissions`(`permission_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `RolePermissions` ADD CONSTRAINT `RolePermissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`permission_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comment_likes` ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `note_tags` ADD CONSTRAINT `note_tags_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `note_tags` ADD CONSTRAINT `note_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `article_categories`(`name`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `n_and_f_file_id` FOREIGN KEY (`file_id`) REFERENCES `files_info`(`file_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_comments` ADD CONSTRAINT `user_comment_id` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`comment_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_comments` ADD CONSTRAINT `user_comment_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `article_id` FOREIGN KEY (`article_id`) REFERENCES `notes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
