/*
 Navicat Premium Dump SQL

 Source Server         : 本机的docker上的mysql
 Source Server Type    : MySQL
 Source Server Version : 80025 (8.0.25)
 Source Host           : localhost:3306
 Source Schema         : my_app_1

 Target Server Type    : MySQL
 Target Server Version : 80025 (8.0.25)
 File Encoding         : 65001

 Date: 04/12/2025 03:23:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for file_category
-- ----------------------------
DROP TABLE IF EXISTS `file_category`;
CREATE TABLE `file_category`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `parent_id` bigint NULL DEFAULT 0,
  `sort` int NULL DEFAULT 0,
  `status` tinyint(1) NULL DEFAULT 1,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file_category
-- ----------------------------
INSERT INTO `file_category` VALUES (1, '图片', 'image', 'image', 0, 1, 1, '所有图片文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (2, '文档', 'document', 'document', 0, 2, 1, '所有文档类文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (3, '视频', 'video', 'video', 0, 3, 1, '所有视频文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (4, '音频', 'audio', 'audio', 0, 4, 1, '所有音频文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (5, '其他', 'other', NULL, 0, 99, 1, '其他未分类文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (6, '用户头像', 'user_avatar', 'image', 1, 1, 1, '注册用户上传的头像', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (7, '文章封面图', 'article_cover', 'image', 1, 2, 1, '文章封面图', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (8, '富文本图片', 'rich_text_image', 'image', 1, 3, 1, '富文本内容中插入的图片', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (9, '评论图片', 'comment_image', 'image', 1, 4, 1, '评论区图片', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (10, '用户上传附件', 'attachment', 'document', 2, 1, 1, '如简历、项目文件、PDF 等', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (11, '合同文档', 'contract_doc', 'document', 2, 2, 1, '用于签署、归档的合同类文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (12, '教学视频', 'course_video', 'video', 3, 1, 1, '课程或培训相关视频', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (13, '宣传视频', 'promo_video', 'video', 3, 2, 1, '项目宣传片、广告视频', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (14, '背景音乐', 'bgm_audio', 'audio', 4, 1, 1, '用于视频或页面背景音乐', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (15, '语音留言', 'voice_msg', 'audio', 4, 2, 1, '用户语音输入留言', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (16, '压缩包文件', 'archive_file', NULL, 5, 1, 1, 'ZIP、RAR 等压缩格式文件', '2025-05-22 00:40:34', '2025-05-22 00:40:34');
INSERT INTO `file_category` VALUES (17, '二维码图片', 'qr_code', 'image', 5, 2, 1, '系统或用户上传的二维码', '2025-05-22 00:40:34', '2025-05-22 00:40:34');

SET FOREIGN_KEY_CHECKS = 1;
