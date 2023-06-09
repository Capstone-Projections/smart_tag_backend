-- CreateTable
CREATE TABLE `attendance` (
    `idattendance` INTEGER NOT NULL AUTO_INCREMENT,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `lesson_idlesson` INTEGER NOT NULL,
    `user_iduser` INTEGER NOT NULL,

    INDEX `fk_attendance_lesson1_idx`(`lesson_idlesson`),
    INDEX `fk_attendance_user1_idx`(`user_iduser`),
    PRIMARY KEY (`idattendance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `idcourse` INTEGER NOT NULL AUTO_INCREMENT,
    `courseCode` VARCHAR(45) NOT NULL,
    `name` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `courseCode_UNIQUE`(`courseCode`),
    UNIQUE INDEX `name_UNIQUE`(`name`),
    PRIMARY KEY (`idcourse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_has_lesson` (
    `course_idcourse` INTEGER NOT NULL,
    `lesson_idlesson` INTEGER NOT NULL,

    INDEX `fk_course_has_lesson_course1_idx`(`course_idcourse`),
    INDEX `fk_course_has_lesson_lesson1_idx`(`lesson_idlesson`),
    PRIMARY KEY (`course_idcourse`, `lesson_idlesson`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lectureroom` (
    `idlectureRoom` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `roomLocation` VARCHAR(200) NULL,
    `uid` VARCHAR(45) NULL,

    PRIMARY KEY (`idlectureRoom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson` (
    `idlesson` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` VARCHAR(45) NULL,
    `endTime` VARCHAR(45) NULL,
    `day` VARCHAR(45) NULL,
    `lectureRoom_idlectureRoom` INTEGER NOT NULL,

    INDEX `fk_lesson_lectureRoom1_idx`(`lectureRoom_idlectureRoom`),
    PRIMARY KEY (`idlesson`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `iduser` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NULL,
    `firstName` VARCHAR(100) NULL,
    `middleName` VARCHAR(100) NULL,
    `lastName` VARCHAR(100) NULL,
    `referenceNumber` VARCHAR(45) NULL,
    `indexNumber` INTEGER NULL,
    `studyProgram` VARCHAR(100) NULL,
    `doubtPoints` FLOAT NULL,
    `role` ENUM('STUDENT', 'LECTURER') NULL,
    `isAdmin` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `referenceNumber_UNIQUE`(`referenceNumber`),
    UNIQUE INDEX `indexNumber_UNIQUE`(`indexNumber`),
    PRIMARY KEY (`iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token` (
    `idtoken` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('EMAIL', 'API') NOT NULL,
    `emailToken` VARCHAR(191) NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `expiration` DATETIME(3) NOT NULL,
    `iduser` INTEGER NOT NULL,

    UNIQUE INDEX `token_emailToken_key`(`emailToken`),
    INDEX `fk_token_user_idx`(`iduser`),
    PRIMARY KEY (`idtoken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_has_course` (
    `user_iduser` INTEGER NOT NULL,
    `course_idcourse` INTEGER NOT NULL,

    INDEX `fk_user_has_course_course1_idx`(`course_idcourse`),
    INDEX `fk_user_has_course_user_idx`(`user_iduser`),
    PRIMARY KEY (`user_iduser`, `course_idcourse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
