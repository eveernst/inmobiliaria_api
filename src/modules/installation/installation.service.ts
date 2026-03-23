import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Installation } from "./entities/installation.entity";
import { CreateInstallationDto } from "./dtos/create-installation.dto";
import { Classification } from "../classification/entities/classification.entity";
import { ReadInstallationDto } from "./dtos/read-installation.dto";

@Injectable()
export class InstallationService {
    constructor(
        @InjectRepository(Installation)
        private readonly installationRepository: Repository<Installation>,
        @InjectRepository(Classification)
        private readonly classificationRepository: Repository<Classification>,
    ) {}

    findAll(): Promise<ReadInstallationDto[]> {
        return this.installationRepository.find(
            { relations: ['classification'] },
        );
    }

    findOne(id: number): Promise<Installation> {
        return this.installationRepository.findOne({ where: { id } });
    }

    async create(installationData: CreateInstallationDto): Promise<Installation> {
        const classification = await this.classificationRepository.findOne({
            where: { id: installationData.classificationId },
        });
        const data = { ...installationData, classification };
        const installation = this.installationRepository.create(data);
        return await this.installationRepository.save(installation);
    }

    async update(id: number, installationData: Partial<Installation>): Promise<Installation> {
        await this.installationRepository.update(id, installationData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.installationRepository.delete(id);
    }
}

