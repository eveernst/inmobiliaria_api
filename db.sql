-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: inmobiliaria
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `inmobiliaria`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `inmobiliaria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `inmobiliaria`;

--
-- Table structure for table `classification`
--

DROP TABLE IF EXISTS `classification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classification`
--

LOCK TABLES `classification` WRITE;
/*!40000 ALTER TABLE `classification` DISABLE KEYS */;
/*!40000 ALTER TABLE `classification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installation`
--

DROP TABLE IF EXISTS `installation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `file` varchar(100) NOT NULL,
  `details` varchar(500) NOT NULL,
  `propertyId` int DEFAULT NULL,
  `classificationId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6faa44c4ee309ae876993aac4a0` (`propertyId`),
  KEY `FK_5a78b3a24bdbb8e0743bbc200a0` (`classificationId`),
  CONSTRAINT `FK_5a78b3a24bdbb8e0743bbc200a0` FOREIGN KEY (`classificationId`) REFERENCES `classification` (`id`),
  CONSTRAINT `FK_6faa44c4ee309ae876993aac4a0` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installation`
--

LOCK TABLES `installation` WRITE;
/*!40000 ALTER TABLE `installation` DISABLE KEYS */;
/*!40000 ALTER TABLE `installation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance`
--

DROP TABLE IF EXISTS `insurance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(100) NOT NULL,
  `phone` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `insuredProperty` varchar(255) NOT NULL,
  `insuranceARM` tinyint NOT NULL,
  `insuranceASE` tinyint NOT NULL,
  `team` tinyint NOT NULL,
  `content` tinyint NOT NULL,
  `values` tinyint NOT NULL,
  `insuranceLink` varchar(255) NOT NULL,
  `insuranceImage` varchar(255) NOT NULL,
  `insuranceDate` datetime NOT NULL,
  `AnualFormLink` varchar(255) NOT NULL,
  `AnualFormImage` varchar(255) NOT NULL,
  `AnualFormDate` datetime NOT NULL,
  `observations` varchar(255) NOT NULL,
  `propertyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d682bfd5b77cc3f64c2281ae37` (`phone`),
  UNIQUE KEY `IDX_9574aa3621a010a97280e9ab2a` (`email`),
  KEY `FK_67de034213778cd9d4d7007ae42` (`propertyId`),
  CONSTRAINT `FK_67de034213778cd9d4d7007ae42` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance`
--

LOCK TABLES `insurance` WRITE;
/*!40000 ALTER TABLE `insurance` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `message` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `propertyId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_66ea6088c78ffdd4f7b52ae7c5c` (`propertyId`),
  KEY `FK_1ced25315eb974b73391fb1c81b` (`userId`),
  CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_66ea6088c78ffdd4f7b52ae7c5c` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `generalPlan` tinyint NOT NULL,
  `planNumber` int NOT NULL,
  `year` int NOT NULL,
  `planImage` varchar(255) NOT NULL,
  `profesional` varchar(255) NOT NULL,
  `professionalContact` varchar(255) NOT NULL,
  `numberVisado` int NOT NULL,
  `dateVisado` datetime NOT NULL,
  `structurePlan` tinyint NOT NULL,
  `structureImage` varchar(255) NOT NULL,
  `gasPlan` tinyint NOT NULL,
  `gasImage` varchar(255) NOT NULL,
  `waterPlan` tinyint NOT NULL,
  `waterImage` varchar(255) NOT NULL,
  `lightPlan` tinyint NOT NULL,
  `lightImage` varchar(255) NOT NULL,
  `projectPlan` tinyint NOT NULL,
  `projectImage` varchar(255) NOT NULL,
  `finalPlan` tinyint NOT NULL,
  `finalImage` varchar(255) NOT NULL,
  `planType` varchar(255) NOT NULL,
  `planNumberUpdate` int NOT NULL,
  `yearUpdate` varchar(255) NOT NULL,
  `stateImage` varchar(255) NOT NULL,
  `imageVisado` varchar(255) NOT NULL,
  `formalities` varchar(255) NOT NULL,
  `documentation` varchar(255) NOT NULL,
  `contacts` varchar(255) NOT NULL,
  `propertyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_02937d7b0f2b95973de968a1aff` (`propertyId`),
  CONSTRAINT `FK_02937d7b0f2b95973de968a1aff` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `goodUseCode` int NOT NULL,
  `file` varchar(255) NOT NULL,
  `province` varchar(100) NOT NULL,
  `locality` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `postalCode` int NOT NULL,
  `betweenStreets1` varchar(100) NOT NULL,
  `betweenStreets2` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `state` int NOT NULL,
  `active` tinyint NOT NULL,
  `clfc` varchar(255) NOT NULL,
  `detailsMaintenance` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  `userId` int DEFAULT NULL,
  `classificationId` int DEFAULT NULL,
  `destiny` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d90007b39cfcf412e15823bebc1` (`userId`),
  KEY `FK_4795c54e22bce5b46f6af3ac97c` (`classificationId`),
  CONSTRAINT `FK_4795c54e22bce5b46f6af3ac97c` FOREIGN KEY (`classificationId`) REFERENCES `classification` (`id`),
  CONSTRAINT `FK_d90007b39cfcf412e15823bebc1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property`
--

LOCK TABLES `property` WRITE;
/*!40000 ALTER TABLE `property` DISABLE KEYS */;
/*!40000 ALTER TABLE `property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rented`
--

DROP TABLE IF EXISTS `rented`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rented` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `ownerDetails` varchar(100) NOT NULL,
  `affectation` varchar(100) NOT NULL,
  `ownerContact` varchar(100) NOT NULL,
  `renterDetails` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `renterContact` varchar(100) NOT NULL,
  `locality` varchar(100) NOT NULL,
  `contratStartDate` datetime NOT NULL,
  `contratEndDate` datetime NOT NULL,
  `province` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `adjustmentType` varchar(100) NOT NULL,
  `contractImage` varchar(255) NOT NULL,
  `propertyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8ec7eeb9ff427cc5d816a5d77da` (`propertyId`),
  CONSTRAINT `FK_8ec7eeb9ff427cc5d816a5d77da` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rented`
--

LOCK TABLES `rented` WRITE;
/*!40000 ALTER TABLE `rented` DISABLE KEYS */;
/*!40000 ALTER TABLE `rented` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writing`
--

DROP TABLE IF EXISTS `writing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `writingNumber` int NOT NULL,
  `voteNumberJDAAC` int NOT NULL,
  `voteDateJDAAC` datetime NOT NULL,
  `imageJDAAC` varchar(255) NOT NULL,
  `voteNumberJDUA` int NOT NULL,
  `voteDateJDUA` datetime NOT NULL,
  `imageJDUA` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `folio` varchar(255) NOT NULL,
  `tomo` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `department` varchar(255) NOT NULL,
  `totalSurface` int NOT NULL,
  `coveredSurface` int NOT NULL,
  `improvementSurface` int NOT NULL,
  `improvementValue` int NOT NULL,
  `cadastralNomenclature` varchar(255) NOT NULL,
  `ubicationMap` varchar(255) NOT NULL,
  `cadastralInform` varchar(255) NOT NULL,
  `actingNotary` varchar(255) NOT NULL,
  `notaryContact` int NOT NULL,
  `interiorImage` varchar(255) NOT NULL,
  `exteriorImage` varchar(255) NOT NULL,
  `formalities` varchar(255) NOT NULL,
  `documentation` varchar(255) NOT NULL,
  `detailSpaces` varchar(255) NOT NULL,
  `propertyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3bc61dedf5bd272a8b2834870f8` (`propertyId`),
  CONSTRAINT `FK_3bc61dedf5bd272a8b2834870f8` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writing`
--

LOCK TABLES `writing` WRITE;
/*!40000 ALTER TABLE `writing` DISABLE KEYS */;
/*!40000 ALTER TABLE `writing` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20 23:03:34
