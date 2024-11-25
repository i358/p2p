-- --------------------------------------------------------
-- Sunucu:                       127.0.0.1
-- Sunucu sürümü:                PostgreSQL 16.4, compiled by Visual C++ build 1940, 64-bit
-- Sunucu İşletim Sistemi:       
-- HeidiSQL Sürüm:               12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- tablo yapısı dökülüyor public.banned
CREATE TABLE IF NOT EXISTS "banned" (
	"id" NUMERIC NOT NULL,
	"bannedBy" NUMERIC NOT NULL,
	"permanent" BOOLEAN NOT NULL,
	"expiresAt" NUMERIC NOT NULL,
	"ip" NUMERIC NOT NULL,
	PRIMARY KEY ("id")
);

-- Veri çıktısı seçilmemişti

-- tablo yapısı dökülüyor public.logs
CREATE TABLE IF NOT EXISTS "logs" (
	"id" SERIAL NOT NULL,
	"type" TEXT NOT NULL,
	"message" TEXT NOT NULL,
	"readChannel" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL,
	"verifyChannel" TEXT NOT NULL,
	"cache" TEXT NOT NULL,
	PRIMARY KEY ("id")
);

-- Veri çıktısı seçilmemişti

-- tablo yapısı dökülüyor public.messages
CREATE TABLE IF NOT EXISTS "messages" (
	"pgid" SERIAL NOT NULL,
	"id" BIGINT NOT NULL,
	"senderId" NUMERIC NOT NULL,
	"content" TEXT NOT NULL,
	"mentions" TEXT NULL DEFAULT NULL,
	"reply" NUMERIC NULL DEFAULT NULL,
	"createdAt" NUMERIC NOT NULL,
	"attachments" TEXT NOT NULL,
	PRIMARY KEY ("id")
);

-- Veri çıktısı seçilmemişti

-- tablo yapısı dökülüyor public.secrets
CREATE TABLE IF NOT EXISTS "secrets" (
	"id" NUMERIC NOT NULL,
	"secret" TEXT NOT NULL,
	"createdAt" NUMERIC NOT NULL,
	PRIMARY KEY ("id")
);

-- Veri çıktısı seçilmemişti

-- tablo yapısı dökülüyor public.users
CREATE TABLE IF NOT EXISTS "users" (
	"pgid" SERIAL NOT NULL,
	"id" BIGINT NOT NULL,
	"username" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"createdAt" NUMERIC NOT NULL,
	"color" TEXT NOT NULL,
	"permLevels" TEXT NOT NULL,
	"ip_addr" TEXT NOT NULL,
	PRIMARY KEY ("id")
);

-- Veri çıktısı seçilmemişti

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
